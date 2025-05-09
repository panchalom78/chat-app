import cloudinary from "../lib/cloudinary.js";
import Friend from "../models/friend.model.js";
import Message from "../models/message.model.js";
import { getUsersByIds } from "../lib/util.js";
import { getReceiverSocketId, io } from "../socket.js";
import mongoose from "mongoose";

async function getLatestMessageTimes(userId, otherUserIds) {
    try {
        const latestMessages = await Promise.all(
            otherUserIds.map(async (otherId) => {
                const message = await Message.findOne({
                    $or: [
                        { senderId: userId, receiverId: otherId },
                        { senderId: otherId, receiverId: userId },
                    ],
                })
                    .sort({ createdAt: -1 })
                    .limit(1);

                return {
                    user: otherId,
                    latestMessageTime: message ? message.createdAt : null,
                };
            })
        );

        return latestMessages
            .sort((a, b) => {
                if (!a.latestMessageTime) return 1;
                if (!b.latestMessageTime) return -1;
                return b.latestMessageTime - a.latestMessageTime;
            })
            .map((item) => item.user);
    } catch (err) {
        console.error("Error fetching latest message times:", err);
        throw err;
    }
}

export const getUsersForSideBar = async (req, res) => {
    try {
        const loggedInUserId = req.user._id;
        const friends = await Friend.findOne({ userId: loggedInUserId });
        if (!friends || friends.friendIds.length == 0) {
            return res.status(200).json([]);
        }
        const friendsIds = await getLatestMessageTimes(
            loggedInUserId,
            friends.friendIds
        );

        const users = await getUsersByIds(friendsIds);

        res.status(200).json(users);
    } catch (error) {
        console.log(error);

        return res.status(500).json({ message: "Internal server error" });
    }
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

export const sendMessage = async (req, res) => {
    try {
        const { text, image } = req.body;
        const { id: receiverId } = req.params;
        const senderId = req.user._id;

        let imageUrl;
        if (image) {
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageUrl = uploadResponse.secure_url;
        }

        const newMessage = new Message({
            senderId,
            receiverId,
            text,
            image: imageUrl,
        });
        await newMessage.save();

        const receiverSocketId = getReceiverSocketId(receiverId);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("newMessage", newMessage);
        }

        return res.status(201).json(newMessage);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};
