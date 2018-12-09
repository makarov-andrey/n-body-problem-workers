export class BodyAccessor {
    constructor (
        public baseArray: Float64Array,
        private dimensionsAmount: number
    ) { }

    get mass(): number {
        return this.baseArray[this.massOffset];
    }

    set mass(value: number) {
        this.baseArray[this.massOffset] = value;
    }

    get position(): Float64Array {
        return this.baseArray.subarray(this.positionOffset, this.positionOffset + this.dimensionsAmount);
    }

    get velocity(): Float64Array {
        return this.baseArray.subarray(this.velocityOffset, this.velocityOffset + this.dimensionsAmount);
    }

    get massOffset(): number {
        return 0;
    }

    get positionOffset(): number {
        return 1;
    }

    get velocityOffset(): number {
        return 1 + this.dimensionsAmount;
    }

    rewrite(value: Float64Array) {
        value.forEach((value: number, key: number) => this.baseArray[key] = value);
    }
}