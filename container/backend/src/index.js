import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import cookies from "cookie-parser";
import { v2 as cloudinary } from "cloudinary";
import { Server } from "socket.io";
import { createServer } from "http";
import fileUpload from "express-fileupload";

import auth from "./routes/auth_routes";
import users from "./routes/users_route";
import chat from "./routes/chat_route";

import connectDb from "./config/db.js";
import globalError from "./middlewares/errorHandler";
import web_socket from "./web_socket";
import {
  isOperationalError,
  logError,
  logErrorMiddleware,
} from "./middlewares/errorLogger";

import path from "path";
dotenv.config({ path: "src/config/.env" });

const app = express();
const httpServer = createServer(app);

app.use(
  fileUpload({
    useTempFiles: true,
  })
);

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_KEY,
  api_secret: process.env.CLOUD_SECRET_KEY,
});
const io = new Server(httpServer, {
  cors: {
    origin: true,
    credentials: true,
    methods: ["GET", "POST"],
  },
});
connectDb().then(() => {
  console.log(
    `Socket is running at http://localhost:${process.env.PORT}/api/v1/socket`
  );
});
io.of("/api/v1/socket").on("connection", (socket) => web_socket(socket, io));

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
app.use(express.json());

app.use(cookies());

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.use("/api/v1/auth", auth);
app.use("/api/v1/users", users);
app.use("/api/v1/chat", chat);

app.use("/uploads", express.static(path.resolve("uploads/")));

if (process.env.NODE_ENV === "production") {
  console.log(__dirname);
  app.use(express.static(path.resolve("../", "app", "dist")));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve("../", "app", "dist", "index.html"));
  });
} else {
  app.get("/", (req, res) => {
    res.send("Api is running");
  });
}
app.use(logErrorMiddleware);
app.use(globalError);

let PORT = process.env.PORT ?? 5000;

httpServer.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

// if the Promise is rejected this will catch it
process.on("unhandledRejection", (err, _) => {
  logError(err);
  throw err;
  // httpServer.close(() => process.exit(1));
});

process.on("uncaughtException", (error) => {
  logError(error);
  if (!isOperationalError(error)) {
    process.exit(1);
  }
});
