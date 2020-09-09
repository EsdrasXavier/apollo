require('dotenv/config');
const ytdl = require('ytdl-core');
const PLAY = 'play';
const STOP = 'stop';

const handlers = {
  [PLAY]: async (message, args) => {
    if (message.channel.type === 'dm') return;

    const voiceChannel = message.member.voice.channel;

    if (!voiceChannel) {
      return message.reply('You need to join a voice channel first!');
    }

    const youtubeUrl = args[0];

    if (youtubeUrl === '') {
      return message.reply('You must provide an youtube link');
    }

    voiceChannel.join().then(connection => {
      const stream = ytdl(youtubeUrl, { filter: 'audioonly' });
      const dispatcher = connection.play(stream);

      // dispatcher.on('finish', () => voiceChannel.leave());
    });
  },
  [STOP]: message => {
    const voiceChannel = message.member.voice.channel;
    if (!voiceChannel) {
      return message.reply('You need to join a voice channel first!');
    }

    voiceChannel.leave();
  }
}

const messageHandler = msg => {
  if (!msg.content.startsWith(process.env.PREFIX) || msg.author.bot) return;
  if (msg.channel.type === 'dm') return;

  const args = msg.content.slice(process.env.PREFIX).trim().split(' ');
  const command = args.shift().toLowerCase();
  handlers[command.substring(1)](msg, args);
}

module.exports = {
  messageHandler
}