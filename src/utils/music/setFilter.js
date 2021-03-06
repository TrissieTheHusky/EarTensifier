const Discord = require('discord.js');

module.exports = async (client, message, filter, state) => {
    const delay = ms => new Promise(res => setTimeout(res, ms));

    const player = client.music.players.get(message.guild.id);

    if (!state) {
        player.setEQ(...Array(13).fill(0).map((n, i) => ({ band: i, gain: 0.15 })));
        const msg = await message.channel.send(`${client.emojiList.loading} Turning off **${filter}**. This may take a few seconds...`);
        const embed = new Discord.MessageEmbed()
            .setAuthor(`Turned off **${filter}**`)
            .setColor(client.colors.main);
        await delay(5000);
        return msg.edit('', embed);
    }
    else if (state) {
        switch (filter) {
            case 'bass':
                player.setEQ(...client.filters.bass);
                break;
            case 'soft':
                player.setEQ(...client.filters.soft);
                break;
            case 'pop':
                player.setEQ(...client.filters.pop);
                break;
            case 'treblebass':
                player.setEQ(...client.filters.treblebass);
                break;
            default:
        }

        const msg = await message.channel.send(`${client.emojiList.loading} Turning on **${filter}**. This may take a few seconds...`);
        const embed = new Discord.MessageEmbed()
            .setDescription(`Turned on **${filter}**`)
            .setColor(client.colors.main);
        await delay(5000);
        return msg.edit('', embed);
    }
};