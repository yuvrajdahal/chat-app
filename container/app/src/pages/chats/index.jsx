import { useLocation, useNavigate } from "react-router-dom";
import { Suspense, useRef, useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import PrivateChat from "../user-chat";
import Users from "../users/index";
import Text from "../../components/Text";
import NavBar from "../../layouts/Nav";
import useSocket from "../../lib/useSocket";
import {
  addActiveChats,
  addNewMessage,
  updateOne,
} from "../../appstate/chats/chat_slice";
import { useDispatch, useSelector } from "react-redux";
import { authSelector } from "../../appstate/auth/auth_slice";
import {
  useSendMessageMutation,
  useUploadImageMutation,
} from "../../appstate/chats/chat_service";
import { classNames } from "../../lib/utils";
import Loading from "../../components/Loading";
import { nanoid } from "@reduxjs/toolkit";

const Chats = () => {
  const id = window.location.pathname.split("/")[3];
  const [receiver, setReceiver] = useState(id);
  const navigate = useNavigate();

  const [sendMessage] = useSendMessageMutation();
  const [upload] = useUploadImageMutation();

  const dispatch = useDispatch();
  const socket = useSocket();
  const { user, userIsLoading } = useSelector(authSelector);
  // set and clear id's according to route
  useEffect(() => {
    if (id) {
      setReceiver(id);
    }
    return () => setReceiver("");
  }, [id]);

  // application socket manager
  useEffect(() => {
    if (!userIsLoading) {
      socket?.emit("add-user", user);
      socket?.on("list-users", (users) => {
        dispatch(addActiveChats(users));
      });
      socket?.on("msg-recieve", (doc) => {
        dispatch(
          addNewMessage({
            _id: nanoid(),
            ...doc,
          })
        );
      });
    }
  }, [socket, user]);

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
    const id = nanoid();
    // dispatch(
    //   addNewMessage({
    // _id: id,
    // from: user,
    // to: to,
    // message: "uploading",
    //   })
    // );
    const { data } = await upload({ file: formData });
    let newId = nanoid();

    const { data: messageRes } = await sendMessage({
      from: user,
      to: to,
      message: data.data?.url,
      cloud_id: data.data?.id,
    });
    dispatch(
      addNewMessage({
        _id: messageRes?.data?._id,
        from: user,
        to: to,
        message: data?.data?.url,
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
      {/* Routes to list user specific chat */}
      <UserPrivateChat
        receiver={receiver}
        submitFileHandler={sendFileAsMessageHandler}
        submitHandler={sendMessageHandler}
      />
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
    <>
      {receiver?.length > 0 ? (
        <div
          className={classNames(
            "border-l border-neutral-700 sm:border-0 w-full h-full text-white"
          )}
        >
          <Routes>
            <Route
              path={`users/${receiver}`}
              element={
                <Suspense
                  fallback={
                    <div className="w-full mt-10 flex justify-center items-center">
                      <Loading />
                    </div>
                  }
                >
                  <PrivateChat
                    submitHandler={submitHandler}
                    submitFileHandler={submitFileHandler}
                  />
                </Suspense>
              }
            />
          </Routes>
        </div>
      ) : (
        <div className="h-full w-full hidden sm:flex flex-col justify-center items-center">
          <img src="/assets/nouserrobot-1.gif" />
          <Text
            variant="primary"
            className="relative -top-[40px] text-xl font-bold"
          >
            No user selected
          </Text>
        </div>
      )}
    </>
  );
};
