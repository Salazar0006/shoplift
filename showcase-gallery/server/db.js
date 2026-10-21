import mongoose from "mongoose";

let isConnected = false;

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.error("✗ Error: MONGODB_URI is not defined in server/.env");
    return false;
  }

  if (uri.includes("<db_password>")) {
    console.warn("\n============================================================");
    console.warn("⚠️  MONGODB_URI still contains '<db_password>' placeholder!");
    console.warn("👉 Please open 'server/.env' and replace '<db_password>'");
    console.warn("   with your actual MongoDB Atlas database password.");
    console.warn("============================================================\n");
    return false;
  }

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });
    isConnected = true;
    console.log(`✓ MongoDB Connected: ${conn.connection.host}`);
    return true;
  } catch (error) {
    isConnected = false;
    console.error(`✗ MongoDB Connection Error: ${error.message}`);
    console.warn("👉 Tips to fix MongoDB Atlas connection:");
    console.warn("   1. Verify your password in server/.env is correct");
    console.warn("   2. In MongoDB Atlas, go to Network Access -> Add IP Address -> Allow Access From Anywhere (0.0.0.0/0)\n");
    return false;
  }
};

export const checkDBStatus = () => isConnected || mongoose.connection.readyState === 1;

export default connectDB;
