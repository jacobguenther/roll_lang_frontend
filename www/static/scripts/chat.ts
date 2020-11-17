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

import { ElementIds } from "./config.js";
import { run as wasm_interpret } from "./roll_interpreter.js"

export class Chat {
	public static CLEAR_HISTORY_ELEMENT: HTMLButtonElement = <HTMLButtonElement>document.getElementById(ElementIds.clear_history);
	public static HISTORY_ELEMENT: HTMLUListElement = <HTMLUListElement>document.getElementById(ElementIds.history_list);
	public static INPUT_ELEMENT: HTMLTextAreaElement = <HTMLTextAreaElement>document.getElementById(ElementIds.roll_lang_input);
	public static SUBMIT_ELEMENT: HTMLInputElement = <HTMLInputElement>document.getElementById(ElementIds.roll_lang_submit);

	entryIDCounter: number;
	currentSelectedEntry: number;

	constructor() {
		this.entryIDCounter = 0;
		this.currentSelectedEntry = 0;

		Chat.CLEAR_HISTORY_ELEMENT.addEventListener('click', Chat.clearChat);

		const onInputFocusIn = this.onInputFocusIn.bind(this);
		const onInputFocusOut = this.onInputFocusOut.bind(this);
		Chat.INPUT_ELEMENT.addEventListener('focusin', onInputFocusIn);
		Chat.INPUT_ELEMENT.addEventListener('focusout', onInputFocusOut);

		const run = this.run.bind(this);
		Chat.SUBMIT_ELEMENT.addEventListener('click', run);
	}
	appendHistory(source: string, result: string) {
		const latestEntry: HTMLLIElement = document.createElement('li');
		const sourceElement: HTMLParagraphElement = document.createElement('p');
		const resultElement: HTMLParagraphElement = document.createElement('p');
		const deleteEntry: HTMLButtonElement = document.createElement('button');

		latestEntry.setAttribute('id', this.entryIDCounter.toString());
		sourceElement.innerHTML = source;
		sourceElement.setAttribute('class', 'source');
		resultElement.innerHTML = result;
		deleteEntry.type = 'button';
		deleteEntry.innerHTML = 'Delete Entry';

		const temp = this.entryIDCounter;
		deleteEntry.addEventListener('click', () => {
			Chat.deleteChatEntry(temp.toString());
		});

		this.entryIDCounter += 1;

		latestEntry.appendChild(sourceElement);
		latestEntry.appendChild(resultElement);
		latestEntry.appendChild(deleteEntry);
		Chat.HISTORY_ELEMENT.appendChild(latestEntry);
		Chat.HISTORY_ELEMENT.scrollTop = 100000;

		this.currentSelectedEntry = Chat.HISTORY_ELEMENT.childElementCount;
	}
	static getSourceFromByIndex(i: number) {
		const entry = Chat.HISTORY_ELEMENT.children[i];
		if (entry !== undefined) {
			return entry.querySelector(".source").innerHTML;
		}
		return undefined;
	}
	static clearChat() {
		console.log('clearing chat history');
		while (Chat.HISTORY_ELEMENT.firstChild) {
			Chat.HISTORY_ELEMENT.removeChild(Chat.HISTORY_ELEMENT.lastChild);
		}
	}
	static deleteChatEntry(id: string) {
		const entry = document.getElementById(id);
		Chat.HISTORY_ELEMENT.removeChild(entry);
	}
	onInputFocusIn() {
		const handleKeyDown = this.handleKeyDown.bind(this);
		Chat.INPUT_ELEMENT.addEventListener('keydown', handleKeyDown);
	}
	onInputFocusOut() {
		const handleKeyDown = this.handleKeyDown.bind(this);
		Chat.INPUT_ELEMENT.removeEventListener('keydown', handleKeyDown);
	}
	handleKeyDown(event: KeyboardEvent) {
		if (event.keyCode === 13) { // enter
			event.preventDefault();
			this.run();
			Chat.INPUT_ELEMENT.value = '';
		} else if (event.keyCode === 38) { // up
			event.preventDefault();
			if (this.currentSelectedEntry < 1) {
				return;
			}

			const source = Chat.getSourceFromByIndex(this.currentSelectedEntry-1);
			if (source === undefined) {
				Chat.INPUT_ELEMENT.value = '';
				this.currentSelectedEntry = Chat.HISTORY_ELEMENT.childElementCount;
			} else {
				this.currentSelectedEntry -= 1;
				Chat.INPUT_ELEMENT.value = source;
			}
		} else if (event.keyCode === 40) { // down
			event.preventDefault();
			const source = Chat.getSourceFromByIndex(this.currentSelectedEntry+1);
			if (source === undefined) {
				Chat.INPUT_ELEMENT.value = '';
				this.currentSelectedEntry = Chat.HISTORY_ELEMENT.childElementCount;
			} else {
				this.currentSelectedEntry += 1;
				Chat.INPUT_ELEMENT.value = source;
			}
		}
	}
	run() {
		const source = Chat.INPUT_ELEMENT.value;
		if (source.length > 0) {
			const result = wasm_interpret(source);
			this.appendHistory(source, result);
		}
		return false;
	}
}
