import { Message, TextChannel } from 'discord.js';

import { getErin } from '../bot';
import { getReminderManager } from '../dao/reminders';
import { isValidDate } from '../util/date';
import { embed } from '../util/discord';
import logger from '../util/logger';

async function manageReminder(guildID: string) {
	try {
		const manager = getReminderManager(guildID);
		const reminders = await manager.getReminders();
		const now = new Date();
		for (const reminder of reminders) {
			if (reminder.remind_at < now) {
				// Reminder is due. Let's delete it and mention our user
				const channel = await getErin().channels.cache.get(reminder.channel_id).fetch() as TextChannel;
				const msg = embed('Reminder!', [`${reminder.content}`]);
				channel.startTyping();
				channel.send(`Hey <@${reminder.user_id}>, you've got a reminder!`);
				channel.send(msg);
				channel.stopTyping();
				manager.deleteReminder(reminder.id);
			}
		}
	} catch (err) {
		logger.error('Error while fetching reminders', {obj: err, service: 'Reminders'});
	}
}

async function manageAllReminders() {
	for (const guild of getErin().guilds.cache.values()) {
		manageReminder(guild.id);
	}
}

export async function initReminders() {
	setInterval(manageAllReminders, 60000);
	manageAllReminders();
}

export async function removeReminder(message: Message, id: number) {
	try {
		const manager = getReminderManager(message.guild.id);
		const reminder = await manager.getReminder(id);
		if (reminder.user_id !== message.author.id) {
			message.channel.send(embed('Reminders', ['Sorry but this reminder isn\'t yours.']));
			return null;
		}
		await manager.deleteReminder(id);
		message.channel.send(embed('Reminders', ['Okay, I\'ll forget about that!']));
		return null;
	} catch (err) {
		logger.error('Error while removing a reminder', {obj: err, service: 'Reminder'});
		message.reply('Sorry! There was an error while removing a reminder');
	}
}

export async function getReminders(message: Message) {
	try {
		const manager = getReminderManager(message.guild.id);
		const reminders = await manager.getReminders(message.author.id);
		if (reminders.length > 0) {
			const msg = ['Here are your reminders'];
			for (const reminder of reminders) {
				msg.push(`${reminder.id}. \`${reminder.remind_at.toISOString()}\`: ${reminder.content}`);
			}
			msg.push('To delete a reminder, use the `forgetreminder <id>` command.');
			message.channel.send(embed('Your reminders', msg));
		} else {
			message.channel.send(embed('Your reminders', ['You have no reminders set!']));
		}
	} catch (err) {
		logger.error('Error while getting reminders', {obj: err, service: 'Reminder'});
		message.reply('Sorry! There was an error while getting your reminders');
	}
}

export async function setReminder(message: Message, remind_time: string, content: string) {
	try {
		const manager = getReminderManager(message.guild.id);
		const guildUser = message.guild.members.cache.find(u => u.id === message.author.id);
		let date: Date;
		if (isValidDate(remind_time)) {
			date = new Date(remind_time);
		} else {
			const reminder = remind_time.match(/[a-zA-Z]+|[0-9]+/g);
			if (+reminder[0] <= 0) {
				// First parameter isn't a number and isn't a date either
				message.channel.send(embed('Reminder', ['That is an invalid reminder date!']));
				return null;
			}
			date = new Date();
			// Determine unit type
			const [n, unit] = reminder;
			if (unit === 'd') {
				date.setDate(date.getDate() + +n);
			} else if (unit === 'w') {
				date.setDate(date.getDate() + (+n * 7));
			} else if (unit === 'M') {
				date.setMonth(date.getMonth() + +n);
			} else if (unit === 'y') {
				date.setFullYear(date.getFullYear() + +n);
			} else if (unit === 's') {
				date.setSeconds(date.getSeconds() + +n);
			} else if (unit === 'm') {
				date.setMinutes(date.getMinutes() + +n);
			} else if (unit === 'h') {
				date.setHours(date.getHours() + +n);
			} else {
				message.channel.send(embed('Reminder', ['Unknown time unit!']));
				return null;
			}
		}
		await manager.insertReminder({
			content: content,
			user_id: message.author.id,
			name: guildUser.user.username,
			channel_id: message.channel.id,
			remind_at: date
		});
		message.channel.send(embed('Reminder', [
			`A new reminder has been set on \`${date.toISOString()}\`:`,
			content
		]));
	} catch (err) {
		logger.error('Error while setting a new reminder', {obj: err, service: 'Reminder'});
		message.reply('Sorry! There was an error while setting your reminder');
	}
	return null;
}