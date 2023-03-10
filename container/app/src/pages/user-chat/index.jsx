import { useRef, useEffect, useState, Suspense } from "react";
import { useLocation, useParams } from "react-router-dom";
import { getUser } from "../../appstate/users/user_service";
import Text from "../../components/Text";
import Input from "../../components/Input";
import { AiFillDelete, AiOutlineGif, AiOutlinePlus } from "react-icons/ai";
import { RiGalleryFill } from "react-icons/ri";

import { classNames } from "../../lib/utils";
import {
  extendedSlice,
  useConnectQuery,
  useDeletMessageMutation,
  useRefetchChatsMutation,
  useUploadImageMutation,
} from "../../appstate/chats/chat_service";
import { useDispatch, useSelector } from "react-redux";
import { authSelector } from "../../appstate/auth/auth_slice";
import FileInput from "../../components/Input/FileInput";
import { useToast } from "../../components/Toast";
import {
  setMessage as dispatchMessage,
  chatAdapterSelector,
  chatSelector,
  removeMessage,
  removeAll,
} from "../../appstate/chats/chat_slice";
import Loading from "../../components/Loading";
import Image from "../../components/Images";
import { IoMdSend } from "react-icons/io";
import { nanoid } from "@reduxjs/toolkit";

const PrivateChat = ({ submitHandler, submitFileHandler }) => {
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
  const dispatch = useDispatch();

  // scrolls to bottom

  useEffect(() => {
    scrollRef?.current?.scrollIntoView();
  }, [chats, data]);

  async function sendFileAsMessageHandler() {
    submitFileHandler(user, selectedUser, messageToBeSend);
    setImage("");
    setMessage("");
  }

  async function sendMessageHandler(i) {
    submitHandler(user, selectedUser, messageToBeSend);
    setImage("");
    setMessage("");
  }
  function checkFileType(file) {
    if (typeof file === "string") return false;
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
  function checkFileOfImage(array = []) {
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
        />
        {/* Chat body */}
        {!chatLoading && (
          <ChatBody
            user={user}
            checkFileOfImage={checkFileOfImage}
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
          checkFileType={checkFileType}
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
const ChatHeader = ({ userImage, isLoading, userName }) => {
  return (
    <div className="h-14 w-full border-b border-neutral-700 flex items-center space-x-2 pb-2 px-2">
      <div className="w-12 h-12 ">
        <Image source={userImage} isLoading={isLoading} />
      </div>
      <Text
        placeholderClassName="w-48"
        isLoading={isLoading}
        className="font-bold"
      >
        {userName}
      </Text>
    </div>
  );
};
const ChatBody = ({ scrollRef, chats, user, checkFileOfImage, isSending }) => {
  const [isHover, setHover] = useState({
    id: null,
    isHover: false,
  });
  const dispatch = useDispatch();
  const [deleteMessage] = useDeletMessageMutation();
  const [blobImage, setBlobImage] = useState(null);
  function deleteMessageHandler(id) {
    dispatch(removeMessage(id));
    deleteMessage({ id: id });
  }
  function onMouseEnter(message) {
    if (message.from._id !== user._id) return;
    setHover({
      id: message._id,
      isHover: true,
    });
  }
  function onMouseLeave(message) {
    if (message.from._id !== user._id) return;
    setHover({
      id: message._id,
      isHover: false,
    });
  }
  const showDeleteIconForConditions = (message) =>
    isHover?.id === message?._id &&
    isHover?.isHover == true &&
    message?._id.length !== 10;
  const isMe = (message) => message?.from._id === user?._id;
  return (
    <div className="pl-2 py-4 h-full flex flex-col gap-4 overflow-y-scroll my-4">
      {chats.map((message) => {
        return (
          <div
            className={classNames(
              "flex gap-2 items-center",
              isMe(message) && "flex-row-reverse pr-2 self-end"
            )}
            key={message?._id}
            onMouseEnter={() => onMouseEnter(message)}
            onMouseLeave={() => onMouseLeave(message)}
          >
            <button className="h-10 rounded-full ring-2 ring-dark-placeholder bg-dark-placeholder focus:ring-placeholder">
              <img
                src={
                  message?.from?._id === user._id
                    ? user?.profilePicture
                    : message?.from?.profilePicture
                }
                className="w-full h-full object-contain"
              />
            </button>
            <Suspense
              fallback={
                <div className="w-full h-full flex justify-center items-center">
                  <Loading className="w-[120px] h-[120px]" />
                </div>
              }
            >
              {renderMessages(
                message,
                setBlobImage,
                blobImage,
                checkFileOfImage
              )}
            </Suspense>
            {showDeleteIconForConditions(message) && (
              <AiFillDelete
                className="text-dark-placeholder cursor-pointer hover:text-red-500"
                onClick={() => {
                  deleteMessageHandler(message?._id);
                }}
              />
            )}
          </div>
        );
      })}
      <div ref={scrollRef} />
    </div>
  );
};
function renderMessages(message, setBlobImage, blobImage, checkFileOfImage) {
  // takes ArrayBuffer image as argument and converts into url
  // and return true
  async function convertFromBufferToImage(image) {
    let blob = new Blob([image], { type: "image/png" });
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onloadend = function () {
      setBlobImage(reader.result);
    };
    return true;
  }
  if (message?.message instanceof ArrayBuffer === true) {
    return (
      <div
        className={classNames(
          "max-w-[120px] sm:max-w-[220px] md:max-w-[320px] break-words rounded-md"
        )}
      >
        <img
          className="h-[200px] w-[200px] object-contain cursor-pointer border border-placeholder py-0.5"
          src={convertFromBufferToImage(message?.message) && blobImage}
        />
      </div>
    );
  }
  if (checkFileOfImage(message?.message)) {
    return (
      <div
        className={classNames(
          "max-w-[120px] sm:max-w-[220px] md:max-w-[320px] break-words rounded-md "
        )}
      >
        <img
          className="h-[200px] w-[200px] object-contain cursor-pointer border border-placeholder py-0.5"
          src={message?.message}
        />
      </div>
    );
  }
  return (
    <div
      className={classNames(
        "max-w-[120px] sm:max-w-[220px] md:max-w-[320px] break-words rounded-md bg-accent"
      )}
    >
      <Text
        as={"div"}
        variant="primary"
        className="px-4 py-1 m-0.5 text-lg sm:text-base"
      >
        {message?.message}
      </Text>
    </div>
  );
}
const ChatInputWithTool = ({
  checkFileType,
  message,
  image,
  messageSetter,
  imageSetter,
  onKeyDown,
}) => {
  return (
    <div className="w-full relative flex flex col">
      {checkFileType(message) === true && (
        <div className="absolute w-full -top-[120px] bg-dark-placeholder rounded-lg outline-none px-4 py-4">
          <button className="relative w-full h-[80px] cursor-pointer w-[80px]  overflow-hidden focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
            <div
              className="absolute right-2 rounded-full active:border-2 active:border-primary"
              onClick={() => {
                imageSetter("");
                messageSetter("");
              }}
            >
              &#x2717;
            </div>
            <img
              className="h-full w-full object-cover"
              src={checkFileType(message) ? image : null}
            />
          </button>
        </div>
      )}
      <Input
        variant="normal"
        className="h-8 w-full"
        value={checkFileType(message) === true ? "" : message}
        onKeyDown={onKeyDown}
        onChange={(e) => {
          messageSetter(e.target.value);
        }}
      />
    </div>
  );
};
const ChatTools = ({
  checkFileType,
  message,
  image,
  imageSetter,
  messageSetter,
  sendFileAsMessageHandler,
  sendMessageHandler,
}) => {
  return (
    <div className="pl-2 relative flex items-center space-x-2">
      <div className="cursor-pointer text-white rounded-full text-sm px-1 py-1 bg-accent">
        <AiOutlinePlus />
      </div>
      <div className="cursor-pointer text-white rounded-full text-sm px-1 py-1 bg-accent">
        <AiOutlineGif />
      </div>
      <div className="cursor-pointer text-white rounded-md text-lg px-0.5 py-0.5 bg-accent">
        <FileInput
          as={RiGalleryFill}
          onChange={(e) => {
            messageSetter(e.target.files[0]);
          }}
        />
      </div>
      <ChatInputWithTool
        checkFileType={checkFileType}
        message={message}
        image={image}
        imageSetter={imageSetter}
        messageSetter={messageSetter}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            typeof message === "object"
              ? sendFileAsMessageHandler()
              : sendMessageHandler();
          }
        }}
      />
      <div className="cursor-pointer text-accent rounded-md text-lg px-0.5 py-0.5">
        <IoMdSend
          onClick={
            typeof message === "object"
              ? sendFileAsMessageHandler
              : sendMessageHandler
          }
        />
      </div>
    </div>
  );
};
