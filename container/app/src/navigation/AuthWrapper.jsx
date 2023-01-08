import { useCurrentUser } from "../appstate/auth/auth_service";
import { Navigate, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { io } from "socket.io-client";
import { authSelector } from "../appstate/auth/auth_slice";
import { useDispatch, useSelector } from "react-redux";
import { addActiveChats } from "../appstate/chats/chat_slice"
import useSocket from "../lib/useSocket"

export const AuthWrapper = ({ children }) => {
  const { isSuccess, isError, isFetching } = useCurrentUser();
  const { user } = useSelector(authSelector);

  const token = JSON.parse(localStorage.getItem("token"))
  if (token !== undefined && token !== null) {
    return children;
  }
  if (!isFetching && isError && !user?.isVerified) {
    return <Navigate to={"/login"} replace />;
  }

  return isSuccess === true && children;

};
