import { Router } from "express";
import { addFoodLog, getFoodLogs, getAllFoodItems, addFoodItem } from "../controllers/food.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.post('/log', verifyJWT, addFoodLog);
router.get('/logs', verifyJWT, getFoodLogs);

router.get('/items', getAllFoodItems);

router.post('/item', addFoodItem);

export default router;
