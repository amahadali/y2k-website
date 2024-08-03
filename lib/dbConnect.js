// Import the mongoose library for MongoDB object modeling
import mongoose from "mongoose";

// Retrieve the MongoDB URI from environment variables
const MONGODB_URI = process.env.MONGODB_URI;

// Check if the MONGODB_URI environment variable is defined
// If not, throw an error indicating the need to define it
if (!MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env.local"
  );
}

// Initialize a cache object to store the MongoDB connection
let cached = global.mongoose;

// If there is no cached connection, create one
if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

// Define an async function to handle the database connection
async function dbConnect() {
  // If there is an existing connection in the cache, return it
  if (cached.conn) {
    return cached.conn;
  }

  // If there is no existing promise, create a new one to connect to MongoDB
  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI).then((mongoose) => {
      return mongoose;
    });
  }

  try {
    // Wait for the connection promise to resolve and store the connection in the cache
    cached.conn = await cached.promise;
    console.log("Connected to MongoDB with Mongoose");
  } catch (error) {
    // If an error occurs, reset the cached promise to allow a retry
    cached.promise = null;
    console.error("Error connecting to MongoDB:", error);
    throw error; // Rethrow the error after logging it
  }

  // Return the MongoDB connection
  return cached.conn;
}

// Export the dbConnect function as the default export
export default dbConnect;
