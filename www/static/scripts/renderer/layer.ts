class MapLayer {
	offset: {dx: number, dy: number};

	constructor(offsetX: number, offsetY: number) {
		this.offset = {dx: offsetX, dy: offsetY};
	}

	get dx(): number {
		return this.offset.dx;
	}
	get dy(): number {
		return this.offset.dy;
	}

	set dx(x: number) {
		this.offset.dx = x;
	}
	set dy(y: number) {
		this.offset.dy = y;
	}
}
class GridLayer extends MapLayer {
	gridSize: number;
	gridCount: number; // {x: number, y: number};

	gridPoints: number[] = [];

	useAxis: boolean = false;
	xAxis: number[] = [];
	yAxis: number[] = [];
	zAxis: number[] = [];

	static default(): GridLayer {
		return new GridLayer(32, 32, false);
	}

	constructor(gridCount: number, gridSize: number, useAxis: boolean) {
		super(0, 0);
		this.gridCount = Math.max(0, Math.floor(gridCount));
		this.gridSize = Math.max(0, Math.floor(gridSize));
		this.useAxis = useAxis;
		this.gridPoints = this.createGridPoints();
		// console.log(this.gridPoints);
	}
	createGridPoints(): number[] {
		const points: number[] = [];

		const min = -this.gridCount * this.gridSize/2;
		const max = this.gridCount * this.gridSize/2;
		for (let pos = -this.gridCount/2; pos < this.gridCount/2; ++pos) {
			const offset = pos * this.gridSize;
			points.push(
				offset, min, offset, max, // y dir
				min, offset, max, offset  // x dir
			);
		}
		points.push(min, max, max, max);
		points.push(max, min, max, max);

		return points;
	}
}
class ImageLayer extends MapLayer {
	imageName: string;
	size: {x: number, y: number};
	alphaTransparency: boolean;

	constructor() {
		super(0, 0);
	}
}
