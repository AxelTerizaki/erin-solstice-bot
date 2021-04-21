import { Message } from 'discord.js';

import { getErin } from '../bot';
import { getDailyManager } from '../dao/dailymanager';
import { getCurrentUser,getUserManager } from '../dao/usermanager';
import Daily from '../entities/dailies';
import User from '../entities/users';
import { date, generateFlatDate } from '../util/date';
import logger from '../util/logger';
import { flat2wimString, format as formatMoney } from '../util/wimoney';

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
		logger.error(`Error while fetching user ${e}`);
	} finally {
		message.channel.stopTyping();
	}
	return null;
}

export async function daily(message: Message, type: string) {
	message.channel.startTyping();
	try {
		const manager = getDailyManager(message.guild.id);
		if('help' === type) {
			message.reply(`Available types:\n${(await getAvailableDailyTypes(message)).join('\n')}`);
		} else {
			await manager.cleanOldDailies(); // first of all, clean it up
			const daily = await manager.getDaily(type);
			const user = await getCurrentUser(message.guild.id, message.member.id);
			if(daily && user) {
				const dailyuser = await manager.getDailyUser(user.id);
				const currentDate = date(true, generateFlatDate());
				if(!dailyuser || (currentDate !== date(true, dailyuser.date))) { // should never happen except if some lags or double try occurs
					await executeDaily(message, daily, user);
				} else {
					message.reply(`You already did a daily task today (${dailyuser.daily.type})`); // @TODO send halp ?
				}
			} else {
				message.reply(`Unknown daily type ${type}. Available types:\n${(await getAvailableDailyTypes(message)).join('\n')}`);
			}
		}
	} catch (e) {
		message.reply('There was some error while fetching daily');
		logger.error(`Error while fetching daily ${e}`);
	} finally {
		message.channel.stopTyping();
	}
	return null;
}

export async function dailyset(message: Message, type: string, amount: number) {
	message.channel.startTyping();
	try {
		if('help' !== type) {
			logger.debug(`Setting daily task ${type} to ${amount}`);
			const manager = getDailyManager(message.guild.id);
			const daily = await manager.registerDaily(type, amount);
			if(daily) {
				message.reply('Daily well set !');
			} else {
				message.reply('Unable to setup Daily !');
			}
		} else {
			message.reply('The task `help` cannot be set');
		}
	} catch (e) {
		message.reply('There was some error while fetching daily');
		logger.error(`Error while fetching daily ${e}`);
	} finally {
		message.channel.stopTyping();
	}
	return null;
}

export async function getAvailableDailyTypes(message: Message): Promise<string[]> {
	const r: string[] = [];
	const manager = getDailyManager(message.guild.id);
	const dailies = await manager.getDailyTypes();
	dailies.forEach(_ => {
		r.push(`${_.type} : ${flat2wimString(_.amount)}`);
	});
	return r;
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

async function executeDaily(message: Message, daily: Daily, user: User) {
	const dmanager = getDailyManager(message.guild.id);
	const umanager = getUserManager(message.guild.id);
	const multiplier = Math.max(1.00, 2.00 - (daily.users.length * daily.regress));
	const amount = Math.floor(daily.amount * multiplier);
	await umanager.changeMoney(user.id, amount);
	await dmanager.saveDailyUser(daily, user);
	message.reply(`You won ${flat2wimString(amount)} ${(multiplier > 1.00)? '(+'+Math.floor(100 * multiplier)+'%) ':''}by doing this daily task !`);
}
