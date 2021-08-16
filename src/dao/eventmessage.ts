import EventMessage from'../entities/reminders';
import { getDB } from '../util/db';

export const managers = {};

export function getEventMessageManager(guildId: string): EventMessageManagerService {
    if(!(guildId in managers)) {
        managers[guildId] = new EventMessageManagerService(guildId);
    }
    return managers[guildId];
}

export default class EventMessageManagerService {
    constructor(guildId: string) {
        this.guildId = guildId;
    }

    guildId: string

    async deleteEventMessage(id: number) {
        const db = await getDB(this.guildId);
    	const repo = db.connection.getRepository(EventMessage);
    	await repo.delete(id);
    }

    async getEventMessage(): Promise<EventMessage[]> {
        const db = await getDB(this.guildId);
        const repo = db.connection.getRepository(EventMessage);
        const eventMessage = repo.find();
        return eventMessage;
    }

    async addEventMessage(eventMessage: EventMessage) {
        const db = await getDB(this.guildId);
        const repo = db.connection.getRepository(EventMessage);
        let e = new EventMessage();
        e = {...e, ...eventMessage};
        await repo.save(e);
    }
}
