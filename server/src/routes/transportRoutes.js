import { Router } from "express";
import { startTracking, endTracking, getAllTrips } from "../controllers/transport.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.post('/start-tracking', verifyJWT, startTracking);
router.post('/end-tracking', verifyJWT, endTracking);
router.get('/trips', verifyJWT, getAllTrips);

export default router;
