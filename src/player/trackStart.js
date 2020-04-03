const { Utils } = require('erela.js');
const Discord = require('discord.js');
const bot = require('../models/bot.js');
const users = require('../models/user.js');
const songs = require('../models/song.js');

module.exports = async (client, textChannel, title, duration, author, uri) => {
	const currentSong = client.music.players.get(textChannel.guild.id).queue[0];
	const requester = currentSong.requester.username + '#' + currentSong.requester.discriminator;
	const thumbnail = `https://img.youtube.com/vi/${currentSong.identifier}/default.jpg`;
	addDB(uri, title, author, duration, uri, thumbnail);

	bot.findOne({
		clientID: client.user.id,
	}, async (err, b) => {
		if (err) client.log(err);

		b.songsPlayed += 1;
		await b.save().catch(e => client.log(e));
	});

	users.findOne({
		authorID: requester.id,
	}, async (err, u) => {
		if (err) client.log(err);

		if(!u.songsPlayed) u.songsPlayed = 1;
		else u.songsPlayed += 1;
		await u.save().catch(e => client.log(e));
	});

	users.findOne({ authorID: requester.id }).then(async messageUser => {
		if (!messageUser) {
			const newUser = new users({
				authorID: requester.id,
				authorName: requester.tag,
				bio: '',
				songsPlayed: 1,
				commandsUsed: 0,
				blocked: false,
				premium: false,
				pro: false,
				developer: false,
			});
			await newUser.save().catch(e => this.client.log(e));
		}
		else {
			messageUser.songsPlayed += 1;
			await messageUser.save().catch(e => console.error(e));
		}
	});

	const embed = new Discord.MessageEmbed()
		.setAuthor(author);
	if (uri.includes('soundcloud')) {
		embed.attachFiles(['./src/assets/soundcloud.png']);
		embed.setThumbnail('attachment://soundcloud.png');
		embed.setFooter('SoundCloud');
		embed.setColor(client.colors.soundcloud);
	}
	else if (uri.includes('bandcamp')) {
		embed.attachFiles(['./src/assets/bandcamp.png']);
		embed.setThumbnail('attachment://bandcamp.png');
		embed.setFooter('Source: bandcamp');
		embed.setColor(client.colors.bandcamp);
	}
	else if (uri.includes('beam.pro')) {
		embed.attachFiles(['./src/assets/mixer.png']);
		embed.setThumbnail('attachment://mixer.png');
		embed.setFooter('Source: Mixer');
		embed.setColor(client.colors.mixer);
	}
	else if (uri.includes('twitch')) {
		embed.attachFiles(['./src/assets/twitch.png']);
		embed.setThumbnail('attachment://twitch.png');
		embed.setFooter('Source: Twitch');
		embed.setColor(client.colors.twitch);
	}
	else if (uri.includes('youtube')) {
		embed.setThumbnail(thumbnail);
		embed.setFooter('Source: Youtube');
		embed.setColor(client.colors.youtube);
	}
	else {
		embed.setColor(client.colors.main);
		embed.setFooter('Source: Other');
	}

	if (duration.toString().length > 10) { embed.addField('Duration', '∞', true); }
	else { embed.addField('Duration', `${Utils.formatTime(duration, true)}`, true); }

	embed.setDescription(`**[${title}](${uri})**`);
	embed.addField('Requested by', requester, true);
	embed.setTimestamp();
	textChannel.send(embed);
};

function addDB(id, title, author, duration, url, thumbnail) {
	let songType = '';
	if (url.includes('youtube')) songType = 'youtube';
	else if (url.includes('soundcloud')) songType = 'soundcloud';
	else if (url.includes('bandcamp')) songType = 'bandcamp';
	else if (url.includes('mixer')) songType = 'mixer';
	else if (url.includes('twitch')) songType = 'twitch';
	else songType = 'other';

	songs.findOne({
		songID: id,
	}, async (err, s) => {
		if (err) console.log(err);
		if (!s) {
			const newSong = new songs({
				songID: id,
				songName: title,
				songAuthor: author,
				type: songType,
				songDuration: duration,
				timesPlayed: 1,
				timesAdded: 0,
				songThumbnail: thumbnail,
			});
			await newSong.save().catch(e => console.log(e));
		}
		else {
			s.timesPlayed += 1;
			await s.save().catch(e => console.log(e));
		}
	});
}