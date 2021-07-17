const Discord = require('discord.js');
require('dotenv').config();
const bot = new Discord.Client();
const mongoose = require('mongoose');
const prefix = process.env.PREFIX;

bot.on('ready', () => {
    console.log("ffxiv bot is online")
})

bot.on('message', msg => {
    if (!msg.content.startsWith(prefix) || msg.author.bot) return;

    const args = msg.content.slice(prefix.length).split(/ +/);
    const command = args.shift().toLowerCase();

    if (command === 'hello') {
        msg.channel.send('hello!!');
    }
})

bot.login(process.env.TOKEN);