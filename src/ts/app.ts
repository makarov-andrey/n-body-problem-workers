import settings from 'settings';

// все данные опиывающие систему в момент времени представляем в виде примитивного массива для многопоточного доступа.
// для этого вычисляем количество элементов массива которое понадобится для хранения всей информации
let arrayLength =
        settings.bodies.length // массы
        + settings.bodies.length * settings.dimension // векторы скоростей
        + settings.bodies.length * settings.dimension // координаты
        + 1, // коэффициент течения времени
    buffer = new SharedArrayBuffer(Float64Array.BYTES_PER_ELEMENT * arrayLength),
    float64 = new Float64Array(buffer);

let worker = new Worker('/dist/workers/calculate.js');
worker.postMessage({
    type: 'reset',
    buffer: buffer
});
worker.postMessage({type: 'start'});