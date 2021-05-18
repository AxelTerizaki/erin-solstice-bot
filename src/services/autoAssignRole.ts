import { Message } from 'discord.js';

import { getRoleManager } from '../dao/roles';
import { sendEmbed } from '../util/discord';
import logger from '../util/logger';

export async function list(message: Message) {
	message.channel.startTyping();
	try {
		const manager = getRoleManager(message.guild.id);
		const assignableRoles = await manager.getAutoAssignableList();
		const data = [];
		if (assignableRoles.length) {
			data.push(`There ${assignableRoles.length > 1 ? 'are' : 'is'}
${assignableRoles.length} role${assignableRoles.length > 1 ? 's' : ''}\
which can be self-assigned :`);
			for (const role of assignableRoles) {
				data.push(`- ${role.name}`);
			}
			data.push('');
			data.push('Use `role <role>` to assign yourself a role');
		} else {
			data.push(`There are currently no role which can be self-assigned.
Use \`roleregister <role>\` to add a self-assignable role.`);
		}
		sendEmbed(message, 'Roles', data);
	} catch (e) {
		message.reply('There was some error while fetching roles');
		logger.error(`Error while fetching roles ${e}`);
	} finally {
		message.channel.stopTyping();
	}
	return null;
}

export async function add(message: Message, roleName: string) {
	message.channel.startTyping();
	logger.debug('Loading role...');
	const manager = getRoleManager(message.guild.id);
	const roleToGive = await manager.getAutoAssignable(roleName);
	if (roleToGive) {
		try {
			await manager.addMember(message.member, roleToGive);
			sendEmbed(message, 'Roles', [`You now have the role ${roleName} ! Enjoy it !`]);
		} catch (e) {
			message.reply('There was some errors while adding you that role');
			logger.error('Error while adding role to member', {obj: e, service: 'Role'});
		}
	} else {
		sendEmbed(message, 'Roles', [`Role ${roleName} does not exist.`]);
	}
	message.channel.stopTyping();
	return null;
}

export async function remove(message: Message, roleName: string) {
	message.channel.startTyping();
	logger.debug('Loading role...');
	const manager = getRoleManager(message.guild.id);
	const roleToRemove = await manager.getAutoAssignable(roleName);
	if (roleToRemove) {
		try {
			await manager.removeMember(message.member, roleToRemove);
			sendEmbed(message, 'Roles', [`You are no longer in ${roleName}! It's okay!`]);
		} catch (e) {
			message.reply('There was some errors while removing you from that role');
			logger.error('Error while removing role from member', {obj: e, service: 'Role'});
		} finally {
			message.channel.stopTyping();
		}
	}
	return null;
}

export async function register(message: Message, roleName: string) {
	message.channel.startTyping();
	// Check if user has the correct role to do this
	if (!message.member.hasPermission('MANAGE_ROLES')) {
		sendEmbed(message, 'Roles', ['I\'m sorry but you cannot do that!']);
		message.channel.stopTyping();
		return null;
	}
	const roles = message.guild.roles;
	if (roles) {
		const role = roles.cache.find(role => role.name.toLowerCase() === roleName.toLowerCase());
		if (role) {
			logger.debug(`Registering role ${roleName} ...`);
			try {
				const manager = getRoleManager(message.guild.id);
				await manager.registerAutoAssignable(role.id, role.name, true);
				sendEmbed(message, 'Roles', ['Role successfully registered as auto-assignable !']);
			} catch (e) {
				message.reply('There was some errors during registering the role as auto-assignable');
				logger.error(`Error while registering role ${role.name} as auto-assignable`, {obj: e, service: 'Role'});
			} finally {
				message.channel.stopTyping();
			}
		} else {
			sendEmbed(message, 'Roles', ['This role was not found.']);
		}
	} else {
		message.reply('I do not have sufficient rights to access roles!');
	}
	message.channel.stopTyping();
	return null;
}

export async function unregister(message: Message, roleName: string) {
	message.channel.startTyping();
	if (!message.member.hasPermission('MANAGE_ROLES')) {
		sendEmbed(message, 'Roles', ['I\'m sorry but you cannot do that!']);
		message.channel.stopTyping();
		return null;
	}
	const roles = message.guild.roles;
	if (roles) {
		const role = roles.cache.find(role => role.name.toLowerCase() === roleName.toLowerCase());
		if (role) {
			logger.debug(`Unregistering role ${roleName} ...`);
			try {
				const manager = getRoleManager(message.guild.id);
				await manager.unregisterAutoAssignable(role.id);
				sendEmbed(message, 'Roles', ['Role successfully unregistered from auto-assignable roles!']);
			} catch (e) {
				message.reply('There was some errors during unregistering the role from auto-assignable');
				logger.error(`Error while unregistering role ${role.name} from auto-assignable`, {obj: e, service: 'Role'});
			} finally {
				message.channel.stopTyping();
			}
		} else {
			sendEmbed(message, 'Roles', ['This role was not found']);
		}
	} else {
		message.reply('I do not have sufficient rights to access roles!');
	}
	message.channel.stopTyping();
	return null;
}
