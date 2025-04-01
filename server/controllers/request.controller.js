import Friend from "../models/friend.model.js";
import User from "../models/user.model.js";
import { getUsersByIds } from "../lib/util.js";
import { getReceiverSocketId, io } from "../socket.js";

export const sendRequest = async (req, res) => {
    try {
        const { id: receiverId } = req.params;
        const senderId = req.user._id;

        const friend = await Friend.findOne({ userId: receiverId });
        const friend2 = await Friend.findOne({ userId: senderId });

        if (friend2) {
            friend2.requestedIds.push(receiverId);
            await friend2.save();
        } else {
            await Friend.create({
                userId: senderId,
                requestIds: [],
                friendIds: [],
                requestedIds: [receiverId],
            });
        }

        if (!friend) {
            await Friend.create({
                userId: receiverId,
                requestIds: [senderId],
                friendIds: [],
                requestedIds: [],
            });
            return res;
        }
        friend.requestIds.push(senderId);
        await friend.save();

        const receiverSocketId = getReceiverSocketId(receiverId);
        if (receiverSocketId) {
            console.log("Socket addReq send");
            io.to(receiverSocketId).emit("addRequest", req.user);
        }

        return res.status(200).json({ message: "Request sent successfully" });
    } catch (error) {
        console.error("Error in sendRequest:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

export const getRequests = async (req, res) => {
    try {
        const userId = req.user._id;
        const friend = await Friend.findOne({ userId: userId });
        if (!friend?.requestIds.length > 0) {
            return res.status(200).json([]);
        }
        const requests = await getUsersByIds(friend.requestIds);
        return res.status(200).json(requests);
    } catch (error) {
        console.error("Error in getRequests:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

export const acceptRequest = async (req, res) => {
    try {
        const { id: requestId } = req.params;
        const userId = req.user._id;
        const friend = await Friend.findOne({ userId: userId });
        const friend2 = await Friend.findOne({ userId: requestId });

        if (friend) {
            friend.requestIds = friend.requestIds.filter(
                (id) => id.toString() !== requestId
            );
            friend.friendIds.push(requestId);
            await friend.save();
        } else {
            await Friend.create({
                userId,
                requestIds: [],
                friendIds: [requestId],
            });
        }

        const receiverSocketId = getReceiverSocketId(requestId);
        if (receiverSocketId)
            io.to(receiverSocketId).emit("acceptRequest", req.user);

        if (friend2) {
            friend2.requestedIds = friend2.requestedIds.filter(
                (id) => id.toString() !== userId
            );
            friend2.friendIds.push(userId);
            await friend2.save();
        } else {
            await Friend.create({
                userId: requestId,
                requestIds: [],
                friendIds: [userId],
                requestedIds: [],
            });
        }

        return res
            .status(200)
            .json({ message: "Request accepted successfully" });
    } catch (error) {
        console.error("Error in acceptRequest:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

export const rejectRequest = async (req, res) => {
    try {
        const { id: requestId } = req.params;
        const userId = req.user._id;

        // Validate requestId
        if (!requestId) {
            return res.status(400).json({ message: "Request ID is required" });
        }

        const friend = await Friend.findOne({ userId: userId });
        if (!friend) {
            return res.status(404).json({ message: "No friend record found" });
        }

        // Check if request actually exists
        if (!friend.requestIds.includes(requestId)) {
            return res
                .status(404)
                .json({ message: "Friend request not found" });
        }

        const friend2 = await Friend.findOne({ userId: requestId });
        if (!friend2) {
            return res.status(404).json({ message: "Requestor not found" });
        }

        // Remove request
        friend.requestIds = friend.requestIds.filter(
            (id) => id.toString() !== requestId
        );
        console.log(friend2);

        console.log(friend2.requestedIds);

        console.log(userId);

        friend2.requestedIds = friend2.requestedIds.filter(
            (id) => id.toString() !== req.user._id.toString()
        );
        console.log(friend2.requestedIds);

        await friend.save();
        await friend2.save();

        return res
            .status(200)
            .json({ message: "Request rejected successfully" });
    } catch (error) {
        console.error("Error in rejectRequest:", error);

        // More specific error handling
        if (error.name === "CastError") {
            return res
                .status(400)
                .json({ message: "Invalid request ID format" });
        }

        return res.status(500).json({ message: "Internal Server Error" });
    }
};

export const getUsersByQuery = async (req, res) => {
    try {
        const { query } = req.body;
        const friend = await Friend.findOne({ userId: req.user._id });
        const excludeIds = [
            ...(friend ? friend.friendIds : []),
            ...(friend ? friend.requestIds : []),
            ...(friend ? friend.requestedIds : []),
            req.user._id,
        ];

        const users = await User.find({
            fullName: { $regex: query, $options: "i" },
            _id: { $nin: excludeIds },
        }).select("-password -email");

        return res.status(200).json(users);
    } catch (error) {
        console.error("Error in getUsersByQuery:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};
