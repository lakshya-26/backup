// models/Waste.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const wasteSchema = new Schema({
    date: { type: Date, default: Date.now },
    organic: { type: Number, required: true },
    plastic: { type: Number, required: true },
    paper: { type: Number, required: true },
    metal: { type: Number, required: true },
    glass: { type: Number, required: true },
    carbonFootprint: { type: Number, required: true } // New field for carbon footprint
});

const Waste = mongoose.model('Waste', wasteSchema);

module.exports = Waste;
