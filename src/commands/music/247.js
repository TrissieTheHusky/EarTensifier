const Command = require('../../structures/Command');

module.exports = class TwentyFourSeven extends Command {
	constructor(client) {
		super(client, {
			name: '24/7',
			description: 'Stays in the voice channel even if no one is in it.',
			aliases: ['stay', '247'],
            playing: true,
            permission: 'pro',
		});
	}
	async run(client, message) {
		const player = client.music.players.get(message.guild.id);
		player.twentyFourSeven = true;

		return message.channel.send('24/7 mode is now on.');
	}
};