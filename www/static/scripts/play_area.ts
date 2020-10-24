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

"use strict";

interface Drawable {
	draw(): void;
}
class Layer {
	private height_m: number = 0;
	private sublayers: Array<Sublayer> = [];

	constructor(height: number, sublayers: Array<Sublayer> | null) {
		this.height = height;
		if (sublayers) {
			for (const sublayer of sublayers) {
				this.addSublayer(sublayer);
			}
		}
	}
	static default() {
		const height = 0;
		const sublayers = [];
		sublayers.push(new Sublayer(SublayerType.GRID));
		sublayers.push(new Sublayer(SublayerType.FREEHAND));
		sublayers.push(new Sublayer(SublayerType.VECTOR));
		return new Layer(height, sublayers);
	}
	get height(): number {
		return this.height_m;
	}
	set height(h: number) {
		this.height_m = Math.max(0, h);
	}
	addSublayer(sublayer: Sublayer) {
		if (sublayer instanceof Sublayer) {
			this.sublayers.push(sublayer);
		}
	}
}

const enum SublayerType {
	GRID,
	FREEHAND,
	VECTOR,
	WALLS,
	IMAGE,
	MASK,
	LIGHTS,
};

class Sublayer {
	type: SublayerType;

	constructor(type: SublayerType) {
		this.type = type;
	}
}

class ZoomConstraints {
	static default: number = 100;
	static min: number = 25;
	static max: number = 200;
	static clamp(z: number): number {
		return clamp(z, ZoomConstraints.min, ZoomConstraints.max);
	}
}
interface Camera {
	reset(): void;
	zoom: number;
}
class Camera2D implements Camera {
	zoom_m: number;

	constructor() {
		this.zoom = ZoomConstraints.default;
	}
	reset() {

	}
	get zoom(): number {
		return this.zoom_m;
	}
	set zoom(z: number) {
		this.zoom_m = ZoomConstraints.clamp(z);
	}
}
class Camera3D {

}



interface IKeyedCollection<T> {
    add(key: string, value: T): void;
    containsKey(key: string): boolean;
    count(): number;
    item(key: string): T;
    keys(): string[];
    remove(key: string): T;
    values(): T[];
}
class KeyedCollection<T> implements IKeyedCollection<T> {
    private items: { [index: string]: T } = {};
    private count_m: number = 0;

    public add(key: string, value: T) {
        if(!this.items.hasOwnProperty(key))
             this.count_m++;

        this.items[key] = value;
    }
	public containsKey(key: string): boolean {
        return this.items.hasOwnProperty(key);
    }
    public count(): number {
        return this.count_m;
    }
    public item(key: string): T {
        return this.items[key];
    }
    public keys(): string[] {
        var keySet: string[] = [];
        for (var prop in this.items) {
            if (this.items.hasOwnProperty(prop)) {
                keySet.push(prop);
            }
        }
        return keySet;
	}
    public remove(key: string): T {
        var val = this.items[key];
        delete this.items[key];
        this.count_m--;
        return val;
    }
    public values(): T[] {
        var values: T[] = [];
        for (var prop in this.items) {
            if (this.items.hasOwnProperty(prop)) {
                values.push(this.items[prop]);
            }
        }
        return values;
    }
}

class SourceResource {
	public source: string;
	constructor(source: string) {
		this.source = source;
	}
}
class ShaderResource {
	public sourceName: string;
	public type: number;
	public shader: WebGLShader;

	constructor(sourceName: string, type: number, shader: WebGLShader) {
		this.sourceName = sourceName;
		this.type = type;
		this.shader = shader;
	}
}
class ShaderAttributeLocations {
	vertexPosition: number;
	constructor(gl: WebGLRenderingContext, shaderProgram: WebGLProgram) {
		this.vertexPosition = gl.getAttribLocation(shaderProgram, 'aVertexPosition');
	}
}
class ShaderUniformLocations {
	projectionMatrix: WebGLUniformLocation;
	modelViewMatrix: WebGLUniformLocation;
	// modelMatrix: WebGLUniformLocation;
	// viewMatrix: WebGLUniformLocation;
	constructor(gl: WebGLRenderingContext, shaderProgram: WebGLProgram) {
		this.projectionMatrix = gl.getUniformLocation(shaderProgram, 'uProjectionMatrix');
		this.modelViewMatrix = gl.getUniformLocation(shaderProgram, 'uModelViewMatrix');
		// this.modelMatrix = gl.getUniformLocation(shaderProgram, 'uModelMatrix');
		// this.viewMatrix = gl.getUniformLocation(shaderProgram, 'uViewMatrix');
	}
}
class ProgramResource {
	public vertexSourceName: string;
	public fragmentSourceName: String;
	public program: WebGLProgram;
	public attributeLocations: ShaderAttributeLocations;
	public uniformLocations: ShaderUniformLocations;
	constructor(
		gl: WebGLRenderingContext,
		vertexSourceName: string,
		fragmentSourceName: string,
		program: WebGLProgram)
	{
		this.vertexSourceName = vertexSourceName;
		this.fragmentSourceName = fragmentSourceName;
		this.program = program;
		this.attributeLocations = new ShaderAttributeLocations(gl, program);
		this.uniformLocations = new ShaderUniformLocations(gl, program);
	}
}
class Resources {
	private shaderSources: KeyedCollection<SourceResource> = new KeyedCollection<SourceResource>();
	private shaders: KeyedCollection<ShaderResource> = new KeyedCollection<ShaderResource>();
	private programs: KeyedCollection<ProgramResource> = new KeyedCollection<ProgramResource>();

