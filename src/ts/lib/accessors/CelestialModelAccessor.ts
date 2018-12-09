import {BodyAccessor} from "./BodyAccessor";

export const TIME_COEFFICIENT_OFFSET = 0;
export const DIMENSIONS_AMOUNT_OFFSET = 1;
export const BODIES_AMOUNT_OFFSET = 2;
export const BODIES_START_OFFSET = 3;

export class CelestialModelAccessor {

    constructor (
        public baseArray: Float64Array
    ) { }

    set timeCoefficient (value: number) {
        this.baseArray[TIME_COEFFICIENT_OFFSET] = value;
    }

    get timeCoefficient (): number {
        return this.baseArray[TIME_COEFFICIENT_OFFSET];
    }

    set dimensionsAmount (value: number) {
        this.baseArray[DIMENSIONS_AMOUNT_OFFSET] = value;
    }

    get dimensionsAmount (): number {
        return this.baseArray[DIMENSIONS_AMOUNT_OFFSET];
    }

    set bodiesAmount (value: number) {
        this.baseArray[BODIES_AMOUNT_OFFSET] = value;
    }

    get bodiesAmount (): number {
        return this.baseArray[BODIES_AMOUNT_OFFSET];
    }

    getBody (index: number): BodyAccessor {
        let bodyLength = this.dimensionsAmount * 2 + 1,
            start = BODIES_START_OFFSET + bodyLength * index;
        return new BodyAccessor(
            this.baseArray.subarray(start, start + bodyLength - 1),
            this.dimensionsAmount
        );
    }

    get bodies (): BodyAccessor[] {
        return Array(this.bodiesAmount).fill(1).map((val, key) => {
            return this.getBody(key);
        });
    }

    rewrite(value: Float64Array) {
        value.forEach((value: number, key: number) => this.baseArray[key] = value);
    }
}