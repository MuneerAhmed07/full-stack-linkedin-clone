import genToken from "../config/token.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";

// SignUp
export const signUp = async (req, res) => {
    try {
        let {firstName, lastName, userName, email, password} = req.body;
        
        // exist Email
        let existEmail = await User.findOne({email});
        if(existEmail) {
            return res.status(400).json({message: "email already exist !"});
        }

        // Exist Username
        let existUsername = await User.findOne({userName});
        if(existUsername) {
            return res.status(400).json({message: "userName already exist !"});
        }

        // password 8 character
        if(password.length < 8) {
            return res.status(400).json({message: "password must be at least 8 character !"})
        }

        // Hash password
        let hassedPassword = await bcrypt.hash(password, 10);

        // create User
        const user = await User.create({
            firstName,
            lastName, 
            userName, 
            email,
            password: hassedPassword,
        });
        
        let token = await genToken(user._id);
        res.cookie("token", token, {
            httpOnly: true,
            maxAge: 7*24*60*60*1000,
            sameSite: "strict",
            secure: process.env.NODE_ENVIRONMENT === "production",
        });
        return res.status(201).json(user);

    } catch (error) {
        console.log(error);
        return res.status(500).json({message: "signup error"});
    }
}

// Login
export const login = async (req, res) => {
    try {
         let {email, password} = req.body;
        
        // exist Email
        let user = await User.findOne({email});
        if(!user) {
            return res.status(400).json({message: "user does not exist !"});
        }

        // password match
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch) {
            return res.status(400).json({message: "incorrect password !"});
        }
        
        let token = await genToken(user._id);
        res.cookie("token", token, {
            httpOnly: true,
            maxAge: 7*24*60*60*1000,
            sameSite: "strict",
            secure: process.env.NODE_ENVIRONMENT === "production",
        });
        return res.status(200).json(user);
    } catch (error) {
        console.log(error)
        return res.status(500).json({message: "login error"});
    }
}

// Logout
export const logOut = async (req, res) => {
    try {
        res.clearCookie("token");
        return res.status(200).json({message: "logout Successfully !"});
    } catch (error) {
        console.log(error)
        return res.status(500).json({message: "logout error"});
    }
}