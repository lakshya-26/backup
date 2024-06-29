const mongoose = require('mongoose');

const EnergyDataSchema = new mongoose.Schema({
    month: {
        type: String,
        required: true,
    },
    year: {
        type: Number,
        required: true,
    },
    usage: {
        type: Number,
        required: true,
    },
    generated: {
        type: Number,
        required: true,
    },
    difference: {
        type: Number,
        default: 0,
    },
    date: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('EnergyData', EnergyDataSchema);
