// Этот воркер управляет всеми вычислениями модели гравитационного воздействия
import {Modulator} from "../lib/Modulator";

let modulator = new Modulator();

self.onmessage = function(event: MessageEvent) {
    // todo переделать на WorkerEventMap если возможно
    switch (event.data.type) {
        case 'reset':
            modulator.reset(new Float64Array(event.data.buffer));
            break;
        case 'start':
            modulator.start();
            break;
        case 'stop':
            modulator.stop();
            break;
    }
};