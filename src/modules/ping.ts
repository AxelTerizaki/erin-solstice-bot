import { getErin } from '../bot';

export async function initPing() {
	const erin = getErin();
	erin.on('message', message => {
		if (message.author.bot) return;
		if (message.content === 'Coucou Erin') message.reply('Coucou!');
	});
	console.log('Ping module registered');
}