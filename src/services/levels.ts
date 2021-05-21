import { Message } from 'discord.js';

import { getErin, getGuild } from '../bot';
import { getLevelManager } from '../dao/levels';
import { GuildLevelMap } from '../types/levels';
import { getConfig } from '../util/config';
import { embed } from '../util/discord';
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
			desc.push(`${rank}. **${user.name}** [${user.class}] Level **${user.level}** (**${user.xp}** XP with **${user.messages}** messages)`);
			rank++;
		}
		const msg = embed(`Rankings for ${getGuild(message.guild.id).name}`, desc);
		message.channel.send(msg);
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
		const msg = embed(`${user.name}'s level information`, [
			`**Class :** [${user.class}] Level ${user.level}`,
			`**XP :** ${user.xp}`,
			`**Messages :** ${user.messages}`
		]);
		message.channel.send(msg);
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
		// Drop message if not in a guild
		if (!message.guild) return;
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
		const data = [];
		if (oldClass && oldClass !== currentUser.class) {
			data.push(`[${oldClass} class removed!]`);
		}
		if (className) {
			data.push(`[${className} class obtained!]`);
			data.push('');
			data.push(`[${className} Level ${currentUser.level}!]`);
		}
		const msg = embed(`${currentUser.name}'s new class!`, data);
		message.channel.send(msg);
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
	user.name = guildUser.nickname;
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
