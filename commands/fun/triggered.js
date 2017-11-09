const Social = require('../../base/Social.js');
const Canvas = require('canvas');
const snek = require('snekfetch');
const { readFile } = require('fs-nextra');
const GIFEncoder = require('gifencoder');
const streamToArray = require('stream-to-array');


class Triggered extends Social {
  constructor(client) {
    super(client, {
      name: 'triggered',
      description: 'Trigger someone...',
      usage: 'triggered [@mention|userid]',
      category: 'Fun',
      extended: 'Ever get so pissed off you explode? You got triggered.',
      cost: 2,
      cooldown: 30,
      aliases: ['trigger'],
      botPerms: ['ATTACH_FILES']
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars 
    try {
      const target = await this.verifyUser(args[0] ? args[0] : message.author.id);
      const cost = this.cmdDis(this.help.cost, level);
      const payMe = await this.cmdPay(message, message.author.id, cost, this.conf.botPerms);
      if (!payMe) return;

      const msg = await message.channel.send(`Triggering...${target.tag}`);

      const attachment = await this.getTriggered(target.displayAvatarURL.replace(/\.(gif|jpg|png|jpeg)\?size=2048/g, '.png?size=512'));
      await message.channel.send({ files: [{ attachment, name: 'triggered.gif' }] });
      await msg.delete();
    } catch (error) {
      throw error;
    }
  }
  
  async getTriggered(triggered) {
    
    const imgTitle = new Canvas.Image();
    const imgTriggered = new Canvas.Image();
    const encoder = new GIFEncoder(256, 256);
    const canvas = new Canvas.createCanvas(256, 256);
    const ctx = canvas.getContext('2d');
    
    imgTitle.src = await readFile('./assets/images/plate_triggered.png');
    imgTriggered.src = await snek.get(triggered).then(res => res.body);
    
    const stream = encoder.createReadStream();
    encoder.start();
    encoder.setRepeat(0);
    encoder.setDelay(50);
    encoder.setQuality(200);
    
    const coord1 = [-25, -33, -42, -14];
    const coord2 = [-25, -13, -34, -10];
    
    // await this.client.wait(60000);
    for (let i = 0; i < 4; i++) {
      ctx.drawImage(imgTriggered, coord1[i], coord2[i], 300, 300);
      ctx.fillStyle = 'rgba(255 , 100, 0, 0.4)';
      ctx.drawImage(imgTitle, 0, 218, 256, 38);
      ctx.fillRect(0, 0, 256, 256);
      encoder.addFrame(ctx);
    }
  
    encoder.finish();
    return streamToArray(stream).then(Buffer.concat);
  }

}
module.exports = Triggered;