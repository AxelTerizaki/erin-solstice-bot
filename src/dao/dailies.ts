import {Daily, DailyUser} from '../types/entities/dailies';
import { getDB } from './db';
import { deleteDaily, deleteDailyWithDate, insertDaily, insertDailyUser, selectDailyType, selectDailyUser } from './sql/dailies';

export const managers = {};

export function getDailyManager(guildId: string): DailyManagerService {
	if (!(guildId in managers)) {
		managers[guildId] = new DailyManagerService(guildId);
	}
	return managers[guildId];
}

export default class DailyManagerService {
	constructor(guildID: string) {
		this.guildId = guildID;
	}

	guildId: string;

	async cleanOldDailies() {
    	const db = await getDB(this.guildId);
    	return db.run(deleteDailyWithDate, {
			date: new Date()
		});
	}

	async getDaily(type: string): Promise<Daily[]> {
    	const db = await getDB(this.guildId);
    	const res = await db.query(selectDailyType(true), {type});
		return res;
	}

	async getDailyUser(userid: string): Promise<DailyUser> {
    	const db = await getDB(this.guildId);
    	const res = db.query(selectDailyUser, {userid});
    	return res[0];
	}

	async saveDailyUser(dailyUser: DailyUser) {
    	const db = await getDB(this.guildId);
		await db.run(insertDailyUser, dailyUser);    	
	}

	async registerDaily(type: string, amount: number) {
    	const db = await getDB(this.guildId);
    	if (0 < amount) {
    		await db.run(insertDaily, {
				type,
				amount
			});
    	} else {
    		await db.run(deleteDaily, {
				type
			});
    	}
	}

	async getDailyTypes(): Promise<Daily[]> {
    	const db = await getDB(this.guildId);
    	const res = await db.query(selectDailyType());
    	return res;
	}
}