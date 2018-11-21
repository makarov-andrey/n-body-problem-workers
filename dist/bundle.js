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
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
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
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 6);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const RadiusVector_1 = __webpack_require__(3);
class VectorValue extends RadiusVector_1.RadiusVector {
    /**
     * @see getDistance
     * @returns {number}
     */
    getModuloValue() {
        return this.getDistance();
    }
    /**
     * @see setDistance
     * @returns {number}
     */
    setModuloValue(val) {
        this.setDistance(val);
    }
}
exports.VectorValue = VectorValue;


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const RadiusVector_1 = __webpack_require__(3);
/**
 * Инстанс этого класса представляет собой позицию объекта относительно точки отсчета, т.е. радиус-вектор.
 */
class Position extends RadiusVector_1.RadiusVector {
    /**
     * Изменяет себя, добавив к себе интегрированную по времени скорость (т.е. разницу в позициях)
     *
     * @param {Velocity} velocity
     * @param {number} time
     */
    move(velocity, time) {
        this.add(velocity.integrate(time));
    }
}
exports.Position = Position;


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const VectorValue_1 = __webpack_require__(0);
const Acceleration_1 = __webpack_require__(10);
/**
 * Инстанс этого класса олицетворяет собой силу, которую можно приложить к телу для придания ему ускорения
 */
class Force extends VectorValue_1.VectorValue {
    /**
     * Выводит ускорение из силы на основе массы
     *
     * @param {number} mass
     * @returns {Acceleration}
     */
    getAcceleration(mass) {
        let acceleration = new Acceleration_1.Acceleration(this.x, this.y);
        acceleration.setModuloValue(this.getModuloValue() / mass);
        return acceleration;
    }
}
exports.Force = Force;


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
class RadiusVector {
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }
    /**
     * Возвращает расстояние от текущей точки до точки to (по умолчанию - до начала координат)
     *
     * @param {RadiusVector} to
     * @returns {number}
     */
    getDistance(to = new RadiusVector(0, 0)) {
        return Math.sqrt(Math.pow(to.x - this.x, 2) + Math.pow(to.y - this.y, 2));
    }
    /**
     * Удлиняет вектор в том же направлении (устанавливая новые координаты)
     *
     * @param {number} val
     */
    setDistance(val) {
        let direction = this.getDirection();
        this.x = val * Math.sin(direction);
        this.y = val * Math.cos(direction);
    }
    /**
     * Возвращает угол вектора в радианах относительно оси абсцисс в соответствии с математическими стандартами
     *          ∧ PI * 0.5
     *          |
     *          |
     *          |      0 (PI * 2)
     * <----------------->
     * PI       |
     *          |
     *          |
     *          ∨ PI * 1.5
     *
     * @param {RadiusVector} to
     * @returns {number}
     */
    getDirection(to = null) {
        let from;
        if (to === null) {
            from = new RadiusVector(0, 0);
            to = this;
        }
        else {
            from = this;
        }
        let ordinateCatheter = to.y - from.y;
        let abscissaCatheter = to.x - from.x;
        if (ordinateCatheter == 0) {
            return abscissaCatheter >= 0 ? 0 : Math.PI;
        }
        if (abscissaCatheter == 0) {
            return ordinateCatheter >= 0 ? Math.PI / 2 : Math.PI * 1.5;
        }
        let relativeAngle = Math.abs(Math.atan(ordinateCatheter / abscissaCatheter));
        switch (to.getQuarter(from)) {
            case 1:
                return relativeAngle;
            case 2:
                return Math.PI - relativeAngle;
            case 3:
                return Math.PI + relativeAngle;
            case 4:
                return Math.PI * 2 - relativeAngle;
        }
    }
    /**
     * Устанавливает координаты вектора, не меняя значения
     *
     * @param {number} val - угол относительно оси абсцисс в радианах
     */
    setDirection(val) {
        let amount = this.getDistance();
        this.x = amount * Math.sin(val);
        this.y = amount * Math.cos(val);
    }
    /**
     * Возвращает четверть, в которой лежит радиус-вектор, в соответствии с математическими стандартами
     *          ∧
     *          |
     *    2     |    1
     *          |
     * <----------------->
     *          |
     *    3     |    4
     *          |
     *          ∨
     *
     * @param {RadiusVector} startingPosition
     * @returns {number} 1|2|3|4
     */
    getQuarter(startingPosition = new RadiusVector(0, 0)) {
        if (this.x > startingPosition.x) {
            if (this.y > startingPosition.y) {
                return 1;
            }
            else {
                return 4;
            }
        }
        else {
            if (this.y >= startingPosition.y) {
                return 2;
            }
            else {
                return 3;
            }
        }
    }
    /**
     * Прибавляет вектор к текущему вектору
     *
     * @param {RadiusVector} another
     */
    add(another) {
        this.x += another.x;
        this.y += another.y;
    }
    /**
     * Вычитает вектор из текущего вектора
     *
     * @param {RadiusVector} another
     */
    deduct(another) {
        this.x -= another.x;
        this.y -= another.y;
    }
}
exports.RadiusVector = RadiusVector;


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const VectorValue_1 = __webpack_require__(0);
const Position_1 = __webpack_require__(1);
/**
 * Инстанс этого класса представляет собой скорость объекта.
 * Т.е. подразумевается единожды дифференцированный по времени радиус-вектор.
 */
