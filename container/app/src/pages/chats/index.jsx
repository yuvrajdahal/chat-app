import { useEffect, useState } from "react";
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
        setReceiver(window.location.pathname.split("/")[3]);
      }
    }
  }, [id]);

  useEffect(() => {
    const handleIncomingMessage = (doc, timeoutId, originalTitle) => {
      if (window.location.pathname.split("/")[3] === doc.from._id) {
        dispatch(
          addNewMessage({
            _id: nanoid(),
            ...doc,
          })
        );
      }

      document.title = `${doc?.from?.name} : ${doc?.message}`;

      if (!document.hidden) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          document.title = originalTitle;
        }, 1000);
      } else {
        playAudio();
      }
    };

    let originalTitle = document.title;
    let timeoutId;

    if (user !== null && socket !== null) {
      socket.on("msg-receive", (doc) => {
        handleIncomingMessage(doc, timeoutId, originalTitle);
      });
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
    };
  }, [user]);

  function playAudio() {
    const audioContext = new (window.AudioContext ||
      window.webkitAudioContext)();
    const audioElement = new Audio("/sound/pop.mp3");

    const source = audioContext.createMediaElementSource(audioElement);
    source.connect(audioContext.destination);

    audioElement.play();
  }

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
    socket?.emit("add-user", user);
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
