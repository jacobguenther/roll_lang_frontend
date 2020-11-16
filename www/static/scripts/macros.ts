// File: www/scripts/macro_table_sort.js

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

import { ElementIds } from "./config.js"
import * as wasm_bindgen from "./roll_interpreter.js"
import {run as wasm_interpret_roll} from "./roll_interpreter.js"
import { fetchJson } from "./fetch.js"
import { chat } from "./main.js"

export class Macro {
	name: string;
	source: string;
	has_shortcut: boolean;

	constructor(name: string, source: string, has_shortcut: boolean) {
		this.name = name;
		this.source = source;
		this.has_shortcut = has_shortcut;
	}
}

export function runMacro(name: string) {
	const source = `#{${name}}`;
	const result = wasm_interpret_roll(source);
	chat.appendHistory(source, result);
}

export function testMacro() {
	const name = (<HTMLInputElement>document.getElementById(ElementIds.create_macro_name)).value;

	// validate macro name here

	const source = (<HTMLTextAreaElement>document.getElementById(ElementIds.create_macro_source)).value;
	if (source.length > 0) {
		const result = wasm_interpret_roll(source);
		const test_output_el = document.getElementById(ElementIds.create_macro_test_output);
		test_output_el.innerHTML = `<p class="source">#{${name}}</p>${result}`;
	}
}

export const enum MacrosSort {
	NAME,
	REVERSE_NAME,
	SHORTCUT,
	REVERSE_SHORTCUT,
}

let macros_sort = MacrosSort.NAME;
const macroTable: HTMLTableElement = <HTMLTableElement>document.getElementById(ElementIds.macro_table);

export function handleMacroSort() {
	let rows = macroTableRows();
	sortMacrosByName(rows);
	switch(macros_sort) {
		case MacrosSort.REVERSE_NAME:
			reverseMacros(rows);
			break;
		case MacrosSort.SHORTCUT:
			sortMacrosByShortcut(rows);
			break;
		case MacrosSort.REVERSE_SHORTCUT:
			reverseMacros(rows);
			sortMacrosByShortcut(rows);
			reverseMacros(rows);
			break;
	}
	appendRows(rows);
}
export function handleSortMacrosByName() {
	switch(macros_sort) {
		case MacrosSort.NAME:
			macros_sort = MacrosSort.REVERSE_NAME;
			break;
		case MacrosSort.REVERSE_NAME:
		case MacrosSort.SHORTCUT:
		case MacrosSort.REVERSE_SHORTCUT:
			macros_sort = MacrosSort.NAME;
			break;
	}
	handleMacroSort();
}
export function handleSortMacrosByShortcut() {
	switch(macros_sort) {
		case MacrosSort.SHORTCUT:
			macros_sort = MacrosSort.REVERSE_SHORTCUT;
			break;
		case MacrosSort.NAME:
		case MacrosSort.REVERSE_NAME:
		case MacrosSort.REVERSE_SHORTCUT:
			macros_sort = MacrosSort.SHORTCUT;
			break;
	}
	handleMacroSort();
}

function macroTableRows(): Array<HTMLTableRowElement> {
	return <Array<HTMLTableRowElement>>Array.from(macroTable.children).slice(1);
}
function appendRows(rows: Array<HTMLTableRowElement>) {
	for (let row of rows) {
		macroTable.appendChild(row);
	}
}


function sortMacrosByName(rows: Array<HTMLTableRowElement>) {
	rows.sort((a, b) => {
		if (a.id > b.id) { return 1; }
		else if (a.id < b.id) { return -1; }
		else { return 0; }
	});
}
function sortMacrosByShortcut(rows: Array<HTMLTableRowElement>) {
	rows.sort((a, b) => {
		let aVal = (<HTMLInputElement>a.children[1].children[0]).checked;
		let bVal = (<HTMLInputElement>b.children[1].children[0]).checked;
		if (aVal && !bVal) { return 1; }
		else if (!aVal && bVal) { return -1; }
		else { return 0; }
	});
}
function reverseMacros(rows: Array<HTMLTableRowElement>) {
	rows.reverse();
}










