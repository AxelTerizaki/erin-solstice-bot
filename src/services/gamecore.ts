import { Message } from 'discord.js';

import { getErin } from '../bot';
import { getUserManager } from '../dao/users';
import { embed } from '../util/discord';
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
	const msg = embed(`${user.id}'s Merchant's Guild Account`, [formatMoney(user.money)]);
	message.channel.send(msg);
	return null;
}

async function moneyForGuilds(message: Message, userId: string) {
	const data = [];
	for (const guild of getErin().guilds.cache.values()) {
		const manager = getUserManager(guild.id);
	    const user = await manager.getUser(userId);
		if(user) { // if no user, we won't display anything
			data.push(`- ${guild.name} : ${formatMoney(user.money)}`);
		}
	}
	const msg = embed('Your Merchant\'s Guild account', data);
	message.channel.send(msg);
}
