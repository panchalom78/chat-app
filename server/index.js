import express from "express";
import authRouter from "./routes/auth.route.js";
import messageRouter from "./routes/message.route.js";
import dotenv from "dotenv";
import { connectDB } from "./lib/db.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import requestRouter from "./routes/friend.route.js";
import { app, server } from "./lib/socket.js";

dotenv.config();
const port = process.env.PORT;

app.use(express.json());
app.use(cookieParser());
app.use(
    cors({
        origin: "*",
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        credentials: true,
    })
);

app.use("/api/auth", authRouter);
app.use("/api/message", messageRouter);
app.use("/api/request", requestRouter);

server.listen(port, () => {
    console.log(`Server running on port ${port}`);
    connectDB();
});
