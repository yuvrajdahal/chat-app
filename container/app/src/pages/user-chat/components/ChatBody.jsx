import { AiFillDelete } from "react-icons/ai";
import { Suspense, useState } from "react";
import { useDispatch } from "react-redux";
import { useDeletMessageMutation } from "../../../appstate/chats/chat_service";
import { classNames } from "../../../lib/utils";
import Loading from "../../../components/Loading";
import Text from "../../../components/Text";
import { removeMessage } from "../../../appstate/chats/chat_slice";

const ChatBody = ({ scrollRef, chats, user, imageExtIncludes, isSending }) => {
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
                imageExtIncludes
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
export default ChatBody;
function renderMessages(message, setBlobImage, blobImage, imageExtIncludes) {
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
  if (imageExtIncludes(message?.message)) {
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
