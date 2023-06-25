import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { io } from "socket.io-client";
import { authSelector } from "../appstate/auth/auth_slice";
import { addActiveChats } from "../appstate/chats/chat_slice";
import { useCurrentUser } from "../appstate/users/user_service";
import { isProd } from "./api";

export default function useSocket() {
  const socket = useRef(null);
  const { isSuccess } = useCurrentUser();
  const dispatch = useDispatch();

  useEffect(() => {
    socket.current = io(
      isProd()
        ? import.meta.env.VITE_SOCKET_PROD_URL
        : import.meta.env.VITE_SOCKET_DEV_URL,
      {
        withCredentials: true,
      }
    );

    socket.current.on("connect", () => {
      console.log("Socket connected");
    });

    socket.current.on("disconnect", () => {
      console.log("Socket disconnected");
    });

    return () => {
      // Clean up the socket connection
      if (socket.current) {
        socket.current.disconnect();
      }
    };
  }, []);

  return socket.current;
}
