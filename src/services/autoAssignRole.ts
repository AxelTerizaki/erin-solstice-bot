import { Message } from 'discord.js';

import { getRoleManager } from '../dao/roles';
import { embed } from '../util/discord';
import logger from '../util/logger';

export async function list(message: Message) {
	message.channel.startTyping();
	try {
		const manager = getRoleManager(message.guild.id);
		const assignableRoles = await manager.getAutoAssignableList();
		const data = [];
		if (assignableRoles.length) {
			data.push(`There ${assignableRoles.length > 1 ? 'are' : 'is'} ${assignableRoles.length} role${assignableRoles.length > 1 ? 's' : ''} which can be self-assigned :`);
			const roles = message.guild.roles.cache;
			for (const role of assignableRoles) {
				// Get the role name from the cache first to make sure we still have it in the guild
				const guildRole = roles.find(r => r.id === role.id);
				if (guildRole) data.push(`- ${guildRole.name}`);
			}
			data.push('');
			data.push('Use `role <role>` to assign yourself a role');
		} else {
			data.push(`There are currently no role which can be self-assigned.
Use \`roleregister <role>\` to add a self-assignable role.`);
		}
		const msg = embed('Roles', data);
		message.channel.send(msg);
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
			const msg = embed('Roles', [`You now have the role ${roleName} ! Enjoy it !`]);
			message.channel.send(msg);
		} catch (e) {
			message.reply('There was some errors while adding you that role');
			logger.error('Error while adding role to member', {obj: e, service: 'Role'});
		}
	} else {
		const msg = embed('Roles', [`Role ${roleName} does not exist.`]);
		message.channel.send(msg);
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
			const msg = embed('Roles', [`You are no longer in ${roleName}! It's okay!`]);
			message.channel.send(msg);
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
		const msg = embed('Roles', ['I\'m sorry but you cannot do that!']);
		message.channel.send(msg);
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
				const msg = embed('Roles', ['Role successfully registered as auto-assignable !']);
				message.channel.send(msg);
			} catch (e) {
				message.reply('There was some errors during registering the role as auto-assignable');
				logger.error(`Error while registering role ${role.name} as auto-assignable`, {obj: e, service: 'Role'});
			} finally {
				message.channel.stopTyping();
			}
		} else {
			const msg = embed('Roles', ['This role was not found.']);
			message.channel.send(msg);
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
		const msg = embed('Roles', ['I\'m sorry but you cannot do that!']);
		message.channel.send(msg);
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
				const msg = embed('Roles', ['Role successfully unregistered from auto-assignable roles!']);
				message.channel.send(msg);
			} catch (e) {
				message.reply('There was some errors during unregistering the role from auto-assignable');
				logger.error(`Error while unregistering role ${role.name} from auto-assignable`, {obj: e, service: 'Role'});
			} finally {
				message.channel.stopTyping();
			}
		} else {
			const msg = embed('Roles', ['This role was not found']);
			message.channel.send(msg);
		}
	} else {
		message.reply('I do not have sufficient rights to access roles!');
	}
	message.channel.stopTyping();
	return null;
}
