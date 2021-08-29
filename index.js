const Discord = require('discord.js');
require('dotenv').config();
const bot = new Discord.Client({ partials: Object.values(Discord.Constants.PartialTypes) });
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
const Team = require('./database/teamModel.js')


bot.on('ready', async () => {
    console.log("ffxiv bot is online");
    //fetch the last week schedule to continue the function after bot restart
    //test channel: 865911002566754307
    //real channel: 866636222113513482
    let channel = await bot.channels.fetch('866636222113513482')
    await channel.messages.fetch({ limit: 1 }).then(message => {
        let lastMessage = message.first();
        const filter = (reaction, user) => {
            return (!user.bot) && (weekReaction.includes(reaction.emoji.name));
        }
        const collector = lastMessage.createReactionCollector(filter, { dispose: true });
        const date = lastMessage.embeds[0].title.split(' ')[1]
        collector.on('collect', (reaction, user) => scheduleCollector(reaction, user, date, lastMessage, Discord));
        collector.on('remove', (reaction, user) => scheduleRemove(reaction, user, date, lastMessage, Discord))

    })
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
bot.on('messageReactionAdd', async(reaction, user)=>{
    if (reaction.message.partial) await reaction.message.fetch();
    let message = reaction.message
    if(reaction.message.channel.id === "865911002566754307"){
        const filter = (reaction, user) => {
            return (!user.bot) && (weekReaction.includes(reaction.emoji.name));
        }
        const collector = message.createReactionCollector(filter, { dispose: true });
        collector.on('collect', (reaction, user) => scheduleCollector(reaction, user, args[1], message, Discord));
        collector.on('remove', (reaction, user) => scheduleRemove(reaction, user, args[1], message, Discord))
    }
})

bot.on('messageReactionRemove', async (reaction, user) => {
    if (reaction.message.partial) await reaction.message.fetch();
    if (user.partial) await user.fetch();

});
*/


bot.login(process.env.TOKEN);

//helper function
const weekReaction = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣'];

const missRole = (schedule) => {
    //create promise if Mongoose query includes callback for async
    return new Promise((resolve, reject) => {
        Team.findOne({ }, function (err, team) {
            let missArray = []
            let role = [[], [], [], [], [], [], []]
            if (err) {
                msg.chaneel.send('error')
            }
            let teamArray = [team.MT, team.ST, team.H1, team.H2, team.D1, team.D2, team.D3, team.D4];
            let teamObject = {
                MT: team.MT,
                ST: team.ST,
                H1: team.H1,
                H2: team.H2,
                D1: team.D1,
                D2: team.D2,
                D3: team.D3,
                D4: team.D4
            }
            missArray.push(teamArray.filter(role => !schedule.monday.includes(role)))
            missArray.push(teamArray.filter(role => !schedule.tuesday.includes(role)))
            missArray.push(teamArray.filter(role => !schedule.wednesday.includes(role)))
            missArray.push(teamArray.filter(role => !schedule.thursday.includes(role)))
            missArray.push(teamArray.filter(role => !schedule.friday.includes(role)))
            missArray.push(teamArray.filter(role => !schedule.saturday.includes(role)))
            missArray.push(teamArray.filter(role => !schedule.sunday.includes(role)))
            console.log("miss array: " + missArray)
            missArray.forEach((day, index) => day.forEach((teammate) => role[index].push(Object.keys(teamObject).find(key => teamObject[key] === teammate))))
            console.log("miss role: " + role)
            resolve(role)
        })
    })
}

const createNewEmbed = async (schedule, Discord, date) => {
    let missArray = await missRole(schedule);
    console.log("test await: " + missArray)
    const newEmbed = new Discord.MessageEmbed()
        .setColor('#304281')
        .setTitle('weekschedule ' + date)
        .addFields(
            { name: 'Monday ' + schedule.monday.length + " people  miss: " + missArray[0], value: '\u200b' + schedule.monday },
            { name: 'Tuesday ' + schedule.tuesday.length + " people  miss: " + missArray[1], value: '\u200b' + schedule.tuesday },
            { name: 'Wednesday ' + schedule.wednesday.length + " people  miss: " + missArray[2], value: '\u200b' + schedule.wednesday },
            { name: 'Thursday ' + schedule.thursday.length + " people  miss: " + missArray[3], value: '\u200b' + schedule.thursday },
            { name: 'Friday ' + schedule.friday.length + " people  miss: " + missArray[4], value: '\u200b' + schedule.friday },
            { name: 'Saturday ' + schedule.saturday.length + " people  miss: " + missArray[5], value: '\u200b' + schedule.saturday },
            { name: 'Sunday ' + schedule.sunday.length + " people  miss: " + missArray[6], value: '\u200b' + schedule.sunday },
        );
    return newEmbed;
}


const scheduleCollector = async (reaction, user, date, msg, Discord) => {
    await Schedule.findOne({ date: date }, async function (err, schedule) {
        if (err) {
            msg.chaneel.send('error')
        }
        if (schedule) {
            if (reaction.emoji.name == '1️⃣') {
                if (!schedule.monday.includes("<@" + user.id + ">")) schedule.monday.push("<@" + user.id + ">")
            }
            if (reaction.emoji.name == '2️⃣') {
                if (!schedule.tuesday.includes("<@" + user.id + ">")) schedule.tuesday.push("<@" + user.id + ">")
            }
            if (reaction.emoji.name == '3️⃣') {
                if (!schedule.wednesday.includes("<@" + user.id + ">")) schedule.wednesday.push("<@" + user.id + ">")
            }
            if (reaction.emoji.name == '4️⃣') {
                if (!schedule.thursday.includes("<@" + user.id + ">")) schedule.thursday.push("<@" + user.id + ">")
            }
            if (reaction.emoji.name == '5️⃣') {
                if (!schedule.friday.includes("<@" + user.id + ">")) schedule.friday.push("<@" + user.id + ">")
            }
            if (reaction.emoji.name == '6️⃣') {
                if (!schedule.saturday.includes("<@" + user.id + ">")) schedule.saturday.push("<@" + user.id + ">")
            }
            if (reaction.emoji.name == '7️⃣') {
                if (!schedule.sunday.includes("<@" + user.id + ">")) schedule.sunday.push("<@" + user.id + ">")
            }
            schedule.save()
            const newEmbed = await createNewEmbed(schedule, Discord, date)
            msg.edit(newEmbed)
        }
    })

}

const scheduleRemove = async (reaction, user, date, msg, Discord) => {
    await Schedule.findOne({ date: date }, async function (err, schedule) {
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
            const newEmbed = await createNewEmbed(schedule, Discord, date)
            msg.edit(newEmbed)
        }
    })
}
