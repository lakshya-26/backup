const mongoose = require('mongoose');

const FoodSchema = new mongoose.Schema({
  name: { type: String, required: true },
  co2: { type: Number, required: true },
  serving: { type: String, required: true }
});

module.exports = mongoose.model('Food', FoodSchema);
