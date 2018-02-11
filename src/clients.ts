import * as _ from 'lodash';
import {Config} from './config';
import {Client} from './client';

export class Clients {
	private _clients: Client[] = [];

	constructor(private config: Config) {
		_.forEach(config.sources, (url, name) => {
			this._clients.push(new Client(name, url, config));
		})
	}

	get clients(): Client[] {
		return this._clients;
	}
}
