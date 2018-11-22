import settings from "../settings";
import {CelestialModelAccessor} from "./CelestialModelAccessor";

export class Modulator {
    // Переменная хранит в себе примитивный массив со всей информацией о физическом состоянии модели в момент времени.
    // Переменной декларируется в основном потоке и приходит в этот воркер через SharedArrayBuffer, следовательно основной
    // поток так же имеет доступ к содержимому
    private celestialModel: CelestialModelAccessor;
    private started = false; // показатель того происходит ли сейчас модуляция в реальном времени
    private integrationStep = settings.maxIntegrationStep; // шаг интеграции
    private integrationWorkers = [
        new Worker('/dist/workers/integration-calculator.js'),
        new Worker('/dist/workers/integration-calculator.js'),
    ];

    reset (baseArray: Float64Array) {
        this.celestialModel = new CelestialModelAccessor(baseArray);
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
            let startedTime = Date.now(),
                results: [Float64Array, Float64Array];

            do {
                results = await this.integrate(settings.integrationTime, this.integrationStep / 2, this.integrationStep);
                this.integrationStep /= 2;
            } while (this.determineMeasurementError(results) > settings.admissibleMeasurementError);

            this.integrationStep *= 4;
            this.celestialModel.rewrite(results[0]);

            let realNow = Date.now(),
                imagineNow = startedTime + settings.integrationTime;
            if (imagineNow < realNow) {
                //вычисляли слишком долго, надо показывать юзеру что компуктер не справляется и он смотрит проекцию в замедленном варианте
                this.celestialModel.timeCoefficient = (imagineNow - startedTime) / (realNow - startedTime);
            } else {
                //вычисляли слишком быстро.
                this.celestialModel.timeCoefficient = 1;
                //костыль для sleep чтобы не обгонять реальное время
                while(Date.now() < imagineNow);
            }
        }
    }

    private integrate(integrationTime: number, ...integrationsSteps: number[]): Promise<Float64Array[]> {
        return <Promise<Float64Array[]>> Promise.all(integrationsSteps.map(async (value, key) => {
            return new Promise (resolve => {
                let id = Math.random(),
                    onmessage = (event: MessageEvent) => {
                        if (event.data.type == 'integration-result' && event.data.id === id) {
                            this.integrationWorkers[key].removeEventListener('onmessage', onmessage);
                            resolve(event.data.result);
                        }
                    };

                this.integrationWorkers[key].addEventListener('onmessage', onmessage);
                this.integrationWorkers[key].postMessage({
                    type: 'integrate',
                    model: this.celestialModel.baseArray, //todo отдавать не все данные модели, а только инфу о телах
                    integrationTime: integrationTime,
                    integrationStep: value,
                    id: id
                });
            });
        }));
    }

    private determineMeasurementError(results: Float64Array[]): number {
        //todo
        return 0;
    }
}