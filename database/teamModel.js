const mongoose = require('mongoose')
const TeamSchema = mongoose.Schema({
    MT: { type: String, required: true },
    ST: { type: String, required: true },
    H1: { type: String, required: true },
    H2: { type: String, required: true },
    D1: { type: String, required: true },
    D2: { type: String, required: true },
    D3: { type: String, required: true },
    D4: { type: String, required: true },
});

module.exports = mongoose.model("Team", TeamSchema);