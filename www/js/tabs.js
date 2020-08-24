// File: js/this.js

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

class Tab {
	constructor(name) {
		this.name = name;
		this.tabID = 'tab-name-' + name;
		this.contentsID = name + '-section';
	}
	get tab() {
		return document.getElementById(this.tabID);
	}
	get contents() {
		return document.getElementById(this.contentsID);
	}
	clone() {
		return new Tab(this.name);
	}
	setActive(settingAs) {
		if (settingAs) {
			this.tab.classList.add('active-tab');
			this.contents.classList.add('active-tab-contents');
		} else {
			this.tab.classList.remove('active-tab');
			this.contents.classList.remove('active-tab-contents');
		}
	}
};

class Tabs {
	constructor() {
		this.history = new Tab('history');
		this.characterSheet = new Tab('character-sheets');
		this.macros = new Tab('macros');
		this.tables = new Tab('tables');
		this.currentSelected = this.history;
		this.history.setActive(true);
		console.log("tabs");
	}
	selectTab(tabName) {
		this.currentSelected.setActive(false);
		if (tabName === this.history.name) {
			this.history.setActive(true);
			this.currentSelected = this.history;
		} else if (tabName === this.characterSheet.name) {
			this.characterSheet.setActive(true);
			this.currentSelected = this.characterSheet;
		} else if (tabName === this.macros.name) {
			this.macros.setActive(true);
			this.currentSelected = this.macros;
		} else if (tabName === this.tables.name) {
			this.tables.setActive(true);
			this.currentSelected = this.tables;
		}
	}
};

let tabs = new Tabs();