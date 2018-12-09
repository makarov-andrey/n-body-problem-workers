// Этот воркер занимается вычислениями, связанными с интегрирацией системы по времени
import {IntegrationCalculator} from "../lib/calculators/IntegrationCalculator";
import {CelestialModelAccessor} from "../lib/accessors/CelestialModelAccessor";

let calculator = new IntegrationCalculator();

(self as unknown as Worker).onmessage = function(event: MessageEvent) {
    // todo переделать на WorkerEventMap если возможно
    switch (event.data.type) {
        case 'integrate':
            calculator.integrate(
                new CelestialModelAccessor(event.data.model),
                event.data.integrationTime,
                event.data.integrationStep
            )
                .then(result => {
                    this.postMessage({
                        type: 'integration-result',
                        id: event.data.id,
                        result: result.baseArray
                    });
                });
            break;
    }
};