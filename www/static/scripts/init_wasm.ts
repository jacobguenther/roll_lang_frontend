// File: www/scripts/help_main.js

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
import { fetchJson } from "./fetch.js"
import { Macro, testMacro, addMacroToTable, addMacroShortcutDOM, handleMacroSort, createUpdateMacro, handleSortMacrosByName, handleSortMacrosByShortcut } from "./macros.js"
import init, {init_wasm as init_interpreter, add_macros as add_macros_to_interpreter} from "./roll_interpreter.js"

const macros: Array<Macro> = [];

export async function initWasm() {
	await init();
	init_interpreter();

	await initPlayerMacrosIfLoggedIn();

	initMacroCreateTabCallbacks();
}
async function initPlayerMacrosIfLoggedIn() {
	let res = await fetchJson('/api/player/logged_in', 'GET', null);
	if (res) {
		await initPlayerMacros();
	}
}
async function initPlayerMacros() {
	const url = '/api/player/macros/all';
	const macrosJson = await fetchJson(url, 'GET', null);
	macrosJson.json().then((data: Array<any>) => {
		console.log(data);
		data.sort((a: Macro, b: Macro) => {
			if (a.name > b.name) { return 1; }
			else if (a.name < b.name) { return -1; }
			else { return 0; }
		});
		for (let element of data) {
			const macro = new Macro(element.name, element.source, element.has_shortcut);
			macros.push(macro);
			addMacroToTable(element.name, element.has_shortcut);
			if (element.has_shortcut) {
				addMacroShortcutDOM(element.name);
			}
		}
		add_macros_to_interpreter(macros);
		handleMacroSort();
	});
}
function initMacroCreateTabCallbacks() {
	document.getElementById(ElementIds.create_macro_submit)
		.addEventListener('click', createUpdateMacro);
	document.getElementById(ElementIds.create_macro_test_submit)
		.addEventListener('click', testMacro);

	document.getElementById(ElementIds.macros_table_name_header)
		.addEventListener('click', handleSortMacrosByName);
	document.getElementById(ElementIds.macros_table_shortcut_header)
		.addEventListener('click', handleSortMacrosByShortcut);
}