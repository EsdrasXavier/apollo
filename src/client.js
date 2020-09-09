const config = require("./config.json");

const handlers = {
  'play': async message => {
    if (message.member.voice.channel) {
      const connection = await message.member.voice.channel.join();
    } else {
      message.reply('You need to join a voice channel first!');
    }
  }
}

const messageHandler = msg => {
  const { content } = msg;
  if (content.startsWith(config.prefix)) {
    handlers[content.substring(1)](msg);
  }
}

module.exports = {
  messageHandler
}