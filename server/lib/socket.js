import express from "express";
import http from "http";
import { Server } from "socket.io";
import { getFriends } from "./util.js";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: [
            process.env.FRONTEND_URL,
            "https://chatty-rust-six.vercel.app", // Explicitly include your frontend URL
            "http://localhost:5175", // For local development
        ],
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Include OPTIONS for preflight
        allowedHeaders: ["Content-Type", "Authorization"], // Specify allowed headers
        credentials: true, // Important for cookies/sessions
    },
    allowEIO3: true, // For Socket.IO v2 client compatibility if needed
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
