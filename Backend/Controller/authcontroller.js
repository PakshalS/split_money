const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
SECRET_KEY= '9J#4@^h$dG7%KsP&!l*2zNqJ^e@8XsT5'


// const register = async (req, res) => {
//   try {
//     const { name, email, password } = req.body;
//     console.log(req.body);

//     // Check if user already exists
//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return res.status(400).json({ error: 'User already exists' });
//     }

//     const user = new User({ name, email, password });
//     await user.save();
//     res.status(201).json({ message: 'Registration Successful' });
//   } catch (error) {
//     console.error('Error during registration:', error);
//     res.status(500).json({ error: 'Registration Failed' });
//   }
// };

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
      const token = jwt.sign({ userId: user._id, email: user.email }, SECRET_KEY, { expiresIn: '1h' });
      console.log('Password match, token generated');
      res.status(200).json({ message: 'Login Successful', token });
    } catch (error) {
      console.error('Error during login:', error);
      res.status(500).json({ error: 'Login Failed' });
    }
  };

  module.exports = { register, login };