import { Schema, model } from "mongoose";
const userSchema = new Schema({
  _id: String,
  socketId: String,
  roomId: String,
});
const OnlineUserModel = model("OnlineUser", userSchema);

export default OnlineUserModel;
