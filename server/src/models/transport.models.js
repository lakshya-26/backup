import mongoose, { Schema } from "mongoose";

const transportSchema = new Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    mode: { type: String, required: true },
    model: { type: String },
    mileage: { type: Number },
    startLocation: {
        latitude: { type: Number, required: true },
        longitude: { type: Number, required: true }
    },
    endLocation: {
        latitude: { type: Number },
        longitude: { type: Number }
    },
    distance: { type: Number },
    fuelConsumed: { type: Number },
    carbonFootprint: { type: Number },
    startTime: { type: Date, default: Date.now },
    endTime: { type: Date }
}, {
    timestamps: true
});

const Transport = mongoose.model('Transport', transportSchema);

export { Transport };
