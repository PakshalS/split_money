const express = require('express');
const http = require('http');
const groupRoutes = require('./routes/groupRoutes');
const authRoutes = require('./routes/authroutes');
const friendrequestRoutes = require('./routes/friendrequestRoutes');
const cors = require('cors');
const dbConnect = require('./config/dbConnection');
const initializeSocket = require('./config/socket');
require('dotenv').config();


const app = express();
const server = http.createServer(app);
const io = initializeSocket(server);

const port = process.env.port;

// Middleware
app.use(cors({
  // origin: ["https://split-money-alpha.vercel.app"],
  // methods: ["GET", "POST", "PUT", "DELETE"],
  // credentials: true
}));
app.use(express.json());

// Make io accessible to routes
app.set('io', io);

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
  server.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
});