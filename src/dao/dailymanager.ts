import Daily from '../entities/dailies';
import DailyUser from '../entities/dailyusers';
import User from '../entities/users';
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
    	const db = getDB(this.guildId);
    	return db.connection.createQueryBuilder()
    		.delete()
    		.from(DailyUser)
    		.where('date<:fd', { fd: generateFlatDate()})
    		.execute();
    }

    async getDaily(type: string): Promise<Daily> {
    	const db = getDB(this.guildId);
    	const repo = db.connection.getRepository(Daily);
    	return repo.findOne(type);
    }

    async getDailyUser(userid: string): Promise<DailyUser> {
    	const db = getDB(this.guildId);
    	const repo = db.connection.getRepository(DailyUser);
    	return repo.findOne(userid);
    }

    async saveDailyUser(daily: Daily, user: User): Promise<DailyUser> {
    	const db = getDB(this.guildId);
    	const repo = db.connection.getRepository(DailyUser);
    	const d = new DailyUser();
    	d.daily = daily;
    	d.userid = user.id;
    	return repo.save(d);
    }

    async registerDaily(type: string, amount: number): Promise<any> {
    	let r: Promise<any> = null;
    	const db = getDB(this.guildId);
    	const repo = db.connection.getRepository(Daily);
    	if(0 < amount) {
    		const d = new Daily();
    		d.type = type;
    		d.amount = amount;
    		r = repo.save(d);
    	} else {
    		r = repo.delete(type);
    	}
    	return r;
    }

    async getDailyTypes(): Promise<Daily[]> {
    	const db = getDB(this.guildId);
    	const repo = db.connection.getRepository(Daily);
    	return repo.find();
    }
}