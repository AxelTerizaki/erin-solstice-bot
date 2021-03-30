import axios from 'axios';

import { SlashCommand } from '../types/discord';
import { getConfig } from './config';
import { discordCommandsURL } from './constants';

export async function registerCommand(command: SlashCommand) {
	await axios.post(discordCommandsURL, command, {headers: {
		Authorization: getConfig().token
	}});
}