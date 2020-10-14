// File: www/scripts/main.js

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

const macroSourceElement = document.getElementById(ElementIds.create_macro_source);

class Macro {
	constructor(name, source, hasShortcut) {
		this.name = name;
		this.source = source;
		this.has_shortcut = hasShortcut;
	}
}

let macros = [];

async function start() {
	await wasm_bindgen('./scripts/roll_lang_frontend_bg.wasm');
	wasm_bindgen.init_wasm(ElementIds);

	const url = '/api/player/macros/all';
	await fetch(url, {
		method: 'GET',
		mode: 'cors',
		cache: 'no-cache',
		credentials: 'same-origin',
		headers: {
		  'Content-Type': 'application/json'
		},
		redirect: 'follow',
		referrerPloicy: 'no-referrer',
	})
	.then(response => response.json())
	.then(data => {
		console.log('Success:', data);
		data.sort((a, b) => {
			if (a.name > b.name) { return 1; }
			else if (a.name < b.name) { return -1; }
			else { return 0; }
		});
		for (let element of data) {
			const macro = new Macro(element.name, element.source, element.has_shortcut);
			macros.push(macro);
			addMacroToTable(element.name, element.has_shortcut);
			if (element.has_shortcut) {
				addMacroShortcut(element.name);
			}
		}
		wasm_bindgen.add_macros(macros);
		handleMacroSort();
	})
	.catch((error) => {
		console.error('Error:', error);
	});
}


function run() {
	const source = sourceInputField.value;
	if (source.length > 0) {
		const result = wasm_bindgen.run(source);
		appendHistory(source, result);
	}
	return false;
}
function runMacro(name) {
	const source = `#{${name}}`;
	const result = wasm_bindgen.run(source);
	appendHistory(source, result);
}
function testMacro() {
	const name = document.getElementById(ElementIds.create_macro_name).value;

	// validate macro name here

	const source = macroSourceElement.value;
	if (source.length > 0) {
		const result = wasm_bindgen.run(source);
		const test_output_el = document.getElementById(ElementIds.create_macro_test_output);
		test_output_el.innerHTML = `<p class="source">#{${name}}</p>${result}`;
	}
}

function createUpdateMacro() {

	// validate macro name here

	const name = document.getElementById(ElementIds.create_macro_name).value;
	if (name.length === 0) {
		return;
	}
	const hasShortcut = document.getElementById(ElementIds.create_macro_add_shortcut).checked;
	const inShrortcuts = document.getElementById(ElementIds.macroShortcut(name)) !== null;
	const source = document.getElementById(ElementIds.create_macro_source).value;
	const inTable = document.getElementById(ElementIds.macroTableRow(name)) !== null;

	console.log(inTable);

	if (hasShortcut && !inShrortcuts) {
		addMacroShortcut(name);
	} else if (!hasShortcut && inShrortcuts) {
		deleteMacroShortcut(name);
	}

	if (!inTable) {
		addMacroToTable(name, hasShortcut);
	}

	wasm_bindgen.add_macro(new Macro(name, source, hasShortcut));

	const url = `/api/player/macros/update_create`;
	fetch(url, {
		method: 'POST',
		mode: 'cors',
		cache: 'no-cache',
		credentials: 'same-origin',
		headers: {
			'Content-Type': 'application/json'
		},
		redirect: 'follow',
		referrerPloicy: 'no-referrer',
		body: JSON.stringify({
			name: name,
			source: source,
			has_shortcut: hasShortcut,
		})
	})
	.catch((error) => {
		console.error('Error:', error);
	});
}
function deleteMacro(macroName) {
	const shortcut = document.getElementById(ElementIds.macroShortcut(macroName));
	if (shortcut) {
		shortcut.remove();
	}
	const row = document.getElementById(ElementIds.macroTableRow(macroName)).remove();
	if (row) {
		row.remove();
	}

	wasm_bindgen.remove_macro(name);

	const url = `/api/player/macros/delete`;
	fetch(url, {
		method: 'DELETE',
		mode: 'cors',
		cache: 'no-cache',
		credentials: 'same-origin',
		headers: {
			'Content-Type': 'application/json'
		},
		redirect: 'follow',
		referrerPloicy: 'no-referrer',
		body: JSON.stringify({
			name: macroName,
		})
	})
	.catch((error) => {
		console.error('Error:', error);
	});
}

