import { Message } from 'discord.js';

import { getErin } from '../bot';
import { getDailyManager } from '../dao/dailies';
import { getSettingManager } from '../dao/settings';
import { getShopManager } from '../dao/store';
import { getCurrentUser,getUserManager } from '../dao/users';
import Daily from '../entities/dailies';
import User from '../entities/users';
import { date, generateFlatDate, time } from '../util/date';
import { embed } from '../util/discord';
import logger from '../util/logger';
import { flat2wimString, format as formatMoney } from '../util/wimoney';

const gamerestrictSettingKey = 'gamerestrict';

export async function restrict(message: Message, isOn: boolean) {
	message.channel.startTyping();
	try {
		if (isOn) {
			getSettingManager(message.guild.id).set(gamerestrictSettingKey, message.channel.id);
		} else {
			getSettingManager(message.guild.id).del(gamerestrictSettingKey);
		}
		message.reply(`Setting \`gamerestrict\` is now \`${isOn ? 'on' : 'off'}\` !`);
	} catch (e) {
		message.reply('There was some error while restricting game commands');
		logger.error(`Error while fetching user ${e}`);
	} finally {
		message.channel.stopTyping();
	}
	return null;
}

export async function getRestricted(message: Message) {
	message.channel.startTyping();
	try {
		const restricted = await isRestricted(message.guild.id);
		if (restricted) {
			const channel = await message.client.channels.fetch(restricted);
			message.reply(`Setting \`gamerestrict\` is \`on\` : game commands are allowed only in ${channel}.`);
		} else {
			message.reply('Setting `gamerestrict` is `off` : game commands are allowed everywhere.');
		}
	} catch (e) {
		message.reply('There was some error while getting `gamerestrict` setting');
		logger.error(`Error while fetching user ${e}`);
	} finally {
		message.channel.stopTyping();
	}
	return null;
}

/**
 * Check if that message was sent from an allowed place (meaning either gamerestrict is off or channel is fine)
 * @param message 
 * @returns 
 */
export async function isAllowed(message: Message): Promise<boolean> {
	const restricted = await isRestricted(message.guild.id);
	return (null === restricted) || (message.channel.id === restricted);
}

