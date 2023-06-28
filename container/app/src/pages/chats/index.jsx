import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useSocket from "../../lib/useSocket";

import NavBar from "../../layouts/Nav";
import UsersList from "./components/UsersList";
import UserPrivateChat from "./components/UserPrivateChat";
import NoUserSelected from "./components/NoUserSelected";

import { useDispatch, useSelector } from "react-redux";
import { authSelector } from "../../appstate/auth/auth_slice";
import {
  useSendMessageMutation,
  useUploadImageMutation,
} from "../../appstate/chats/chat_service";

import { addNewMessage, updateOne } from "../../appstate/chats/chat_slice";
import { nanoid } from "@reduxjs/toolkit";

const Chats = () => {
  const id = window.location.pathname.split("/")[3];
  const [receiver, setReceiver] = useState(id ?? "");

  const navigate = useNavigate();

  const [sendMessage] = useSendMessageMutation();
  const [upload] = useUploadImageMutation();

  const dispatch = useDispatch();

  const socket = useSocket();
  const { user, userIsLoading } = useSelector(authSelector);

  // Set and clear IDs according to route
  useEffect(() => {
    if (id) {
      setReceiver(id);
    } else {
      setReceiver("");
    }
  }, [id]);

  function playAudio() {
    const audioContext = new (window.AudioContext ||
      window.webkitAudioContext)();
    const audioElement = new Audio("/sound/pop.mp3");

    // Create a source node from the audio element
    const source = audioContext.createMediaElementSource(audioElement);

    // Connect the source to the audio context's destination (output)
    source.connect(audioContext.destination);

    // Start playing the audio
    audioElement.play();
  }

  // Application socket manager
  useEffect(() => {
    let originalTitle = document.title;
    let timeoutId;

    if (!userIsLoading && socket) {
      socket?.emit("add-user", user);

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

    // Clean up the event listener when the component unmounts
    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [socket, user, userIsLoading]);

  const handleIncomingMessage = (doc, timeoutId, originalTitle) => {
    if (receiver === doc.from._id) {
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
  }

  return (
    <div className="w-full h-full flex">
      {/* Sidebar or Navbar */}
      <NavBar />

      {/* Routes to list users */}
      <UsersList
        onChange={(id) => {
          onUserChange(id);
        }}
        receiver={receiver}
      />

      {/* Routes to list user-specific chat */}
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
