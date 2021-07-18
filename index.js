const Discord = require('discord.js');
require('dotenv').config();
const bot = new Discord.Client();
const mongoose = require('mongoose');
const db = mongoose.connection;
const prefix = process.env.PREFIX;

mongoose.connect(process.env.MONGODB_KEY)
db.on('error', console.error.bind(console, "Connection error:"));
db.once("open", function () {
    console.log("Connection is open...");
});

let GuideSchema = mongoose.Schema({
    raid: { type: String, required: true, unique: true },
    guide: { type: String, required: true }
});

let Guide = mongoose.model("Guide", GuideSchema);


bot.on('ready', () => {
    console.log("ffxiv bot is online")
})

bot.on('message', async (msg) => {
    if (!msg.content.startsWith(prefix) || msg.author.bot) return;

    const args = msg.content.slice(prefix.length).split(/ +/);

    switch (args[0]) {
        case 'save':
            if (!args[2]) {
                msg.channel.send('wrong format')
            }
            else {
                Guide.findOne({ raid: args[1] }, function (err, guide) {
                    if (err) {
                        msg.chaneel.send('error')
                    }
                    if (guide) {
                        guide.guide += ' \n' + args[2]
                        guide.save(function (err) {
                            if (err) msg.channel.send('save eror')
                            else msg.channel.send('save successfully')
                        })
                    }
                    else {
                        let e = new Guide({
                            raid: args[1],
                            guide: args[2]
                        })
                        e.save(function (err) {
                            if (err) msg.channel.send('save eror')
                            else msg.channel.send('save successfully')
                        })
                    }
                })
            }
            break;
        case 'guide':
            Guide.findOne({ raid: args[1] }, function (err, guide) {
                if (err) {
                    msg.channel.send('error')
                }
                if (guide) {
                    msg.channel.send(guide.guide)
                }
                else msg.channel.send('no guide link')
            })
            break;
        case 'update':
            if (!args[2]) {
                msg.channel.send('wrong format')
            }
            else {
                Guide.findOne({ raid: args[1] }, function (err, guide) {
                    if (err) {
                        msg.chaneel.send('error')
                    }
                    if (guide) {
                        guide.guide = args[2]
                        guide.save(function (err) {
                            if (err) msg.channel.send('save eror')
                            else msg.channel.send('save successfully')
                        })
                    }
                    else {
                        let e = new Guide({
                            raid: args[1],
                            guide: args[2]
                        })
                        e.save(function (err) {
                            if (err) msg.channel.send('save eror')
                            else msg.channel.send('save successfully')
                        })
                    }
                })
            }
            break;
        case 'delete':
            break;
    }
})




bot.login(process.env.TOKEN);