import { Suspense, useRef, useEffect, useState } from "react";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import Text from "../../components/Text";
import NavBar from "../../layouts/Nav";
import useSocket from "../../lib/useSocket";
import { useDispatch, useSelector } from "react-redux";
import { authSelector } from "../../appstate/auth/auth_slice";
import {
  addActiveChats,
  addNewMessage,
  updateOne,
} from "../../appstate/chats/chat_slice";
import {
  useSendMessageMutation,
  useUploadImageMutation,
} from "../../appstate/chats/chat_service";
import { classNames } from "../../lib/utils";
import Loading from "../../components/Loading";
import { nanoid } from "@reduxjs/toolkit";
import store from "../../appstate/store";
import CallTab from "../call";
import PrivateChat from "../user-chat";
import Users from "../users/index";

const Chats = () => {
  const id = window.location.pathname.split("/")[3];
  const _callId = window.location.pathname.split("/")[4];
  const [receiver, setReceiver] = useState(id ?? "");
  const [callId, setCallId] = useState(_callId);
  const [recievedVideoBuffer, setRecievedBuffer] = useState([]);

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

  useEffect(() => {
    if (_callId) {
      setCallId(_callId);
    } else {
      setCallId("");
    }
  }, [_callId]);

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
      socket.on("msg-receive", (doc) =>
        handleIncomingMessage(doc, timeoutId, originalTitle)
      );
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
      {receiver?.length > 0 &&
        (callId?.length === 0 || callId?.length === undefined) && (
          <UserPrivateChat
            key={receiver}
            receiver={receiver}
            submitFileHandler={sendFileAsMessageHandler}
            submitHandler={sendMessageHandler}
          />
        )}

      {callId?.length > 0 && (
        <VideoCallTab receiver={receiver} callId={callId} />
      )}

      {receiver.length === 0 && <NoUserSelected />}
    </div>
  );
};

export default Chats;

const UsersList = ({ onChange, receiver }) => {
  return (
    <div
      className={classNames(
        "w-full sm:basis-64 h-full border-x border-neutral-700 px-2  space-y-1.5",
        receiver?.length > 0 ? "hidden sm:block" : "block"
      )}
    >
      <Routes>
        <Route
          path={`users/*`}
          element={<Users onChangeChatUser={onChange} />}
        />
      </Routes>
    </div>
  );
};

const UserPrivateChat = ({ receiver, submitHandler, submitFileHandler }) => {
  return (
    <div
      className={classNames(
        "border-l border-neutral-700 sm:border-0 w-full h-full text-white"
      )}
    >
      <Routes>
        <Route
          path={`users/${receiver}`}
          element={
            <PrivateChat
              submitHandler={submitHandler}
              submitFileHandler={submitFileHandler}
            />
          }
        />
      </Routes>
    </div>
  );
};

const VideoCallTab = ({ receiver, callId, userJoinCallHandler }) => {
  return (
    <div
      className={classNames(
        "border-l border-neutral-700 sm:border-0 w-full h-full text-white"
      )}
    >
      <Routes>
        <Route
          path={`users/${receiver}/${callId}`}
          element={<CallTab userJoinCallHandler={userJoinCallHandler} />}
        />
      </Routes>
    </div>
  );
};

const NoUserSelected = () => {
  return (
    <div className="h-full w-full hidden sm:flex flex-col justify-center items-center">
      <div className="h-[300px] w-[300px] my-8">
        <img src="/assets/nouserrobot-1.gif" className="h-full w-full" />
      </div>
      <Text
        variant="primary"
        className="relative -top-[40px] text-xl font-bold mt-2"
      >
        No user selected
      </Text>
    </div>
  );
};
