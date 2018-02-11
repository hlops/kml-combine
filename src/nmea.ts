const nmea = require('nmea');
import * as _ from 'lodash';

class JsonLine {
	private _data: any;
	private _error: Error;

	constructor(private _line: string) {
		try {
			this._data = nmea.parse(_line);
		} catch (e) {
			this._error = e;
		}
	}

	get line(): string {
		return this._line;
	}

	get data(): any {
		return this._data;
	}

	get error(): Error {
		return this._error;
	}
}

export class NmeaPotion {
	constructor(private _lines: string[]) {
	}

	get lines(): string[] {
		return this._lines;
	}

	public toJson(): JsonLine[] {
		return this._lines.map(line => new JsonLine(line));
	}

	get data(): any[] {
		return _.reduce<JsonLine, any[]>(
			this.toJson(),
			(result, line) => {
				if (line.data && line.data.lat) {
					result.push(line.data);
//line.data.lat = -112.2550785337791 + Math.random()*.01;
//line.data.lon = 36.07954952145647 + Math.random()*.01;
				}
				return result;
			},
			[]
		);
	}
}
