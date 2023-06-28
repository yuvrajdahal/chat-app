import { useEffect, useRef } from "react";
import { io } from "socket.io-client";
import { isProd } from "./api";

export default function useSocket() {
  const socket = useRef(null);

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
      console.log("User Connected");
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
