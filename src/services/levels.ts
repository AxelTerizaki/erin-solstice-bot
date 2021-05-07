import { Message, MessageEmbed } from 'discord.js';

import { getErin, getGuild } from '../bot';
import { getLevelManager } from '../dao/levels';
import { GuildLevelMap } from '../types/levels';
import { getConfig } from '../util/config';
import logger from '../util/logger';

const guildLevelsMap: GuildLevelMap = new Map();

/** Temporary until we have a page to display */
export async function getGuildLevels(message: Message) {
	try {
		const manager = getLevelManager(message.guild.id);
		const users = await manager.getGuildLevels();
		let rank = 1;
		const desc = [];
		for (const user of users) {
			if (rank > 15) break;
			if (!user.class) user.class = 'No Class';
			desc.push(`${rank}. ${user.name} [${user.class}] Level ${user.level} (${user.xp} XP with ${user.messages} messages)`);
			rank++;
		}
		const embed = new MessageEmbed()
			.setTitle(`Rankings for ${getGuild(message.guild.id).name}`)
			.setColor(0xff0000)
			.setDescription(desc.join('\n'));
		message.channel.send(embed);
	} catch(err) {
		logger.error('Error while fetching levels', {obj: err, service: 'Levels'});
	}
	return null;
}

export async function getLevel(message: Message) {
	message.channel.startTyping();
	try {
		const manager = getLevelManager(message.guild.id);
		const user = await manager.getUserLevel(message.author.id);
		message.reply(`[${user.class}] level ${user.level} with ${user.xp} XP and ${user.messages}!`);
	} catch (e) {
		message.channel.send('There was some error while fetching level');
		logger.error('Error while fetching user level', {obj: e, service: 'Levels'});
	} finally {
		message.channel.stopTyping();
	}
	return null;
}

export async function initLevels() {
	// Let's register a message handler to listen to all messages.
	getErin().on('message', message => {
		// Ignore commandes starting with prefix
		if (message.content.startsWith(getConfig().prefix)) return;
		// First we check if it's been a minute since the user has posted
		if (!guildLevelsMap.get(message.guild.id)) {
			guildLevelsMap.set(message.guild.id, new Map());
		}
		const levelsDateMap = guildLevelsMap.get(message.guild.id);
		const levelsDate = levelsDateMap.get(message.author.id);
		if (levelsDate) {
			const oneMinuteAgo = new Date();
			oneMinuteAgo.setMinutes(oneMinuteAgo.getMinutes() - 1);
			if (levelsDate < oneMinuteAgo) {
				// User hasn't posted any message since at least a minute ago, add XP and all.
				computeNewMessage(message);
			}
		} else {
			// User has no date, adding it
			computeNewMessage(message);
		}
	});
}

export async function setLevelClass(message: Message, className: string) {
	try {
		if (className.length > 25) {
			message.reply('Sorry, your class name is way too long! (25 characters maximum)');
			return;
		}
		const manager = getLevelManager(message.guild.id);
		const currentUser = await manager.getUserLevel(message.author.id);
		if (!currentUser) {
			// How the fuck this happens, we will never know. But Erin's always prepared.
			message.reply('You have not posted any message yet, and cannot set your class!');
			return;
		}
		const oldClass = currentUser.class;
		if (!className) className = null;
		currentUser.class = className;
		await manager.saveLevel(currentUser);
		if (oldClass && oldClass !== currentUser.class) {
			message.reply(`[${oldClass} class removed!]`);
		}
		if (className) {
			message.reply(`[${className} class obtained!]`);
			message.reply(`[${className} Level ${currentUser.level}!]`);
		}
	} catch(err) {
		logger.error('Error while setting new class', {obj: err, service: 'Levels'});
		message.reply('Sorry! There was an error while setting your new class');
	}
	return null;
}

async function computeNewMessage(message: Message) {
	const manager = getLevelManager(message.guild.id);
	const currentUser = await manager.getUserLevel(message.author.id);
	// XP for this message
	const newXP = Math.floor(Math.random() * (25 - 15 + 1) + 15);
	const guildUser = message.guild.members.cache.find(u => u.id === message.author.id);
	const user = currentUser
		? currentUser
		: { id: message.author.id };
	user.xp = currentUser
		? user.xp + newXP
		: newXP;
	user.messages = currentUser
		? user.messages + 1
		: 1;
	user.level = computeLevel(user.xp);
	user.name = guildUser.user.username;
	user.avatar = message.author.avatarURL();
	await manager.saveLevel(user);
	const levelsDate = guildLevelsMap.get(message.guild.id);
	levelsDate.set(message.author.id, new Date());
	guildLevelsMap.set(message.guild.id, levelsDate);
}

function computeLevel(xp: number): number {
	let level = 100;
	while (xp < getXPForLevel(level)) {
		if (level === 1) break;
		level--;
	}
	return level;
}

/** Courtesy of @leonekmi */
function getXPForLevel(level: number): number {
	if (level <= 1) return 250;
	return getXPForLevel(level - 1) + (level * 800);
}
