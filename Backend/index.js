const express = require('express');
const groupRoutes = require('./routes/groupRoutes');
const authRoutes = require('./routes/authroutes');
const friendrequestRoutes = require('./routes/friendrequestRoutes');
const expenseRoutes = require('./routes/expenseRoutes');
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
app.use('/groups', groupRoutes);
app.use('/friends',friendrequestRoutes);
app.use('/feature',expenseRoutes);


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