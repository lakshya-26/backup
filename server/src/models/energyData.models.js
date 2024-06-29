const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const EnergyDataSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
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
