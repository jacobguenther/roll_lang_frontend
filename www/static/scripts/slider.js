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

const sliderBar = document.getElementById(ElementIds.slider_bar);
const gridContainer = document.getElementById('page_container');
let handlingDragging = false;
let slider_position = 360+3;

function reset_slider_position() {
	set_slider_postition(slider_position)
}
function set_slider_postition(pos) {
	if (sliderBar.offsetParent !== null) {
		const max = Math.max(120, window.innerWidth); // in case innerWidth is less than 120px
		pos = clamp(pos, 120, max);
		gridContainer.style.gridTemplateColumns = `1fr 6px ${pos}px`;
		slider_position = pos;
	}
}
function StartDrag(event) {
	handlingDragging = true;
	gridContainer.style.cursor = 'ew-resize';
}
function onDrag(event) {
	if (handlingDragging) {
		let slider_position = window.innerWidth-event.clientX-3;
		set_slider_postition(slider_position);
	}
}
function endDrag(event) {
	handlingDragging = false;
	gridContainer.style.cursor = 'auto';
}

sliderBar.addEventListener('mousedown', StartDrag);
gridContainer.addEventListener('mousemove', onDrag);
gridContainer.addEventListener('mouseup', endDrag);

set_slider_postition(slider_position);
