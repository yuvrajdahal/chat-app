export default function (socket, io) {
  socket.on("add-user", async (roomId) => {
    if (!roomId) return;
    console.log("User id is ", roomId);
    socket.join(roomId);
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
