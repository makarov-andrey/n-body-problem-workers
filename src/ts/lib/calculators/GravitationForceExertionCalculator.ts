import {BodyAccessor} from "../accessors/BodyAccessor";

export class GravitationForceExertionCalculator {
    exert(bodyAccessor: BodyAccessor, netGravityForce: number[], integrationStep: number) {
        let acceleration = netGravityForce.map(val => val / bodyAccessor.mass),
            velocity = bodyAccessor.velocity;
        velocity.forEach((val, index) => {
            velocity[index] += acceleration[index] * integrationStep;
        });

        let position = bodyAccessor.position;
        position.forEach((val, index) => {
            position[index] += velocity[index] * integrationStep;
        });

        return bodyAccessor;
    }
}