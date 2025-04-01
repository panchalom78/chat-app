import express from "express";
import { Server } from "socket.io";
import { getFriends } from "./lib/util.js";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const io = new Server({
    cors: {
        origin: [process.env.FRONTEND_URL],
        methods: ["GET", "POST", "PUT", "DELETE"],
        credentials: true,
    },
    path: "/socket.io/",
    addTrailingSlash: false,
    transports: ["websocket", "polling"],
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

app.io = io;
export { io, app };
