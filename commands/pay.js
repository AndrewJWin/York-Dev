const Social = require('../base/Social.js');

class Pay extends Social {
  constructor(client) {
    super(client, {
      name: 'pay',
      description: 'Pay another user your activity points.',
      usage: 'pay',
      category: 'Social',
      aliases: ['give', 'loan', 'donate']
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars
    try {
      const user = await this.verifyUser(args[0]);
      if (isNaN(args[1])) return message.channel.send('Not a valid amount');
      await this.donate(message, message.author.id, user, parseInt(args[1]));
      // message.channel.send(points);
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Pay;