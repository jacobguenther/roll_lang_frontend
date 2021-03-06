// File: www/scipts/tabs.js

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

const activeTabClass = 'active_tab';
const activeTabContentsClass = 'active_tab_contents';

export class Tab {
	name: string;
	tabId: string;
	contentId: string;

	constructor(headerItemId: string, contentId: string) {
		this.name = name;
		this.tabId = headerItemId;
		this.contentId = contentId;
	}
	get tab() {
		return document.getElementById(this.tabId);
	}
	get content() {
		return document.getElementById(this.contentId);
	}
	setActive() {
		this.tab.classList.add(activeTabClass);
		this.content.classList.add(activeTabContentsClass);
	}
	setInactive() {
		this.tab.classList.remove(activeTabClass);
		this.content.classList.remove(activeTabContentsClass);
	}
}

export class Tabs {
	history: Tab;
	characterSheet: Tab;
	macros:  Tab;
	notes: Tab;
	tables: Tab;
	settings: Tab;
	currentSelected: Tab;

	constructor() {
		this.history = this.initTab(
			ElementIds.header_item_history,
			ElementIds.tab_content_history,
			this.selectHistory
		);
		this.characterSheet = this.initTab(
			ElementIds.header_item_character_sheets,
			ElementIds.tab_content_character_sheets,
			this.selectCharacterSheets
		);
		this.macros = this.initTab(
			ElementIds.header_item_macros,
			ElementIds.tab_content_macros,
			this.selectMacros
		);
		this.notes = this.initTab(
			ElementIds.header_item_notes,
			ElementIds.tab_content_notes,
			this.selectNotes
		);
		this.tables = this.initTab(
			ElementIds.header_item_tables,
			ElementIds.tab_content_tables,
			this.selectTables
		);
		this.settings = this.initTab(
			ElementIds.header_item_settings,
			ElementIds.tab_content_settings,
			this.selectSettings
		);

		this.currentSelected = this.history;
		this.history.setActive();
	}
	initTab(headerId: string, contentId: string, selectCallback): Tab {
		const tab = new Tab(headerId, contentId);
		const callback = selectCallback.bind(this);
		tab.tab.addEventListener('click', callback);
		return tab;
	}
	selectTab(tab: Tab) {
		this.currentSelected.setInactive();
		this.currentSelected = tab;
		tab.setActive();
	}
	selectHistory() {
		this.selectTab(this.history);
	}
	selectCharacterSheets() {
		this.selectTab(this.characterSheet);
	}
	selectMacros() {
		this.selectTab(this.macros);
	}
	selectNotes() {
		this.selectTab(this.notes);
	}
	selectTables() {
		this.selectTab(this.tables);
	}
	selectSettings() {
		this.selectTab(this.settings);
	}
}
