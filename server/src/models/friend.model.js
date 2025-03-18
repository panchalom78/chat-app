import mongoose from "mongoose";

const friendSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true,
    },
    friendIds: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
    ],
    requestIds: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
    ],
    requestedIds: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
    ],
});

const Friend = mongoose.model("Friend", friendSchema);

export default Friend;
