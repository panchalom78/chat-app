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
// app.use(
//     cors({
//         origin: [process.env.FRONTEND_URL],
//         methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
//         credentials: true,
//     })
// );

console.log(process.env.FRONTEND_URL);

const allowedOrigins = [
    process.env.FRONTEND_URL,
    // Add other environments if needed
    "http://localhost:5175", // for local development
];

app.use(
    cors({
        origin: function (origin, callback) {
            // Allow requests with no origin (like mobile apps or curl requests)
            if (!origin) return callback(null, true);

            if (allowedOrigins.indexOf(origin) === -1) {
                const msg = `The CORS policy for this site does not allow access from the specified Origin: ${origin}`;
                return callback(new Error(msg), false);
            }
            return callback(null, true);
        },
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        credentials: true,
    })
);

app.use("/api/auth", authRouter);
app.use("/api/message", messageRouter);
app.use("/api/request", requestRouter);
app.options("*", cors()); // Enable preflight for all routes

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
