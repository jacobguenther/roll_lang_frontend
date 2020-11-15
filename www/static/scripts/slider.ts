// File: www/scripts/slider.js

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

import { ElementIds, clamp } from "./config.js";

export class SliderBar {
	element: HTMLDivElement;
	container: HTMLDivElement;
	handlingDragging: boolean;
	position: number;
	constructor() {
		this.element = <HTMLDivElement>document.getElementById(ElementIds.slider_bar);
		this.container = <HTMLDivElement>document.getElementById(ElementIds.app_content);
		this.handlingDragging = false;
		this.position = 360+3;

		const startDragging = this.startDragging.bind(this);
		const whileDragging = this.whileDragging.bind(this);
		const endDragging = this.endDragging.bind(this);
		this.element.addEventListener('mousedown', startDragging);
		this.container.addEventListener('mousemove', whileDragging);
		this.container.addEventListener('mouseup', endDragging);

		this.resetPosition();
	}
	resetPosition() {
		this.setPosition(this.position);
	}
	setPosition(pos: number) {
		if (this.element.offsetParent !== null) {
			const max = Math.max(120, window.innerWidth-20); // in case innerWidth is less than 120px
			pos = clamp(pos, 120, max);
			this.container.style.gridTemplateColumns = `1fr 6px ${pos}px`;
			this.position = pos;
		}
	}
	startDragging(event: MouseEvent) {
		this.handlingDragging = true;
		this.container.style.cursor = 'ew-resize';
	}
	whileDragging(event: MouseEvent) {
		if (this.handlingDragging) {
			let pos = window.innerWidth-event.clientX-3;
			this.setPosition(pos);
		}
	}
	endDragging(event: MouseEvent) {
		this.handlingDragging = false;
		this.container.style.cursor = 'auto';
	}
	onWindowResize() {
		if (window.innerWidth < 600) {
			this.container.style.gridTemplateColumns = '100%';
		} else {
			this.resetPosition();
		}
	}
}
