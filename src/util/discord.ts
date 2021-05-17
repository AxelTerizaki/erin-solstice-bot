import { Message, MessageEmbed } from 'discord.js';

export function sendEmbed(message: Message, title: string, data: string[]) {
	const embed = new MessageEmbed()
		.setTitle(title)
		.setColor(0xff0000)
		.setDescription(data.join('\n'));
	message.channel.send(embed);
}