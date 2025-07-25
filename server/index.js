import express from "express";
import authRouter from "./routes/auth.route.js";
import messageRouter from "./routes/message.route.js";
import dotenv from "dotenv";
import { connectDB } from "./lib/db.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import requestRouter from "./routes/friend.route.js";
import { app, server } from "./socket.js";

dotenv.config();
const port = process.env.PORT;

app.use(express.json({ limit: "10mb" }));
app.use(cookieParser());
app.use(
    cors({
        origin: [process.env.FRONTEND_URL],
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        credentials: true,
    })
);

app.use("/api/auth", authRouter);
app.use("/api/message", messageRouter);
app.use("/api/request", requestRouter);

const startServer = async () => {
    try {
        await connectDB();
        server.listen(port, () => {
            console.log(process.env.FRONTEND_URL);
            console.log(`Server running on port ${port}`);
        });
    } catch (error) {
        console.error("Error starting server:", error);
        process.exit(1);
    }
};

await startServer();
