// slider.js

// Copyright (C) 2020  Jacob Guenther
// 
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
// 
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
// 
// You should have received a copy of the GNU General Public License
// along with this program.  If not, see <https://www.gnu.org/licenses/>.

const sliderBarID = 'slider-bar';
const sliderBar = document.getElementById(sliderBarID);
const gridContainer = document.getElementById('page-container');
let handlingDragging = false;

function StartDrag(event) {
	handlingDragging = true;
	gridContainer.style.cursor = 'ew-resize';
}
function onDrag(event) {
	if (handlingDragging) {
		gridContainer.style.gridTemplateColumns = `1fr 6px ${window.innerWidth-event.clientX-3}px`;
	}
}
function endDrag(event) {
	handlingDragging = false;
	gridContainer.style.cursor = 'auto';
}

sliderBar.addEventListener('mousedown', StartDrag);
gridContainer.addEventListener('mousemove', onDrag);
gridContainer.addEventListener('mouseup', endDrag);
