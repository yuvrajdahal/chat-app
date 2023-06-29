export default function (socket, io) {
  socket.on("add-user", async (user) => {
    console.log("User id is ", user._id);
    try {
      socket.join(user._id);
    } catch (error) {
      console.error("Error adding user:", error);
    }
  });

  socket.on("send-msg", async (data) => {
    try {
      socket.to(data.to._id).emit("msg-receive", data);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  });
  socket.on("disconnect", () => disconnectUser(socket));
}
const disconnectUser = async (socket) => {
  try {
    socket.disconnect();
  } catch (error) {
    console.error("Error disconnecting user:", error);
  }
};
