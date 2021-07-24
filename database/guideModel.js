const mongoose = require('mongoose')
const GuideSchema = mongoose.Schema({
    raid: { type: String, required: true, unique: true },
    guide: { type: String, required: true }
});

module.exports = mongoose.model("Guide", GuideSchema);