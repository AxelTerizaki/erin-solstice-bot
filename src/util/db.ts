import {resolve} from 'path';
import { Connection, ConnectionOptions, createConnection } from 'typeorm';

import Role from '../entities/roles';
import Setting from '../entities/settings';
import User from '../entities/users';
import { getState } from './state';

export const dbs = {};

export function getDB(guildID: string): Database {
	// the guild ID is a number, but the property is a string
	return dbs[guildID];
}

export default class Database {
	constructor(guildID: string) {
		this.options = {
			name: guildID,
			type: 'sqlite',
			database: resolve(getState().dataPath, `db/${guildID}.sqlite`),
			logging: true,
			entities: [Setting, Role, User],
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

