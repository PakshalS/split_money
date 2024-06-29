const express = require('express');
const authRoutes = require('./routes/authroutes');
const cors = require('cors');
const dbConnect = require('./config/dbConnection');
require('dotenv').config();

const app = express();
const port = process.env.port;

// Middleware
app.use(cors());
app.use(express.json());

//Routes
app.use('/auth', authRoutes);

// Default Route
app.get('/', (req, res) => {
  res.send('Hello, world!');
});

// Connect to MongoDB and start the server
dbConnect().then(() => {
  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
});

