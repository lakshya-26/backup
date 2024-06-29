import { Food } from "../models/food.models.js";
import { FoodItem } from "../models/food.js";
import DailyFootprint from '../models/dailyFootprint.models.js';
import asyncHandler from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";


const addFoodLog = asyncHandler(async (req, res) => {
    const { meal, foods } = req.body;
    const userId = req.user._id;

    const carbonFootprint = foods.reduce((total, food) => total + food.co2 * food.quantity, 0);

    const foodLog = new Food({
        userId,
        meal,
        foods,
        carbonFootprint
    });

    await foodLog.save();

    res.status(201).json(new ApiResponse(201, foodLog, "Food log added successfully"));
});


const getFoodLogs = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const foodLogs = await Food.find({ userId }).sort({ date: -1 });

    res.status(200).json(new ApiResponse(200, foodLogs, "Food logs retrieved successfully"));
});


const getAllFoodItems = asyncHandler(async (req, res) => {
    const foodItems = await FoodItem.find({});

    res.status(200).json(new ApiResponse(200, foodItems, "Food items retrieved successfully"));
});


const addFoodItem = asyncHandler(async (req, res) => {
    const { name, co2 } = req.body;

    const foodItem = new FoodItem({
        name,
        co2, 
        serving
    });

    await foodItem.save();

    res.status(201).json(new ApiResponse(201, foodItem, "Food item added successfully"));
});

const saveDailyFootprint = asyncHandler(async (req, res) => {
    const { userId, date, totalCarbonFootprint } = req.body;

    const dailyFootprint = new DailyFootprint({
        userId,
        date,
        totalCarbonFootprint,
    });

    await dailyFootprint.save();

    res.status(201).json(new ApiResponse(201, dailyFootprint, "Daily footprint saved successfully"));
});

const getDailyFootprints = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const dailyFootprints = await DailyFootprint.find({ userId }).sort({ date: -1 });

    res.status(200).json(new ApiResponse(200, dailyFootprints, "Daily footprints retrieved successfully"));
});


export { addFoodLog, getFoodLogs, getAllFoodItems, addFoodItem, saveDailyFootprint, getDailyFootprints };
