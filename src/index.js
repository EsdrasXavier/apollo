require('dotenv/config');
const Discord = require("discord.js");
const client = new Discord.Client();
const { messageHandler } = require('./client');

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', messageHandler);

client.login(process.env.BOT_TOKEN);