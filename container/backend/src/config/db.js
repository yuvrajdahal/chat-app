import mongoose from "mongoose";
import socket from "socket.io";

const connectDb = async () => {
  let url =
    process.env.NODE_ENV === "production"
      ? process.env.MONGO_URL
      : process.env.MONGO_DEV_URL;
  const conn = await mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  console.log(`Mongoose Connected at: ${conn.connection.host}`);
};

export default connectDb;
