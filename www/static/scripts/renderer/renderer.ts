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

/// <reference path="../config.ts" />
/// <reference path="camera.ts" />
/// <reference path="canvas_observer.ts" />
/// <reference path="resources.ts" />


const indices = [
	0, 1, 2,
	1, 3, 2,
];

const quad2 = [
	 1.0,  1.0, 0.0, 1.0,
	-1.0,  1.0, 0.0, 1.0,
	 1.0, -1.0, 0.0, 1.0,
	-1.0, -1.0, 0.0, 1.0
];
const quad = [
	// position                uv          color           normal           tangent
	-0.5,  0.5,  0.0,  1.0, // 0.0, 0.0,
	 0.5,  0.5,  0.0,  1.0, // 1.0, 0.0,
	-0.5, -0.5,  0.0,  1.0, // 0.0, 1.0,
	 0.5, -0.5,  0.0,  1.0, // 1.0, 1.0,
];
const uv = [
	0.0, 0.0,
	1.0, 0.0,
	0.0, 1.0,
	1.0, 1.0,
];
const colors = [
	1.0,  1.0,  1.0,  1.0,    // white
	1.0,  0.0,  0.0,  1.0,    // red
	0.0,  1.0,  0.0,  1.0,    // green
	0.0,  0.0,  1.0,  1.0,    // blue
];

class Grid {
	gridCount: number;
	gridSize: number;

	gridPoints: number[] = [];

	useAxis: boolean = false;
	xAxis: number[] = [];
	yAxis: number[] = [];
	zAxis: number[] = [];
	constructor(gridCount: number, gridSize: number, useAxis: boolean) {
		this.gridCount = Math.floor(gridCount);
		this.gridSize = Math.floor(gridSize);
		this.useAxis = useAxis;
		this.gridPoints = this.createGridPoints();
		console.log(this.gridPoints);
	}
	createGridPoints(): number[] {
		const points: number[] = [];

		const min = -this.gridCount * this.gridSize/2;
		const max = this.gridCount * this.gridSize/2;
		for (let pos = -this.gridCount/2; pos < this.gridCount/2; ++pos) {
			const offset = pos * this.gridSize;
			points.push(
				offset, min, offset, max, // y dir
				min, offset, max, offset  // x dir
			);
		}
		points.push(min, max, max, max);
		points.push(max, min, max, max);

		return points;
	}
}

class Renderer implements ICanvasObservable {
	private playAreaDiv: HTMLDivElement;
	private canvas: HTMLCanvasElement;
	private gl: WebGLRenderingContext;
	// private layers: Array<Layer> = [];
	private resizeObserver: ResizeObserver; // Definition isn't in Typescript yet, just going to wait till it is.
	private resources: Resources;

	private camera: Camera2D;

	private canvasObservers: ICanvasObserver[] = [];

	private firstRun = true;

	constructor() {
		const maybePlayArea = document.getElementById(ElementIds.play_area);
		if (maybePlayArea instanceof HTMLDivElement) {
			this.playAreaDiv = maybePlayArea;
		} else {
			console.error('Could not find map div wrapper!');
		}
		const maybeCanvas = document.getElementById(ElementIds.play_area_canvas);
		if (maybeCanvas instanceof HTMLCanvasElement) {
			this.canvas = maybeCanvas;
		} else {
			console.error('Could not find map canvas!');
		}
		const maybeContext = this.canvas.getContext('webgl');
		if (maybeContext instanceof WebGLRenderingContext) {
			this.gl = maybeContext;
		} else {
			console.error('Unable to initialize WebGL. Your browser or machine may not support it.');
		}

		// this.layers.push(Layer.default());

		this.setWebGLDefaults();

		const callback = this.resizeCallback.bind(this);
		this.resizeObserver = new ResizeObserver(callback);
		this.resizeObserver.observe(this.playAreaDiv);

		this.resources = new Resources();

		this.camera = new Camera2D(this.gl);
		this.attachObserver(this.camera);
	}

