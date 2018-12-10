import settings from "../settings";
import {CelestialModelAccessor} from "./accessors/CelestialModelAccessor";

export class Modulator {
    // Переменная хранит в себе примитивный массив со всей информацией о физическом состоянии модели в момент времени.
    // Переменной декларируется в основном потоке и приходит в этот воркер через SharedArrayBuffer, следовательно основной
    // поток так же имеет доступ к содержимому
    private modelAccessor: CelestialModelAccessor;
    private started = false; // показатель того происходит ли сейчас модуляция в реальном времени
    private integrationStep = settings.maxIntegrationStep; // шаг интеграции
    private integrationWorkers = [
        new Worker('/dist/workers/integration-calculator.js'),
        new Worker('/dist/workers/integration-calculator.js'),
    ];

    reset (baseArray: Float64Array) {
        this.modelAccessor = new CelestialModelAccessor(baseArray);
    }

    start() {
        if (!this.started) {
            this.started = true;
            this.work();
        }
    }

    stop() {
        this.started = false;
    }

    private async work() {
        while (this.started) {
            //todo перейти на performance.now()
            let startedTime = Date.now(),
                results: Float64Array[];

            do {
                results = await this.integrate(settings.integrationTime, this.integrationStep / 2, this.integrationStep);
                this.integrationStep /= 4;
            } while (this.determineMeasurementError(results[0], results[1]) > settings.admissibleMeasurementError);

            this.integrationStep = Math.min(this.integrationStep * 8, settings.maxIntegrationStep);
            this.modelAccessor.rewrite(results[0]);

            let realNow = Date.now(),
                imagineNow = startedTime + settings.integrationTime;
            if (imagineNow < realNow) {
                //вычисляли слишком долго, надо показывать юзеру, что компуктер не справляется и он смотрит проекцию в замедленном варианте
                this.modelAccessor.timeCoefficient = (imagineNow - startedTime) / (realNow - startedTime);
            } else {
                //вычисляли слишком быстро.
                this.modelAccessor.timeCoefficient = 1;
                //костыль для sleep чтобы не обгонять реальное время
                //todo найти способ сделать точный асинхронный sleep в наносекундах
                while(Date.now() < imagineNow);
            }
        }
    }

    private integrate(integrationTime: number, ...integrationsSteps: number[]): Promise<Float64Array[]> {
        return <Promise<Float64Array[]>> Promise.all(integrationsSteps.map(async (value, key) => {
            return new Promise (resolve => {
                let id = Math.random(),
                    onmessage = (event: MessageEvent) => {
                        if (event.data.type === 'integration-result' && event.data.id === id) {
                            this.integrationWorkers[key].removeEventListener('message', onmessage);
                            resolve(event.data.result);
                        }
                    };

                this.integrationWorkers[key].addEventListener('message', onmessage);
                this.integrationWorkers[key].postMessage({
                    type: 'integrate',
                    model: this.modelAccessor.baseArray,
                    integrationTime: integrationTime,
                    integrationStep: value,
                    id: id
                });
            });
        }));
    }

    private determineMeasurementError(result1: Float64Array, result2: Float64Array): number {
        let bodies1 = new CelestialModelAccessor(result1).bodies,
            bodies2 = new CelestialModelAccessor(result2).bodies;

        return bodies1.reduce(
            (result, body1, bodyIndex) => {
                let body2 = bodies2[bodyIndex],
                    body2Position = body2.position,
                    body2Velocity = body2.velocity;

                return result
                    + Math.sqrt(Math.abs(body1.position.reduce(
                        (accumulated, body1PointVal, dimensionIndex) => accumulated + Math.pow(body2Position[dimensionIndex] - body1PointVal, 2),
                        0
                    )))
                    + Math.sqrt(Math.abs(body1.velocity.reduce(
                        (accumulated, body1PointVal, dimensionIndex) => accumulated + Math.pow(body2Velocity[dimensionIndex] - body1PointVal, 2),
                        0
                    )));
            },
            0
        );
    }
}