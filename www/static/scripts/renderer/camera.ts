// File: www/scripts/play_area.js

/**
 * @licstart The following is the entire license notice for the
 *  JavaScript code in this page.
 *
 * Copyright (C) 2020  Jacob Guenther
 *
 * The JavaScript code in this page is free software: you can
 * redistribute it and/or modify it under the terms of the GNU
 * General Public License (GNU GPL) as published by the Free Software
 * Foundation, either version 3 of the License, or (at your option)
 * any later version.  The code is distributed WITHOUT ANY WARRANTY;
 * without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE.  See the GNU GPL for more details.
 *
 * As additional permission under GNU GPL version 3 section 7, you
 * may distribute non-source (e.g., minimized or compacted) forms of
 * that code without the copy of the GNU GPL normally required by
 * section 4, provided you include this license notice and a URL
 * through which recipients can access the Corresponding Source.
 *
 * @licend The above is the entire license notice
 * for the JavaScript code in this page.
 */

import { clamp } from "./../config.js";
import { ICanvasObserver } from "./canvas_observer.js";
import * as mat4 from "./../gl_matrix/src/mat4.js";

class ZoomConstraints {
	static default: number = 1;
	static min: number = 0.25;
	static max: number = 2;
	static clamp(z: number): number {
		return clamp(z, ZoomConstraints.min, ZoomConstraints.max);
	}
}

export class Camera2D implements ICanvasObserver {
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
		const projection = mat4.create();
		return mat4.ortho(
			projection,
			this.left, this.right,
			this.bottom, this.top,
			this.zNear, this.zFar
		);
	}
	view() {
		const view = mat4.create();
		return mat4.translate(
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