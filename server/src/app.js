import express from "express";
import cors from 'cors';
import cookieParser from "cookie-parser";
import userRouter from "./routes/userRoutes.js";
import foodRouter from "./routes/foodRoutes.js";
import transportRouter from "./routes/transportRoutes.js";

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
export { app };
