import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../models/user.model.js";
import Friend from "../models/friend.model.js";
import Message from "../models/message.model.js";
import { getReceiverSocketId, io } from "../socket.js";

dotenv.config();

export const generateToken = (userId, res) => {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: "7d",
    });
    res.cookie("token", token, {
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    });
    return token;
};

export const getUsersByIds = async (ids) => {
    const users = await Promise.all(
        ids.map(async (id) => {
            return await User.findOne({ _id: id }).select("-email -password");
        })
    );
    return users;
};

export const getFriends = async (userId) => {
    const user = await Friend.findOne({ userId });
    return user?.friendIds || [];
};

export const getMessages = async (req, res) => {
    try {
        const { id: userToChatId } = req.params;
        const myId = req.user._id;

        const messages = await Message.find({
            $or: [
                { senderId: myId, receiverId: userToChatId },
                { senderId: userToChatId, receiverId: myId },
            ],
        });

        return res.status(200).json(messages);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const sendMessage = async (text, imageUrl = "", receiverId) => {
    try {
        const newMessage = new Message({
            senderId: process.env.CHATBOT_ID,
            receiverId,
            text,
            image: imageUrl,
        });
        await newMessage.save();

        const receiverSocketId = getReceiverSocketId(receiverId);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("newMessage", newMessage);
        }
    } catch (error) {
        console.log(error);
    }
};
