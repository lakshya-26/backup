import mongoose, { Schema } from "mongoose";

const transportSchema = new Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    mode: { type: String, required: true },
    model: { type: String },
    mileage: { type: Number },
    distance: { type: Number, required: true },
    fuelConsumed: { type: Number },
    carbonFootprint: { type: Number },
    startTime: { type: Date, default: Date.now },
    endTime: { type: Date }
});

const Transport = mongoose.model('Transport', transportSchema);

export { Transport };
