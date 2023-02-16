global.onlineUsers = new Map();
let users = [];

export default function (socket, io) {
  socket.on("add-user", (user) => {
    if (!users.some((eachUser) => eachUser._id === user._id)) {
      users.push({
        user: user._id,
        socketId: socket.id,
      });
      socket.join(socket.id);
    }

    socket.emit("list-users", users);
  });
  socket.on("send-msg", (data) => {
    const sendUserSocket = users.find(
      (singleUser) => singleUser?.user === data?.to._id
    );
    if (sendUserSocket) {
      socket.to(sendUserSocket.socketId).emit("msg-recieve", data);
    }
  });
  socket.on("disconnect", () => {
    users = users.filter((eachUser) => eachUser.socketId !== socket.id);
    socket.emit("list-users", users);
    socket.disconnect();
  });
}
