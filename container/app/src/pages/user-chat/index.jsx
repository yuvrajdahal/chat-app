import { useRef, useEffect, useState, Suspense } from "react";
import { useParams } from "react-router-dom";
import { getUser } from "../../appstate/users/user_service";

import { useConnectQuery } from "../../appstate/chats/chat_service";
import { useSelector } from "react-redux";
import { authSelector } from "../../appstate/auth/auth_slice";
import { useToast } from "../../components/Toast";
import {
  chatAdapterSelector,
  chatSelector,
} from "../../appstate/chats/chat_slice";
import Loading from "../../components/Loading";
import ChatBody from "./components/ChatBody";
import ChatHeader from "./components/ChatHeader";
import ChatTools from "./components/ChatTools";

const PrivateChat = ({
  submitHandler,
  submitFileHandler,
  handleStartRecording,
}) => {
  const param = useParams();
  const scrollRef = useRef(null);

  const { add } = useToast();

  const [messageToBeSend, setMessage] = useState("");
  const [image, setImage] = useState("");

  const { user } = useSelector(authSelector);
  const id = window.location.pathname.split("/")[3];

  const { data } = useConnectQuery({
    from: user._id,
    to: id,
  });
  const { data: selectedUser, isLoading } = getUser({ id: param?.id });
  const chats = useSelector(chatAdapterSelector.selectAll);
  const { isLoading: chatLoading, isSending } = useSelector(chatSelector);

  useEffect(() => {
    // scrolls to bottom
    scrollRef?.current?.scrollIntoView();
  }, [chats, data]);

  async function sendFileAsMessageHandler() {
    submitFileHandler(user, selectedUser, messageToBeSend);
    setImage("");
    setMessage("");
  }

  async function sendMessageHandler() {
    submitHandler(user, selectedUser, messageToBeSend);
    setImage("");
    setMessage("");
  }
  function createFileToUrl(file) {
    if (!file) return false;

    let fileTypes = ["jpg", "jpeg", "png"];

    let extension = file.name.split(".").pop().toLowerCase();

    if (fileTypes.indexOf(extension) > -1 === false) {
      add.error("File must be png or jpeg");
    }
    var reader = new FileReader();
    // url
    reader.readAsDataURL(file);
    reader.onloadend = function (e) {
      setImage(reader.result);
    };
    return true;
  }

  // checks file type
  function imageExtIncludes(array = []) {
    if (array instanceof ArrayBuffer === true) return false;
    let isFounded = ["jpg", "png", "jpeg"].some((ai) => {
      return array.includes(ai);
    });
    return isFounded;
  }
  return (
    <>
      <div className=" h-full flex flex-col justify-between py-2 px-2 overflow-hidden">
        {/* Chat Header */}
        <ChatHeader
          isLoading={isLoading}
          userImage={selectedUser?.profilePicture}
          userName={selectedUser?.name}
          handleStartRecording={handleStartRecording}
          chatId={id}
        />
        {/* Chat body */}
        {!chatLoading && (
          <ChatBody
            user={user}
            imageExtIncludes={imageExtIncludes}
            chats={chats}
            isSending={isSending}
            scrollRef={scrollRef}
          />
        )}
        {chatLoading && (
          <div className="w-full h-full flex justify-center items-center">
            <Loading className="w-[120px] h-[120px]" />
          </div>
        )}
        {/* tools */}
        <ChatTools
          createFileToUrl={createFileToUrl}
          message={messageToBeSend}
          image={image}
          imageSetter={setImage}
          messageSetter={setMessage}
          sendFileAsMessageHandler={sendFileAsMessageHandler}
          sendMessageHandler={sendMessageHandler}
        />
      </div>
    </>
  );
};
export default PrivateChat;
