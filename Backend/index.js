const express = require('express');
const app = express();
const port = 3000;
const User = require('./Database/models/User');
const dbConnect = require('./Database/dbConnection');
const bcrypt = require('bcrypt');

// Middleware for parsing JSON
app.use(express.json());

// Registration Route
app.post('/register', async (req, res) => {
  try { 
    const { name, email, password } = req.body;
    console.log(req.body);
    const user = new User({ name, email, password });
    await user.save();
    res.status(201).json({ message: 'Registration Successful' });
  } catch (error) {
    res.status(500).json({ error: 'Registration Failed' });
  }
});

// Login Route
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(`Login attempt with email: ${email}`);

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      console.log('User not found');
      return res.status(401).json({ error: 'Authentication Failed: Invalid email or password' });
    }

    // Compare provided password with stored hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log('Password mismatch');
      return res.status(401).json({ error: 'Authentication Failed: Invalid email or password' });
    }

    console.log('Password match');
    res.status(200).json({ message: 'Login Successful' });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ error: 'Login Failed' });
  }
});

// Connect to MongoDB
dbConnect();

// Default Route
app.get('/', (req, res) => {
  res.send('Hello, world!');
});

// Start Server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
