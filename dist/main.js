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
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/bootstrap.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./node_modules/css-loader/dist/runtime/api.js":
/*!*****************************************************!*\
  !*** ./node_modules/css-loader/dist/runtime/api.js ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
module.exports = function (useSourceMap) {
  var list = []; // return the list of modules as css string

  list.toString = function toString() {
    return this.map(function (item) {
      var content = cssWithMappingToString(item, useSourceMap);

      if (item[2]) {
        return '@media ' + item[2] + '{' + content + '}';
      } else {
        return content;
      }
    }).join('');
  }; // import a list of modules into the list


  list.i = function (modules, mediaQuery) {
    if (typeof modules === 'string') {
      modules = [[null, modules, '']];
    }

    var alreadyImportedModules = {};

    for (var i = 0; i < this.length; i++) {
      var id = this[i][0];

      if (id != null) {
        alreadyImportedModules[id] = true;
      }
    }

    for (i = 0; i < modules.length; i++) {
      var item = modules[i]; // skip already imported module
      // this implementation is not 100% perfect for weird media query combinations
      // when a module is imported multiple times with different media queries.
      // I hope this will never occur (Hey this way we have smaller bundles)

      if (item[0] == null || !alreadyImportedModules[item[0]]) {
        if (mediaQuery && !item[2]) {
          item[2] = mediaQuery;
        } else if (mediaQuery) {
          item[2] = '(' + item[2] + ') and (' + mediaQuery + ')';
        }

        list.push(item);
      }
    }
  };

  return list;
};

function cssWithMappingToString(item, useSourceMap) {
  var content = item[1] || '';
  var cssMapping = item[3];

  if (!cssMapping) {
    return content;
  }

  if (useSourceMap && typeof btoa === 'function') {
    var sourceMapping = toComment(cssMapping);
    var sourceURLs = cssMapping.sources.map(function (source) {
      return '/*# sourceURL=' + cssMapping.sourceRoot + source + ' */';
    });
    return [content].concat(sourceURLs).concat([sourceMapping]).join('\n');
  }

  return [content].join('\n');
} // Adapted from convert-source-map (MIT)


function toComment(sourceMap) {
  // eslint-disable-next-line no-undef
  var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap))));
  var data = 'sourceMappingURL=data:application/json;charset=utf-8;base64,' + base64;
  return '/*# ' + data + ' */';
}

/***/ }),

/***/ "./src/bootstrap.js":
/*!**************************!*\
  !*** ./src/bootstrap.js ***!
  \**************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _ts_app_ts__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ts/app.ts */ "./src/ts/app.ts");
/* harmony import */ var _ts_app_ts__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_ts_app_ts__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _css_style_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./css/style.css */ "./src/css/style.css");
/* harmony import */ var _css_style_css__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_css_style_css__WEBPACK_IMPORTED_MODULE_1__);




/***/ }),

/***/ "./src/css/style.css":
/*!***************************!*\
  !*** ./src/css/style.css ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(/*! ../../node_modules/css-loader/dist/runtime/api.js */ "./node_modules/css-loader/dist/runtime/api.js")(false);
// Module
exports.push([module.i, "body {\n    background: #ff0000;\n}\n\n#space  {\n    border: 1px solid #ccc;\n    position: relative;\n}\n#space canvas {\n    position: absolute;\n    top: 0;\n    left: 0;\n}\n\n.container {\n    margin: 0 auto;\n    max-width: 1020px;\n    display: flex;\n    justify-content: space-between;\n}\n.col {\n    width: 500px;\n}\n\n#controls label {\n    display: block;\n}\n#controls .body-controls-box {\n    margin-bottom: 20px;\n}\n\n.warning {\n    margin-top: 10px;\n    color: #f00;\n}", ""]);



/***/ }),

/***/ "./src/ts/app.ts":
/*!***********************!*\
  !*** ./src/ts/app.ts ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const settings_1 = __webpack_require__(/*! ./settings */ "./src/ts/settings.ts");
const CelestialModelAccessor_1 = __webpack_require__(/*! ./lib/accessors/CelestialModelAccessor */ "./src/ts/lib/accessors/CelestialModelAccessor.ts");
const Renderer2D_1 = __webpack_require__(/*! ./lib/Renderer2D */ "./src/ts/lib/Renderer2D.ts");
// все данные опиывающие систему в момент времени представляем в виде примитивного массива для многопоточного доступа.
// для этого вычисляем количество элементов массива которое понадобится для хранения всей информации
let baseArrayLength = +1 // коэффициент течения времени
    + 1 // показатель количества измерений
    + 1 // показатель количества тел в системе
    + settings_1.default.bodies.length // массы
    + settings_1.default.bodies.length * settings_1.default.dimensionsAmount // векторы скоростей
    + settings_1.default.bodies.length * settings_1.default.dimensionsAmount, // координаты
buffer = new SharedArrayBuffer(Float64Array.BYTES_PER_ELEMENT * baseArrayLength), baseArray = new Float64Array(buffer), modelAccessor = new CelestialModelAccessor_1.CelestialModelAccessor(baseArray);
modelAccessor.timeCoefficient = settings_1.default.timeCoefficient;
modelAccessor.dimensionsAmount = settings_1.default.dimensionsAmount;
modelAccessor.bodiesAmount = settings_1.default.bodies.length;
modelAccessor.bodies.forEach((bodyAccessor, bodyIndex) => {
    let bodySource = settings_1.default.bodies[bodyIndex], velocity = bodyAccessor.velocity, position = bodyAccessor.position;
    bodyAccessor.mass = bodySource.mass;
    velocity.forEach((val, index) => {
        velocity[index] = bodySource.velocity[index];
    });
    position.forEach((val, index) => {
        position[index] = bodySource.position[index];
    });
});
let canvas = document.getElementById('space'), renderer = new Renderer2D_1.Renderer2D(canvas.getContext('2d'), modelAccessor, settings_1.default.renderingScale);
renderer.start();
let worker = new Worker('/dist/workers/modulator.js');
worker.postMessage({
    type: 'reset',
    buffer: buffer
});
worker.postMessage({ type: 'start' });


/***/ }),

/***/ "./src/ts/lib/Renderer2D.ts":
/*!**********************************!*\
  !*** ./src/ts/lib/Renderer2D.ts ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
class Renderer2D {
    constructor(bodiesLayer, modelAccessor, scale) {
        this.bodiesLayer = bodiesLayer;
        this.modelAccessor = modelAccessor;
        this.scale = scale;
        this.started = false;
        this.niceColors = [
            "#900",
            "#090",
            "#009",
            "#990",
            "#909",
            "#099",
            "#999",
        ];
    }
    start() {
        this.started = true;
        this.recursiveRender();
    }
    stop() {
        this.started = false;
    }
    recursiveRender() {
        if (!this.started)
            return;
        this.render();
        requestAnimationFrame(() => this.recursiveRender());
    }
    render() {
        this.bodiesLayer.clearRect(0, 0, this.bodiesLayer.canvas.width, this.bodiesLayer.canvas.height);
        this.modelAccessor.bodies.forEach((body, index) => {
            let position = body.position, x = Math.round(position[0] / this.scale * 10) / 10, y = Math.round(position[1] / this.scale * 10) / 10;
            this.bodiesLayer.fillStyle = this.niceColors[index] || "#000";
            this.bodiesLayer.beginPath();
            this.bodiesLayer.arc(x, y, 1, 0, 2 * Math.PI);
            this.bodiesLayer.fill();
        });
    }
}
exports.Renderer2D = Renderer2D;


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


/***/ })

/******/ });
//# sourceMappingURL=main.js.map