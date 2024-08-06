const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
// const crypto = require('crypto');
// const nodemailer = require('nodemailer');

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user with the given email already exists
    const existingUserByEmail = await User.findOne({ email });
    if (existingUserByEmail) {
      return res.status(400).json({ error: 'User with this email already exists' });
    }

    // Check if user with the given name already exists
    const existingUserByName = await User.findOne({ name });
    if (existingUserByName) {
      return res.status(400).json({ error: 'User with this name already exists' });
    }

    // Create a new user
    const user = new User({ name, email, password });
    await user.save();

    res.status(201).json({ message: 'Registration successful' });
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
};

const login = async (req, res) => {
    try {
      const { email, password } = req.body;
      console.log(`Login attempt with email: ${email}`);
  
      // Find user by email
      const user = await User.findOne({ email });
      if (!user) {
        console.log('User not found');
        return res.status(401).json({ error: 'Authentication Failed: Invalid email or password' });
      }
  
      // Compare passwords
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        console.log('Password mismatch');
        return res.status(401).json({ error: 'Authentication Failed: Invalid email or password' });
      }
  
      // Generate JWT token
      const token = jwt.sign({ userId: user._id, email: user.email }, process.env.SECRET_KEY , { expiresIn: '24h' });
      console.log('Password match, token generated');
      res.status(200).json({ message: 'Login Successful', token });
    } catch (error) {
      console.error('Error during login:', error);
      res.status(500).json({ error: 'Login Failed' });
    }
  };

  
  // const transporter = nodemailer.createTransport({
  //   service: 'Gmail',
  //   auth: {
  //     user: process.env.EMAIL_USER,
  //     pass: process.env.EMAIL_PASS,
  //   },
  // });
  
  // const requestPasswordReset = async (req, res) => {
  //   try {
  //     const { emailOrUsername } = req.body;
  //     const user = await User.findOne({
  //       $or: [{ email: emailOrUsername }, { name: emailOrUsername }],
  //     });
  
  //     if (!user) {
  //       return res.status(404).json({ error: 'User not found' });
  //     }
  
  //     const temporaryPassword = crypto.randomBytes(4).toString('hex');
  //     const hashedPassword = await bcrypt.hash(temporaryPassword, 10);
  
  //     user.password = hashedPassword;
  //     await user.save();
  
  //     const mailOptions = {
  //       from: process.env.EMAIL_USER,
  //       to: user.email,
  //       subject: 'Password Reset Request',
  //       text: `Your temporary password is ${temporaryPassword}`,
  //     };
  
  //     transporter.sendMail(mailOptions, (error, info) => {
  //       if (error) {
  //         return res.status(500).json({ error: 'Error sending email' });
  //       }
  //       res.status(200).json({ message: 'Temporary password sent to your email' });
  //     });
  //   } catch (error) {
  //     res.status(500).json({ error: 'Error processing request' });
  //   }
  // };

  
  // const changePassword = async (req, res) => {
  //   try {
  //     const { oldPassword, newPassword } = req.body;
  //     const userId = req.user.userId;
  
  //     const user = await User.findById(userId);
  
  //     if (!user) {
  //       return res.status(404).json({ error: 'User not found' });
  //     }
  
  //     const isMatch = await bcrypt.compare(oldPassword, user.password);
  
  //     if (!isMatch) {
  //       return res.status(400).json({ error: 'Incorrect old password' });
  //     }
  
  //     const hashedNewPassword = await bcrypt.hash(newPassword, 10);
  //     user.password = hashedNewPassword;
  //     await user.save();
  
  //     res.status(200).json({ message: 'Password changed successfully' });
  //   } catch (error) {
  //     res.status(500).json({ error: 'Error changing password' });
  //   }
  // };
  

  module.exports = { register, login };