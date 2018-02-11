import * as fs from 'fs';
import * as _ from 'lodash';

const CONFIG_FILE_NAME = './config.json';

class ConfigGear {
	protected parse() {
		try {
			this.setValues(JSON.parse(fs.readFileSync(CONFIG_FILE_NAME, 'utf8')));
		} catch (e) {
			if (e.code === 'ENOENT') {
				this.writeToFile();
			} else {
				throw e;
			}
		}
	}

	private writeToFile(): void {
		fs.writeFileSync(CONFIG_FILE_NAME, this.toJson());
	}

	private setValues(json) {
		_.keys(json).forEach(key => {
			const name = '_' + _.camelCase(key);
			if (this[name]) {
				this[name] = json[key];
			} else {
				console.warn('Unexpected config key: ', key);
			}
		});
	}

	private toJson(): string {
		const json = _.transform(
			_.keys(this),
			(result, key) => {
				const name = _.kebabCase(key);
				console.log(name, key);
				result[name] = this[key];
			},
			{}
		);
		return JSON.stringify(json, null, 2);
	}
}

export class Config extends ConfigGear {
	private _serverPort: number = 8088;
	private _queueSize: number = 5;
	private _reconnectTimeout: number = 2 * 1000;
	private _sources: _.Dictionary<string> = { 'NMEA Simulator': 'localhost:55555' };

	constructor() {
		super();
		this.parse();
	}

	get serverPort(): number {
		return this._serverPort;
	}

	get queueSize(): number {
		return this._queueSize;
	}

	get sources(): _.Dictionary<string> {
		return this._sources;
	}

	get reconnectTimeout(): number {
		return this._reconnectTimeout;
	}
}
