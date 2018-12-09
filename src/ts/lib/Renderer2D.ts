import {CelestialModelAccessor} from "./accessors/CelestialModelAccessor";

export class Renderer2D {
    private started = false;

    public niceColors = [
        "#900",
        "#090",
        "#009",
        "#990",
        "#909",
        "#099",
        "#999",
    ];

    constructor(
        private bodiesLayer: CanvasRenderingContext2D,
        private modelAccessor: CelestialModelAccessor,
        public scale: number
    ) {}

    start() {
        this.started = true;
        this.recursiveRender();
    }

    stop() {
        this.started = false;
    }

    private recursiveRender() {
        if (!this.started) return;
        this.render();
        requestAnimationFrame(() => this.recursiveRender());
    }

    render() {
        this.bodiesLayer.clearRect(0, 0, this.bodiesLayer.canvas.width, this.bodiesLayer.canvas.height);
        this.modelAccessor.bodies.forEach((body, index) => {
            let position = body.position,
                x = Math.round(position[0] / this.scale * 10) / 10,
                y = Math.round(position[1] / this.scale * 10) / 10;

            this.bodiesLayer.fillStyle = this.niceColors[index] || "#000";
            this.bodiesLayer.beginPath();
            this.bodiesLayer.arc(x, y, 1, 0, 2 * Math.PI);
            this.bodiesLayer.fill();
        });
    }
}