const mongoose = require('mongoose')
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

module.exports = mongoose.model("Schedule", ScheduleSchema);