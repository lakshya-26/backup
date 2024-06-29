import mongoose, { Schema } from "mongoose";

const foodItemSchema = new Schema({
    name: { type: String, required: true },
    quantity: { type: Number, required: true },
    co2: { type: Number, required: true }
});

const foodSchema = new Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    meal: { type: String, required: true },
    foods: [foodItemSchema],
    carbonFootprint: { type: Number, required: true },
    date: { type: Date, default: Date.now }
});

const Food = mongoose.model('Food', foodSchema);

export { Food };
