import cloudinary from "../lib/cloudinary.js";
import { generateToken } from "../lib/util.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";

export const signup = async (req, res) => {
    try {
        const { fullName, password, email } = req.body;

        if (!fullName || !password || !email) {
            return res.status(400).json({ message: "All fields are required" });
        }

        if (password.length < 8) {
            return res
                .status(400)
                .json({ message: "Password must be atleast 6 characters" });
        }

        const user = await User.findOne({ email });
        if (user) {
            return res
                .status(400)
                .json({ message: "User already registered. Please login" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            fullName,
            email,
            password: hashedPassword,
        });

        await newUser.save();
        generateToken(newUser._id, res);
        return res.status(201).json({
            _id: newUser._id,
            fullName,
            email,
            profilePic: newUser.profilePic,
        });
    } catch (error) {
        console.log(error);

        return res.status(500).json({ message: "Internal server error" });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        generateToken(user._id, res);
        return res.status(200).json({
            _id: user._id,
            email,
            fullName: user.fullName,
            profilePic: user.profilePic,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const logout = (req, res) => {
    res.cookie("token", "", { maxAge: 0 });
    return res.status(200).json({ message: "Logged out successfully" });
};

export const updateProfile = async (req, res) => {
    try {
        const { profilePic } = req.body;
        const userId = req.user._id;

        if (!profilePic) {
            return res.status(400).json({ message: "Profile Pic is required" });
        }

        const uploadResponse = await cloudinary.uploader.upload(profilePic);

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { profilePic: uploadResponse.secure_url },
            { new: true }
        );

        return res.status(200).json(updatedUser);
    } catch (error) {
        console.log(error);

        return res.status(500).json({ message: "Internal server error" });
    }
};

export const checkAuth = async (req, res) => {
    try {
        return res.status(200).json(req.user);
    } catch (error) {
        console.log(error);

        return res.status(500).json({ message: "Internal server error" });
    }
};
