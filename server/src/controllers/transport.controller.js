import { Transport } from "../models/transport.models.js";
import asyncHandler from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

const calculateDistance = (start, end) => {
    const R = 6371; // Radius of the Earth in km
    const dLat = (end.latitude - start.latitude) * (Math.PI / 180);
    const dLon = (end.longitude - start.longitude) * (Math.PI / 180);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(start.latitude * (Math.PI / 180)) * Math.cos(end.latitude * (Math.PI / 180)) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
};

const startTracking = asyncHandler(async (req, res) => {
    const { mode, model, mileage, startLocation } = req.body;
    const userId = req.user._id;

    if (!mode || !startLocation) {
        throw new ApiError(400, "Mode and start location are required");
    }

    const trip = new Transport({
        userId,
        mode,
        model,
        mileage,
        startLocation
    });

    await trip.save();

    res.status(201).json(new ApiResponse(201, { tripId: trip._id }, "Trip started successfully"));
});

const endTracking = asyncHandler(async (req, res) => {
    const { tripId, endLocation } = req.body;

    if (!tripId || !endLocation) {
        throw new ApiError(400, "Trip ID and end location are required");
    }

    const trip = await Transport.findById(tripId);

    if (!trip) {
        throw new ApiError(404, "Trip not found");
    }

    trip.endLocation = endLocation;
    trip.distance = calculateDistance(trip.startLocation, trip.endLocation);

    if (trip.mode === 'car' || trip.mode === 'bike') {
        const mileage = parseFloat(trip.mileage);
        if (!isNaN(mileage) && mileage > 0) {
            trip.fuelConsumed = trip.distance / mileage;
            trip.carbonFootprint = trip.fuelConsumed * 2.31; // Assuming 2.31 kg CO2 per liter of gasoline
        } else {
            throw new ApiError(400, "Invalid mileage provided");
        }
    } else {
        trip.fuelConsumed = 0;
        trip.carbonFootprint = 0;
    }

    await trip.save();

    res.status(200).json(new ApiResponse(200, trip, "Trip ended successfully"));
});

const getAllTrips = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const trips = await Transport.find({ userId }).sort({ startTime: -1 });

    res.status(200).json(new ApiResponse(200, trips, "Trips retrieved successfully"));
});

export { startTracking, endTracking, getAllTrips };

