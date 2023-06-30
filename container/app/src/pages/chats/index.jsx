import { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { nanoid } from "@reduxjs/toolkit";

import NavBar from "../../layouts/Nav";
import UsersList from "./components/UsersList";
import UserPrivateChat from "./components/UserPrivateChat";
import NoUserSelected from "./components/NoUserSelected";

import {
  useSendMessageMutation,
  useUploadImageMutation,
} from "../../appstate/chats/chat_service";

import { addNewMessage, updateOne } from "../../appstate/chats/chat_slice";
import useSocket from "../../lib/useSocket";
import { authSelector } from "../../appstate/auth/auth_slice";
import { playAudio } from "../../lib/sounds";

const Chats = () => {
  const location = useLocation();

  const id = location.pathname.split("/")[3];
  const [receiver, setReceiver] = useState(id ?? "");
  const navigate = useNavigate();

  const [sendMessage] = useSendMessageMutation();
  const [upload] = useUploadImageMutation();

  const dispatch = useDispatch();

  const socket = useSocket();
  const { user } = useSelector(authSelector);

  useEffect(() => {
    if (location.pathname.split("/")[3]) {
      if (receiver.length === 0) {
        setReceiver(location.pathname.split("/")[3]);
      }
    }
  }, [id, location]);

  useEffect(() => {
    let originalTitle = document.title;
    let timeoutId;

    if (socket !== null && user !== null) {
      socket.emit("add-user", user._id);
      socket.on("msg-receive", handleIncomingMessage);
    }

    const handleVisibilityChange = () => {
      if (!document.hidden) {
        document.title = originalTitle;
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      if (socket !== null) {
        socket.off("msg-receive", handleIncomingMessage);
      }
    };
  }, [user, dispatch, socket]);

  const handleIncomingMessage = useCallback(
    (doc) => {
      if (window.location.pathname.split("/")[3] === doc.from._id) {
        dispatch(
          addNewMessage({
            _id: nanoid(),
            ...doc,
          })
        );
      }

      if (document.hidden) {
        document.title = `${doc?.from?.name} : ${doc?.message}`;
      }

      if (document.hidden) playAudio("/sound/pop.mp3");
    },
    [dispatch]
  );

  async function sendMessageHandler(user, to, message) {
    if (message?.length === 0) return;
    const id = nanoid(10);
    dispatch(
      addNewMessage({
        _id: id,
        from: user,
        to: to,
        message: message,
      })
    );
    socket?.emit("send-msg", {
      from: user,
      to: to,
      message: message,
    });
    const { data } = await sendMessage({
      from: user,
      to: to,
      message: message,
    });
    dispatch(
      updateOne({
        id: id,
        changes: {
          _id: data?.data?._id,
        },
      })
    );
  }

  async function sendFileAsMessageHandler(user, to, message) {
    const formData = new FormData();
    await formData.append("image", message);

    let id = nanoid();
    let buffer = await message.arrayBuffer();
    dispatch(
      addNewMessage({
        _id: id,
        from: user,
        to: to,
        message: buffer,
      })
    );
    socket?.emit("send-msg", {
      from: user,
      to: to,
      message: message,
    });
    const { data } = await upload({ file: formData });
    const { data: msgData } = await sendMessage({
      from: user,
      to: to,
      message: data?.data?.url,
      cloud_id: data?.data?.id,
    });
    dispatch(
      updateOne({
        id: id,
        changes: {
          _id: msgData?.data?._id,
        },
      })
    );
  }

  function onUserChange(id) {
    setReceiver(id);
    navigate(`users/${id}`, {
      state: id,
    });
    if (user && socket) {
      socket?.emit("add-user", user._id);
    }
  }

  return (
    <div className="w-full h-full flex">
      <NavBar />
      <UsersList
        onChange={(id) => {
          onUserChange(id);
        }}
        receiver={receiver}
      />
      {receiver?.length > 0 && (
        <UserPrivateChat
          key={receiver}
          receiver={receiver}
          submitFileHandler={sendFileAsMessageHandler}
          submitHandler={sendMessageHandler}
        />
      )}
      {receiver.length === 0 && <NoUserSelected />}
    </div>
  );
};

export default Chats;