function changeMacroShortcut(macroName) {
	const hasShortcut = document.getElementById(ElementIds.macroTableShortcutTongle(macroName)).checked;
	const inShrortcuts = document.getElementById(ElementIds.macroShortcut(macroName)) !== null;

	if (hasShortcut && !inShrortcuts) {
		addMacroShortcut(macroName);
	} else if (!hasShortcut && inShrortcuts) {
		deleteMacroShortcut(macroName);
	}
}
function addMacroShortcut(macroName) {
	const shortcuts = document.getElementById(ElementIds.macro_shortcuts);
	let newShortcut = document.createElement('button');
	newShortcut.id = ElementIds.macroShortcut(macroName);
	newShortcut.innerHTML = macroName;
	newShortcut.setAttribute('onclick', `runMacro('${macroName}');`);
	shortcuts.appendChild(newShortcut);

	const url = `/api/player/macros/update_shortcut`;
	fetch(url, {
		method: 'POST',
		mode: 'cors',
		cache: 'no-cache',
		credentials: 'same-origin',
		headers: {
			'Content-Type': 'application/json'
		},
		redirect: 'follow',
		referrerPloicy: 'no-referrer',
		body: JSON.stringify({
			name: macroName,
			source: "",
			has_shortcut: true,
		})
	})
	.catch((error) => {
		console.error('Error:', error);
	});
}
function deleteMacroShortcut(macroName) {
	document.getElementById(ElementIds.macroShortcut(macroName)).remove();

	const url = `/api/player/macros/update_shortcut`;
	fetch(url, {
		method: 'POST',
		mode: 'cors',
		cache: 'no-cache',
		credentials: 'same-origin',
		headers: {
			'Content-Type': 'application/json'
		},
		redirect: 'follow',
		referrerPloicy: 'no-referrer',
		body: JSON.stringify({
			name: macroName,
			source: "",
			has_shortcut: false,
		})
	})
	.catch((error) => {
		console.error('Error:', error);
	});
}
function addMacroToTable(macroName, hasShortcut) {
	const macroTable = document.getElementById(ElementIds.macro_table);

	let newRow = document.createElement('tr');
	newRow.id = ElementIds.macroTableRow(macroName);

	const nameCell = document.createElement('td');
	nameCell.innerHTML = macroName;
	nameCell.setAttribute('onclick', `selectMacro('${macroName}');`);

	const shortcutCell = document.createElement('td');
	const shortcutTongle = document.createElement('input');
	shortcutTongle.type = 'checkbox';
	if (hasShortcut) {
		shortcutTongle.checked = true;
	}
	shortcutTongle.id = ElementIds.macroTableShortcutTongle(macroName);
	shortcutTongle.setAttribute('onclick', `changeMacroShortcut('${macroName}');`);
	shortcutCell.appendChild(shortcutTongle);

	const deleteCell = document.createElement('td');
	deleteCell.id = ElementIds.macroTableRowDelete(macroName);
	deleteCell.innerHTML = 'delete';
	deleteCell.setAttribute('onclick', `deleteMacro('${macroName}');`);

	newRow.appendChild(nameCell);
	newRow.appendChild(shortcutCell);
	newRow.appendChild(deleteCell);
	macroTable.appendChild(newRow);
}
function selectMacro(macroName) {
	document.getElementById(ElementIds.create_macro_name).value = macroName;
	document.getElementById(ElementIds.create_macro_source).value = wasm_bindgen.macro_source(macroName);
}