const Discord = require('discord.js');
require('dotenv').config();
const bot = new Discord.Client();
const mongoose = require('mongoose');
const db = mongoose.connection;
const prefix = process.env.PREFIX;
const fs = require('fs');
bot.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands/').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const command = require(`./commands/${file}`)
    bot.commands.set(command.name, command);
}

mongoose.connect(process.env.MONGODB_KEY)
db.on('error', console.error.bind(console, "Connection error:"));
db.once("open", function () {
    console.log("Connection is open...");
});

const Guide = require('./database/guideModel.js')
const Schedule = require('./database/scheduleModel.js')

/* const GuideSchema = mongoose.Schema({
    raid: { type: String, required: true, unique: true },
    guide: { type: String, required: true }
});

const ScheduleSchema = mongoose.Schema({
    date: { type: String, required: true, unique: true },
    monday: [{ type: String }],
    tuesday: [{ type: String }],
    wednesday: [{ type: String }],
    thursday: [{ type: String }],
    friday: [{ type: String }],
    saturday: [{ type: String }],
    sunday: [{ type: String }]
})

const Guide = mongoose.model("Guide", GuideSchema);
const Schedule = mongoose.model("Schedule", ScheduleSchema); */


bot.on('ready', () => {
    console.log("ffxiv bot is online")
})

bot.on('message', async (msg) => {
    if (!msg.content.startsWith(prefix) || msg.author.bot) return;

    const args = msg.content.slice(prefix.length).split(/ +/);

    switch (args[0]) {
        case 'save':
            bot.commands.get('save').execute(msg, args);
            break;
        case 'guide':
            bot.commands.get('guide').execute(msg, args);
            break;
        case 'guideList':
            bot.commands.get('guideList').execute(msg, args, Discord);
            break;
        case 'update':
            bot.commands.get('update').execute(msg, args);
            break;
        case 'delete':
            break;
        case 'drop':
            break;
        case 'schedule':
            bot.commands.get('schedule').execute(msg, args, Discord);
            break;
    }
})

