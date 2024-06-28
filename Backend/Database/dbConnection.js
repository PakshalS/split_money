const mongoose = require('mongoose');

const dbConnect = async () => {
  try {
    // Replace <username> and <password> with your actual MongoDB Atlas credentials
    // const uri = "mongodb+srv://3277pakshalshah:0m8C4qUQwotSSRE8@cluster0.wpiqcft.mongodb.net/?appName=Cluster0/Information?retryWrites=true&w=majority";
   const uri ="mongodb+srv://3277pakshalshah:0m8C4qUQwotSSRE8@cluster0.wpiqcft.mongodb.net/Information?retryWrites=true&w=majority&appName=Cluster0";
    await mongoose.connect(uri);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
};

module.exports = dbConnect;
