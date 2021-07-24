const Guide = require('../database/guideModel.js')


module.exports = {
    name: 'guide',
    description: 'this is a raid guid displaying command',
    execute(message, args) {
        Guide.findOne({ raid: args[1] }, function (err, guide) {
            if (err) {
                message.channel.send('error')
            }
            if (guide) {
                message.channel.send(guide.guide)
            }
            else message.channel.send('no guide link')
        })
    }
}