class Velocity extends VectorValue_1.VectorValue {
    /**
     * Изменяет себя, добавив к себе интегрированное по времени ускорение (т.е. разницу в скоростях)
     *
     * @param {Acceleration} acceleration
     * @param {number} time
     */
    accelerate(acceleration, time) {
        this.add(acceleration.integrate(time));
    }
    /**
     * Интегрирует по времени скорость - возвращает объект Position, представляющий собой разницу позиций
     *
     * @param {number} time
     * @returns {Position}
     */
    integrate(time) {
        let position = new Position_1.Position(this.x, this.y);
        position.setDistance(this.getModuloValue() * time);
        return position;
    }
}
exports.Velocity = Velocity;


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
function createElementFromHtml(html) {
    let template = document.createElement('template');
    template.innerHTML = html.trim();
    return template.content.firstChild;
}
exports.createElementFromHtml = createElementFromHtml;
function rand(min, max) {
    return Math.random() * (max - min) + min;
}
exports.rand = rand;


/***/ }),
/* 6 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__ts_app_ts__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__ts_app_ts___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__ts_app_ts__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__css_style_css__ = __webpack_require__(15);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__css_style_css___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__css_style_css__);




/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const CelestialMechanicsController_1 = __webpack_require__(8);
let space = document.getElementById("space");
let controls = document.getElementById("controls");
let controller = new CelestialMechanicsController_1.CelestialMechanicsController(space, controls);
controller.start();


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const CelestialMechanicsSimulator_1 = __webpack_require__(9);
const CelestialMechanicsRenderer_1 = __webpack_require__(11);
const Body_1 = __webpack_require__(12);
const BodyControlsAccessor_1 = __webpack_require__(14);
const utilities = __webpack_require__(5);
class CelestialMechanicsController {
    constructor(spaceElement, controlsElement) {
        this.spaceElement = spaceElement;
        this.controlsElement = controlsElement;
        this.integrationStep = 1 / 100000;
        this.minFPS = 30;
        this.timeScale = 1;
        this.defaultColor = "#000";
        this.niceColors = [
            "#900",
            "#090",
            "#009",
            "#990",
            "#909",
            "#099",
            "#999",
        ];
        this.started = false;
        this.bodyControlsAccessors = [];
        this.previousIntegrationTimestamp = Date.now();
        this.realTimeScale = this.timeScale;
        this.simulator = new CelestialMechanicsSimulator_1.CelestialMechanicsSimulator();
        this.renderer = new CelestialMechanicsRenderer_1.CelestialMechanicsRenderer(this.spaceElement, this.simulator);
        this.setInitialValuesForBodies();
        this.createControls();
        this.renderer.render();
    }
    reset() {
        this.synchroniseControls();
        this.renderer.reset();
    }
    applyControlsValues() {
        this.bodyControlsAccessors.forEach(accessor => accessor.apply());
        this.renderer.reset();
    }
    resetControllerSettings() {
        this.integrationStep = 1 / 10000;
        this.timeScale = 1;
        this.renderer.scale = 3e6;
        this.previousIntegrationTimestamp = Date.now();
        this.realTimeScale = this.timeScale;
    }
    setInitialValuesForBodies() {
        this.resetControllerSettings();
        this.setBodiesAmount(3);
        this.simulator.bodies.forEach(body => body.mass = 2e35);
        let scale = 3e8;
        let offsetX = scale * 2;
        let offsetY = scale * 2;
        let p1 = 0.392955;
        let p2 = 0.097579;
        this.simulator.bodies[0].position.x = -1 * scale + offsetX;
        this.simulator.bodies[0].position.y = offsetY;
        this.simulator.bodies[0].velocity.x = p1 * scale;
        this.simulator.bodies[0].velocity.y = p2 * scale;
        this.simulator.bodies[1].position.x = scale + offsetX;
        this.simulator.bodies[1].position.y = offsetY;
        this.simulator.bodies[1].velocity.x = p1 * scale;
        this.simulator.bodies[1].velocity.y = p2 * scale;
        this.simulator.bodies[2].position.x = offsetX;
        this.simulator.bodies[2].position.y = offsetY;
        this.simulator.bodies[2].velocity.x = -2 * p1 * scale;
        this.simulator.bodies[2].velocity.y = -2 * p2 * scale;
    }
    solarSystemModulation() {
        this.integrationStep = 5;
        this.timeScale = 525600;
        this.renderer.scale = 1.5e9;
        this.previousIntegrationTimestamp = Date.now();
        this.realTimeScale = this.timeScale;
        this.setBodiesAmount(2);
        let sun = this.simulator.bodies[0];
        let earth = this.simulator.bodies[1];
        sun.mass = 1.98892e30;
        sun.position.x = 3e11;
        sun.position.y = 3e11;
        sun.velocity.x = 0;
        sun.velocity.y = 0;
        earth.mass = 5.9726e24;
        earth.position.x = sun.position.x + 149597870700;
        earth.position.y = sun.position.y;
        earth.velocity.y = 0;
        earth.velocity.x = 30000;
    }
    setRandomValuesForBodies() {
        this.resetControllerSettings();
        this.setBodiesAmount(3);
        this.simulator.bodies[0].position.x = 9e8;
        this.simulator.bodies[0].position.y = 8.1e8;
        this.simulator.bodies[1].position.x = 4.5e8;
        this.simulator.bodies[1].position.y = 9e8;
        this.simulator.bodies[2].position.x = 7.5e8;
        this.simulator.bodies[2].position.y = 4.5e8;
        this.simulator.bodies.forEach(body => {
            body.mass = utilities.rand(1e35, 1e36);
            body.velocity.setModuloValue(utilities.rand(1e7, 1e8));
        });
        this.simulator.bodies[0].velocity.setDirection(utilities.rand(Math.PI, Math.PI * 1.5));
        this.simulator.bodies[1].velocity.setDirection(utilities.rand(Math.PI * 1.5, Math.PI * 2));
        this.simulator.bodies[2].velocity.setDirection(utilities.rand(Math.PI / 2, Math.PI));
    }
    start() {
        if (this.started) {
            return;
        }
        this.started = true;
        this.previousIntegrationTimestamp = Date.now();
        this.asynchronousRecursiveRender();
    }
    pause() {
        this.started = false;
    }
    setBodiesAmount(amount) {
        let length = this.simulator.bodies.length;
        while (amount < length) {
            let body = this.simulator.bodies.pop();
            if (body.color != this.defaultColor) {
                this.niceColors.unshift(body.color);
            }
            length--;
        }
        while (amount > length) {
            let body = new Body_1.Body();
            body.color = this.niceColors.shift() || this.defaultColor;
            this.simulator.bodies.push(body);
            length++;
        }
    }
    createControls() {
        this.simulator.bodies.forEach((body, i) => {
            let bodyControlsAccessor = new BodyControlsAccessor_1.BodyControlsAccessor(body, `Тело  ${i + 1}`);
            this.bodyControlsAccessors.push(bodyControlsAccessor);
            this.controlsElement.appendChild(bodyControlsAccessor.boxElement);
        });
        let stopButton = utilities.createElementFromHtml(`<button>Pause</button>`);
        stopButton.addEventListener("click", () => this.pause());
        this.controlsElement.appendChild(stopButton);
        let startButton = utilities.createElementFromHtml(`<button>Start</button>`);
        startButton.addEventListener("click", () => this.start());
        this.controlsElement.appendChild(startButton);
        let applyButton = utilities.createElementFromHtml(`<button>Apply</button>`);
        applyButton.addEventListener("click", () => this.applyControlsValues());
        this.controlsElement.appendChild(applyButton);
        let resetButton = utilities.createElementFromHtml(`<button>Reset</button>`);
        resetButton.addEventListener("click", () => {
            this.setInitialValuesForBodies();
            this.reset();
        });
        this.controlsElement.appendChild(resetButton);
        let randomButton = utilities.createElementFromHtml(`<button>Random</button>`);
        randomButton.addEventListener("click", () => {
            this.setRandomValuesForBodies();
            this.reset();
        });
        this.controlsElement.appendChild(randomButton);
        let earthSunButton = utilities.createElementFromHtml(`<button>Earth-Sun</button>`);
        earthSunButton.addEventListener("click", () => {
            this.solarSystemModulation();
            this.reset();
        });
        this.controlsElement.appendChild(earthSunButton);
        let timeScaleWarning = utilities.createElementFromHtml(`
            <div id="time-slowed-warning" class="warning" style="display: none;">
                Время замедлено на <span id="time-slowed-value"></span>%
            </div>
        `);
        this.controlsElement.appendChild(timeScaleWarning);
    }
    synchroniseControls() {
        this.bodyControlsAccessors.forEach(accessor => accessor.synchronise());
        if (this.realTimeScale < this.timeScale) {
            document.getElementById('time-slowed-warning').style.display = 'block';
            document.getElementById('time-slowed-value').innerHTML = Math.round((this.timeScale - this.realTimeScale) / this.timeScale * 100).toString();
        }
        else {
            document.getElementById('time-slowed-warning').style.display = 'none';
        }
    }
    asynchronousRecursiveRender() {
        if (!this.started) {
            return;
        }
        let now = Date.now(), frameRenderingTime = now - this.previousIntegrationTimestamp, maxFrameRenderingTime = 1000 / this.minFPS;
        this.realTimeScale *= maxFrameRenderingTime / frameRenderingTime;
        if (this.realTimeScale > this.timeScale) {
            this.realTimeScale = this.timeScale;
        }
        while (this.previousIntegrationTimestamp < now) {
            this.simulator.integrate(this.integrationStep);
            this.renderer.renderEfficiently();
            this.previousIntegrationTimestamp += this.integrationStep * 1000 / this.realTimeScale;
        }
        this.synchroniseControls();
        this.waitForAnimationFrame().then(() => this.asynchronousRecursiveRender());
    }
    waitForAnimationFrame() {
        return new Promise(resolve => requestAnimationFrame(resolve));
    }
}
exports.CelestialMechanicsController = CelestialMechanicsController;


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const Force_1 = __webpack_require__(2);
class CelestialMechanicsSimulator {
    constructor() {
        this.bodies = [];
    }
    /**
     * Метод интегрирует систему по времени. Т.е. вычисляет действие силы на каждый объект системы за заданный прошедший
     * промежуток времени и двигает тела системы в соответствии с их импульсами.
     *
     * @param {number} time
     */
    integrate(time) {
        let netGravityForcesForBodies = new Map();
        this.bodies.forEach(body => {
            netGravityForcesForBodies.set(body, this.netGravityForceFor(body));
        });
        this.bodies.forEach(body => {
            body.exert(netGravityForcesForBodies.get(body), time);
            body.move(time);
        });
    }
    /**
     * Метод вычисляет равнодействующую сил притяжения всех объектов системы на тело
     *
     * @param {Body} body
     * @returns {Force}
     */
    netGravityForceFor(body) {
        let netForce = new Force_1.Force();
        this.bodies.forEach(another => {
            if (another !== body) {
                netForce.add(body.gravityForce(another));
            }
        });
        return netForce;
    }
}
exports.CelestialMechanicsSimulator = CelestialMechanicsSimulator;


