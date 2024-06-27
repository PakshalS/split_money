// // mongodbClient.js
// const { MongoClient, ServerApiVersion } = require('mongodb');
// const uri = "mongodb+srv://3277pakshalshah:0m8C4qUQwotSSRE8@cluster0.wpiqcft.mongodb.net/?appName=Cluster0/Information";

// // Create a MongoClient with a MongoClientOptions object to set the Stable API version
// const client = new MongoClient(uri, {
//   serverApi: {
//     version: ServerApiVersion.v1,
//     strict: true,
//     deprecationErrors: true,
//   }
// });

// async function connectToDatabase() {
//   try {
//     // Connect the client to the server (optional starting in v4.7)
//     await client.connect();
//     // Send a ping to confirm a successful connection
//     await client.db("Information").command({ ping: 1 });
//     console.log("Pinged your deployment. You successfully connected to MongoDB!");
//     return client;
//   } catch (error) {
//     console.error("Failed to connect to MongoDB", error);
//     throw error;
//   }
// }

// module.exports = { connectToDatabase, client };

// mongodbClient.js
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://3277pakshalshah:0m8C4qUQwotSSRE8@cluster0.wpiqcft.mongodb.net/?appName=Cluster0/Information";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function connectToDatabase() {
  try {
    // Connect the client to the server
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("Information").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
    return client;
  } catch (error) {
    console.error("Failed to connect to MongoDB", error);
    throw error;
  }
}

module.exports = { connectToDatabase, client };
