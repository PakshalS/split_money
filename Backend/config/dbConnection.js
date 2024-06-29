const mongoose = require('mongoose');

const dbConnect = async () => {
  try {
    // Replace <username> and <password> with your actual MongoDB Atlas credentials
    await mongoose.connect(process.env.uri);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
};

module.exports = dbConnect;
