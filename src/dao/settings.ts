import { DeleteResult } from 'typeorm';

import Setting from '../entities/settings';
import { getDB } from '../util/db';

export const managers = {};

export function getSettingManager(guildId: string): SettingManagerService {
	if (!(guildId in managers)) {
		managers[guildId] = new SettingManagerService(guildId);
	}
	return managers[guildId];
}

export default class SettingManagerService {
	constructor(guildID: string) {
		this.guildId = guildID;
	}

    guildId: string

    async get(setting: string): Promise<Setting> {
    	const db = await getDB(this.guildId);
    	const repo = db.connection.getRepository(Setting);
    	return repo.findOne(setting);
    }

    async set(setting: string, value: string): Promise<Setting> {
    	const db = await getDB(this.guildId);
    	const repo = db.connection.getRepository(Setting);
    	const s = new Setting();
    	s.setting = setting;
    	s.value = value;
    	return repo.save(s);
    }

    async del(setting: string): Promise<DeleteResult> {
    	const db = await getDB(this.guildId);
    	const repo = db.connection.getRepository(Setting);
    	return repo.delete(setting);
    }
}