import express from "express";
import http from "http";
import { Server } from "socket.io";
import { getFriends } from "./util.js";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();
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

const server = http.createServer(app);

// 3. Enhanced Socket.IO CORS configuration
const io = new Server(server, {
    cors: {
        origin: [
            process.env.FRONTEND_URL,
            "https://chatty-rust-six.vercel.app",
            "http://localhost:3000",
        ],
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
        credentials: true,
    },
    transports: ["websocket", "polling"], // Ensure both transports are enabled
});
const userSocketMap = {};

export const getReceiverSocketId = (userId) => {
    return userSocketMap[userId];
};

io.on("connection", async (socket) => {
    console.log("a user connected", socket.id);

    const userId = socket.handshake.query.userId;
    if (userId) userSocketMap[userId] = socket.id;

    const friends = await getFriends(userId);
    var onlineUsers = [];
    for (const friendId of friends) {
        if (userSocketMap[friendId]) {
            socket.to(userSocketMap[friendId]).emit("online", [userId]);
            onlineUsers = [...onlineUsers, friendId];
        }
    }
    socket.emit("online", onlineUsers);

    socket.on("disconnect", () => {
        console.log("user disconnected", socket.id);
        for (const friendId of friends) {
            if (userSocketMap[friendId]) {
                socket.to(userSocketMap[friendId]).emit("offline", userId);
            }
        }
        delete userSocketMap[userId];
    });
});

export { io, server, app };
