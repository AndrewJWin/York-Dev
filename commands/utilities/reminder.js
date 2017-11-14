const Command = require('../../base/Command.js');
const ms = require('ms');
const moment = require('moment');

function regCheck(reminder) {
  const remind = /(?:^| )((?:\d{1,2}(?:\.\d|\d)?)|a) ?((?:m(?:in(?:ute)?)?|h(?:our)?|d(?:ay)?|w(?:eek)?|m(?:onth)?|y(?:ear)?)s?)\b/g.exec(reminder);
  if (!remind) return false;
  const time = remind[0]
    .replace(/ ms?\b/, ' min') //m => min
    .replace(/\ba ?((?:m(?:in(?:ute)?)?|h(?:our)?|d(?:ay)?|w(?:eek)?|m(?:onth)?|y(?:ear)?)s?)\b/g, '1 $1').trim(); // a "something" => 1 "something"
  const input = remind.input
    .replace(/\b(in|me|to)\b/g, '')
    .replace(remind[0], '').trim();
  if (input.length === 0) return false;
  return `${input}#${time}`;
}

class Reminder extends Command {
  constructor(client) {
    super(client, {
      name: 'reminder',
      description: 'Remind yourself with this command.',
      category: 'Utilities',
      usage: 'reminder [me] <reminder message>',
      extended: 'Need to be reminded to take the trash out? This command can help!',
      aliases: ['remember', 'remind'],
      botPerms: []
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars
    if (args.length === 0) {
      let reminders = this.client.reminders.findAll('id', message.author.id);
      if (reminders.length === 0) reminders = 'You do not have any reminders set.';
      message.channel.send('**Your Reminders:**\n' + reminders.map(r => `${r.reminder} - ${moment(r.reminderTimestamp).fromNow()}`).join('\n'));
      return;
    }
    const blah = await regCheck(args.join(' '));
    if (!blah) throw '|`❌`| Invalid Command usage, you must supply a reminder message and duration e.g; `Do the laundry in 20 minutes`.';
    this.client.reminders.set(`${message.author.id}-${message.createdTimestamp + ms(blah.split('#')[1])}`, {
      id: message.author.id,
      reminder: blah.split('#')[0],
      reminderTimestamp: message.createdTimestamp + ms(blah.split('#')[1])
    });

    message.channel.send(`I will remind you to \`${blah.split('#')[0]}\`, ${blah.split('#')[1]} from now.`);
  }
}

module.exports = Reminder;