// Этот воркер занимается вычислениями силы гравитации и результатов её воздействия на тела

import {NetGravitationForceCalculator} from "../lib/calculators/NetGravitationForceCalculator";
import {GravitationForceExertionCalculator} from "../lib/calculators/GravitationForceExertionCalculator";
import {CelestialModelAccessor} from "../lib/accessors/CelestialModelAccessor";
import {BodyAccessor} from "../lib/accessors/BodyAccessor";

let netGravitationForceCalculator = new NetGravitationForceCalculator();
let gravitationForceExertionCalculator = new GravitationForceExertionCalculator();

(self as unknown as Worker).onmessage = function(event: MessageEvent) {
    // todo переделать на WorkerEventMap если возможно
    switch (event.data.type) {
        case 'calculate-net-gravity-force':
            this.postMessage({
                type: 'net-gravity-force-calculation-result',
                id: event.data.id,
                result: netGravitationForceCalculator.calculate(
                    new CelestialModelAccessor(event.data.model),
                    event.data.index
                )
            });
            break;
        case 'calculate-exertion':
            this.postMessage({
                type: 'exertion-calculation-result',
                id: event.data.id,
                result: gravitationForceExertionCalculator
                    .exert(
                        new BodyAccessor(event.data.model, event.data.dimensionsAmount),
                        event.data.netGravityForce,
                        event.data.integrationStep
                    )
                    .baseArray
            });
            break;
    }
};