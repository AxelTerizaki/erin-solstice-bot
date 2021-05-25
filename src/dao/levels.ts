import UserLevel from '../entities/levels';
import { getDB } from '../util/db';

export const managers = {};

export function getLevelManager(guildId: string): UserLevelManagerService {
	if (!(guildId in managers)) {
		managers[guildId] = new UserLevelManagerService(guildId);
	}
	return managers[guildId];
}

export default class UserLevelManagerService {
	constructor(guildID: string) {
		this.guildId = guildID;
	}

    guildId: string

    /**
     *
     * @param id
     * @returns
     */
    async getUserLevel(id: string): Promise<UserLevel> {
    	const db = await getDB(this.guildId);
    	const repo = db.connection.getRepository(UserLevel);
    	const user = repo.findOne(id);
    	return user;
    }

    /**
     *
     * @returns
     */
	 async getGuildLevels(): Promise<UserLevel[]> {
    	const db = await getDB(this.guildId);
    	const repo = db.connection.getRepository(UserLevel);
    	return repo.find({
    		order: {
    			xp: 'DESC'
    		}
    	});
    }

    /**
     * Save new user level data
	 * @param UserLevel user level data
     * @returns
     */
    async saveLevel(user: UserLevel) {
    	const db = await getDB(this.guildId);
    	const repo = db.connection.getRepository(UserLevel);
    	let r = new UserLevel();
    	r = {...r, ...user};
    	return repo.save(r);
    }
}