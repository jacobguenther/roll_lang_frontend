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

const MacrosSort = {
	NAME: 'name',
	REVERSE_NAME: 'reverse name',
	SHORTCUT: 'shortcut',
	REVERSE_SHORTCUT: 'reverse shortcut'
}
let macros_sort = MacrosSort.NAME;

function handleMacroSort() {
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
function handleSortMacrosByName() {
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
function handleSortMacrosByShortcut() {
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

const macroTable = document.getElementById(ElementIds.macro_table);
function macroTableRows() {
	return Array.from(macroTable.children).slice(1);
}
function appendRows(rows) {
	for (let row of rows) {
		macroTable.appendChild(row);
	}
}


function sortMacrosByName(rows) {
	rows.sort((a, b) => {
		if (a.id > b.id) { return 1; }
		else if (a.id < b.id) { return -1; }
		else { return 0; }
	});
}
function sortMacrosByShortcut(rows) {
	rows.sort((a, b) => {
		let aVal = a.children[1].children[0].checked;
		let bVal = b.children[1].children[0].checked;
		if (aVal && !bVal) { return 1; }
		else if (!aVal && bVal) { return -1; }
		else { return 0; }
	});
}
function reverseMacros(rows) {
	rows.reverse();
}