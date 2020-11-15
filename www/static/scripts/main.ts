// File: www/scripts/main.js

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
import { SliderBar } from "./slider.js"
import { Tabs } from "./tabs.js"
import { Renderer } from "./renderer/renderer.js"
import { MapEditor } from "./map_editor.js"
import init, {run as wasm_interpret_roll} from "./roll_interpreter.js"
import { Chat } from "./chat.js"

let sliderBar: SliderBar;
let tabs: Tabs;
let chat: Chat;
let renderer: Renderer;
let mapEditor: MapEditor;

async function main() {
	sliderBar = new SliderBar();
	tabs = new Tabs();

	renderer = new Renderer;
	renderer.loadDefaults()
		.then(() => {
			renderer.setupBuffer();
		})
		.catch(console.error);

	mapEditor = new MapEditor();

	init()
		.then(() => {
			chat = new Chat();
		});
}

main();

function runMacro(name: string) {
	const source = `#{${name}}`;
	const result = wasm_interpret_roll(source);
	chat.appendHistory(source, result);
}

function testMacro() {
	const name = (<HTMLInputElement>document.getElementById(ElementIds.create_macro_name)).value;

	// validate macro name here

	const source = (<HTMLTextAreaElement>document.getElementById(ElementIds.create_macro_source)).value;
	if (source.length > 0) {
		const result = wasm_interpret_roll(source);
		const test_output_el = document.getElementById(ElementIds.create_macro_test_output);
		test_output_el.innerHTML = `<p class="source">#{${name}}</p>${result}`;
	}
}
