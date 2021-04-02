import {resolve} from 'path';
import { Connection, ConnectionOptions, createConnection } from 'typeorm';

import Setting from '../entities/settings';
import { getState } from './state';

export const dbs = {};

export function getDB(guildID: string) {
	// the guild ID is a number, but the property is a string
	return dbs[guildID];
}

export default class Database {
	constructor(guildID: string) {
		this.options = {
			type: 'sqlite',
			database: resolve(getState().dataPath, `db/${guildID}.sqlite`),
			logging: true,
			entities: [Setting],
			synchronize: true
		};
		this.guildID = guildID;
	}

	guildID: string
	options: ConnectionOptions
	connection: Connection

	init = async () => {
		this.connection = await createConnection(this.options);
		dbs[`${this.guildID}`] = this;
	}
}

