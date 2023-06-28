import Image from "../../../components/Images";
import Text from "../../../components/Text";

const ChatHeader = ({ userImage, isLoading, userName }) => {
  return (
    <div className="flex items-center justify-between pr-6">
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
    </div>
  );
};
export default ChatHeader;
