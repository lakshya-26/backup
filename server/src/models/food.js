import mongoose, { Schema } from "mongoose";

const foodItemSchema = new Schema({
    name: { type: String, required: true },
    co2: { type: Number, required: true },
    serving: { type: String, required: true }
});

const FoodItem = mongoose.model('FoodItem', foodItemSchema);

export { FoodItem };
