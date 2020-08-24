// File: index.js

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


const {  } = wasm_bindgen;

const sourceInputField = document.getElementById('input-textarea');
const history = document.getElementById('history');
let historyIDCounter = 0;
let currentSelectedHistoryElement = 0;
const macroSourceElement = document.getElementById('create-macro-source');

async function start() {
	await wasm_bindgen('./scripts/roll_lang_frontend_bg.wasm');
	wasm_bindgen.init_wasm();
}
function readSource() {
	console.log(sourceInputField.value);
	return sourceInputField.value;
}
function run() {
	const source = readSource();
	const result = wasm_bindgen.run(source);
	appendHistory(source, result);
	return false;
}
function runMacro(name) {
	const source = wasm_bindgen.macro_source(name);
	const result = wasm_bindgen.run(source);
	appendHistory(source, result);
}

function appendHistory(source, result) {
	const latestEntry = document.createElement('li');
	const sourceElement = document.createElement('p');
	const resultElement = document.createElement('p');
	const deleteEntry = document.createElement('button');

	latestEntry.setAttribute('id', historyIDCounter);
	sourceElement.innerHTML = source;
	sourceElement.setAttribute('class', 'source');
	resultElement.innerHTML = result;
	deleteEntry.type = 'button';
	deleteEntry.innerHTML = 'Delete Entry';
	deleteEntry.setAttribute('onclick', `deleteHistoryEntry(${historyIDCounter})`);
	historyIDCounter += 1;

	latestEntry.appendChild(sourceElement);
	latestEntry.appendChild(resultElement);
	latestEntry.appendChild(deleteEntry);
	history.appendChild(latestEntry);
	history.scrollTop = 100000;

	currentSelectedHistoryElement = history.childElementCount;
}
function getSourceFromHistory(i) {
	const historyEntry = history.children[i];
	if (historyEntry === undefined) {
		return undefined;
	}
	return historyEntry.querySelector(".source").innerHTML;
}
function clearHistory() {
	while (history.firstChild) {
		history.removeChild(history.lastChild);
	}
	historySources = new Map();
}
function deleteHistoryEntry(id) {
	let entry = document.getElementById(id);
	history.removeChild(entry);
}


function inputFocusIn() {
	sourceInputField.addEventListener('keydown', handleKeyDown);
}
function inputFocusOut() {
	sourceInputField.removeEventListener('keydown', handleKeyDown);
}


function handleKeyDown(event) {
	if (event.keyCode === 13) { // enter
		event.preventDefault();
		run();
		sourceInputField.value = "";
	} else if (event.keyCode === 38) { // up
		event.preventDefault();
		if (currentSelectedHistoryElement < 1) {
			return;
		}

		let source = getSourceFromHistory(currentSelectedHistoryElement-1);
		if (source === undefined) {
			sourceInputField.value = '';
			currentSelectedHistoryElement = history.childElementCount;
		} else {
			currentSelectedHistoryElement -= 1;
			sourceInputField.value = source;
		}
	} else if (event.keyCode == '40') { // down
		event.preventDefault();
		let source = getSourceFromHistory(currentSelectedHistoryElement+1);
		if (source === undefined) {
			sourceInputField.value = '';
			currentSelectedHistoryElement = history.childElementCount;
		} else {
			currentSelectedHistoryElement += 1;
			sourceInputField.value = source;
		}
	}
}