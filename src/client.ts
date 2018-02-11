import * as net from 'net';
import { RestrictedQueue } from './restrictedQueue';
import { Config } from './config';
import { NmeaPotion } from './nmea';

export class ClientError {}

export class ClientErrors {
	private _total: number = 0;
	private _inRow: number = 0;
	private _errors: RestrictedQueue<ClientError> = new RestrictedQueue(5);

	get total(): number {
		return this._total;
	}

	get inRow(): number {
		return this._inRow;
	}

	get errors(): RestrictedQueue<ClientError> {
		return this._errors;
	}

	public clear() {
		this._inRow = 0;
	}

	public error(error: ClientError) {
		this._inRow++;
		this._total++;
		this._errors.push(error);
	}
}

export class ClientStatus {
	private _active: boolean;
	private _errors: ClientErrors = new ClientErrors();
	private _bytesReceived: number = 0;

	get active(): boolean {
		return this._active;
	}

	get errors(): ClientErrors {
		return this._errors;
	}

	get bytesReceived(): number {
		return this._bytesReceived;
	}

	public started() {
		this._active = true;
	}

	public closed() {
		this._active = false;
	}

	public data(data: Buffer) {
		this.errors.clear();
		this._bytesReceived += data.length;
	}

	public error(error: ClientError) {
		this.errors.error(error);
	}
}

export class Client {
	private _queue: RestrictedQueue<NmeaPotion>;
	private _url: string;
	private _startTime: Date = new Date();
	private _status: ClientStatus = new ClientStatus();
	private _socket = new net.Socket();

	constructor(private _name: string, _url: string, private _config: Config) {
		this._url = _url.replace(/^http(s)?\:[\/]*/, '');
		this._queue = new RestrictedQueue(_config.queueSize);
		this.createConnection();
	}

	private createConnection() {
		this._socket.on('connect', () => {
			console.log('connecting to ' + this._url);
			this._status.started();
		});
		this._socket.on('data', (data: Buffer) => {
			this._status.data(data);
			this._queue.push(new NmeaPotion(data.toString().split('\n')));
		});
		this._socket.on('error', (error: any) => {
			console.error(error);
			this._status.error(error);
		});
		this._socket.on('close', () => {
			console.log('connection closed: ' + this._url);
			this._status.closed();
			setTimeout(() => this.connect(), this._config.reconnectTimeout);
		});
		this.connect();
	}

	private connect() {
		const urlParts: string[] = this._url.split(':', 2);
		this._socket.connect(Number(urlParts[1]), urlParts[0]);
	}

	get name(): string {
		return this._name;
	}

	get startTime(): Date {
		return this._startTime;
	}

	get queue(): RestrictedQueue<NmeaPotion> {
		return this._queue;
	}

	get status(): ClientStatus {
		return this._status;
	}
}