/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const VectorValue_1 = __webpack_require__(0);
const Velocity_1 = __webpack_require__(4);
/**
 * Инстанс этого класса представляет собой ускорение объекта.
 * Т.е. подразумевается дважды дифференцированный по времени радиус-вектор.
 */
class Acceleration extends VectorValue_1.VectorValue {
    /**
     * Интегрирует по времени ускорение - возвращает объект Velocity, представляющий собой разницу скоростей
     *
     * @param {number} time
     * @returns {Velocity}
     */
    integrate(time) {
        let velocity = new Velocity_1.Velocity(this.x, this.y);
        velocity.setModuloValue(this.getModuloValue() * time);
        return velocity;
    }
}
exports.Acceleration = Acceleration;


/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const Position_1 = __webpack_require__(1);
class CelestialMechanicsRenderer {
    constructor(space, modulator) {
        this.space = space;
        this.modulator = modulator;
        this.scale = 3e6;
        this.previousPositions = new WeakMap;
        this.createLayers();
        this.resetDrawnPositions();
    }
    createLayers() {
        let trajectoriesCanvas = document.createElement("canvas");
        trajectoriesCanvas.width = this.space.offsetWidth;
        trajectoriesCanvas.height = this.space.offsetHeight;
        this.space.appendChild(trajectoriesCanvas);
        this.trajectoriesLayer = trajectoriesCanvas.getContext("2d");
        let bodiesCanvas = document.createElement("canvas");
        bodiesCanvas.width = this.space.offsetWidth;
        bodiesCanvas.height = this.space.offsetHeight;
        this.space.appendChild(bodiesCanvas);
        this.bodiesLayer = bodiesCanvas.getContext("2d");
    }
    resetDrawnPositions() {
        this.modulator.bodies.forEach(body => {
            let prevPosition = this.previousPositions.get(body);
            if (!prevPosition) {
                prevPosition = new Position_1.Position();
                this.previousPositions.set(body, prevPosition);
            }
            prevPosition.x = body.position.x;
            prevPosition.y = body.position.y;
        });
    }
    needRendering() {
        return this.modulator.bodies.some(body => {
            let prevPosition = this.previousPositions.get(body);
            return Math.round(prevPosition.x / this.scale) != Math.round(body.position.x / this.scale)
                || Math.round(prevPosition.y / this.scale) != Math.round(body.position.y / this.scale);
        });
    }
    render() {
        this.renderTrajectories();
        this.renderBodies();
    }
    renderEfficiently() {
        if (this.needRendering()) {
            this.render();
        }
    }
    renderBodies() {
        this.bodiesLayer.clearRect(0, 0, this.bodiesLayer.canvas.width, this.bodiesLayer.canvas.height);
        this.modulator.bodies.forEach(body => {
            let x = Math.round(body.position.x / this.scale * 10) / 10;
            let y = Math.round(body.position.y / this.scale * 10) / 10;
            this.bodiesLayer.fillStyle = body.color;
            this.bodiesLayer.beginPath();
            this.bodiesLayer.arc(x, y, 3, 0, 2 * Math.PI);
            this.bodiesLayer.fill();
        });
    }
    renderTrajectories() {
        this.modulator.bodies.forEach(body => {
            let prevPosition = this.previousPositions.get(body);
            if (!prevPosition) {
                prevPosition = new Position_1.Position(body.position.x, body.position.y);
                this.previousPositions.set(body, prevPosition);
            }
            let oldX = Math.round(prevPosition.x / this.scale * 10) / 10;
            let oldY = Math.round(prevPosition.y / this.scale * 10) / 10;
            let newX = Math.round(body.position.x / this.scale * 10) / 10;
            let newY = Math.round(body.position.y / this.scale * 10) / 10;
            this.trajectoriesLayer.strokeStyle = body.color;
            this.trajectoriesLayer.beginPath();
            this.trajectoriesLayer.moveTo(oldX, oldY);
            this.trajectoriesLayer.lineTo(newX, newY);
            this.trajectoriesLayer.stroke();
        });
        this.resetDrawnPositions();
    }
    reset() {
        this.trajectoriesLayer.clearRect(0, 0, this.trajectoriesLayer.canvas.width, this.trajectoriesLayer.canvas.height);
        this.resetDrawnPositions();
        this.render();
    }
}
exports.CelestialMechanicsRenderer = CelestialMechanicsRenderer;


