import settings from "../settings";

export class MainCalculator {
    // Переменная хранит в себе примитивный массив со всей информацией о физическом состоянии модели в момент времени.
    // Переменной декларируется в основном потоке и приходит в этот воркер через SharedArrayBuffer, следовательно основной
    // поток так же имеет доступ к содержимому
    private model: Float64Array;
    private started = false; // показатель того происходит ли сейчас модуляция в реальном времени
    private lastIntegrationTime: number; // таймстамп с микросекундами последнего вычисления шага интеграции
    private integrationStep = Math.pow(2, -16); // шаг интеграции
    private integrationWorkers = [
        new Worker('/dist/workers/integrate.js'),
        new Worker('/dist/workers/integrate.js'),
    ];

    reset (model: Float64Array) {
        this.model = model;
    }

    start() {
        if (!this.started) {
            this.started = true;
            this.lastIntegrationTime = Date.now();
            this.work();
        }
    }

    stop() {
        this.started = false;
    }

    private async work() {
        if (!this.started) return;

        let results: [Float64Array, Float64Array],
            measurementError: number,
            startingTime = Date.now();

        do {
            results = await this.integrate(this.integrationStep / 2, this.integrationStep);
            measurementError = 0;//todo высчитать погрешность
            this.integrationStep /= 2;
        } while (measurementError > settings.admissibleMeasurementError);
        this.integrationStep *= 4;
        results[0].forEach((value: number, key: number) => this.model[key] = value);
        this.lastIntegrationTime += this.integrationStep;
        //todo высчитывать и изменять показатель скорости течения времени

        this.work.call(this);
    }

    private integrate(...integrationsSteps): Promise<Float64Array[]> {
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
                    model: this.model, //todo отдавать не все данные модели, а только инфу о телах
                    integrationStep: value,
                    id: id
                });
            });
        }));
    }
}