// const { connectToDatabase, client } = require('./dbConnection.js');

// async function dbConnect() {
//   try {
//     // Connect to the database
//     await connectToDatabase();
//   } catch (error) {
//     console.error("Error during database connection:", error);
//   } finally {
//     // Ensures that the client will close when you finish/error
//     await client.close();
//   }
// }

// module.exports = dbConnect;
// dbConnection.js
const { connectToDatabase }  = require('./dbConnection.js');

async function dbConnect() {
  try {
    // Connect to the database
    await connectToDatabase();
  } catch (error) {
    console.error("Error during database connection:", error);
  }
}

module.exports = dbConnect;
