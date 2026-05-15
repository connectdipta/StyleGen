import mongoose from "mongoose";

const connectDatabase = async () => {
  try {
    const uri = process.env.MONGODB_URI;
    console.log(`[DB] Attempting connection. URI length: ${uri?.length}, Starts with: ${uri?.substring(0, 10)}...`);
    if (!uri) {
      throw new Error("MONGODB_URI is not defined in environment variables");
    }

    await mongoose.connect(uri);
    console.log("✅ MongoDB Atlas Connected Successfully");
  } catch (error) {
    console.error("❌ Database Connection Error:", error.message);
    throw error;
  }
};

export default connectDatabase;