/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const Physics_1 = __webpack_require__(13);
const Position_1 = __webpack_require__(1);
const Velocity_1 = __webpack_require__(4);
const Force_1 = __webpack_require__(2);
/**
 * Физическое тело. Материальный объект, выраженный в виде материальной точки, имеющий массу, скорость и позицию
 * в момент времени.
 */
class Body {
    constructor() {
        /**
         * скорость тела в момент времени
         */
        this.velocity = new Velocity_1.Velocity();
        /**
         * Позиция тела в момент времени
         */
        this.position = new Position_1.Position();
    }
    /**
     * Применить силу в течении времени
     *
     * @param {Force} force
     * @param {number} time
     */
    exert(force, time) {
        let acceleration = force.getAcceleration(this.mass);
        this.velocity.accelerate(acceleration, time);
    }
    /**
     * Двигает свою позицию в соответствии со своей скоростью за промежуток времени
     *
     * @param {number} time
     */
    move(time) {
        this.position.move(this.velocity, time);
    }
    /**
     * Вычисляет и возвращает силу притяжения между собой и другим телом
     *
     * @param {Body} another
     * @returns {Force}
     */
    gravityForce(another) {
        let result = new Force_1.Force();
        let distance = this.position.getDistance(another.position);
        result.setModuloValue(Physics_1.Physics.G * (this.mass * another.mass / Math.pow(distance, 2)));
        result.setDirection(this.position.getDirection(another.position));
        return result;
    }
}
exports.Body = Body;


