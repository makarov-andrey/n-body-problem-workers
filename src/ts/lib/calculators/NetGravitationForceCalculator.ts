import {CelestialModelAccessor} from "../accessors/CelestialModelAccessor";
import {G} from "../constants/physics";

export class NetGravitationForceCalculator {
    calculate(modelAccessor: CelestialModelAccessor, currentBodyIndex: number) {
        let currentBody = modelAccessor.getBody(currentBodyIndex);
        return modelAccessor.bodies.reduce(
            (netForce, anotherBody, anotherBodyIndex) => {
                if (anotherBodyIndex == currentBodyIndex) return netForce;

                let anotherBodyPosition = anotherBody.position,
                    distance = Math.sqrt(Math.abs(currentBody.position.reduce(
                        (accumulated, pointVal, dimensionIndex) => accumulated + Math.pow(anotherBodyPosition[dimensionIndex] - pointVal, 2),
                        0
                    ))),
                    forceModuloValue = G * (currentBody.mass * anotherBody.mass / Math.pow(distance, 2)),
                    proportion = forceModuloValue / distance,
                    force = anotherBody.position.map(val => val * proportion);

                return netForce.map((val, index) => val + force[index]);
            },
            Array(modelAccessor.dimensionsAmount).fill(0)
        );
    }
}