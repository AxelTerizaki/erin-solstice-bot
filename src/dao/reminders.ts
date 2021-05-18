import Reminder from '../entities/reminders';
import { getDB } from '../util/db';

export const managers = {};

export function getReminderManager(guildId: string): ReminderManagerService {
	if (!(guildId in managers)) {
		managers[guildId] = new ReminderManagerService(guildId);
	}
	return managers[guildId];
}

export default class ReminderManagerService {
	constructor(guildID: string) {
		this.guildId = guildID;
	}

    guildId: string

    async deleteReminder(id: number) {
    	const db = getDB(this.guildId);
    	const repo = db.connection.getRepository(Reminder);
    	await repo.delete(id);
    }

    async getReminders(): Promise<Reminder[]> {
    	const db = getDB(this.guildId);
    	const repo = db.connection.getRepository(Reminder);
    	const reminders = repo.find();
    	return reminders;
    }

    async insertReminder(reminder: Reminder) {
    	const db = getDB(this.guildId);
    	const repo = db.connection.getRepository(Reminder);
    	let r = new Reminder();
    	r = {...r, ...reminder};
    	await repo.save(r);
    }
}