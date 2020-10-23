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

class Macro {
	constructor(name, source, hasShortcut) {
		this.name = name;
		this.source = source;
		this.has_shortcut = hasShortcut;
	}
}

const macros = [];

async function initWasm() {
	await wasm_bindgen('./scripts/roll_lang_frontend_bg.wasm');
	wasm_bindgen.init_wasm(ElementIds);

	const loggedIn = await getIsLoggedIn();
	if (loggedIn) {
		await initPlayerMacros();
	}
}

async function getIsLoggedIn() {
	const self = this;
	loggedIn = false;

	await myFetch('/api/player/logged_in', 'GET', null, function(data) {
		self.loggedIn = data;
	});

	return loggedIn;
}
async function initPlayerMacros() {
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
	.then(function (response) {
		console.log(response);
		if (response.ok) {
			return response.json();
		} else {
			throw new Error(`${url} ${response.statusText}`);
		}
	})
	.then(function(data) {
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
				addMacroShortcutDOM(element.name);
			}
		}
		wasm_bindgen.add_macros(macros);
		handleMacroSort();
	})
	.catch((error) => {
		console.error(error);
	});
}