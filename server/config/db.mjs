import mongoose from "mongoose";
import dotenv from "dotenv"; // Import dotenv

// Load environment variables from .env file
dotenv.config();

const mongodbURI =
  process.env.MONGODB_URI

const connectDB = async () => {
  try {
    await mongoose.connect(mongodbURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Mongoose is connected");
  } catch (error) {
    console.error("Mongoose connection error:", error);
    process.exit(1);
  }

  mongoose.connection.on("disconnected", () => {
    console.log("Mongoose is disconnected");
    process.exit(1);
  });

  process.on("SIGINT", async () => {
    console.log("App is terminating");
    await mongoose.connection.close();
    console.log("Mongoose default connection closed");
    process.exit(0);
  });
};

export default connectDB;
