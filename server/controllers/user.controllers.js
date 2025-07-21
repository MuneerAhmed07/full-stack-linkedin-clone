import uploadOnCloudinary from "../config/cloudinary.js";
import User from "../models/user.model.js";

// get Current User Controller
export const getCurrentUser = async (req, res) => {
    try {
        let id = req.userId;
        const user = await User.findById(id).select("-password");
        if (!user) {
            return res.status(400).json({ message: "user does not found!" });
        }

        return res.status(200).json(user);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "get current user error!" });
    }
}

// updateProfile Controllers
export const updateProfile = async (req, res) => {
    try {
        let { firstName, lastName, userName, headline, location, gender } = req.body;
        let skills = req.body.skills ? JSON.parse(req.body.skills) : [];
        let education = req.body.education ? JSON.parse(req.body.education) : [];
        let experience = req.body.experience ? JSON.parse(req.body.experience) : [];

        let profileImage;
        let coverImage;

        if (req.files.profileImage) {
            profileImage = await uploadOnCloudinary(req.files.profileImage[0].path);
        }
        if (req.files.coverImage) {
            coverImage = await uploadOnCloudinary(req.files.coverImage[0].path);
        }

        let user = await User.findByIdAndUpdate(req.userId, {
            firstName, lastName, userName, headline, location, gender, skills, education, experience, profileImage, coverImage
        }, { new: true }).select("-password");

        return res.status(200).json(user);

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "update profile Error." });
    }
}

// get other user profile
export const getProfile = async (req, res) => {
    try {
        let { userName } = req.params;

        let user = await User.findOne({ userName }).select("-password");

        if (!user) {
            return res.status(400).json({ message: "UserName does not exist" });
        }

        return res.status(200).json(user);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Get profile Error." });
    }
}

// Search Controller
export const search = async (req, res) => {
    try {
        let { query } = req.query;

        if (!query) {
            return res.status(400).json({ message: "query is required" });
        }

        let users = await User.find({
            $or: [
                { firstName: { $regex: query, $options: "i" } },
                { lastName: { $regex: query, $options: "i" } },
                { userName: { $regex: query, $options: "i" } },
                { skills: { $in: [query] } },
            ]
        })

        return res.status(200).json(users);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Search Error." });
    }
}

// suggested Controller
export const getSuggestedUser = async (req, res) => {
    try {
        let currentUser = await User.findById(req.userId).select("connection");

        let suggestedUser = await User.find({
            _id: {
                $ne: currentUser,
                $nin: currentUser.connection,
            }
        }).select("-password");

        return res.status(200).json(suggestedUser);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Suggested User Error." });
    }
}