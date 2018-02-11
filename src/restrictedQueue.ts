export class RestrictedQueue<T> {
	private _store: T[] = [];

	constructor(private maxSize: number = 10) {
	}

	public push(val: T) {
		if (this._store.length >= this.maxSize) {
			this.pop();
		}
		this._store.push(val);
	}

	public pop(): T | undefined {
		return this._store.shift();
	}

	public peek(index: number = 0): T | undefined {
		return this._store[index];
	}

	get all(): T[] {
		return this._store;
	}
}
