import Daily from '../types/entities/dailies';
import DailyUser from '../types/entities/dailyUsers';
import User from '../types/entities/users';
import { generateFlatDate } from '../util/date';
import { getDB } from '../util/db';

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

    guildId: string

    async cleanOldDailies() {
    	const db = await getDB(this.guildId);
    	return db.connection.createQueryBuilder()
    		.delete()
    		.from(DailyUser)
    		.where('date<:fd', { fd: generateFlatDate()})
    		.execute();
    }

    async getDaily(type: string): Promise<Daily> {
    	const db = await getDB(this.guildId);
    	const repo = db.connection.getRepository(Daily);
    	return repo.findOne(type);
    }

    async getDailyUser(userid: string): Promise<DailyUser> {
    	const db = await getDB(this.guildId);
    	const repo = db.connection.getRepository(DailyUser);
    	return repo.findOne(userid, { relations: ['daily'] });
    }

    async saveDailyUser(daily: Daily, user: User): Promise<DailyUser> {
    	const db = await getDB(this.guildId);
    	const repo = db.connection.getRepository(DailyUser);
    	const d = new DailyUser();
    	d.daily = daily;
    	d.userid = user.id;
    	return repo.save(d);
    }

    async registerDaily(type: string, amount: number): Promise<any> {
    	const db = await getDB(this.guildId);
    	const repo = db.connection.getRepository(Daily);
    	if (0 < amount) {
    		const d = new Daily();
    		d.type = type;
    		d.amount = amount;
    		return repo.save(d);
    	} else {
    		return repo.delete(type);
    	}
    }

    async getDailyTypes(): Promise<Daily[]> {
    	const db = await getDB(this.guildId);
    	const repo = db.connection.getRepository(Daily);
    	return repo.find();
    }
}