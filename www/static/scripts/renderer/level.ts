/// <reference path="layer.ts" />

class MapLevel {
	name: string;
	height: number | null;
	layers: Array<MapLayer>;
	constructor(name: string) {
		this.name = name;
		this.height = 0;
		this.layers = [];
	}
}