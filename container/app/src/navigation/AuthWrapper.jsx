import { useCurrentUser } from "../appstate/auth/auth_service";
import { Navigate, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { io } from "socket.io-client";
import { authSelector } from "../appstate/auth/auth_slice";
import { useDispatch, useSelector } from "react-redux";
import { addActiveChats } from "../appstate/chats/chat_slice"
import useSocket from "../lib/useSocket"

export const AuthWrapper = ({ children }) => {
  const { isSuccess, isError, data, isFetching } = useCurrentUser();
  const { user } = useSelector(authSelector);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const ws = useSocket();

  // useEffect(() => {
  //   if (isSuccess) {
  //     ws?.emit("add-user", user)
  //     ws?.on("list-users", (users) => {
  //       dispatch(addActiveChats(users))
  //     });
  //     ws?.on("msg-recieve", doc => {
  //       console.log(doc)
  //     });
  //   }
  // }, [user, ws])

  if (!user?.isVerified && !isFetching && isError && !isSuccess) {
    navigate("/login")
  } else {
    return children;
  }

};
