import * as bodyParser from 'body-parser';
import * as express from 'express';
import * as hbs from 'hbs';
import {Config} from './config';
import {Response} from 'express-serve-static-core';
import {Client} from './client';

export class Server {
	private express: express.Application;

	constructor(private config: Config, private clients: Client[]) {
		this.express = express();

		this.middleware();
		this.route();
		this.start();
	}

	private middleware() {
		this.express.use(bodyParser.urlencoded({extended: false}));
		this.express.set('views', __dirname + '/views');
		this.express.set('view engine', 'hbs');

		hbs.registerHelper('incremented', (index: number) => {
			return index + 1;
		});
	}

	private start() {
		this.express.listen(this.config.serverPort, () => {
			console.log('Server was started on port ', this.config.serverPort);
		});
	}

	private route() {
		this.express.use('/assets', express.static('./src/assets'));
		this.express.get('/kml/test', (req, res) => this.showKml(res, true));
		this.express.get('/*', (req, res) => this.showStatus(res));
	}

	private showStatus(res: Response) {
		res.render('status', {config: this.config, clients: this.clients});
	}

	private showKml(res: any, testMode: boolean = false) {
		if (testMode) {
			res.setHeader('Content-Type', 'text/xml');
		}
		res.render('kml', {config: this.config, clients: this.clients});
	}
}
