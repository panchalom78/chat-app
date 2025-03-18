import cloudinary from "../lib/cloudinary.js";
import Friend from "../models/friend.model.js";
import Message from "../models/message.model.js";
import { getUsersByIds } from "../lib/util.js";
import { getReceiverSocketId, io } from "../lib/socket.js";

export const getUsersForSideBar = async (req, res) => {
    try {
        const loggedInUserId = req.user._id;
        var friends = await Friend.findOne({ userId: loggedInUserId });

        const messages = await Message.find({
            $or: [{ senderId: loggedInUserId }, { receiverId: loggedInUserId }],
        }).sort({ createdAt: -1 });

        const friendIds = [
            ...new Set(
                messages.map((msg) => {
                    // If senderId is the logged in user, return receiverId, else return senderId
                    return msg.senderId.toString() === loggedInUserId.toString()
                        ? msg.receiverId.toString()
                        : msg.senderId.toString();
                })
            ),
        ];

        friendIds.map((id) => {
            if (friends.friendIds.includes(id)) {
                const index = friends.friendIds.indexOf(id);
                delete friends.friendIds[index];
            }
        });

        const newIds = [...friendIds, ...friends.friendIds];

        const users = await getUsersByIds(newIds);

        res.status(200).json(users);
    } catch (error) {
        console.log(error);

        return res.status(500).json({ message: "Internal server error" });
    }
};

// export const getUsersForSideBar = async (req, res) => {
//     try {
//         const loggedInUserId = req.user._id;
//         const friends = await Friend.findOne({ userId: loggedInUserId });

//         if (!friends || !friends.friendIds.length) {
//             return res.status(200).json([]);
//         }

//         // Aggregate to find the latest message for each friend
//         const latestMessages = await Message.aggregate([
//             {
//                 $match: {
//                     $or: [
//                         { senderId: loggedInUserId },
//                         { receiverId: loggedInUserId },
//                     ],
//                 },
//             },
//             {
//                 $sort: { createdAt: -1 },
//             },
//             {
//                 $group: {
//                     _id: {
//                         $cond: [
//                             { $eq: ["$senderId", loggedInUserId] },
//                             "$receiverId",
//                             "$senderId",
//                         ],
//                     },
//                     latestMessage: { $first: "$$ROOT" },
//                 },
//             },
//             {
//                 $match: {
//                     _id: { $in: friends.friendIds },
//                 },
//             },
//             {
//                 $sort: { "latestMessage.createdAt": -1 },
//             },
//         ]);

//         // Extract user IDs from the aggregation result
//         const sortedUserIds = latestMessages.map((msg) => msg._id);

//         // Fetch user details
//         const users = await User.find({ _id: { $in: sortedUserIds } })
//             .select("-password -email")
//             .lean();

//         // Sort users based on the order of sortedUserIds
//         const sortedUsers = sortedUserIds.map((id) =>
//             users.find((user) => user._id.toString() === id.toString())
//         );

//         res.status(200).json(sortedUsers);
//     } catch (error) {
//         console.error("Error in getUsersForSideBar:", error);
//         return res.status(500).json({ message: "Internal server error" });
//     }
// };

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