/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
class Physics {
}
/**
 * Гравитационная постоянная
 *
 * @type {number}
 */
Physics.G = 6.67408e-11;
exports.Physics = Physics;


/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const utilities = __webpack_require__(5);
class BodyControlsAccessor {
    constructor(body, name) {
        this.body = body;
        this.boxElement = utilities.createElementFromHtml(`<div class='body-controls-box'><span style="color: ${body.color}">${name}</span></div>`);
        this.massInput = utilities.createElementFromHtml(`<input type="text"/>`);
        this.xVelocityInput = utilities.createElementFromHtml(`<input type="text"/>`);
        this.yVelocityInput = utilities.createElementFromHtml(`<input type="text"/>`);
        this.xPositionInput = utilities.createElementFromHtml(`<input type="text"/>`);
        this.yPositionInput = utilities.createElementFromHtml(`<input type="text"/>`);
        let massLabel = utilities.createElementFromHtml('<label>Масса (кг):</label>');
        massLabel.appendChild(this.massInput);
        this.boxElement.appendChild(massLabel);
        let xVelocityLabel = utilities.createElementFromHtml('<label>Вектор скорости X (м/с):</label>');
        xVelocityLabel.appendChild(this.xVelocityInput);
        this.boxElement.appendChild(xVelocityLabel);
        let yVelocityLabel = utilities.createElementFromHtml('<label>Вектор скорости Y (м/с):</label>');
        yVelocityLabel.appendChild(this.yVelocityInput);
        this.boxElement.appendChild(yVelocityLabel);
        let xPositionLabel = utilities.createElementFromHtml('<label>Позиция X (м):</label>');
        xPositionLabel.appendChild(this.xPositionInput);
        this.boxElement.appendChild(xPositionLabel);
        let yPositionLabel = utilities.createElementFromHtml('<label>Позиция Y (м):</label>');
        yPositionLabel.appendChild(this.yPositionInput);
        this.boxElement.appendChild(yPositionLabel);
    }
    apply() {
        this.body.mass = Number.parseFloat(this.massInput.value);
        this.body.velocity.x = Number.parseFloat(this.xVelocityInput.value);
        this.body.velocity.y = Number.parseFloat(this.yVelocityInput.value);
        this.body.position.x = Number.parseFloat(this.xPositionInput.value);
        this.body.position.y = Number.parseFloat(this.yPositionInput.value);
    }
    synchronise() {
        this.massInput.value = this.body.mass.toExponential();
        this.xVelocityInput.value = this.body.velocity.x.toExponential();
        this.yVelocityInput.value = this.body.velocity.y.toExponential();
        this.xPositionInput.value = this.body.position.x.toExponential();
        this.yPositionInput.value = this.body.position.y.toExponential();
    }
}
exports.BodyControlsAccessor = BodyControlsAccessor;


