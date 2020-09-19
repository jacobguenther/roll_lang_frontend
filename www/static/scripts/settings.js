// File: www/scripts/settings.js

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

const THEME = {
	LIGHT: 'light',
	DARK: 'dark',
}

class Settings {
	constructor() {
		this.defaultTheme = THEME.LIGHT;

		let savedTheme = this.getThemeFromCookie();
		if (savedTheme === undefined) {
			this.theme = THEME.LIGHT;
		} else {
			this.theme = savedTheme;
		}
		console.log(this.theme);
	}
	getThemeFromCookie() {
		let cookies = document.cookie.split(';');
		for (let cookie of cookies) {
			if (cookie.length === 0) {
				continue;
			}
			let keyValue = cookie.split('=');
			let key = keyValue[0].trim();
			let value = keyValue[1].trim();
			if (key === 'theme') {
				switch (value) {
					case THEME.LIGHT:
						return THEME.LIGHT;
					case THEME.DARK:
						return THEME.DARK;
					default:
						return undefined;
				}
			}
		}
		return undefined;
	}
	applyAndSaveTheme() {

	}
}

let settings = new Settings();