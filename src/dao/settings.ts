import { Setting } from '../types/entities/settings';
import { getDB } from './db';
import { deleteSetting, insertSetting, selectSetting } from './sql/settings';

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

	guildId: string;

	async get(setting: string): Promise<Setting> {
    	const db = await getDB(this.guildId);
		const res = await db.query(selectSetting, { setting });
		return res[0];
	}

	async set(setting: string, value: string) {
    	const db = await getDB(this.guildId);
    	await db.run(insertSetting, { setting, value });
	}

	async del(setting: string) {
    	const db = await getDB(this.guildId);
    	await db.run(deleteSetting, { setting });
	}
}