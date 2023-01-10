import { useLocation, useNavigate } from "react-router-dom";
import { Suspense, useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import PrivateChat from "../user-chat";
import Users from "../users/index";
import Text from "../../components/Text";
import NavBar from "../../layouts/Nav";
import useSocket from "../../lib/useSocket";
import { addActiveChats, addNewMessage } from "../../appstate/chats/chat_slice";
import { useDispatch, useSelector } from "react-redux";
import { authSelector } from "../../appstate/auth/auth_slice";
import { useSendMessageMutation, useUploadImageMutation } from "../../appstate/chats/chat_service";
import { classNames } from "../../lib/utils";

const Chats = () => {
  const location = useLocation();
  const id = location.pathname.split("/")[3]
  const [receiver, setReceiver] = useState("");
  const navigate = useNavigate();

  const [sendMessage] = useSendMessageMutation();
  const [upload] = useUploadImageMutation();

  const dispatch = useDispatch();
  const socket = useSocket();
  const { user, userIsLoading } = useSelector(authSelector);

  // application socket manager
  useEffect(() => {
    setReceiver(id);
    return () => setReceiver("")
  }, [location])
  useEffect(() => {
    if (!userIsLoading) {
      socket?.emit("add-user", user)
      socket?.on("list-users", (users) => {
        dispatch(addActiveChats(users))
      });
      socket?.on("msg-recieve", doc => {
        dispatch(addNewMessage(doc));
      });
    }
  }, [socket, user]);

  function onChangeChatUser(id) {
    setReceiver(id);
    navigate(`users/${id}`, {
      state: id
    });
  }

  async function sendMessageHandler(user, to, message) {
    dispatch(addNewMessage({
      from: user,
      to: to,
      message: message
    }))
    socket?.emit("send-msg", {
      from: user,
      to: to,
      message: message
    });
    sendMessage({
      from: user,
      to: to,
      message: message
    });
  }

  async function sendFileAsMessageHandler(user, to, message) {
    const formData = new FormData();
    await formData.append("image", message);
    const { data: file } = await upload({ file: formData });
    sendMessage({
      from: user,
      to: to,
      message: file
    });
  }

  return (
    <div className="w-full h-full flex">
      <NavBar />
      <div className='w-full hidden sm:block sm:basis-64 h-full border-x border-neutral-700 px-2  space-y-1.5'>
        <Routes>
          <Route
            path={`users/*`}
            element={
              <Suspense fallback="loading..">
                <Users onChangeChatUser={onChangeChatUser} />
              </Suspense>
            }
          />
        </Routes>
      </div>
      {receiver && receiver.length <= 0 && <div className='w-full block sm:hidden sm:basis-64 h-full border-x border-neutral-700 px-2  space-y-1.5'>
        <Routes>
          <Route
            path={`users/*`}
            element={
              <Suspense fallback="loading..">
                <Users onChangeChatUser={onChangeChatUser} />
              </Suspense>
            }
          />
        </Routes>
      </div>}
      <div className={classNames(
        "border sm:border-0 w-full h-full text-white",
        receiver && receiver.length <= 0 && "hidden"
      )}>
        {receiver ? (
          <Routes>
            <Route
              path={`users/${receiver}`}
              element={
                <Suspense fallback={"loading.."}>
                  <PrivateChat submitHandler={sendMessageHandler} submitFileHandler={sendFileAsMessageHandler} />
                </Suspense>
              }
            />
          </Routes>

        ) : (<div className="h-full w-full hidden sm:flex flex-col justify-center items-center">
          <img src="/assets/nouserrobot-1.gif" />
          <Text variant="primary" className="relative -top-[40px] text-xl font-bold">No user selected</Text>
        </div>)}
      </div>
    </div>
  );
};
export default Chats;
