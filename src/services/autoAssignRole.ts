import { Message } from 'discord.js';

import { getRoleManager } from '../dao/rolemanager';
import logger from '../util/logger';

export async function list(message: Message) {
	message.channel.startTyping();
	try {
		const manager = getRoleManager(message.guild.id);
		const assignableRoles = await manager.getAutoAssignableList();
		if (assignableRoles.length) {
			message.reply(`There ${assignableRoles.length > 1 ? 'are' : 'is'} \
${assignableRoles.length} role${assignableRoles.length > 1 ? 's' : ''}\
which can be self-assigned
${assignableRoles.map(assignableRole => assignableRole.name).join(', ')}
Use \`role <role>\` to assign yourself a role`);
		} else {
			message.reply(`There are currently no role which can be self-assigned.
Use \`roleregister <role>\` to add a self-assignable role.`);
		}
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
			message.reply(`You now have the role ${roleName} ! Enjoy it !`);
		} catch (e) {
			message.reply('There was some errors while adding you that role');
			logger.error('Error while adding role to member', {obj: e, service: 'Role'});
		}
	} else {
		message.reply(`Role ${roleName} does not exist.`);
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
			message.reply(`You now have the role ${roleName} ! Enjoy it !`);
		} catch (e) {
			message.reply('There was some errors while adding you that role');
			logger.error('Error while removing role from member', {obj: e, service: 'Role'});
		} finally {
			message.channel.stopTyping();
		}
	}
	return null;
}

export async function register(message: Message, roleName: string) {
	message.channel.startTyping();
	logger.debug('Loading roles...');
	const roles = message.guild.roles;
	if (roles) {
		logger.debug(`Finding role ${roleName} ...`);
		const role = roles.cache.find(role => role.name.toLowerCase() === roleName.toLowerCase());
		if (role) {
			logger.debug(`Registering role ${roleName} ...`);
			try {
				const manager = getRoleManager(message.guild.id);
				await manager.registerAutoAssignable(role.id, role.name, true);
				message.reply('Role successfully registered as auto-assignable !');
			} catch (e) {
				message.reply('There was some errors during registering the role as auto-assignable');
				logger.error(`Error while registering role ${role.name} as auto-assignable`, {obj: e, service: 'Role'});
			} finally {
				message.channel.stopTyping();
			}
		} else {
			message.reply('This role was not found.');
		}
	} else {
		message.reply('I cannot access to any role !');
	}
	message.channel.stopTyping();
	return null;
}

export async function unregister(message: Message, roleName: string) {
	message.channel.startTyping();
	logger.debug('Loading roles...');
	const roles = message.guild.roles;
	if (roles) {
		logger.debug(`Finding role ${roleName} ...`);
		const role = roles.cache.find(role => role.name.toLowerCase() === roleName.toLowerCase());
		if (role) {
			logger.debug(`Unregistering role ${roleName} ...`);
			try {
				const manager = getRoleManager(message.guild.id);
				await manager.unregisterAutoAssignable(role.id);
				message.reply('Role successfully unregistered from auto-assignable !');
			} catch (e) {
				message.reply('There was some errors during unregistering the role from auto-assignable');
				logger.error(`Error while unregistering role ${role.name} from auto-assignable`, {obj: e, service: 'Role'});
			} finally {
				message.channel.stopTyping();
			}
		} else {
			message.reply('This role was not found');
		}
	} else {
		message.reply('I cannot access to any role !');
	}
	message.channel.stopTyping();
	return null;
}
