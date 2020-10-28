interface ICanvasObserver {
	notify(width: number, height: number): void;
}
interface ICanvasObservable {
	attachObserver(observer: ICanvasObserver): void;
	detachObserver(observer: ICanvasObserver): void;
	notifyObservers(width: number, height: number): void;
}