	async loadShaderSource(name: string): Promise<SourceResource> {
		if (this.shaderSources.containsKey(name)) {
			const res = this.shaderSources.item(name);
			return res;
		}

		let source = '';
		const self = this;
		await fetch(`/assets/shaders/${name}`, {
			method: 'GET',
			mode: 'cors',
			cache: 'no-cache',
			credentials: 'omit',
			headers: {
				'content-type': 'application/json'
			},
			redirect: 'follow',
			referrerPolicy: 'no-referrer',
			body: null,
		})
		.then(checkFetchText)
		.then((data) => {
			source = data;
		})
		.catch(console.error)

		const res = new SourceResource(source);
		this.shaderSources.add(name, res);
		return res;
	}
	async loadShader(gl: WebGLRenderingContext, name: string, type: number): Promise<ShaderResource> {
		if (this.shaders.containsKey(name)) {
			const res = this.shaders.item(name);
			return res;
		}
		const source = await this.loadShaderSource(name);
		const shader = gl.createShader(type);
		gl.shaderSource(shader, source.source);
		gl.compileShader(shader);

		// validate compilateion?

		const res = new ShaderResource(name, type, shader);
		this.shaders.add(name, res);
		return res;
	}
	async loadProgram(gl: WebGLRenderingContext, programName: string, vertexName: string, fragmentName: string): Promise<ProgramResource> {
		if (this.programs.containsKey(name)) {
			const res = this.programs.item(name);
			return res;
		}
		const vertexShader = await this.loadShader(gl, vertexName, gl.VERTEX_SHADER);
		const fragmentShader = await this.loadShader(gl, fragmentName, gl.FRAGMENT_SHADER);

		const program = gl.createProgram();
		gl.attachShader(program, vertexShader.shader);
		gl.attachShader(program, fragmentShader.shader);
		gl.linkProgram(program);

		// validate link status?

		const res = new ProgramResource(gl, vertexName, fragmentName, program);
		this.programs.add(programName, res)
		return res;
	}
	getProgram(name: string): ProgramResource {
		return this.programs.item(name);
	}
}
class Renderer {
	private playAreaDiv: HTMLDivElement;
	private canvas: HTMLCanvasElement;
	private gl: WebGLRenderingContext;
	private layers: Array<Layer> = [];
	private resizeObserver: ResizeObserver;
	private resources: Resources;

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

		this.layers.push(Layer.default());

		const callback = this.resizeCallback.bind(this);
		this.resizeObserver = new ResizeObserver(callback);
		this.resizeObserver.observe(this.playAreaDiv);

		this.resources = new Resources;
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

	clear(): void {
		const gl = this.gl;
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	}

	setupBuffer(): void {
		const gl = this.gl;
		gl.clearColor(0.5, 0.0, 0.0, 1.0);
		gl.clearDepth(1.0);
		gl.enable(gl.DEPTH_TEST);
		gl.depthFunc(gl.LEQUAL);
		this.clear();

		const positionBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
		const positions = [
			-1.0,  1.0,
			 1.0,  1.0,
			-1.0, -1.0,
			 1.0, -1.0,
		];
		gl.bufferData(gl.ARRAY_BUFFER,
						new Float32Array(positions),
						gl.STATIC_DRAW);


		const projectionMatrix = glMatrix.mat4.create();
		{
			const fov = 45 * Math.PI / 180;
			const aspect = this.width / this.height;
			const zNear = 0.1;
			const zFar = 100.0;
			glMatrix.mat4.perspective(
				projectionMatrix,
				fov,
				aspect,
				zNear,
				zFar,
			);
		}

		const modelViewMatrix = glMatrix.mat4.create();
		glMatrix.mat4.translate(
			modelViewMatrix,
			modelViewMatrix,
			[0.0, 0.0, -5.0]
		);

		const programInfo = this.resources.getProgram('test');
		{
			const numComponents = 2;  // pull out 2 values per iteration
			const type = gl.FLOAT;    // the data in the buffer is 32bit floats
			const normalize = false;  // don't normalize
			const stride = 0;         // how many bytes to get from one set of values to the next
										// 0 = use type and numComponents above
			const offset = 0;         // how many bytes inside the buffer to start from
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
		gl.useProgram(programInfo.program);

		// Set the shader uniforms

		gl.uniformMatrix4fv(
			programInfo.uniformLocations.projectionMatrix,
			false,
			projectionMatrix);
		gl.uniformMatrix4fv(
			programInfo.uniformLocations.modelViewMatrix,
			false,
			modelViewMatrix);

		{
			const offset = 0;
			const vertexCount = 4;
			gl.drawArrays(gl.TRIANGLE_STRIP, offset, vertexCount);
		}
	}
	draw(): void {
		this.clear();
	}

	resize(w: number, h: number): void {
		const gl = this.gl;
		const width = Math.floor(w);
		const height = Math.floor(h);
		gl.canvas.width = width;
		gl.canvas.height = height;
		gl.viewport(0, 0, width, height);
		this.clear();
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
	}
	async loadDefaults() {
		const program = await this.resources.loadProgram(this.gl, 'test', 'vertex.vert', 'fragment.frag');
	}
}