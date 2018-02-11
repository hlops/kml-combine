import { Config } from './config';
import { Server } from './server';
import { Clients } from './clients';

class Main {
	constructor() {
		const config = new Config();
		const clients = new Clients(config);
		const server = new Server(config, clients.clients);
	}
}

export default new Main();
