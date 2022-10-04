import { Reminder } from '../types/entities/reminders';
import { getDB } from './db';
import { sqldeleteReminder, sqlinsertReminder, sqlselectReminders } from './sql/reminders';

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

	guildId: string;

	async deleteReminder(id: number) {
    	const db = await getDB(this.guildId);
    	await db.run(sqldeleteReminder, { id });
	}

	async getReminders(user?: string): Promise<Reminder[]> {
    	const db = await getDB(this.guildId);
		const res = db.query(sqlselectReminders(user), {user_id: user} );
		return res;    	
	}

	async getReminder(id?: number): Promise<Reminder> {
    	const db = await getDB(this.guildId);
		const res = db.query(sqlselectReminders(null, id), {id});
		return res[0];
	}

	async insertReminder(reminder: Reminder) {
    	const db = await getDB(this.guildId);
    	await db.run(sqlinsertReminder, reminder);
	}
}