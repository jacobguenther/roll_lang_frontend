// File: www/scripts/map_editor.ts

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

import { clamp } from "./config.js"
import { MapLevel } from "./renderer/level.js"
import { MapLayer, GridLayer } from "./renderer/layer.js"

export class MapSettings {
	name: string;
	visible: boolean;
	fogOfWar: boolean;
	staticLighting: boolean;
	dynamicLighting: boolean;
	levels: Array<MapLevel>;

	level_id: number;

	constructor() {
		this.name = '';
		this.visible = true;
		this.fogOfWar = false;
		this.staticLighting = false;
		this.dynamicLighting = false;
		this.levels = [];
		this.level_id = 0;
	}
}

export class MapEditor {
	container: HTMLDivElement;
	header: HTMLDivElement;
	contents: HTMLUListElement;
	levelList: HTMLUListElement;
	newLevelButton: HTMLInputElement;

	dragging: boolean;

	settings: MapSettings;

	constructor() {
		const maybeContainer = document.getElementById('map_editor_container');
		if (maybeContainer instanceof HTMLDivElement) {
			this.container = maybeContainer;
		} else {
			// handle failure
		}

		const maybeHeader = document.getElementById('map_editor_header');
		if (maybeHeader instanceof HTMLDivElement) {
			this.header = maybeHeader;
		} else {
			// handle failure
		}

		const maybeContents = document.getElementById('map_editor');
		if (maybeContents instanceof HTMLUListElement) {
			this.contents = maybeContents;
		} else {
			// handle failure
		}

		const maybeLevelList = document.getElementById('map_level_list');
		if (maybeLevelList instanceof HTMLUListElement) {
			this.levelList = maybeLevelList;
		} else {
			// handle failure
		}

		const maybeNewLevelButton = document.getElementById('create_new_level');
		if (maybeNewLevelButton instanceof HTMLInputElement) {
			this.newLevelButton = maybeNewLevelButton;
		} else {
			// handle failure
		}

		this.dragging = false;
		const startDragEditorCallback = this.startDragEditor.bind(this);
		this.header.onmousedown = startDragEditorCallback;
		const stopDragEditorCallback = this.stopDragEditor.bind(this);
		document.onmouseup = stopDragEditorCallback;

		this.settings = new MapSettings();

		this.setupEditorElements();
		this.createNewLevelCallback(null);
	}
	startDragEditor() {
		this.dragging = true;
		const dragEditorCallback = this.dragEditor.bind(this);
		document.onmousemove = dragEditorCallback;
	}
	stopDragEditor() {
		this.dragging = false;
		document.onmousemove = null;
	}
	dragEditor(event: MouseEvent) {
		event.preventDefault();
		const divBounds = this.container.getBoundingClientRect();
		const bounds = document.getElementById('play_area').getBoundingClientRect();
		{
			const contianerWidth = divBounds.right - divBounds.left;

			const leftPos = event.clientX - contianerWidth/2;
			const leftMin = Math.max(0, bounds.left);
			const leftMax = Math.max(0, bounds.right - contianerWidth);
			this.container.style.left = `${clamp(leftPos, leftMin, leftMax)}px`;
		}
		{
			const headerBounds = this.header.getBoundingClientRect();
			const headerHeight = headerBounds.top - headerBounds.bottom;
			const containerHeight = divBounds.bottom - divBounds.top;

			const topPos = event.clientY - bounds.top + headerHeight/2;
			const topMin = 0;
			const topMax = Math.max(0, bounds.bottom - bounds.top - containerHeight);
			this.container.style.top = `${clamp(topPos, topMin, topMax)}px`;
		}
	}
	setupEditorElements() {
		this.setupSettingsElements();

		const createNewLevel = this.createNewLevelCallback.bind(this);
		this.newLevelButton.addEventListener('click', createNewLevel);
	}
	setupSettingsElements() {

	}
	createNewLevelCallback(event: MouseEvent | null) {
		this.settings.levels.push(new MapLevel('Unnamed Layer'));

		const level = document.createElement('li');
		level.setAttribute('class', 'level_wrapper');
		{
			const levelHeader = this.createNewLevelHeader('Unnamed Level');
			const levelContent = this.createNewLevelContent('Unnamed Level');
			level.appendChild(levelHeader);
			level.appendChild(levelContent);
		}
		this.levelList.appendChild(level);
	}
	createNewLevelHeader(name: string) {
		const levelHeader = document.createElement('div');
		levelHeader.setAttribute('class', 'level_header');
		{
			const levelName = document.createElement('h4');
			levelName.innerHTML = name;
			levelHeader.appendChild(levelName);
		}
		return levelHeader;
	}
	createNewLevelContent(name: string) {
		const levelContent = document.createElement('div');
		levelContent.setAttribute('class', 'level_content');
		{
			const nameLabel = document.createElement('label');
			nameLabel.setAttribute('for', '');
			nameLabel.innerHTML = 'Name';
			levelContent.appendChild(nameLabel);
		}
		{
			const nameInput = document.createElement('input');
			nameInput.setAttribute('type', 'text');
			nameInput.setAttribute('id', '');
			nameInput.setAttribute('name', '');
			nameInput.setAttribute('value', name);
			levelContent.appendChild(nameInput);
		}
		{
			const nameLabel = document.createElement('label');
			nameLabel.setAttribute('for', '');
			nameLabel.innerHTML = 'Height';
			levelContent.appendChild(nameLabel);
		}
		{
			const nameInput = document.createElement('input');
			nameInput.setAttribute('type', 'number');
			nameInput.setAttribute('id', '');
			nameInput.setAttribute('name', '');
			nameInput.setAttribute('value', '0');
			levelContent.appendChild(nameInput);
		}
		{
			const layersHeader = document.createElement('h5');
			layersHeader.innerHTML = 'Layers - 0';
			levelContent.appendChild(layersHeader);
		}
		{
			const layers = document.createElement('ul');
			levelContent.appendChild(layers);
		}
		{
			const newLayerWrapper = document.createElement('div');
			newLayerWrapper.setAttribute('class', 'new_layer_wrapper');

			const layerTypeLabel = document.createElement('label');
			layerTypeLabel.setAttribute('name', '');
			layerTypeLabel.innerHTML = 'New Layer Type';

			const layerType = document.createElement('select');
			layerType.setAttribute('name', '');
			layerType.setAttribute('id', '');

			const gridOption = document.createElement('option');
			gridOption.setAttribute('value', 'grid');
			gridOption.innerHTML = 'grid';
			const imageOption = document.createElement('option');
			imageOption.setAttribute('value', 'image');
			imageOption.innerHTML = 'image';

			layerType.appendChild(gridOption);
			layerType.appendChild(imageOption);
			newLayerWrapper.appendChild(layerTypeLabel);
			newLayerWrapper.appendChild(layerType);

			const newLayer = document.createElement('input');
			newLayer.setAttribute('type', 'button');
			newLayer.setAttribute('id', '');
			newLayer.setAttribute('value', 'Create New Layer');
			const createNewLayerCallback = this.createNewLayerCallback.bind(this);
			newLayer.addEventListener('click', createNewLayerCallback);

			newLayerWrapper.appendChild(newLayer);
			levelContent.appendChild(newLayerWrapper);
		}
		return levelContent;
	}
	createNewLayerCallback(event: MouseEvent | null) {
		const type = document.getElementById('select_layer_type____');

	}
}
