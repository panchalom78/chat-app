import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../models/user.model.js";
import Friend from "../models/friend.model.js";

dotenv.config();

export const generateToken = (userId, res) => {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: "7d",
    });
    res.cookie("token", token, {
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
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
