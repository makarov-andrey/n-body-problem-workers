export class CelestialModelAccessor {
    constructor (
        private model: Float64Array
    ) { }

    set timeCoefficient (value: number) {
        //todo
    }

    get timeCoefficient (): number {
        //todo
        return 0;
    }

    get baseArray (): Float64Array {
        return this.model;
    }

    rewrite(value: Float64Array) {
        value.forEach((value: number, key: number) => this.model[key] = value);
    }
}