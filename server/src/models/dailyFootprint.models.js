import mongoose, { Schema } from 'mongoose';

const dailyFootprintSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    date: {
        type: Date,
        required: true,
        unique: true,
        index: true
    },
    totalCarbonFootprint: {
        type: Number,
        required: true
    }
}, {
    timestamps: true
});

const DailyFootprint = mongoose.model('DailyFootprint', dailyFootprintSchema);

export default DailyFootprint;
