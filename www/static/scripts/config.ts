// File: www/scipts/config_ids.js

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
 * may distribute non_source (e.g., minimized or compacted) forms of
 * that code without the copy of the GNU GPL normally required by
 * section 4, provided you include this license notice and a URL
 * through which recipients can access the Corresponding Source.
 *
 * @licend The above is the entire license notice
 * for the JavaScript code in this page.
 */

const ElementIds = {
	main_header: 'header_bar',
	main_nav_list: 'main_nav_list',

	footer: 'footer_bar',
	javascript_license_information: 'jslicense',

	app_content: 'app_content',
	play_area: 'play_area',
	slider_bar: 'slider_bar',

	side_bar: 'side_bar',
	tabs_header: 'tabs_header',
	header_item_history: 'tab_header_item_history',
	header_item_character_sheets: 'tab_header_item_character_sheets',
	header_item_macros: 'tab_header_item_macros',
	header_item_tables: 'tab_header_item_tables',
	header_item_notes: 'tab_header_item_notes',
	header_item_settings: 'tab_header_item_settings',

	// play area
	play_area_canvas: 'play_area_canvas',

	tab_content_wrapper: 'tab_content_wrapper',
	tab_content_history: 'tab_content_history',
	tab_content_character_sheets: 'tab_content_character_sheets',
	tab_content_macros: 'tab_content_macros',
	tab_content_notes: 'tab_content_notes',
	tab_content_tables: 'tab_content_tables',
	tab_content_settings: 'tab_content_settings',

	// history tab
	history_controls: 'history_controls',
	clear_history: 'clear_history',
	macro_shortcuts: 'macro_shortcuts',
	history_wrapper: 'history_wrapper',
	history_list: 'history_list',
	history_break: 'history_break',
	roll_lang_form: 'roll_lang_form',
	roll_lang_input_container: 'roll_lang_input_container',
	roll_lang_input_label: 'roll_lang_input_label',
	roll_lang_input: 'roll_lang_input', // textarea
	roll_lang_submit: 'roll_lang_submit',

	// macros tab
	create_macro_container: 'create_macro_container',
	create_macro_name_label: 'create_macro_name_label',
	create_macro_name: 'create_macro_name', // input
	create_macro_source_label: 'create_macro_source_label',
	create_macro_source: 'create_macro_source', // textarea
	create_macro_shortcut_container: 'create_macro_shortcut_container',
	create_macro_add_shortcut: 'create_macro_add_shortcut',
	create_macro_submits: 'create_macro_submits', // input
	create_macro_create_or_update: 'create_macro_create_or_update',
	create_macro_test_macro: 'create_macro_test_macro',
	create_macro_test_output: 'create_macro_test_output',

	macro_table_container: 'macros_table_container',
	macro_table: 'macros_table',
	macro_table_header_name: 'macros_table_name',
	macro_table_header_shortcut: 'macros_table_shortcut',
	macro_table_header_delete: 'macros_table_delete',

	macro(macroName: string) {
		return macroName.replace(/\s+/g, '-');
	},
	macroTableRow(macroName: string) {
		return `macro_table_row_${ElementIds.macro(macroName)}`;
	},
	macroTableShortcutTongle(macroName: string) {
		return `place_macro_in_shortcuts_${ElementIds.macro(macroName)}`;
	},
	macroTableRowDelete(macroName: string) {
		return `delete_macro_${ElementIds.macro(macroName)}`;
	},
	macroShortcut(macroName: string) {
		return `macro_shortcut_${ElementIds.macro(macroName)}`;
	},
}

function isGoodResponseStatus(status: number) {
	return status > 199 && status < 300;
}
function checkFetchError(response: Response) {
	if (isGoodResponseStatus(response.status)) {
		return Promise.resolve(response);
	} else {
		throw Error(response.statusText);
	}
}
function responseToText(response: Response) {
	return response.text();
}
function responseToJson(response: Response) {
	return response.json();
}

async function fetchJson(url: string, method: string, body: any, handlerFunc: any): Promise<any> {
	return await fetch(url, {
		method: method,
		mode: 'cors',
		cache: 'no-cache',
		credentials: 'same-origin',
		headers: {
			'Content-Type': 'application/json'
		},
		redirect: 'follow',
		referrerPolicy: 'no-referrer',
		body: body,
	})
	.then(checkFetchError)
	.then(responseToJson)
	.then(handlerFunc)
	.catch(console.error);
}
async function fetchImage(name: string) {
	return await fetch(`/assets/${name}`, {
		method: 'GET',
		mode: 'cors',
		cache: 'no-cache',
		credentials: 'omit',
		headers: {
			'content-type': 'application/json'
		},
		redirect: 'follow',
		referrerPolicy: 'no-referrer',
		body: null,
	})
	.then(checkFetchError)
	.then((response) => {
		return response.blob();
	})
	.then((image) => {
		return Promise.resolve(URL.createObjectURL(image));
	})
	.catch(console.error);
}
async function fetchShader(name: string) {
	return await fetch(`/assets/shaders/${name}`, {
		method: 'GET',
		mode: 'cors',
		cache: 'no-cache',
		credentials: 'omit',
		headers: {
			'content-type': 'application/json'
		},
		redirect: 'follow',
		referrerPolicy: 'no-referrer',
		body: null,
	})
	.then(checkFetchError)
	.then(responseToText)
	.then((data) => {
		return data;
	})
	.catch(console.error);
}

function clamp(x: number, min: number, max: number) {
	return Math.min(Math.max(x, min), max);
}