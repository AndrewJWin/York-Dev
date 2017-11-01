const Command = require('../../base/Command.js');
const { RichEmbed } = require('discord.js');
const snek = require('snekfetch');

class Mdn extends Command {
  constructor(client) {
    super(client, {
      name: 'mdn',
      description: 'Latency and API response times.',
      usage: 'mdn <search term>',
      extended: 'This command is a response test, it helps gauge if there is any latency (lag) in either the bots connection, or the API.',
      botPerms: ['SEND_MESSAGES']
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars
    const query = args.join('-');
    try {
      const { body } = await snek
        .get('https://developer.mozilla.org/en-US/search.json')
        .query({ q: query });
      if (!body.documents.length) throw 'Could not find any results.';
      const data = body.documents[0];
      const embed = new RichEmbed()
        .setColor(0x066FAD)
        .setAuthor('MDN', 'https://i.imgur.com/DFGXabG.png')
        .setURL(data.url)
        .setTitle(data.title)
        .setDescription(data.excerpt);
      return message.channel.send(embed);
    } catch (err) {
      return message.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
    }  }
}

module.exports = Mdn;