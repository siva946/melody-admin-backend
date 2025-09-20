import mongoose from 'mongoose'
const connectDB = async() => {
  try {
    await mongoose.connect(process.env.MONGO_URL, {
      serverSelectionTimeoutMS: 30000, // Increase timeout to 30s
      connectTimeoutMS: 30000,
      socketTimeoutMS: 45000,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 30000,
    });
    console.log("MongoDB connected");
  } catch (error) { 
    console.log("MongoDB connection error:", error);
    // process.exit(1);
    }   
}

export default connectDB
