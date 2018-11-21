// Этот воркер управляет всеми вычислениями модели гравитационного воздействия
import settings from '../settings';
import {MainCalculator} from "../lib/MainCalculator";

let calculate = new MainCalculator();

self.onmessage = function(this: Worker, event: MessageEvent) {
    // todo переделать на WorkerEventMap если возможно
    switch (event.data.type) {
        case 'reset':
            calculate.reset(new Float64Array(event.data.buffer));
            break;
        case 'start':
            calculate.start();
            break;
        case 'stop':
            calculate.stop();
            break;
    }
};