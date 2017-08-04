exports.run = (client, message, args, level) => {
  if (!args[0]) {
    const settings = message.guild ? client.settings.get(message.guild.id) : client.config.defaultSettings;
    const myCommands = message.guild ? client.commands.filter(cmd => cmd.conf.permLevel <= level && cmd.conf.hidden !== true) : client.commands.filter(cmd => cmd.conf.permLevel <= level && cmd.conf.hidden !== true &&  cmd.conf.guildOnly !== true);
    const commandNames = myCommands.keyArray();
    const longest = commandNames.reduce((long, str) => Math.max(long, str.length), 0);
    let currentCategory = '';
    let output = `= Command List =\n\n[Use ${client.config.defaultSettings.prefix}help <commandname> for details]\n`;
    const sorted = myCommands.sort((p, c) => p.help.category > c.help.category ? 1 : -1);
    sorted.forEach( c => {
      const cat = c.help.category.toProperCase();
      if (currentCategory !== cat) {
        output += `\n== ${cat} ==\n`;
        currentCategory = cat;
      }
      output += `${settings.prefix}${c.help.name}${' '.repeat(longest - c.help.name.length)} :: ${c.help.description}\n`;
    });
    message.channel.send(output, {code:'asciidoc'});
  } else {
    let command = args[0];
    if (client.commands.has(command)) {
      command = client.commands.get(command);
      if (level < command.conf.permLevel) return;
      message.channel.send(`= ${command.help.name} = \n${command.help.description}\nusage:: ${command.help.usage}\nalises:: ${command.conf.aliases.join(', ')}\ndetails:: ${command.help.extended}`, {code:'asciidoc'});
    }
  }
};
exports.conf = {
  hidden: true,
  aliases: ['h', 'halp'],
  permLevel: 0
};

exports.help = {
  name: 'help',
  description: 'Displays all the available commands for your permission level.',
  usage: 'help [command]',
  category: 'Support',
  extended: 'This command will display all available commands for your permission level, with the additonal option of getting per command information when you run \`help <command name>\`.'
};
