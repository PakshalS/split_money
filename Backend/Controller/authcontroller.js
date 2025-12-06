const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const crypto = require("crypto");
const axios = require("axios");
require("dotenv").config();

const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check if user with the given email already exists
        const existingUserByEmail = await User.findOne({ email });
        if (existingUserByEmail) {
            return res
                .status(400)
                .json({ error: "User with this email already exists" });
        }

        // Check if user with the given name already exists
        const existingUserByName = await User.findOne({ name });
        if (existingUserByName) {
            return res
                .status(400)
                .json({ error: "User with this name already exists" });
        }

        // Create a new user
        const user = new User({ name, email, password });
        await user.save();

        res.status(201).json({ message: "Registration successful" });
    } catch (error) {
        console.error("Error during registration:", error);
        res.status(500).json({ error: "Registration failed" });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log(`Login attempt with email: ${email}`);

        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            console.log("User not found");
            return res
                .status(401)
                .json({ error: "Authentication Failed: Invalid email or password" });
        }

        // Compare passwords
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            console.log("Password mismatch");
            return res
                .status(401)
                .json({ error: "Authentication Failed: Invalid email or password" });
        }

        // Generate JWT token
        const token = jwt.sign(
            { userId: user._id, email: user.email },
            process.env.SECRET_KEY,
            { expiresIn: "24h" }
        );
        console.log("Password match, token generated");
        res.status(200).json({ message: "Login Successful", token });
    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).json({ error: "Login Failed" });
    }
};

const EMAILJS_SERVICE_ID = process.env.EMAILJS_SERVICE_ID;
const EMAILJS_TEMPLATE_ID = process.env.EMAILJS_TEMPLATE_ID;
const EMAILJS_PUBLIC_KEY = process.env.EMAILJS_PUBLIC_KEY;
const EMAILJS_PRIVATE_KEY = process.env.EMAILJS_PRIVATE_KEY;

const requestPasswordReset = async (req, res) => {
    try {
        const { emailOrUsername } = req.body;
        const emailSanitized = emailOrUsername.trim().toLowerCase();

        console.log("Input raw:", emailOrUsername);
        console.log("Input sanitized:", emailSanitized);

        const allUsers = await User.find({});
        console.log("Actual stored emails:", allUsers.map(u => u.email));

        if (!emailOrUsername) {
            return res.status(400).json({ error: "Email or username is required" });
        }

        // Find user by email OR username
        const user = await User.findOne({
            $or: [
                { email: { $regex: new RegExp(`^${emailSanitized}$`, "i") } },
                { name: { $regex: new RegExp(`^${emailSanitized}$`, "i") } },
            ],
        });

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Create temporary password (8 char hex)
        const temporaryPassword = crypto.randomBytes(4).toString("hex");

        // ❗ Store plain temp password; pre-save will hash it
        user.password = temporaryPassword;

        await user.save();

        // EmailJS template data
        const emailData = {
            service_id: EMAILJS_SERVICE_ID,
            template_id: EMAILJS_TEMPLATE_ID,
            user_id: EMAILJS_PUBLIC_KEY,
            accessToken: EMAILJS_PRIVATE_KEY,
            template_params: {
                to_email: user.email,
                user_name: user.name,
                temporary_password: temporaryPassword,
            },
        };

        await axios.post("https://api.emailjs.com/api/v1.0/email/send", emailData);

        res.status(200).json({
            message: "Temporary password sent to your email",
            email: user.email.replace(/(.{2})(.*)(@.*)/, "$1***$3"),
        });
    } catch (error) {
        console.error("Password reset error:", error);
        res.status(500).json({ error: "Error processing password reset request" });
    }
};

const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const userId = req.user.userId;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) return res.status(400).json({ error: "Incorrect old password" });

    user.password = newPassword;   // ✔ no hashing here
    await user.save();             // ✔ pre-save hook hashes correctly

    res.json({ message: "Password changed successfully" });

  } catch (error) {
    res.status(500).json({ error: "Error changing password" });
  }
};



module.exports = { register, login, changePassword, requestPasswordReset };
