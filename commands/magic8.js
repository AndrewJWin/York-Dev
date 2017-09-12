const answers = [ 'Maybe.', 'Certainly not.', 'I hope so.', 'Not in your wildest dreams.', 'There is a good chance.', 'Quite likely.', 'I think so.', 'I hope not.', 'I hope so.', 'Never!', 'Fuhgeddaboudit.', 'Ahaha! Really?!?', 'Pfft.', 'Sorry, bucko.', 'Hell, yes.', 'Hell to the no.', 'The future is bleak.', 'The future is uncertain.', 'I would rather not say.', 'Who cares?', 'Possibly.', 'Never, ever, ever.', 'There is a small chance.', 'Yes!' ];
const Social = require('../base/Social.js');

class Magic8 extends Social {
  constructor(client) {
    super(client, {
      name: 'magic8',
      description: 'Answers a question, magic 8 ball style.',
      usage: 'magic8 <question>?',
      category: 'Fun',
      extended: 'This Social will answer any question given to it in the style of a magic 8 ball.',
      cost: 5,
      guildOnly: true,
      aliases: ['8', '8ball']
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars
    try {
      if (level < 2) {
        const payMe = await this.pay(message, message.author.id, this.help.cost);
        if (!payMe) return;  
      }
      if (!message.content.endsWith('?')) return message.reply('That does not look like a question, (hint, end your question with a `?`.)');
      const msg = await message.channel.send('`Thinking...`');
      setTimeout( async () => {
        await msg.edit(`${answers[Math.floor(Math.random() * answers.length)]}`);
      }, Math.random() * (1 - 5) + 1 * 2000);
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Magic8;