export async function money(message: Message) {
	message.channel.startTyping();
	try {
		if (message.guild) {
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

export async function daily(message: Message, type: string) {
	message.channel.startTyping();
	try {
		if (await isAllowed(message)) {
			const manager = getDailyManager(message.guild.id);
			if ('help' === type) {
				message.reply(`Available types:\n${(await getAvailableDailyTypes(message)).join('\n')}`);
			} else {
				await manager.cleanOldDailies(); // first of all, clean it up
				const daily = await manager.getDaily(type);
				const user = await getCurrentUser(message.guild.id, message.member.id);
				if (daily && user) {
					const dailyuser = await manager.getDailyUser(user.id);
					const currentDate = date(true, generateFlatDate());
					if (!dailyuser || (currentDate !== date(true, dailyuser.date))) { // should never happen except if some lags or double try occurs
						await executeDaily(message, daily, user);
					} else {
						message.reply(`You already did a daily task today (${dailyuser.daily.type} at ${time(dailyuser.date)})`); 
						// @TODO send halp ?
					}
				} else {
					message.reply(`Unknown daily type ${type}. Available types:\n${(await getAvailableDailyTypes(message)).join('\n')}`);
				}
			}
		} else {
			message.reply('This command is not allowed into this channel (`gamerestrict` is on)');
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
		if ('help' !== type) {
			logger.debug(`Setting daily task ${type} to ${amount}`);
			const manager = getDailyManager(message.guild.id);
			const daily = await manager.registerDaily(type, amount);
			if (daily) {
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
	for (const d of dailies) {
		r.push(`${d.type} : ${flat2wimString(d.amount)}`);
	}
	return r;
}

export async function headTail(message: Message, bet: number) {
	message.channel.startTyping();
	try {
		const manager = getUserManager(message.guild.id);
		const currentUser = await getCurrentUser(message.guild.id, message.member.id);
		if (bet <= currentUser.money) {
			manager.changeMoney(message.member.id, bet);
			const rnd = Math.floor(Math.random() * 10100);
			let won = 0;
			let res = 'head';
			if (rnd > 10000) {
				res = 'edge';
				won = Math.floor(bet * 10);
			} else if (rnd < 5000) {
				res = 'tail';
				won = Math.floor(bet * 1.75);
			}
			if (0 < won) {
				message.reply(`${res} ! You won ${flat2wimString(won)} !`);
			} else {
				message.reply(`${res} ! You lost your bet.`);
			}
		} else {
			message.reply(`You cannot bet (${flat2wimString(bet)}) more than you have (${flat2wimString(currentUser.money)}) !`);
		}
	} catch (e) {
		message.reply('There was some error while trying heads n tails');
		logger.error(`Error while trying heads n tails ${e}`);
	} finally {
		message.channel.stopTyping();
	}
	
	return null;
}

/**
 * Retrieves the channel ID for gamerestrict settting, if any.
 * @param guildId 
 * @returns 
 */
async function isRestricted(guildId: string): Promise<string> {
	return (await getSettingManager(guildId).get(gamerestrictSettingKey))?.value || null;
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
		if (user) { // if no user, we won't display anything
			data.push(`- ${guild.name} : ${formatMoney(user.money)}`);
		}
	}
	const msg = embed('Your Merchant\'s Guild account', data);
	message.channel.send(msg);
}

async function executeDaily(message: Message, daily: Daily, user: User) {
	message.channel.startTyping();
	try {
		const dmanager = getDailyManager(message.guild.id);
		const umanager = getUserManager(message.guild.id);
		// if empty, typeorm returns null, and typeorm denies init on relations
		const dusers = daily.users ?? []; 
		const multiplier = Math.max(1.00, 2.00 - (dusers.length * daily.regress));
		const amount = Math.floor(daily.amount * multiplier);
		await umanager.changeMoney(user.id, amount);
		await dmanager.saveDailyUser(daily, user);
		message.reply(`You won ${flat2wimString(amount)} ${(multiplier > 1.00)? '('+Math.floor(100 * multiplier)+'%) ':''}by doing this daily task !`);
	} catch (e) {
		message.reply('There was some error while executing dailies');
		logger.error('Error while executing dailies', {obj: e, service: 'Game'});
	} finally {
		message.channel.stopTyping();
	}
}

export async function setupItem(message: Message, name: string, emote: string, price: number) {
	message.channel.startTyping();
	try {
		const imanager = getShopManager(message.guild.id);
		if (price > 0) { // add / modify
			const itemToUpdate = await imanager.findItemByAny(name);
			if (itemToUpdate) { 
				// exists ! update
				await imanager.saveItem(emote, name, price, itemToUpdate.id);
				message.reply(`Item ${name} updated !`);
			} else { // then create it !
				await imanager.saveItem(emote, name, price);
				message.reply(`Item ${name} added !`);
			}
		} else { // remove
			const itemToDelete = await imanager.findItemByAny(name);
			if (itemToDelete) {
				await imanager.removeItem(itemToDelete.id);
				message.reply(`Item ${name} removed !`);
			}
		}
	} catch (e) {
		message.reply('There was some error while setting up item');
		logger.error('Error while setting up item', {obj: e, service: 'Game'});
	} finally {
		message.channel.stopTyping();
	}
}

export async function listItems(message: Message) {
	message.channel.startTyping();
	try {
		const imanager = getShopManager(message.guild.id);
		const umanager = getUserManager(message.guild.id);
		const items = await imanager.getShop();
		let r = 'Shop content : \n';
		for (const i of items) {
			r += `${i.emote} ${(i.name !== i.emote)? i.name:'\t\t'} : ${flat2wimString(i.price)}\n`;
		}
		const user = await umanager.getUser(message.member.id);
		message.reply(r + formatMoney(user.money? user.money:0));
	} catch (e) {
		message.reply('There was some error while listing items');
		logger.error('Error while listing items', {obj: e, service: 'Game'});
	} finally {
		message.channel.stopTyping();
	}
}

export async function buyItem(message: Message, userid: string, itemSearch: string, nb: number) {
	message.channel.startTyping();
	try {
		const umanager = getUserManager(message.guild.id);
		const imanager = getShopManager(message.guild.id);
		const currentUser = await getCurrentUser(message.guild.id, userid);
		const item = await imanager.findItemByAny(itemSearch);
		if (item) {
			nb = Math.max(1, Math.round(nb));
			const totalPrice = nb * item.price;
			if (totalPrice <= currentUser.money) { // first of all, grab money
				await umanager.changeMoney(currentUser.id, -1 * totalPrice);
				await umanager.addItem(currentUser.id, item, nb);
				message.reply(`You bought ${nb} × ${item.name} !`);
			} else {
				message.reply(`You cannot buy this item, as it costs ${flat2wimString(totalPrice)} and you only have ${flat2wimString(currentUser.money)} !`);
			}
		} else {
			message.reply(`Unable to find item ${itemSearch} !`);
		}
	} catch (e) {
		message.reply('There was some error while buying item');
		logger.error('Error while buying item', {obj: e, service: 'Game'});
	} finally {
		message.channel.stopTyping();
	}
}

export async function showInventory(message: Message, userid: string) {
	message.channel.startTyping();
	try {
		const umanager = getUserManager(message.guild.id);
		const items = await umanager.listItems(userid);
		if (items) {
			let r = 'Inventory content : \n';
			for (const i of items) {
				r += `${i.nb} × ${i.item.emote} ${(i.item.name !== i.item.emote)? i.item.name:''}\n`;
			}
			const currentUser = await getCurrentUser(message.guild.id, userid);
			message.reply(r + formatMoney(currentUser.money? currentUser.money:0));
		}
	} catch (e) {
		message.reply('There was some error while listing inventory');
		logger.error('Error while listing inventory', {obj: e, service: 'Game'});
	} finally {
		message.channel.stopTyping();
	}
}
