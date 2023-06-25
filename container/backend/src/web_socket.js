import OnlineUserModel from "./models/online_user_model";

export default function (socket, io) {
  socket.on("add-user", async (user) => {
    try {
      const existingUser = await OnlineUserModel.findOne({ _id: user._id });
      if (existingUser) {
        await OnlineUserModel.findOneAndDelete({ _id: user._id });
      }
      await OnlineUserModel.create({ _id: user._id, socketId: socket.id });

      socket.join(socket.id);
      const users = await OnlineUserModel.find();
      socket.emit("list-users", users);
    } catch (error) {
      console.error("Error adding user:", error);
    }
  });

  socket.on("send-msg", async (data) => {
    try {
      const sendUserSocket = await OnlineUserModel.findOne({
        _id: data.to._id,
      });
      if (sendUserSocket) {
        socket.to(sendUserSocket.socketId).emit("msg-receive", data);
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  });

  socket.on("disconnect", async () => {
    try {
      await OnlineUserModel.findOneAndDelete({ socketId: socket.id });

      const users = await OnlineUserModel.find();
      socket.emit("list-users", users);
      socket.disconnect();
    } catch (error) {
      console.error("Error disconnecting user:", error);
    }
  });
}
