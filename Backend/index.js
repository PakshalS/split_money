const express = require('express');
const groupRoutes = require('./routes/groupRoutes');
const authRoutes = require('./routes/authroutes');
const friendrequestRoutes = require('./routes/friendrequestRoutes');
const cors = require('cors');
const dbConnect = require('./config/dbConnection');
require('dotenv').config();

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

//Routes
app.use('/auth', authRoutes);
app.use('/groups', groupRoutes);
app.use('/friends',friendrequestRoutes);


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