/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(16);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {"hmr":true}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(18)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../node_modules/css-loader/index.js!./style.css", function() {
			var newContent = require("!!../../node_modules/css-loader/index.js!./style.css");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(17)(undefined);
// imports


// module
exports.push([module.i, "#space  {\n    border: 1px solid #ccc;\n    position: relative;\n}\n#space canvas {\n    position: absolute;\n    top: 0;\n    left: 0;\n}\n\n.container {\n    margin: 0 auto;\n    max-width: 1020px;\n    display: flex;\n    justify-content: space-between;\n}\n.col {\n    width: 500px;\n}\n\n#controls label {\n    display: block;\n}\n#controls .body-controls-box {\n    margin-bottom: 20px;\n}\n\n.warning {\n    margin-top: 10px;\n    color: #f00;\n}", ""]);

// exports


/***/ }),
/* 17 */
/***/ (function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
module.exports = function(useSourceMap) {
	var list = [];

	// return the list of modules as css string
	list.toString = function toString() {
		return this.map(function (item) {
			var content = cssWithMappingToString(item, useSourceMap);
			if(item[2]) {
				return "@media " + item[2] + "{" + content + "}";
			} else {
				return content;
			}
		}).join("");
	};

	// import a list of modules into the list
	list.i = function(modules, mediaQuery) {
		if(typeof modules === "string")
			modules = [[null, modules, ""]];
		var alreadyImportedModules = {};
		for(var i = 0; i < this.length; i++) {
			var id = this[i][0];
			if(typeof id === "number")
				alreadyImportedModules[id] = true;
		}
		for(i = 0; i < modules.length; i++) {
			var item = modules[i];
			// skip already imported module
			// this implementation is not 100% perfect for weird media query combinations
			//  when a module is imported multiple times with different media queries.
			//  I hope this will never occur (Hey this way we have smaller bundles)
			if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
				if(mediaQuery && !item[2]) {
					item[2] = mediaQuery;
				} else if(mediaQuery) {
					item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
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
			return '/*# sourceURL=' + cssMapping.sourceRoot + source + ' */'
		});

		return [content].concat(sourceURLs).concat([sourceMapping]).join('\n');
	}

	return [content].join('\n');
}

// Adapted from convert-source-map (MIT)
function toComment(sourceMap) {
	// eslint-disable-next-line no-undef
	var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap))));
	var data = 'sourceMappingURL=data:application/json;charset=utf-8;base64,' + base64;

	return '/*# ' + data + ' */';
}


/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/

var stylesInDom = {};

var	memoize = function (fn) {
	var memo;

	return function () {
		if (typeof memo === "undefined") memo = fn.apply(this, arguments);
		return memo;
	};
};

var isOldIE = memoize(function () {
	// Test for IE <= 9 as proposed by Browserhacks
	// @see http://browserhacks.com/#hack-e71d8692f65334173fee715c222cb805
	// Tests for existence of standard globals is to allow style-loader
	// to operate correctly into non-standard environments
	// @see https://github.com/webpack-contrib/style-loader/issues/177
	return window && document && document.all && !window.atob;
});

var getElement = (function (fn) {
	var memo = {};

	return function(selector) {
		if (typeof memo[selector] === "undefined") {
			var styleTarget = fn.call(this, selector);
			// Special case to return head of iframe instead of iframe itself
			if (styleTarget instanceof window.HTMLIFrameElement) {
				try {
					// This will throw an exception if access to iframe is blocked
					// due to cross-origin restrictions
					styleTarget = styleTarget.contentDocument.head;
				} catch(e) {
					styleTarget = null;
				}
			}
			memo[selector] = styleTarget;
		}
		return memo[selector]
	};
})(function (target) {
	return document.querySelector(target)
});

var singleton = null;
var	singletonCounter = 0;
var	stylesInsertedAtTop = [];

var	fixUrls = __webpack_require__(19);

module.exports = function(list, options) {
	if (typeof DEBUG !== "undefined" && DEBUG) {
		if (typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
	}

	options = options || {};

	options.attrs = typeof options.attrs === "object" ? options.attrs : {};

	// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
	// tags it will allow on a page
	if (!options.singleton) options.singleton = isOldIE();

	// By default, add <style> tags to the <head> element
	if (!options.insertInto) options.insertInto = "head";

	// By default, add <style> tags to the bottom of the target
	if (!options.insertAt) options.insertAt = "bottom";

	var styles = listToStyles(list, options);

	addStylesToDom(styles, options);

	return function update (newList) {
		var mayRemove = [];

		for (var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];

			domStyle.refs--;
			mayRemove.push(domStyle);
		}

		if(newList) {
			var newStyles = listToStyles(newList, options);
			addStylesToDom(newStyles, options);
		}

		for (var i = 0; i < mayRemove.length; i++) {
			var domStyle = mayRemove[i];

			if(domStyle.refs === 0) {
				for (var j = 0; j < domStyle.parts.length; j++) domStyle.parts[j]();

				delete stylesInDom[domStyle.id];
			}
		}
	};
};

