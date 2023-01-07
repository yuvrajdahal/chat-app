import { Schema, model } from "mongoose";

const chatSchema = new Schema({
    chatUsers: {
        type: Array,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    from: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    to: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});
const ChatModel = model("Chat", chatSchema);
export default ChatModel;
