const express = require('express');
const groupRoutes = require('./routes/groupRoutes');
const authRoutes = require('./routes/authroutes');
const friendrequestRoutes = require('./routes/friendrequestRoutes');
const cors = require('cors');
const dbConnect = require('./config/dbConnection');
require('dotenv').config();
const path = require('path');

const app = express();
const port = process.env.port;

// Middleware
app.use(cors(
  // {
  //   origin: ["https://deploy-split-money-api.vercel.app"],
  //   methods:[
  //     "POST" , "GET" , "DELETE" ,"PUT"
  //   ],
  //   credentials: true
  // }
));
app.use(express.json());

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'client/build')));

//Routes
app.use('/auth', authRoutes);
app.use('/groups', groupRoutes);
app.use('/friends',friendrequestRoutes);


// Default Route
app.get('/', (req, res) => {
  res.send('Hello, world!');
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});

// Connect to MongoDB and start the server
dbConnect().then(() => {
  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
});