function addStylesToDom (styles, options) {
	for (var i = 0; i < styles.length; i++) {
		var item = styles[i];
		var domStyle = stylesInDom[item.id];

		if(domStyle) {
			domStyle.refs++;

			for(var j = 0; j < domStyle.parts.length; j++) {
				domStyle.parts[j](item.parts[j]);
			}

			for(; j < item.parts.length; j++) {
				domStyle.parts.push(addStyle(item.parts[j], options));
			}
		} else {
			var parts = [];

			for(var j = 0; j < item.parts.length; j++) {
				parts.push(addStyle(item.parts[j], options));
			}

			stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
		}
	}
}

function listToStyles (list, options) {
	var styles = [];
	var newStyles = {};

	for (var i = 0; i < list.length; i++) {
		var item = list[i];
		var id = options.base ? item[0] + options.base : item[0];
		var css = item[1];
		var media = item[2];
		var sourceMap = item[3];
		var part = {css: css, media: media, sourceMap: sourceMap};

		if(!newStyles[id]) styles.push(newStyles[id] = {id: id, parts: [part]});
		else newStyles[id].parts.push(part);
	}

	return styles;
}

function insertStyleElement (options, style) {
	var target = getElement(options.insertInto)

	if (!target) {
		throw new Error("Couldn't find a style target. This probably means that the value for the 'insertInto' parameter is invalid.");
	}

	var lastStyleElementInsertedAtTop = stylesInsertedAtTop[stylesInsertedAtTop.length - 1];

	if (options.insertAt === "top") {
		if (!lastStyleElementInsertedAtTop) {
			target.insertBefore(style, target.firstChild);
		} else if (lastStyleElementInsertedAtTop.nextSibling) {
			target.insertBefore(style, lastStyleElementInsertedAtTop.nextSibling);
		} else {
			target.appendChild(style);
		}
		stylesInsertedAtTop.push(style);
	} else if (options.insertAt === "bottom") {
		target.appendChild(style);
	} else if (typeof options.insertAt === "object" && options.insertAt.before) {
		var nextSibling = getElement(options.insertInto + " " + options.insertAt.before);
		target.insertBefore(style, nextSibling);
	} else {
		throw new Error("[Style Loader]\n\n Invalid value for parameter 'insertAt' ('options.insertAt') found.\n Must be 'top', 'bottom', or Object.\n (https://github.com/webpack-contrib/style-loader#insertat)\n");
	}
}

function removeStyleElement (style) {
	if (style.parentNode === null) return false;
	style.parentNode.removeChild(style);

	var idx = stylesInsertedAtTop.indexOf(style);
	if(idx >= 0) {
		stylesInsertedAtTop.splice(idx, 1);
	}
}

function createStyleElement (options) {
	var style = document.createElement("style");

	options.attrs.type = "text/css";

	addAttrs(style, options.attrs);
	insertStyleElement(options, style);

	return style;
}

function createLinkElement (options) {
	var link = document.createElement("link");

	options.attrs.type = "text/css";
	options.attrs.rel = "stylesheet";

	addAttrs(link, options.attrs);
	insertStyleElement(options, link);

	return link;
}

function addAttrs (el, attrs) {
	Object.keys(attrs).forEach(function (key) {
		el.setAttribute(key, attrs[key]);
	});
}

function addStyle (obj, options) {
	var style, update, remove, result;

	// If a transform function was defined, run it on the css
	if (options.transform && obj.css) {
	    result = options.transform(obj.css);

	    if (result) {
	    	// If transform returns a value, use that instead of the original css.
	    	// This allows running runtime transformations on the css.
	    	obj.css = result;
	    } else {
	    	// If the transform function returns a falsy value, don't add this css.
	    	// This allows conditional loading of css
	    	return function() {
	    		// noop
	    	};
	    }
	}

	if (options.singleton) {
		var styleIndex = singletonCounter++;

		style = singleton || (singleton = createStyleElement(options));

		update = applyToSingletonTag.bind(null, style, styleIndex, false);
		remove = applyToSingletonTag.bind(null, style, styleIndex, true);

	} else if (
		obj.sourceMap &&
		typeof URL === "function" &&
		typeof URL.createObjectURL === "function" &&
		typeof URL.revokeObjectURL === "function" &&
		typeof Blob === "function" &&
		typeof btoa === "function"
	) {
		style = createLinkElement(options);
		update = updateLink.bind(null, style, options);
		remove = function () {
			removeStyleElement(style);

			if(style.href) URL.revokeObjectURL(style.href);
		};
	} else {
		style = createStyleElement(options);
		update = applyToTag.bind(null, style);
		remove = function () {
			removeStyleElement(style);
		};
	}

	update(obj);

	return function updateStyle (newObj) {
		if (newObj) {
			if (
				newObj.css === obj.css &&
				newObj.media === obj.media &&
				newObj.sourceMap === obj.sourceMap
			) {
				return;
			}

			update(obj = newObj);
		} else {
			remove();
		}
	};
}

var replaceText = (function () {
	var textStore = [];

	return function (index, replacement) {
		textStore[index] = replacement;

		return textStore.filter(Boolean).join('\n');
	};
})();