/* 
//helper functions
const addReactions = (message, reactions) => {
    reactions.forEach((reaction) => {
        setTimeout(() => {
            message.react(reaction)
        }, 550);
    })
}

const weekReaction = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣'];

const schedule = async (message, args, Discord) => {
    let embed = new Discord.MessageEmbed()
        .setColor('#304281')
        .setTitle('WeekSchedule')
        .addFields(
            { name: 'Monday 0 people', value: '\u200b' },
            { name: 'Tuesday 0 people', value: '\u200b' },
            { name: 'Wednesday 0 people', value: '\u200b' },
            { name: 'Thursday 0 people', value: '\u200b' },
            { name: 'Friday 0 people', value: '\u200b' },
            { name: 'Saturday 0 people', value: '\u200b' },
            { name: 'Sunday 0 people', value: '\u200b' },
        );

    await Schedule.findOne({ date: args[1] }, function (err, schedule) {
        if (!schedule) {
            let e = new Schedule({
                date: args[1]
            })
            e.save();
        }
        else {
            embed = new Discord.MessageEmbed()
                .setColor('#304281')
                .setTitle('WeekSchedule')
                .addFields(
                    { name: 'Monday ' + schedule.monday.length + " people", value: '\u200b' + schedule.monday },
                    { name: 'Tuesday ' + schedule.tuesday.length + " people", value: '\u200b' + schedule.tuesday },
                    { name: 'Wednesday ' + schedule.wednesday.length + " people", value: '\u200b' + schedule.wednesday },
                    { name: 'Thursday ' + schedule.thursday.length + " people", value: '\u200b' + schedule.thursday },
                    { name: 'Friday ' + schedule.friday.length + " people", value: '\u200b' + schedule.friday },
                    { name: 'Saturday ' + schedule.saturday.length + " people", value: '\u200b' + schedule.saturday },
                    { name: 'Sunday ' + schedule.sunday.length + " people", value: '\u200b' + schedule.sunday },
                );

        }
        message.channel.send(embed).then((message) => {
            addReactions(message, weekReaction);
            const filter = (reaction, user) => {
                return (!user.bot) && (weekReaction.includes(reaction.emoji.name));
            }
            const collector = message.createReactionCollector(filter, { dispose: true });
            collector.on('collect', (reaction, user) => scheduleCollector(reaction, user, args[1], message));
            collector.on('remove', (reaction, user) => scheduleRemove(reaction, user, args[1], message))
        })

    })



}

const scheduleCollector = async (reaction, user, date, msg) => {
    await Schedule.findOne({ date: date }, function (err, schedule) {
        if (err) {
            msg.chaneel.send('error')
        }
        if (schedule) {
            if (reaction.emoji.name == '1️⃣') {
                schedule.monday.push("<@" + user.id + ">")
            }
            if (reaction.emoji.name == '2️⃣') {
                schedule.tuesday.push("<@" + user.id + ">")
            }
            if (reaction.emoji.name == '3️⃣') {
                schedule.wednesday.push("<@" + user.id + ">")
            }
            if (reaction.emoji.name == '4️⃣') {
                schedule.thursday.push("<@" + user.id + ">")
            }
            if (reaction.emoji.name == '5️⃣') {
                schedule.friday.push("<@" + user.id + ">")
            }
            if (reaction.emoji.name == '6️⃣') {
                schedule.saturday.push("<@" + user.id + ">")
            }
            if (reaction.emoji.name == '7️⃣') {
                schedule.sunday.push("<@" + user.id + ">")
            }
            schedule.save()
            const newEmbed = new Discord.MessageEmbed()
                .setColor('#304281')
                .setTitle('WeekSchedule')
                .addFields(
                    { name: 'Monday ' + schedule.monday.length + " people", value: '\u200b' + schedule.monday },
                    { name: 'Tuesday ' + schedule.tuesday.length + " people", value: '\u200b' + schedule.tuesday },
                    { name: 'Wednesday ' + schedule.wednesday.length + " people", value: '\u200b' + schedule.wednesday },
                    { name: 'Thursday ' + schedule.thursday.length + " people", value: '\u200b' + schedule.thursday },
                    { name: 'Friday ' + schedule.friday.length + " people", value: '\u200b' + schedule.friday },
                    { name: 'Saturday ' + schedule.saturday.length + " people", value: '\u200b' + schedule.saturday },
                    { name: 'Sunday ' + schedule.sunday.length + " people", value: '\u200b' + schedule.sunday },
                );
            msg.edit(newEmbed)
        }
    })

}

const scheduleRemove = async (reaction, user, date, msg) => {
    await Schedule.findOne({ date: date }, function (err, schedule) {
        if (err) {
            msg.chaneel.send('error')
        }
        if (schedule) {
            if (reaction.emoji.name == '1️⃣') {
                schedule.monday = schedule.monday.filter(reactedUser => reactedUser != "<@" + user.id + ">")
            }
            if (reaction.emoji.name == '2️⃣') {
                schedule.tuesday = schedule.tuesday.filter(reactedUser => reactedUser != "<@" + user.id + ">")
            }
            if (reaction.emoji.name == '3️⃣') {
                schedule.wednesday = schedule.wednesday.filter(reactedUser => reactedUser != "<@" + user.id + ">")
            }
            if (reaction.emoji.name == '4️⃣') {
                schedule.thursday = schedule.thursday.filter(reactedUser => reactedUser != "<@" + user.id + ">")
            }
            if (reaction.emoji.name == '5️⃣') {
                schedule.friday = schedule.friday.filter(reactedUser => reactedUser != "<@" + user.id + ">")
            }
            if (reaction.emoji.name == '6️⃣') {
                schedule.saturday = schedule.saturday.filter(reactedUser => reactedUser != "<@" + user.id + ">")
            }
            if (reaction.emoji.name == '7️⃣') {
                schedule.sunday = schedule.sunday.filter(reactedUser => reactedUser != "<@" + user.id + ">")
            }
            schedule.save()
            const newEmbed = new Discord.MessageEmbed()
                .setColor('#304281')
                .setTitle('WeekSchedule')
                .addFields(
                    { name: 'Monday ' + schedule.monday.length + " people", value: '\u200b' + schedule.monday },
                    { name: 'Tuesday ' + schedule.tuesday.length + " people", value: '\u200b' + schedule.tuesday },
                    { name: 'Wednesday ' + schedule.wednesday.length + " people", value: '\u200b' + schedule.wednesday },
                    { name: 'Thursday ' + schedule.thursday.length + " people", value: '\u200b' + schedule.thursday },
                    { name: 'Friday ' + schedule.friday.length + " people", value: '\u200b' + schedule.friday },
                    { name: 'Saturday ' + schedule.saturday.length + " people", value: '\u200b' + schedule.saturday },
                    { name: 'Sunday ' + schedule.sunday.length + " people", value: '\u200b' + schedule.sunday },
                );
            msg.edit(newEmbed)
        }
    })

} */


bot.login(process.env.TOKEN);