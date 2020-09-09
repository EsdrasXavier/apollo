require('dotenv/config');
const ytdl = require('ytdl-core');
const Queue = require('./Queue');
const PLAY = 'play';
const STOP = 'stop';
const NEXT = 'next';
const PREVIOUS = 'previous';

const guildsQueues = {};

const getCurrentQueue = (connection, message) => {
  let currentQueue = guildsQueues[message.guild.id];

  if (currentQueue == null) {
    currentQueue = new Queue(connection);
    guildsQueues[message.guild.id] = currentQueue;
  }

  return currentQueue;
}

const handlers = {
  [PLAY]: (message, args) => {
    const voiceChannel = message.member.voice.channel;

    if (!voiceChannel) {
      return message.reply('You need to join a voice channel first!');
    }

    const youtubeUrl = args[0];

    if (youtubeUrl === '') {
      return message.reply('You must provide an youtube link');
    }

    voiceChannel.join().then(connection => {
      let currentQueue = getCurrentQueue(connection, message);

      currentQueue.enqueue(youtubeUrl);

      if (!currentQueue.isRunning()) {
        currentQueue.next();
        play(connection, currentQueue);
      }
    });
  },
  [STOP]: message => {
    const voiceChannel = message.member.voice.channel;
    if (!voiceChannel) {
      return message.reply('You need to join a voice channel first!');
    }

    voiceChannel.join().then(connection => {
      connection.stop();
    });
  },
  [NEXT]: message => {
    const voiceChannel = message.member.voice.channel;

    if (!voiceChannel) {
      return message.reply('You need to join a voice channel first!');
    }

    voiceChannel.join().then(connection => {
      let currentQueue = getCurrentQueue(connection, message);

      if (currentQueue == null) {
        return;
      }

      if (currentQueue.next())
        play(connection, currentQueue);
    });
  },
  [PREVIOUS]: message => {
    const voiceChannel = message.member.voice.channel;

    if (!voiceChannel) {
      return message.reply('You need to join a voice channel first!');
    }

    voiceChannel.join().then(connection => {
      let currentQueue = getCurrentQueue(connection, message);

      if (currentQueue == null) {
        return;
      }

      if (currentQueue.previous())
        play(connection, currentQueue);
    });
  }
}

const play = (connection, currentQueue) => {
  const stream = ytdl(currentQueue.current(), { filter: 'audioonly' });
  const dispatcher = connection.play(stream);
  dispatcher.on('finish', () => {
    if (currentQueue.next() != null) {
      play(connection, currentQueue.current());
    }
  });
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