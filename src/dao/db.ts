import {resolve} from 'path';
import { open } from 'sqlite';
import sqlite3, { Database } from 'sqlite3';

import { DBOptions } from '../types/db';
import { getState } from '../util/state';


export const dbs = {};

export async function getDB(guildID: string): Promise<DB> {
	// the guild ID is a number, but the property is a string
	if (!dbs[guildID]) {
		// If DB doesn't exist yet create it
		const guildDB = new DB(guildID);
		await guildDB.init();
	}
	return dbs[guildID];
}

export default class DB {
	constructor(guildID: string) {
		this.options = {
			name: guildID,
			database: resolve(getState().dataPath, `db/${guildID}.sqlite`),
			migrationsPath: resolve(getState().appPath, 'migrations/'),
			logging: true,
		};
		this.guildID = guildID;
	}

	guildID: string;
	options: DBOptions;
	db: Database<sqlite3.Database, sqlite3.Statement>;
	//db: any;

	public async init() {
		this.db = await open({
			filename: this.options.database,
			driver: sqlite3.cached.Database
		});
		if (this.options.logging) sqlite3.verbose();
		await this.db.migrate({
			migrationsPath: this.options.migrationsPath
		})
		dbs[`${this.guildID}`] = this;

	}

	public async query(sql: string, params?: any) {
		return this.db.all(sql, params);
	}

	public async run(sql: string, params?: any) {
		return this.db.run(sql, params);
	}

	public async close() {
		await this.db.close();
	}
}
