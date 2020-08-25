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
 * may distribute non-source (e.g., minimized or compacted) forms of
 * that code without the copy of the GNU GPL normally required by
 * section 4, provided you include this license notice and a URL
 * through which recipients can access the Corresponding Source.
 * 
 * @licend The above is the entire license notice
 * for the JavaScript code in this page.
 */


const tables_tab_ids = {
	content: 'tables-tab-content',
}
const macros_tab_ids = {
	content: 'macros-tab-content',

	create_macro_container: 'create-macro-container',
	create_macro_name_label: 'create-macro-name-label',
	create_macro_name: 'create-macro-name',
	create_macro_source_label: 'create-macro-source-label',
	create_macro_source: 'create-macro-source',
	create_macro_shortcut_container: 'create-macro-shortcut-container',
	create_macro_add_shortcut: 'create-macro-add-shortcut',
	create_macro_submits: 'create-macro-submits',
	create_macro_create_or_update: 'create-macro-create-or-update',
	create_macro_test_macro: 'create-macro-test-macro',

	macros_table_container: 'macros-table-container',
	macros_table: 'macros-table',
	macros_table_header_name: 'macros-table-name',
	macros_table_header_shortcut: 'macros-table-shortcut',
	macros_table_header_delete: 'macros-table-delete',
}
const character_sheets_tab_ids = {
	content: 'character-sheets-tab-content',
}
const history_tab_ids = {
	content: 'history-tab-content',
	
	history_controls: 'history-controls',
	clear_history: 'clear-history',
	macro_shortcuts: 'macro-shortcuts',

	history_wrapper: 'history-wrapper',
	history_list: 'history-list',

	history_break: 'history-break',

	roll_lang_form: 'roll-lang-form',
	roll_lang_input_container: 'roll-lang-input-container',
	roll_lang_input_label: 'roll-lang-input-label',
	roll_lang_input: 'roll-lang-input',
	roll_lang_submit: 'roll-lang-submit',
}
const tabs_content_ids = {
	wrapper: "tab-content-wrapper",
	history_tab: history_tab_ids,
	character_sheets_tab: character_sheets_tab_ids,
	macros_tab: macros_tab_ids,
	tables_tab: tables_tab_ids,
}
const tab_header_item_ids = {
	history: "tab-header-item-history",
	character_sheets: "tab-header-item-character-sheets",
	macros: "tab-header-item-macros",
	tables: "tab-header-item-tables",
}
const tabs_header_ids = {
	tabs_header: "tabs-header",
	items: tab_header_item_ids,
}
const footer_ids = {
	footer: "footer-bar",
	javascript_license_information: 'jslicense',
}
const side_bar_ids = {
	side_bar: "side-bar",
	tab_header: tabs_header_ids,
	tab_content: tabs_content_ids,
}
const header_ids = {
	header_bar: "header-bar",
	main_nav_list: "main-nav-list",
}
const elementIds = {
	header: header_ids,
	play_area: "play-area",
	slider_bar: "slider-bar",
	side_bar: side_bar_ids,
	footer: footer_ids,
}