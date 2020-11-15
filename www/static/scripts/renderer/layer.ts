// File: www/scripts/renderer/layer.ts

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

export class MapLayer {
	offset: {dx: number, dy: number};

	constructor(offsetX: number, offsetY: number) {
		this.offset = {dx: offsetX, dy: offsetY};
	}

	get dx(): number {
		return this.offset.dx;
	}
	get dy(): number {
		return this.offset.dy;
	}

	set dx(x: number) {
		this.offset.dx = x;
	}
	set dy(y: number) {
		this.offset.dy = y;
	}
}
export class GridLayer extends MapLayer {
	gridSize: number;
	gridCount: number; // {x: number, y: number};

	gridPoints: number[] = [];

	useAxis: boolean = false;
	xAxis: number[] = [];
	yAxis: number[] = [];
	zAxis: number[] = [];

	static default(): GridLayer {
		return new GridLayer(32, 32, false);
	}

	constructor(gridCount: number, gridSize: number, useAxis: boolean) {
		super(0, 0);
		this.gridCount = Math.max(0, Math.floor(gridCount));
		this.gridSize = Math.max(0, Math.floor(gridSize));
		this.useAxis = useAxis;
		this.gridPoints = this.createGridPoints();
		// console.log(this.gridPoints);
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
export class ImageLayer extends MapLayer {
	imageName: string;
	size: {x: number, y: number};
	alphaTransparency: boolean;

	constructor() {
		super(0, 0);
	}
}
