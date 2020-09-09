const Discord = require("discord.js");
const config = require("./config.json");
const client = new Discord.Client();
const { messageHandler } = require('./client');

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', messageHandler);


client.login(config.BOT_TOKEN);