function applyToSingletonTag (style, index, remove, obj) {
	var css = remove ? "" : obj.css;

	if (style.styleSheet) {
		style.styleSheet.cssText = replaceText(index, css);
	} else {
		var cssNode = document.createTextNode(css);
		var childNodes = style.childNodes;

		if (childNodes[index]) style.removeChild(childNodes[index]);

		if (childNodes.length) {
			style.insertBefore(cssNode, childNodes[index]);
		} else {
			style.appendChild(cssNode);
		}
	}
}

function applyToTag (style, obj) {
	var css = obj.css;
	var media = obj.media;

	if(media) {
		style.setAttribute("media", media)
	}

	if(style.styleSheet) {
		style.styleSheet.cssText = css;
	} else {
		while(style.firstChild) {
			style.removeChild(style.firstChild);
		}

		style.appendChild(document.createTextNode(css));
	}
}

function updateLink (link, options, obj) {
	var css = obj.css;
	var sourceMap = obj.sourceMap;

	/*
		If convertToAbsoluteUrls isn't defined, but sourcemaps are enabled
		and there is no publicPath defined then lets turn convertToAbsoluteUrls
		on by default.  Otherwise default to the convertToAbsoluteUrls option
		directly
	*/
	var autoFixUrls = options.convertToAbsoluteUrls === undefined && sourceMap;

	if (options.convertToAbsoluteUrls || autoFixUrls) {
		css = fixUrls(css);
	}

	if (sourceMap) {
		// http://stackoverflow.com/a/26603875
		css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
	}

	var blob = new Blob([css], { type: "text/css" });

	var oldSrc = link.href;

	link.href = URL.createObjectURL(blob);

	if(oldSrc) URL.revokeObjectURL(oldSrc);
}


/***/ }),
/* 19 */
/***/ (function(module, exports) {


/**
 * When source maps are enabled, `style-loader` uses a link element with a data-uri to
 * embed the css on the page. This breaks all relative urls because now they are relative to a
 * bundle instead of the current page.
 *
 * One solution is to only use full urls, but that may be impossible.
 *
 * Instead, this function "fixes" the relative urls to be absolute according to the current page location.
 *
 * A rudimentary test suite is located at `test/fixUrls.js` and can be run via the `npm test` command.
 *
 */

module.exports = function (css) {
  // get current location
  var location = typeof window !== "undefined" && window.location;

  if (!location) {
    throw new Error("fixUrls requires window.location");
  }

	// blank or null?
	if (!css || typeof css !== "string") {
	  return css;
  }

  var baseUrl = location.protocol + "//" + location.host;
  var currentDir = baseUrl + location.pathname.replace(/\/[^\/]*$/, "/");

	// convert each url(...)
	/*
	This regular expression is just a way to recursively match brackets within
	a string.

	 /url\s*\(  = Match on the word "url" with any whitespace after it and then a parens
	   (  = Start a capturing group
	     (?:  = Start a non-capturing group
	         [^)(]  = Match anything that isn't a parentheses
	         |  = OR
	         \(  = Match a start parentheses
	             (?:  = Start another non-capturing groups
	                 [^)(]+  = Match anything that isn't a parentheses
	                 |  = OR
	                 \(  = Match a start parentheses
	                     [^)(]*  = Match anything that isn't a parentheses
	                 \)  = Match a end parentheses
	             )  = End Group
              *\) = Match anything and then a close parens
          )  = Close non-capturing group
          *  = Match anything
       )  = Close capturing group
	 \)  = Match a close parens

	 /gi  = Get all matches, not the first.  Be case insensitive.
	 */
	var fixedCss = css.replace(/url\s*\(((?:[^)(]|\((?:[^)(]+|\([^)(]*\))*\))*)\)/gi, function(fullMatch, origUrl) {
		// strip quotes (if they exist)
		var unquotedOrigUrl = origUrl
			.trim()
			.replace(/^"(.*)"$/, function(o, $1){ return $1; })
			.replace(/^'(.*)'$/, function(o, $1){ return $1; });

		// already a full url? no change
		if (/^(#|data:|http:\/\/|https:\/\/|file:\/\/\/)/i.test(unquotedOrigUrl)) {
		  return fullMatch;
		}

		// convert the url to a full url
		var newUrl;

		if (unquotedOrigUrl.indexOf("//") === 0) {
		  	//TODO: should we add protocol?
			newUrl = unquotedOrigUrl;
		} else if (unquotedOrigUrl.indexOf("/") === 0) {
			// path should be relative to the base url
			newUrl = baseUrl + unquotedOrigUrl; // already starts with '/'
		} else {
			// path should be relative to current directory
			newUrl = currentDir + unquotedOrigUrl.replace(/^\.\//, ""); // Strip leading './'
		}

		// send back the fixed url(...)
		return "url(" + JSON.stringify(newUrl) + ")";
	});

	// send back the fixed css
	return fixedCss;
};


/***/ })
/******/ ]);
//# sourceMappingURL=bundle.js.map