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


class Renderer {
	playAreaDiv;
	canvas;
	gl;
	layers = [];

	constructor() {
		this.playAreaDiv = document.getElementById(ElementIds.play_area);
		this.canvas = document.getElementById(ElementIds.play_area_canvas);
		this.gl = this.canvas.getContext('webgl');
		if (this.gl === null) {
			console.error('Unable to initialize WebGL. Your browser or machine may not support it.');
		}
		this.clear();

		const callback = this.resizeCallback.bind(this);
		this.resizeObserver = new ResizeObserver(callback);
		this.resizeObserver.observe(this.playAreaDiv);
	}
	get canvasWidth() {
		return this.canvas.clientWidth;
	}
	get canvasHeight() {
		return this.canvas.clientHeight;
	}
	set canvasWidth(w) {
		this.canvas.width = Math.floor(w);
	}
	set canvasHeight(h) {
		this.canvas.height = Math.floor(h);
	}
	get width() {
		return this.gl.canvas.width;
	}
	get height() {
		return this.gl.canvas.height;
	}
	set width(w) {
		const gl = this.gl;
		const width = Math.floor(w);
		gl.canvas.width = width;
		gl.viewport(0, 0, width, this.height);
	}
	set height(h) {
		const gl = this.gl;
		const height = Math.floor(h);
		gl.canvas.height = height;
		gl.viewport(0, 0, this.width, height);
	}

	clear() {
		const gl = this.gl;
		gl.clearColor(0.5, 0.0, 0.5, 1.0);
		gl.clear(gl.COLOR_BUFFER_BIT);
	}
	resize(w, h) {
		const gl = this.gl;
		const width = Math.floor(w);
		const height = Math.floor(h);
		gl.canvas.width = width;
		gl.canvas.height = height;
		gl.viewport(0, 0, width, height);
		this.clear();
	}
	resizeCallback(entries) {
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
}