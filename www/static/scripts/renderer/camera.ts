/// <reference path="../config.ts" />
/// <reference path="canvas_observer.ts" />

class ZoomConstraints {
	static default: number = 1;
	// percentage
	static min: number = 0.25;
	static max: number = 2;
	static clamp(z: number): number {
		return clamp(z, ZoomConstraints.min, ZoomConstraints.max);
	}
}

// interface Camera {
// 	reset(): void;
// 	getZoom(): number;
// 	setZoom(z: number): void;
// 	getPan(): Float32Array; // vec2
// 	setPan(x: number, y: number): void;
// }

class Camera2D implements ICanvasObserver {
	canvasSize: {x: number, y: number};
	center: {x: number, y: number};
	pan: {x: number, y: number};
	zoom: number;

	zNear: number;
	zFar: number;

	constructor(gl: WebGLRenderingContext) {
		this.canvasSize = {x: gl.canvas.width, y: gl.canvas.height}
		this.center = {x: this.canvasSize.x/2, y: this.canvasSize.y/2};
		this.pan = {x: 0, y: 0};
		this.zoom = ZoomConstraints.default;
		this.zNear = 0.1;
		this.zFar = 100.0;
	}
	reset() {
		this.zoom = ZoomConstraints.default;
	}
	getZoom(): number {
		return this.zoom;
	}
	setZoom(z: number) {
		this.zoom = ZoomConstraints.clamp(z);
	}
	get left(): number {
		return -this.canvasSize.x/2;
	}
	get right(): number {
		return this.canvasSize.x/2;
	}
	get bottom(): number {
		return -this.canvasSize.y/2;
	}
	get top(): number {
		return this.canvasSize.y/2;
	}
	projection() {
		const projection = glMatrix.mat4.create();
		return glMatrix.mat4.ortho(
			projection,
			this.left, this.right,
			this.bottom, this.top,
			this.zNear, this.zFar
		);
	}
	view() {
		const view = glMatrix.mat4.create();
		return glMatrix.mat4.translate(
			view,
			view,
			[this.pan.x, this.pan.y, -1.0]
		);
	}
	notify(width: number, height: number): void {
		this.canvasSize.x = width;
		this.canvasSize.y = height;
	}
}