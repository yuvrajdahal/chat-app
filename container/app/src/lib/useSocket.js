import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { io } from "socket.io-client";
import { authSelector } from "../appstate/auth/auth_slice";
import { addActiveChats } from "../appstate/chats/chat_slice";
import { useCurrentUser } from "../appstate/users/user_service";
import { isProd } from "./api";
// export const ws = io('ws://localhost:5900/api/v1/socket', {
//     withCredentials: true,
// })
export default function useSocket() {
    const socket = useRef(null);
    const { isSuccess } = useCurrentUser();

    useEffect(() => {
        socket.current = io(isProd() ? import.meta.env.VITE_SOCKET_PROD_URL : import.meta.env.VITE_SOCKET_DEV_URL, {
            withCredentials: true,
        });
    }, []);
    return socket.current
}