	get canvasWidth(): number {
		return this.canvas.clientWidth;
	}
	get canvasHeight(): number {
		return this.canvas.clientHeight;
	}
	set canvasWidth(w: number) {
		this.canvas.width = Math.floor(w);
	}
	set canvasHeight(h: number) {
		this.canvas.height = Math.floor(h);
	}

	get width(): number {
		return this.gl.canvas.width;
	}
	get height(): number {
		return this.gl.canvas.height;
	}
	set width(w: number) {
		const gl = this.gl;
		const width = Math.floor(w);
		gl.canvas.width = width;
		gl.viewport(0, 0, width, this.height);
	}
	set height(h: number) {
		const gl = this.gl;
		const height = Math.floor(h);
		gl.canvas.height = height;
		gl.viewport(0, 0, this.width, height);
	}

	setWebGLDefaults() {
		const gl = this.gl;
		const gray = 0.5;
		gl.clearColor(gray, gray, gray, 1.0);
		gl.clearDepth(1.0);
		gl.enable(gl.DEPTH_TEST);
		gl.depthFunc(gl.LEQUAL);
	}
	clear(): void {
		const gl = this.gl;
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	}
	draw(): void {
		this.clear();
	}

	createBuffer(data: Array<any>, type: number): WebGLBuffer {
		const gl = this.gl;
		const buffer = gl.createBuffer();
		gl.bindBuffer(type, buffer);
		if (type === gl.ELEMENT_ARRAY_BUFFER) {
			gl.bufferData(type, new Uint16Array(data), gl.STATIC_DRAW);
		} else {
			gl.bufferData(type, new Float32Array(data), gl.STATIC_DRAW);
		}
		return buffer;
	}
	bindBuffer(program: WebGLProgram, buffer: WebGLBuffer) {

	}
	setupBuffer(): void {
		if (!this.firstRun) {
			const gl = this.gl;
			this.clear();


			const programInfo = this.resources.getProgram('test');
			if (!programInfo) {
				return;
			}
			const positionBuffer = this.createBuffer(quad, gl.ARRAY_BUFFER);
			{
				const numComponents = 4;
				const type = gl.FLOAT;
				const normalize = false;
				const stride = 0;
				const offset = 0;
				gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
				gl.vertexAttribPointer(
					programInfo.attributeLocations.vertexPosition,
					numComponents,
					type,
					normalize,
					stride,
					offset);
				gl.enableVertexAttribArray(
					programInfo.attributeLocations.vertexPosition);
			}

			const uvBuffer = this.createBuffer(uv, gl.ARRAY_BUFFER);
			{
				const numComponents = 2;
				const type = gl.FLOAT;
				const normalize = false;
				const stride = 0;
				const offset = 0;
				gl.bindBuffer(gl.ARRAY_BUFFER, uvBuffer);
				gl.vertexAttribPointer(
					programInfo.attributeLocations.textureCoord,
					numComponents,
					type,
					normalize,
					stride,
					offset);
				gl.enableVertexAttribArray(
					programInfo.attributeLocations.textureCoord);
			}

			const colorBuffer = this.createBuffer(colors, gl.ARRAY_BUFFER);
			{
				const numComponents = 4;
				const type = gl.FLOAT;
				const normalize = false;
				const stride = 0;
				const offset = 0;
				gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
				gl.vertexAttribPointer(
					programInfo.attributeLocations.vertexColor,
					numComponents,
					type,
					normalize,
					stride,
					offset);
				gl.enableVertexAttribArray(
					programInfo.attributeLocations.vertexColor);
			}

			const indexBuffer = this.createBuffer(indices, gl.ELEMENT_ARRAY_BUFFER);

			const textureInfo = this.resources.getImage('testImage');

			gl.activeTexture(gl.TEXTURE0);
			gl.bindTexture(gl.TEXTURE_2D, textureInfo.texture);

			const projectionMatrix = this.camera.projection();
			const viewMatrix = this.camera.view();
			const modelMatrix = glMatrix.mat4.create();
			{
				glMatrix.mat4.scale(
					modelMatrix,
					modelMatrix,
					[textureInfo.sizeX, textureInfo.sizeY, 0]
				);
			}

			gl.useProgram(programInfo.program);
			gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);

			gl.uniform1i(programInfo.uniformLocations.sampler, 0);
			gl.uniform1f(programInfo.uniformLocations.mixFactor, 0.0);

			gl.uniformMatrix4fv(programInfo.uniformLocations.projectionMatrix, false, projectionMatrix);
			gl.uniformMatrix4fv(programInfo.uniformLocations.viewMatrix, false, viewMatrix);
			gl.uniformMatrix4fv(programInfo.uniformLocations.modelMatrix, false, modelMatrix);

			{
				const count = 6;
				const type = gl.UNSIGNED_SHORT;
				const offset = 0;
				gl.drawElements(gl.TRIANGLES, count, type, offset);
			}


			const gridCount = 64;
			const gridSize = 64;

			const gridProgram = this.resources.getProgram('grid');
			const grid = new Grid(gridCount, gridSize, false);
			const gridBuffer = this.createBuffer(grid.gridPoints, gl.ARRAY_BUFFER);
			{
				const numComponents = 2;
				const type = gl.FLOAT;
				const normalize = false;
				const stride = 0;
				const offset = 0;
				gl.vertexAttribPointer(
					gridProgram.attributeLocations.vertexPosition,
					numComponents,
					type,
					normalize,
					stride,
					offset);
				gl.enableVertexAttribArray(
					gridProgram.attributeLocations.vertexPosition);
			}
			gl.useProgram(gridProgram.program);
			gl.uniformMatrix4fv(gridProgram.uniformLocations.projectionMatrix, false, projectionMatrix);
			gl.uniformMatrix4fv(gridProgram.uniformLocations.viewMatrix, false, viewMatrix);
			gl.uniformMatrix4fv(gridProgram.uniformLocations.modelMatrix, false, glMatrix.mat4.create());

			gl.uniform4fv(gridProgram.uniformLocations.gridColor, new Float32Array([0.0, 0.0, 0.0, 1.0]));
			gl.drawArrays(gl.LINES, 0, gridCount*4+4);

		} else {
			this.firstRun = false;
		}
	}

	attachObserver(observer: ICanvasObserver): void {
		const exists = this.canvasObservers.includes(observer);
		if (!exists) {
			this.canvasObservers.push(observer);
		}
	}
	detachObserver(observer: ICanvasObserver): void {

	}
	notifyObservers(width: number, height: number): void {
		for (const observer of this.canvasObservers) {
			observer.notify(width, height);
		}
	}

	resize(w: number, h: number): void {
		const gl = this.gl;
		const width = Math.floor(w);
		const height = Math.floor(h);
		gl.canvas.width = width;
		gl.canvas.height = height;
		gl.viewport(0, 0, width, height);
		this.clear();
		this.setupBuffer();
	}
	resizeCallback(entries: ResizeObserverEntry): void {
		let entry;
		if (entries.length > 0) {
			entry = entries[0];
		} else {
			return;
		}

		let width = 0;
		let height = 0;
		if (entry.contentBoxSize) {
			width = entry.contentBoxSize.inlineSize;
			height = entry.contentBoxSize.blockSize;
		} else {
			width = entry.contentRect.width;
			height = entry.contentRect.height;
		}
		height += 4;
		this.resize(width, height);
		this.notifyObservers(width, height);
	}
	async loadDefaults() {
		const testProgram = await this.resources.loadProgram(this.gl, 'test', 'vertex.vert', 'fragment.frag')
			.catch(console.error);
		const gridProgram = await this.resources.loadProgram(this.gl, 'grid', 'grid.vert', 'grid.frag')
			.catch(console.error);
		const image = await this.resources.loadImage(this.gl, 'testImage', 'testmap.png')
			.catch(console.error);
	}
}
