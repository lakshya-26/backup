import { Router } from "express";
import {getEnergyData, logEnergyData} from "../controllers/energy.controller.js"
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.get('/getEnergyData', verifyJWT, getEnergyData);
router.post('/logEnergyData', verifyJWT, logEnergyData);

export default router;