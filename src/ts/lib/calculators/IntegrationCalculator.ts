import {CelestialModelAccessor} from "../accessors/CelestialModelAccessor";

export class IntegrationCalculator {
    private gravityForceCalculationWorkers: Worker[] = [];

    async integrate(modelAccessor: CelestialModelAccessor, integrationTime: number, integrationStep: number): Promise<CelestialModelAccessor> {
        for (let i = this.gravityForceCalculationWorkers.length; i < modelAccessor.bodiesAmount; i++) {
            this.gravityForceCalculationWorkers.push(new Worker('/dist/workers/gravitation-force-calculator.js'));
        }

        for (let passedTime = 0; passedTime < integrationTime; passedTime += integrationStep) {
            let netGravityForces: number[][] = await Promise.all(Array(modelAccessor.bodiesAmount).fill(1).map((val, index) => {
                return this.calculateNetGravityForce(modelAccessor, index)
            }));

            await await Promise.all(Array(modelAccessor.bodiesAmount).fill(1).map((val, index) => {
                return this.exert(modelAccessor, index, netGravityForces[index], integrationStep);
            }));
        }

        return modelAccessor;
    }

    private calculateNetGravityForce(modelAccessor: CelestialModelAccessor, bodyIndex: number): Promise<number[]> {
        return new Promise (resolve => {
            let id = Math.random(),
                onmessage = (event: MessageEvent) => {
                    if (event.data.type === 'net-gravity-force-calculation-result' && event.data.id === id) {
                        this.gravityForceCalculationWorkers[bodyIndex].removeEventListener('message', onmessage);
                        resolve(event.data.result);
                    }
                };

            this.gravityForceCalculationWorkers[bodyIndex].addEventListener('message', onmessage);
            this.gravityForceCalculationWorkers[bodyIndex].postMessage({
                type: 'calculate-net-gravity-force',
                id: id,
                model: modelAccessor.baseArray,
                index: bodyIndex
            });
        });
    }

    private async exert(modelAccessor: CelestialModelAccessor, bodyIndex: number, netGravityForce: number[], integrationStep: number): Promise<void> {
        return new Promise (resolve => {
            let bodyAccessor = modelAccessor.getBody(bodyIndex),
                id = Math.random(),
                onmessage = (event: MessageEvent) => {
                    if (event.data.type === 'exertion-calculation-result' && event.data.id === id) {
                        this.gravityForceCalculationWorkers[bodyIndex].removeEventListener('message', onmessage);
                        bodyAccessor.rewrite(event.data.result);
                        resolve();
                    }
                };

            this.gravityForceCalculationWorkers[bodyIndex].addEventListener('message', onmessage);
            this.gravityForceCalculationWorkers[bodyIndex].postMessage({
                type: 'calculate-exertion',
                id: id,
                model: bodyAccessor.baseArray,
                dimensionsAmount: modelAccessor.dimensionsAmount,
                netGravityForce: netGravityForce,
                integrationStep: integrationStep
            });
        });
    }
}