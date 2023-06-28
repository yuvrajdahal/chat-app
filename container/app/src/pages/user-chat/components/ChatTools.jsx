import { IoMdSend } from "react-icons/io";
import { AiOutlineGif } from "react-icons/ai";
import { RiGalleryFill } from "react-icons/ri";
import FileInput from "../../../components/Input/FileInput";
import Input from "../../../components/Input";

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
export default ChatTools;
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
