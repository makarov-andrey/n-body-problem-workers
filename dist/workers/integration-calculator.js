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
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/ts/workers/integration-calculator.ts");
/******/ })
/************************************************************************/
/******/ ({

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

/***/ "./src/ts/lib/calculators/IntegrationCalculator.ts":
/*!*********************************************************!*\
  !*** ./src/ts/lib/calculators/IntegrationCalculator.ts ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
class IntegrationCalculator {
    constructor() {
        this.gravityForceCalculationWorkers = [];
    }
    async integrate(modelAccessor, integrationTime, integrationStep) {
        for (let i = this.gravityForceCalculationWorkers.length; i < modelAccessor.bodiesAmount; i++) {
            this.gravityForceCalculationWorkers.push(new Worker('/dist/workers/gravitation-force-calculator.js'));
        }
        for (let passedTime = 0; passedTime < integrationTime; passedTime += integrationStep) {
            let netGravityForces = await Promise.all(Array(modelAccessor.bodiesAmount).fill(1).map((val, index) => {
                return this.calculateNetGravityForce(modelAccessor, index);
            }));
            await await Promise.all(Array(modelAccessor.bodiesAmount).fill(1).map((val, index) => {
                return this.exert(modelAccessor, index, netGravityForces[index], integrationStep);
            }));
        }
        return modelAccessor;
    }
    calculateNetGravityForce(modelAccessor, bodyIndex) {
        return new Promise(resolve => {
            let id = Math.random(), onmessage = (event) => {
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
    async exert(modelAccessor, bodyIndex, netGravityForce, integrationStep) {
        return new Promise(resolve => {
            let bodyAccessor = modelAccessor.getBody(bodyIndex), id = Math.random(), onmessage = (event) => {
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
exports.IntegrationCalculator = IntegrationCalculator;


/***/ }),

/***/ "./src/ts/workers/integration-calculator.ts":
/*!**************************************************!*\
  !*** ./src/ts/workers/integration-calculator.ts ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
// Этот воркер занимается вычислениями, связанными с интегрирацией системы по времени
const IntegrationCalculator_1 = __webpack_require__(/*! ../lib/calculators/IntegrationCalculator */ "./src/ts/lib/calculators/IntegrationCalculator.ts");
const CelestialModelAccessor_1 = __webpack_require__(/*! ../lib/accessors/CelestialModelAccessor */ "./src/ts/lib/accessors/CelestialModelAccessor.ts");
let calculator = new IntegrationCalculator_1.IntegrationCalculator();
addEventListener('message', (event) => {
    // todo переделать на WorkerEventMap если возможно
    switch (event.data.type) {
        case 'integrate':
            calculator.integrate(new CelestialModelAccessor_1.CelestialModelAccessor(event.data.model), event.data.integrationTime, event.data.integrationStep)
                .then(result => {
                postMessage({
                    type: 'integration-result',
                    id: event.data.id,
                    result: result.baseArray
                });
            });
            break;
    }
});


/***/ })

/******/ });
//# sourceMappingURL=integration-calculator.js.map