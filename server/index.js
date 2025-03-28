import express from "express";
import authRouter from "./routes/auth.route.js";
import messageRouter from "./routes/message.route.js";
import dotenv from "dotenv";
import { connectDB } from "./lib/db.js";
import cookieParser from "cookie-parser";
import requestRouter from "./routes/friend.route.js";
import { app, server } from "./lib/socket.js";
import cors from "cors";

dotenv.config();
const port = process.env.PORT;

app.use(express.json());
app.use(cookieParser());
// app.use(
//     cors({
//         origin: [process.env.FRONTEND_URL],
//         methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
//         credentials: true,
//     })
// );

app.use(
    cors({
        origin: [
            process.env.FRONTEND_URL,
            "http://localhost:3000", // For local development
        ],
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
        credentials: true,
    })
);

// 2. Explicit OPTIONS handler for preflight requests
app.options("*", cors());
console.log(process.env.FRONTEND_URL);

const allowedOrigins = [
    process.env.FRONTEND_URL,
    // Add other environments if needed
    "http://localhost:5175", // for local development
];

app.use("/api/auth", authRouter);
app.use("/api/message", messageRouter);
app.use("/api/request", requestRouter);

const startServer = async () => {
    try {
        await connectDB();
        server.listen(port, () => {
            console.log(`Server running on port ${port}`);
        });
    } catch (error) {
        console.error("Error starting server:", error);
        process.exit(1);
    }
};

await startServer();
