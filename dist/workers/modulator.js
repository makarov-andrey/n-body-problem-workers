/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "dist/";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/ts/workers/modulator.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/ts/lib/Modulator.ts":
/*!*********************************!*\
  !*** ./src/ts/lib/Modulator.ts ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const settings_1 = __webpack_require__(/*! ../settings */ "./src/ts/settings.ts");
const CelestialModelAccessor_1 = __webpack_require__(/*! ./accessors/CelestialModelAccessor */ "./src/ts/lib/accessors/CelestialModelAccessor.ts");
class Modulator {
    constructor() {
        this.started = false; // показатель того происходит ли сейчас модуляция в реальном времени
        this.integrationStep = settings_1.default.maxIntegrationStep; // шаг интеграции
        this.integrationWorkers = [
            new Worker('/dist/workers/integration-calculator.js'),
            new Worker('/dist/workers/integration-calculator.js'),
        ];
    }
    reset(baseArray) {
        this.modelAccessor = new CelestialModelAccessor_1.CelestialModelAccessor(baseArray);
    }
    start() {
        if (!this.started) {
            this.started = true;
            this.work();
        }
    }
    stop() {
        this.started = false;
    }
    async work() {
        while (this.started) {
            //todo перейти на performance.now()
            let startedTime = Date.now(), results;
            do {
                results = await this.integrate(settings_1.default.integrationTime, this.integrationStep / 2, this.integrationStep);
                this.integrationStep /= 4;
            } while (this.determineMeasurementError(results[0], results[1]) > settings_1.default.admissibleMeasurementError);
            this.integrationStep = Math.min(this.integrationStep * 8, settings_1.default.maxIntegrationStep);
            this.modelAccessor.rewrite(results[0]);
            let realNow = Date.now(), imagineNow = startedTime + settings_1.default.integrationTime;
            if (imagineNow < realNow) {
                //вычисляли слишком долго, надо показывать юзеру, что компуктер не справляется и он смотрит проекцию в замедленном варианте
                this.modelAccessor.timeCoefficient = (imagineNow - startedTime) / (realNow - startedTime);
            }
            else {
                //вычисляли слишком быстро.
                this.modelAccessor.timeCoefficient = 1;
                //костыль для sleep чтобы не обгонять реальное время
                //todo найти способ сделать точный асинхронный sleep в наносекундах
                while (Date.now() < imagineNow)
                    ;
            }
        }
    }
    integrate(integrationTime, ...integrationsSteps) {
        return Promise.all(integrationsSteps.map(async (value, key) => {
            return new Promise(resolve => {
                let id = Math.random(), onmessage = (event) => {
                    if (event.data.type === 'integration-result' && event.data.id === id) {
                        this.integrationWorkers[key].removeEventListener('message', onmessage);
                        resolve(event.data.result);
                    }
                };
                this.integrationWorkers[key].addEventListener('message', onmessage);
                this.integrationWorkers[key].postMessage({
                    type: 'integrate',
                    model: this.modelAccessor.baseArray,
                    integrationTime: integrationTime,
                    integrationStep: value,
                    id: id
                });
            });
        }));
    }
    determineMeasurementError(result1, result2) {
        let bodies1 = new CelestialModelAccessor_1.CelestialModelAccessor(result1).bodies, bodies2 = new CelestialModelAccessor_1.CelestialModelAccessor(result2).bodies;
        return bodies1.reduce((result, body1, bodyIndex) => {
            let body2 = bodies2[bodyIndex], body2Position = body2.position, body2Velocity = body2.velocity;
            return result
                + Math.sqrt(Math.abs(body1.position.reduce((accumulated, body1PointVal, dimensionIndex) => accumulated + Math.pow(body2Position[dimensionIndex] - body1PointVal, 2), 0)))
                + Math.sqrt(Math.abs(body1.velocity.reduce((accumulated, body1PointVal, dimensionIndex) => accumulated + Math.pow(body2Velocity[dimensionIndex] - body1PointVal, 2), 0)));
        }, 0);
    }
}
exports.Modulator = Modulator;


/***/ }),

