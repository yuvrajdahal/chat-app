import OnlineUserModel from "./models/online_user_model";

// let users = [];
// let callRoom = [];
// export default function (socket, io) {
//   socket.on("add-user", async (user) => {
//     const existingUser = await OnlineUserModel.findOne({ _id: user._id });
//     if (!existingUser) {
//       const newUser = new OnlineUserModel({
//         _id: user._id,
//         socketId: socket.id,
//       });
//       await newUser.save();
//     }
//     socket.join(socket.id);
//     const users = await OnlineUserModel.find();
//     socket.emit("list-users", users);
//     // if (!users.some((eachUser) => eachUser._id === user._id)) {
//     //   users.push({
//     //     user: user._id,
//     //     socketId: socket.id,
//     //   });
//     //   socket.join(socket.id);
//     // }

//     // socket.emit("list-users", users);
//   });
//   socket.on("send-msg", async (data) => {
//     const sendUserSocket = await OnlineUserModel.findOne({ _id: data.to._id });
//     if (sendUserSocket) {
//       socket.to(sendUserSocket.socketId).emit("msg-receive", data);
//     }

//     // const sendUserSocket = users.find(
//     //   (singleUser) => singleUser?.user === data?.to._id
//     // );
//     // if (sendUserSocket) {
//     //   socket.to(sendUserSocket.socketId).emit("msg-recieve", data);
//     // }
//   });
//   socket.on("join-stream", async (id) => {
//     const existingRoom = await OnlineUserModel.findOne({ roomId: id });
//     if (!existingRoom) {
//       const newUser = new OnlineUserModel({
//         roomId: id,
//         socketId: socket.id,
//       });
//       await newUser.save();
//     }
//     socket.join(id);
//     const callRoom = await OnlineUserModel.find({ roomId: id });
//     socket.emit("join-stream", callRoom);

//     // if (!callRoom.some((roomId) => roomId === id)) {
//     //   users.push({
//     //     roomId: id,
//     //     socketId: socket.id,
//     //   });
//     //   socket.join(id);
//     // }
//     // socket.emit("join-stream", callRoom);
//   });

//   socket.on("video-stream", (data) => {
//     const sendUserSocket = users.find(
//       (singleUser) => singleUser?.user === data?.ids.roomId
//     );
//     console.log(sendUserSocket, users);
//     if (sendUserSocket) {
//       socket.emit("video-stream", data);
//     }
//   });
//   socket.on("disconnect", async () => {
//     try {
//       await OnlineUserModel.findOneAndDelete({ socketId: socket.id });
//       const users = await OnlineUserModel.find();
//       socket.emit("list-users", users);
//       socket.disconnect();
//     } catch (err) {
//       console.error("Error disconnecting user:", err);
//     }
//   });
// }

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
/**
 * Testing Sacalability
 */

// const asyncHandler = (fn) => (socket, io) => {
//   return (...args) => {
//     try {
//       return Promise.resolve(fn(socket, io, ...args));
//     } catch (err) {
//       console.error("Error:", err);
//     }
//   };
// };

// const addUser = async (socket, io, user) => {
//   const existingUser = await OnlineUserModel.findOne({ _id: user._id });
//   if (!existingUser) {
//     const newUser = new OnlineUserModel({ _id: user._id, socketId: socket.id });
//     await newUser.save();
//   }
//   socket.join(socket.id);
//   const users = await OnlineUserModel.find();
//   socket.emit("list-users", users);
// };

// const sendMsg = async (socket, io, data) => {
//   const sendUserSocket = await OnlineUserModel.findOne({ _id: data.to._id });
//   if (sendUserSocket) {
//     socket.to(sendUserSocket.socketId).emit("msg-receive", data);
//   }
// };

// const joinStream = async (socket, io, id) => {
//   const existingRoom = await OnlineUserModel.findOne({ roomId: id });
//   if (!existingRoom) {
//     const newUser = new OnlineUserModel({ roomId: id, socketId: socket.id });
//     await newUser.save();
//   }
//   socket.join(id);
//   const callRoom = await OnlineUserModel.find({ roomId: id });
//   socket.emit("join-stream", callRoom);
// };

// const videoStream = async (socket, io, data) => {
//   const sendUserSocket = await OnlineUserModel.findOne({
//     roomId: data.ids.roomId,
//   });
//   if (sendUserSocket) {
//     socket.emit("video-stream", data);
//   }
// };

// const disconnect = async (socket, io) => {
//   await OnlineUserModel.findOneAndDelete({ socketId: socket.id });
//   const users = await OnlineUserModel.find();
//   socket.emit("list-users", users);
//   socket.disconnect();
// };

// export default function (socket, io) {
//   socket.on("add-user", asyncHandler(addUser)(socket, io));
//   socket.on("send-msg", asyncHandler(sendMsg)(socket, io));
//   socket.on("join-stream", asyncHandler(joinStream)(socket, io));
//   socket.on("video-stream", asyncHandler(videoStream)(socket, io));
//   socket.on("disconnect", asyncHandler(disconnect)(socket, io));
// }
