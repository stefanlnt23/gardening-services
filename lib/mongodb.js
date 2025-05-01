import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectToDatabase() {
  try {
    if (cached.conn) {
      console.log("Using cached MongoDB connection");
      return cached.conn;
    }

    if (!cached.promise) {
      const opts = {
        bufferCommands: false,
      };

      console.log("Creating new MongoDB connection...");
      cached.promise = mongoose.connect(MONGODB_URI, opts)
        .then((mongoose) => {
          console.log("Connected to MongoDB successfully");
          return mongoose;
        })
        .catch((error) => {
          console.error("MongoDB connection error:", error);
          cached.promise = null; // Reset the promise on error
          throw error;
        });
    } else {
      console.log("Using existing connection promise");
    }

    cached.conn = await cached.promise;
    return cached.conn;
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
    // Reset cached connection and promise on error
    cached.conn = null;
    cached.promise = null;
    throw error;
  }
}

export default connectToDatabase;
