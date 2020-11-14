
class MapSettings {
	name: string;
	viewable: boolean;
	fogOfWar: boolean;
	staticLighting: boolean;
	dynamicLighting: boolean;
}
class MapLevelLayer {

}
class MapLevel {
	settings: MapSettings;
	height: string;
	layers: MapLevelLayer;
}


class MapEditor {
	container: HTMLDivElement;
	header: HTMLDivElement;
	contents: HTMLUListElement;
	levelList: HTMLUListElement;

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

		this.dragging = false;
		const startDragEditorCallback = this.startDragEditor.bind(this);
		this.header.onmousedown = startDragEditorCallback;
		const stopDragEditorCallback = this.stopDragEditor.bind(this);
		document.onmouseup = stopDragEditorCallback;

		// this.createMapSettings();
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
	updateMapSettings() {

	}
	createNewLevel(levelSettings: any) {

	}
}
