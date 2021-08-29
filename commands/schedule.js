const Schedule = require('../database/scheduleModel.js')
const Team = require('../database/teamModel.js')


const addReactions = (message, reactions) => {
    reactions.forEach((reaction) => {
        setTimeout(() => {
            message.react(reaction)
        }, 550);
    })
}

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

module.exports = {
    name: 'schedule',
    description: 'this is a week schedule command',
    async execute(message, args, Discord) {
        if (!args[1]) msg.channel.send('add date please')
        else {

            await Schedule.findOne({ date: args[1] }, async function (err, schedule) {
                if (!schedule) {
                    let e = new Schedule({
                        date: args[1]
                    })
                    e.save();
                    embed = await createNewEmbed(e, Discord)
                }
                else {
                    embed = await createNewEmbed(schedule, Discord, args[1])
                }
                message.channel.send(embed).then((message) => {
                    addReactions(message, weekReaction);
                    const filter = (reaction, user) => {
                        return (!user.bot) && (weekReaction.includes(reaction.emoji.name));
                    }
                    const collector = message.createReactionCollector(filter, { dispose: true });
                    collector.on('collect', (reaction, user) => scheduleCollector(reaction, user, args[1], message, Discord));
                    collector.on('remove', (reaction, user) => scheduleRemove(reaction, user, args[1], message, Discord))
                })

            })

        }
    }

}