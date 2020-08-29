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


const activeTabClass = 'active-tab';
const activeTabContentsClass = 'active-tab-contents';

class Tab {
	constructor(headerItemId, contentId) {
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

class Tabs {
	constructor() {
		this.history = new Tab(
			ElementIds.header_item_history,
			ElementIds.history_tab_content
		);
		this.characterSheet = new Tab(
			ElementIds.header_item_character_sheets,
			ElementIds.character_sheets_tab_content
		);
		this.macros = new Tab(
			ElementIds.header_item_macros,
			ElementIds.macros_tab_content
		);
		this.tables = new Tab(
			ElementIds.header_item_tables,
			ElementIds.tables_tab_content
		);
		this.currentSelected = this.history;
		this.history.setActive();
	}
	selectTab(tab) {
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
	selectTables() {
		this.selectTab(this.tables);
	}
}

const tabs = new Tabs();