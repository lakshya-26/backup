import express from "express";
import cors from 'cors';
import cookieParser from "cookie-parser";
import userRouter from "./routes/userRoutes.js";
import foodRouter from "./routes/foodRoutes.js";
import transportRouter from "./routes/transportRoutes.js";
import energyRouter from "./routes/energyRoutes.js"

const app = express();

app.use(cors());
app.use(express.json({
    limit: "24kb"
}));
app.use(express.urlencoded({
    extended: true,
    limit: "24kb"
}));
app.use(express.static("public"));
app.use(cookieParser());

app.use("/api/v1/users", userRouter);
app.use("/api/v1/food", foodRouter);
app.use("/api/v1/transport", transportRouter);
app.use("/api/v1/energy", energyRouter);
export { app };
