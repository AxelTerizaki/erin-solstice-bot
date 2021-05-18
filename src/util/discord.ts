import { MessageEmbed } from 'discord.js';

export function embed(title: string, data: string[]) {
	return new MessageEmbed()
		.setTitle(title)
		.setColor(0xff0000)
		.setDescription(data.join('\n'));
}