import EmojiPicker from "emoji-picker-react";
import { IoMdSend } from "react-icons/io";
import { BsFillEmojiSunglassesFill } from "react-icons/bs";
import { RiGalleryFill } from "react-icons/ri";
import FileInput from "../../../components/Input/FileInput";
import Input from "../../../components/Input";
import { useState } from "react";

const ChatTools = ({
  createFileToUrl,
  message,
  image,
  imageSetter,
  messageSetter,
  sendFileAsMessageHandler,
  sendMessageHandler,
}) => {
  const [isGifPopOpen, setGifPopOpen] = useState(false);

  return (
    <div className="pl-2 relative flex items-center space-x-2">
      <div
        className="cursor-pointer text-white rounded-full text-sm px-1 py-1 bg-accent"
        onClick={() => {
          setGifPopOpen((prev) => !prev);
          imageSetter("");
          messageSetter("");
        }}
      >
        <BsFillEmojiSunglassesFill />
      </div>
      <div className="cursor-pointer text-white rounded-md text-lg px-0.5 py-0.5 bg-accent">
        <FileInput
          as={RiGalleryFill}
          onChange={(e) => {
            imageSetter(e.target.files[0]);
          }}
        />
      </div>
      <ChatInputWithTool
        isGifPopOpen={isGifPopOpen}
        setGifPopOpen={setGifPopOpen}
        createFileToUrl={createFileToUrl}
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
export default ChatTools;
const ChatInputWithTool = ({
  isGifPopOpen,
  setGifPopOpen,
  createFileToUrl,
  message,
  image,
  messageSetter,
  imageSetter,
  onKeyDown,
}) => {
  return (
    <div className="w-full relative flex flex col">
      {isGifPopOpen === false && image && createFileToUrl(image) === true && (
        <div className="absolute w-full -top-[120px] bg-dark-placeholder rounded-lg outline-none px-4 py-4">
          <button className="relative h-[80px] cursor-pointer w-[80px]  overflow-hidden focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
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
              src={createFileToUrl(image) ? image : null}
            />
          </button>
        </div>
      )}
      {isGifPopOpen && (
        <div className="absolute -top-[370px] -left-[60px] bg-dark-placeholder flex flex-col rounded-lg outline-none px-3 p-1.5">
          <div className="flex justify-between items-center">
            <div className="text-secondary font-semibold text-lg">Emoji</div>
            <button
              className="text-lg cursor-pointer rounded-full focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              onClick={() => {
                setGifPopOpen((prev) => !prev);
              }}
            >
              &#x2717;
            </button>
          </div>
          <div className="pt-2 text-charcoal">
            <EmojiPicker
              height={300}
              width={300}
              onEmojiClick={(emoji) => {
                messageSetter(emoji.emoji);
                setGifPopOpen((prev) => !prev);
              }}
            />
          </div>
        </div>
      )}

      <Input
        variant="normal"
        className="h-8 w-full"
        value={message}
        onKeyDown={onKeyDown}
        onChange={(e) => {
          messageSetter(e.target.value);
        }}
      />
    </div>
  );
};
