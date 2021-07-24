const Guide = require('../database/guideModel.js')


module.exports = {
    name: 'guideList',
    description: 'this is a guide list displaying command',
    execute(message, args, Discord) {
        Guide.find({}, function (err, guides) {
            if (err) {
                message.channel.send('error')
            }
            if (guides) {
                let guideMap = [];
                guides.forEach((guide) => {
                    guideMap.push(guide.raid)
                })
                const newEmbed = new Discord.MessageEmbed()
                    .setColor('#304281')
                    .setTitle('Guide List');
                guideMap.forEach((guide, index) => newEmbed.addField(index + 1, guide))
                message.channel.send(newEmbed).then(async () => {
                    const filter = (user) => { return user.author.id === message.author.id }
                    try {
                        let collected = await message.channel.awaitMessages(filter, { max: 1, time: 15000, errors: ['time'] });
                        let choice = collected.first().content;
                        message.channel.send(guides[choice - 1].guide);
                    }
                    catch (e) {
                        return message.channel.send('no guide');
                    };
                });
            }
            else message.channel.send('no guide')
        })
    }
}