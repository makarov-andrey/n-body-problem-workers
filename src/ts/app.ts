import settings from './settings';
import {CelestialModelAccessor} from "./lib/accessors/CelestialModelAccessor";
import {Renderer2D} from "./lib/Renderer2D";

// все данные опиывающие систему в момент времени представляем в виде примитивного массива для многопоточного доступа.
// для этого вычисляем количество элементов массива которое понадобится для хранения всей информации
let baseArrayLength: number =
        + 1 // коэффициент течения времени
        + 1 // показатель количества измерений
        + 1 // показатель количества тел в системе
        + settings.bodies.length // массы
        + settings.bodies.length * settings.dimensionsAmount // векторы скоростей
        + settings.bodies.length * settings.dimensionsAmount, // координаты
    buffer = new SharedArrayBuffer(Float64Array.BYTES_PER_ELEMENT * baseArrayLength),
    baseArray = new Float64Array(buffer),
    modelAccessor = new CelestialModelAccessor(baseArray);

modelAccessor.timeCoefficient = settings.timeCoefficient;
modelAccessor.dimensionsAmount = settings.dimensionsAmount;
modelAccessor.bodiesAmount = settings.bodies.length;
modelAccessor.bodies.forEach((bodyAccessor, bodyIndex)=> {
    let bodySource = settings.bodies[bodyIndex],
        velocity = bodyAccessor.velocity,
        position = bodyAccessor.position;

    bodyAccessor.mass = bodySource.mass;
    velocity.forEach((val, index) => {
        velocity[index] = bodySource.velocity[index];
    });
    position.forEach((val, index) => {
        position[index] = bodySource.position[index];
    });
});

let canvas = <HTMLCanvasElement> document.getElementById('space'),
    renderer = new Renderer2D(
        canvas.getContext('2d'),
        modelAccessor,
        settings.renderingScale
    );

renderer.start();

let worker = new Worker('/dist/workers/modulator.js');
worker.postMessage({
    type: 'reset',
    buffer: buffer
});
worker.postMessage({type: 'start'});