/***/ "./src/ts/lib/accessors/BodyAccessor.ts":
/*!**********************************************!*\
  !*** ./src/ts/lib/accessors/BodyAccessor.ts ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
class BodyAccessor {
    constructor(baseArray, dimensionsAmount) {
        this.baseArray = baseArray;
        this.dimensionsAmount = dimensionsAmount;
    }
    get mass() {
        return this.baseArray[this.massOffset];
    }
    set mass(value) {
        this.baseArray[this.massOffset] = value;
    }
    get position() {
        return this.baseArray.subarray(this.positionOffset, this.positionOffset + this.dimensionsAmount);
    }
    get velocity() {
        return this.baseArray.subarray(this.velocityOffset, this.velocityOffset + this.dimensionsAmount);
    }
    get massOffset() {
        return 0;
    }
    get positionOffset() {
        return 1;
    }
    get velocityOffset() {
        return 1 + this.dimensionsAmount;
    }
    rewrite(value) {
        value.forEach((value, key) => this.baseArray[key] = value);
    }
}
exports.BodyAccessor = BodyAccessor;


/***/ }),

/***/ "./src/ts/lib/accessors/CelestialModelAccessor.ts":
/*!********************************************************!*\
  !*** ./src/ts/lib/accessors/CelestialModelAccessor.ts ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const BodyAccessor_1 = __webpack_require__(/*! ./BodyAccessor */ "./src/ts/lib/accessors/BodyAccessor.ts");
exports.TIME_COEFFICIENT_OFFSET = 0;
exports.DIMENSIONS_AMOUNT_OFFSET = 1;
exports.BODIES_AMOUNT_OFFSET = 2;
exports.BODIES_START_OFFSET = 3;
class CelestialModelAccessor {
    constructor(baseArray) {
        this.baseArray = baseArray;
    }
    set timeCoefficient(value) {
        this.baseArray[exports.TIME_COEFFICIENT_OFFSET] = value;
    }
    get timeCoefficient() {
        return this.baseArray[exports.TIME_COEFFICIENT_OFFSET];
    }
    set dimensionsAmount(value) {
        this.baseArray[exports.DIMENSIONS_AMOUNT_OFFSET] = value;
    }
    get dimensionsAmount() {
        return this.baseArray[exports.DIMENSIONS_AMOUNT_OFFSET];
    }
    set bodiesAmount(value) {
        this.baseArray[exports.BODIES_AMOUNT_OFFSET] = value;
    }
    get bodiesAmount() {
        return this.baseArray[exports.BODIES_AMOUNT_OFFSET];
    }
    getBody(index) {
        let bodyLength = this.dimensionsAmount * 2 + 1, start = exports.BODIES_START_OFFSET + bodyLength * index;
        return new BodyAccessor_1.BodyAccessor(this.baseArray.subarray(start, start + bodyLength - 1), this.dimensionsAmount);
    }
    get bodies() {
        return Array(this.bodiesAmount).fill(1).map((val, key) => {
            return this.getBody(key);
        });
    }
    rewrite(value) {
        value.forEach((value, key) => this.baseArray[key] = value);
    }
}
exports.CelestialModelAccessor = CelestialModelAccessor;


/***/ }),

/***/ "./src/ts/settings.ts":
/*!****************************!*\
  !*** ./src/ts/settings.ts ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    bodies: (() => {
        let scale = 3e8;
        let offsetX = scale * 2;
        let offsetY = scale * 2;
        let p1 = 0.392955;
        let p2 = 0.097579;
        return [
            {
                mass: 2e35,
                position: [
                    -1 * scale + offsetX,
                    offsetY
                ],
                velocity: [
                    p1 * scale,
                    p2 * scale
                ]
            },
            {
                mass: 2e35,
                position: [
                    scale + offsetX,
                    offsetY
                ],
                velocity: [
                    p1 * scale,
                    p2 * scale
                ]
            },
            {
                mass: 2e35,
                position: [
                    offsetX,
                    offsetY
                ],
                velocity: [
                    -2 * p1 * scale,
                    -2 * p2 * scale
                ]
            }
        ];
    })(),
    dimensionsAmount: 2,
    admissibleMeasurementError: 1000,
    maxIntegrationStep: Math.pow(2, -15),
    integrationTime: Math.pow(2, -13),
    timeCoefficient: 1,
    renderingScale: 3e6,
};


/***/ }),

/***/ "./src/ts/workers/modulator.ts":
/*!*************************************!*\
  !*** ./src/ts/workers/modulator.ts ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
// Этот воркер управляет всеми вычислениями модели гравитационного воздействия
const Modulator_1 = __webpack_require__(/*! ../lib/Modulator */ "./src/ts/lib/Modulator.ts");
let modulator = new Modulator_1.Modulator();
addEventListener('message', (event) => {
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
});


/***/ })

/******/ });
//# sourceMappingURL=modulator.js.map