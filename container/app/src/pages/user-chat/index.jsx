import { useRef, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getUser } from '../../appstate/users/user_service'
import Text from "../../components/Text";
import Input from "../../components/Input"
import { AiOutlineGif, AiOutlinePlus } from "react-icons/ai";
import { RiGalleryFill } from "react-icons/ri";
import { classNames } from "../../lib/utils"
import { useConnectQuery, useRefetchChatsMutation, } from "../../appstate/chats/chat_service"
import { useSelector } from "react-redux";
import { authSelector } from "../../appstate/auth/auth_slice";
import FileInput from "../../components/Input/FileInput";
import { useToast } from "../../components/Toast";
import { chatAdapterSelector, chatSelector } from "../../appstate/chats/chat_slice"
import Loading from "../../components/Loading";
import Image from "../../components/Images";
import { IoMdSend } from "react-icons/io";

const PrivateChat = ({ submitHandler, submitFileHandler }) => {
  const param = useParams();
  const scrollRef = useRef(null);

  const { add } = useToast();

  const [messageToBeSend, setMessage] = useState("")
  const [image, setImage] = useState("");
  const [prevUser, setPrevUser] = useState(param.id)

  const { user } = useSelector(authSelector);

  const { data: selectedUser, isLoading } = getUser({ id: param?.id });
  const { refetch, data } = useConnectQuery({ from: user._id, to: selectedUser?._id });

  const chats = useSelector(chatAdapterSelector.selectAll);
  const { isLoading: chatLoading } = useSelector(chatSelector);


  useEffect(() => {
    if (prevUser !== selectedUser?._id) {
      refetch();
      setPrevUser(param.id)
      console.log("refetch")
    }
  }, [selectedUser, param])

  useEffect(() => {
    scrollRef?.current?.scrollIntoView();
  }, [chats, data])

  async function sendFileAsMessageHandler() {
    submitFileHandler(user, selectedUser, messageToBeSend)
    setImage("")
    setMessage("")
  }

  async function sendMessageHandler() {
    submitHandler(user, selectedUser, messageToBeSend)
    setImage("")
    setMessage("")
  }
  function checkFileType(file) {
    if (typeof file === "string") return false
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
    return true
  }
  function checkFileOfImage(array = []) {
    let isFounded = ["jpg", "png", "jpeg"].some(ai => {
      return array.includes(ai)
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
        {!chatLoading && <ChatBody
          user={user}
          checkFileOfImage={checkFileOfImage}
          chats={chats}
          scrollRef={scrollRef}
        />}
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
      <Text placeholderClassName="w-48" isLoading={isLoading} className="font-bold">{userName}</Text>
    </div>

  )
}
const ChatBody = ({ scrollRef, chats, user, checkFileOfImage }) => {
  return (
    <div className="pl-2 py-4 h-full flex flex-col gap-4 overflow-y-scroll my-4">
      {chats.map((message, i) => {
        return (
          <div className={classNames(
            message?.from._id === user._id && "self-end",
            "flex gap-2 items-center",
            message?.from._id === user._id && "flex-row-reverse pr-2",
          )}
            key={i}
          >
            <button className='h-10 rounded-full ring-2 ring-dark-placeholder bg-dark-placeholder focus:ring-placeholder'>
              <img
                src={message?.from?._id === user._id ? user?.profilePicture : message?.from?.profilePicture}
                className='w-full h-full object-contain'
              />
            </button>
            <div>
              {checkFileOfImage(message.message) === true ? (
                <img
                  className="h-[200px] w-[200px] object-contain cursor-pointer border border-placeholder py-0.5"
                  src={"http://localhost:5900" + message.message}
                />) : (
                <Text as={"span"} variant="primary" className="px-4 py-1 m-0.5 bg-accent rounded-full" >{message.message}</Text>
              )}
            </div>
          </div>
        )
      })}
      <div ref={scrollRef} />
    </div>
  )
}
const ChatInputWithTool = ({ checkFileType, message, image, messageSetter, imageSetter }) => {
  return (
    <div className="w-full relative flex flex col">
      {
        checkFileType(message) === true && (
          <div className="absolute w-full -top-[120px] bg-dark-placeholder rounded-lg outline-none px-4 py-4">
            <button className="relative w-full h-[80px] cursor-pointer w-[80px]  overflow-hidden focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
              <div className="absolute right-2 rounded-full active:border-2 active:border-primary"
                onClick={() => {
                  imageSetter("")
                  messageSetter("")
                }}
              >&#x2717;</div>
              <img
                className="h-full w-full object-cover"
                src={
                  checkFileType(message) ? image : null
                }
              />
            </button>
          </div>
        )
      }
      <Input variant="normal" className="h-8 w-full"
        value={checkFileType(message) === true ? "" : message}
        onChange={(e) => {
          messageSetter(
            e.target.value
          )
        }}
      />
    </div>
  )
}
const ChatTools = ({
  checkFileType,
  message,
  image,
  imageSetter,
  messageSetter,
  sendFileAsMessageHandler,
  sendMessageHandler
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
        <FileInput as={RiGalleryFill} onChange={(e) => {
          messageSetter(
            e.target.files[0]
          )
        }} />
      </div>
      <ChatInputWithTool
        checkFileType={checkFileType}
        message={message}
        image={image}
        imageSetter={imageSetter}
        messageSetter={messageSetter}
      />
      <div className="cursor-pointer text-accent rounded-md text-lg px-0.5 py-0.5"
      ><IoMdSend onClick={typeof message === "object" ? sendFileAsMessageHandler : sendMessageHandler} /></div>
    </div>
  )
}