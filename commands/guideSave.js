const Guide = require('../database/guideModel.js')

module.exports = {
    name: 'save',
    description: 'this is a guide saving command',
    execute(message, args) {
        if (!args[2]) {
            message.channel.send('wrong format')
        }
        else {
            Guide.findOne({ raid: args[1] }, function (err, guide) {
                if (err) {
                    message.chaneel.send('error')
                }
                if (guide) {
                    for (let i = 2; i < args.length; i++) {
                        guide.guide[guide.guide.length + (i - 2)] = args[i]
                    }
                    guide.save(function (err) {
                        if (err) message.channel.send('save eror')
                        else message.channel.send('save successfully')
                    })
                }
                else {
                    let e = new Guide({
                        raid: args[1],
                        guide: args[2]
                    })
                    e.save(function (err) {
                        if (err) message.channel.send('save eror')
                        else message.channel.send('save successfully')
                    })
                }
            })
        }
    }
}