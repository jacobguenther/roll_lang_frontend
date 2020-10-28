/// <reference path="../config.ts" />
/// <reference path="canvas_observer.ts" />

class ZoomConstraints {
	static default: number = 100;
	// percentage
	static min: number = 25;
	static max: number = 200;
	static clamp(z: number): number {
		return clamp(z, ZoomConstraints.min, ZoomConstraints.max);
	}
}

interface Camera {
	reset(): void;
	getZoom(): number;
	setZoom(z: number): void;
	getPan(): Float32Array; // vec2
	setPan(x: number, y: number): void;
}

class Camera2D implements Camera, ICanvasObserver {
	canvasX: number;
	canvasY: number;

	zoom: number;
	panX: number;
	panY: number;

	zNear: number;
	zFar: number;

	constructor(gl: WebGLRenderingContext) {
		this.canvasX = gl.canvas.width;
		this.canvasY = gl.canvas.height;
		this.zoom = ZoomConstraints.default;
		this.panX = 0;
		this.panY = 0;
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
		return -this.canvasX/2;
	}
	get right(): number {
		return this.canvasX/2;
	}
	get bottom(): number {
		return -this.canvasY/2;
	}
	get top(): number {
		return this.canvasY/2;
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
			[this.panX, this.panY, -1.0]
		);
	}
	notify(width: number, height: number): void {
		this.canvasX = width;
		this.canvasY = height;
	}
}
class Camera3D {

}