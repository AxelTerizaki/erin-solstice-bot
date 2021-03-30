import { getConfig } from './util/config';
import express from 'express';
import helmet from 'helmet';
import compression from 'compression';
import {createServer} from 'http';
import logger from './util/logger';
import { APIMessage } from 'discord.js';

function slashCommands() {
	const slashRouter = express.Router();
	pingController(slashRouter);
	return slashRouter;
}

export async function initWebServer() {
	const conf = getConfig();
	const app = express();
	app.set('trust proxy', (ip: string) => {
		return ip === '127.0.0.1' ||
			ip === '::ffff:127.0.0.1';
	});
	app.use(helmet({
		hsts: false
	}));
	app.use(compression());
	app.use(express.json({limit: '1000mb'})); // support json encoded bodies
	app.use(express.urlencoded({
		limit: '1000mb',
		extended: true
	})); // support encoded bodies
	app.use((req, res, next) => {
		res.setHeader('Access-Control-Allow-Origin', '*');
		res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
		res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Authorization, Accept, Key');
		req.method === 'OPTIONS'
			? res.json()
			: next();
	});
	app.use('/slash', slashCommands());

	const server = createServer(app);
	const port = getConfig().web.port;
	server.listen(port, () => logger.info(`App listening on ${port}`, {service: 'Web'}));
}