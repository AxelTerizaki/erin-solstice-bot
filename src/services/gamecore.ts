import { Message } from 'discord.js';

import { getErin } from '../bot';
import { getUserManager } from '../dao/usermanager';
import logger from '../util/logger';
import { format as formatMoney } from '../util/wimoney';

export async function money(message: Message) {
	message.channel.startTyping();
	try {
		if(message.guild) {
		    await moneyForGuild(message, message.member.id, message.guild.id);
		} else { // no guild
			await moneyForGuilds(message, message.author.id);
		}
	} catch (e) {
		message.reply('There was some error while fetching user');
		logger.error('Error while fetching user', {obj: e, service: 'Money'});
	} finally {
		message.channel.stopTyping();
	}
	return null;
}

async function moneyForGuild(message: Message, userId: string, guildId: string) {
	const manager = getUserManager(guildId);
	let user = await manager.getUser(userId);
	// if no user yet,
	// let's register one while it's okay,
	// with default money (which is zero for now, but maybe a setting ?)
	if (!user) {
		user = await manager.saveMoney(userId, 0);
	}
	return message.reply(formatMoney(user.money));
}

async function moneyForGuilds(message: Message, userId: string) {
	for (const guild of getErin().guilds.cache.values()) {
		const manager = getUserManager(guild.id);
	    const user = await manager.getUser(userId);
		if(user) { // if no user, we won't display anything
			message.reply(`${guild.name} : ${formatMoney(user.money)}`);
		}
	}
}