export async function createUpdateMacro() {
	const nameInputElement = <HTMLInputElement>document.getElementById(ElementIds.create_macro_name);
	const name: string = nameInputElement.value;
	if (name.length === 0) {
		return;
	}

	// validate macro name here

	const hasShortcut = (<HTMLInputElement>document.getElementById(ElementIds.create_macro_add_shortcut)).checked;
	const inShrortcuts = document.getElementById(ElementIds.macroShortcut(name)) !== null;
	const source = (<HTMLInputElement>document.getElementById(ElementIds.create_macro_source)).value;
	const inTable = document.getElementById(ElementIds.macroTableRow(name)) !== null;

	console.log(inTable);

	if (hasShortcut && !inShrortcuts) {
		await addMacroShortcutServer(name);
	} else if (!hasShortcut && inShrortcuts) {
		await removeMacroShortcutServer(name);
	}

	if (!inTable) {
		addMacroToTable(name, hasShortcut);
	}

	const macro = new Macro(name, source, hasShortcut);
	wasm_bindgen.add_macro(macro);

	const url = '/api/player/macros/update_create';

	console.log('test');
	const body = JSON.stringify(macro);
	await fetchJson(url, 'POST', body);
}
export async function deleteMacro(macroName: string) {
	const shortcut = document.getElementById(ElementIds.macroShortcut(macroName));
	if (shortcut) {
		shortcut.remove();
	}
	const row = document.getElementById(ElementIds.macroTableRow(macroName));
	if (row) {
		row.remove();
	}

	wasm_bindgen.remove_macro(name);

	const url = '/api/player/macros/delete';
	const body = JSON.stringify({
		name: macroName,
	});
	await fetchJson(url, 'DELETE', body);
}

export async function changeMacroShortcut(macroName: string) {
	const hasShortcut = (<HTMLInputElement>document.getElementById(ElementIds.macroTableShortcutTongle(macroName))).checked;
	const inShrortcuts = document.getElementById(ElementIds.macroShortcut(macroName)) !== null;

	if (hasShortcut && !inShrortcuts) {
		await addMacroShortcutServer(macroName);
	} else if (!hasShortcut && inShrortcuts) {
		await removeMacroShortcutServer(macroName);
	}
}
export function addMacroShortcutDOM(macroName: string) {
	const shortcuts = document.getElementById(ElementIds.macro_shortcuts);
	let newShortcut = document.createElement('button');
	newShortcut.id = ElementIds.macroShortcut(macroName);
	newShortcut.innerHTML = macroName;
	newShortcut.addEventListener('click', () => {
		runMacro(macroName);
	});
	shortcuts.appendChild(newShortcut);
}
export async function addMacroShortcutServer(macroName: string) {
	addMacroShortcutDOM(macroName);

	const url = '/api/player/macros/update_shortcut';
	const body = JSON.stringify({
		name: macroName,
		source: "",
		has_shortcut: true,
	});
	await fetchJson(url, 'POST', body);
}
export function removeMacroShortcutDOM(macroName: string) {
	document.getElementById(ElementIds.macroShortcut(macroName)).remove();
}
export async function removeMacroShortcutServer(macroName: string) {
	removeMacroShortcutDOM(macroName);

	const url = '/api/player/macros/update_shortcut';
	const body = JSON.stringify({
		name: macroName,
		source: "",
		has_shortcut: true,
	});
	await fetchJson(url, 'POST', body);
}


export function addMacroToTable(macroName: string, hasShortcut: boolean) {
	const macroTable = document.getElementById(ElementIds.macro_table);

	let newRow = document.createElement('tr');
	newRow.id = ElementIds.macroTableRow(macroName);

	const nameCell = document.createElement('td');
	nameCell.innerHTML = macroName;
	nameCell.addEventListener('click', () => {
		selectMacro(macroName);
	});

	const shortcutCell = document.createElement('td');
	const shortcutTongle = document.createElement('input');
	shortcutTongle.type = 'checkbox';
	if (hasShortcut) {
		shortcutTongle.checked = true;
	}
	shortcutTongle.id = ElementIds.macroTableShortcutTongle(macroName);
	shortcutTongle.addEventListener('click', () => {
		changeMacroShortcut(macroName);
	});
	shortcutCell.appendChild(shortcutTongle);

	const deleteCell = document.createElement('td');
	deleteCell.id = ElementIds.macroTableRowDelete(macroName);
	deleteCell.innerHTML = 'delete';
	deleteCell.addEventListener('click', () => {
		deleteMacro(macroName);
	});

	newRow.appendChild(nameCell);
	newRow.appendChild(shortcutCell);
	newRow.appendChild(deleteCell);
	macroTable.appendChild(newRow);
}
export function selectMacro(macroName: string) {
	(<HTMLInputElement>document.getElementById(ElementIds.create_macro_name)).value = macroName;
	(<HTMLInputElement>document.getElementById(ElementIds.create_macro_source)).value = wasm_bindgen.macro_source(macroName);
}
