import { CommandInteraction } from 'discord.js';
import { CommandInfo } from '../types/commandinfo';

export const COMMANDTYPE = {
	'COMMAND': 1,
	'USER': 2,
	'MESSAGE': 3
};

export const OPTIONTYPE = {
	'SUB': 1, // internal
	'SUBGROUP': 2, // internal
	'STR': 3,
	'INT': 4,
	'BOOL': 5,
	'USER': 6, // unsupported
	'CHANNEL': 7, // unsupported
	'ROLE': 8, // unsupported
	'MENTIONABLE': 9, // unsupported
	'NUMBER': 10 // unsupported
};

export abstract class Command {
	data: CommandInfo;

	constructor(commandInfo: CommandInfo) {
		this.data = {
			...{
				global: true,
				description: '',
    			aliases: [],
    			default: true,
    			options: {},
			},
			...commandInfo
		};
		if (!this.data.fullName) { // no full name : command is standalone
			this.data.fullName = this.data.name;
		}
	}

	async execute(interaction: CommandInteraction) {
		throw new Error('Unimplemented');
	}
}