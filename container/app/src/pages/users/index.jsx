import { getUsers } from "../../appstate/users/user_service";
import { useState } from "react";
import { classNames } from "../../lib/utils";
import Text from "../../components/Text";
import { useDispatch } from "react-redux";
import { removePreviousChat } from "../../appstate/chats/chat_slice";
import Image from "../../components/Images";
import { extendedSlice } from "../../appstate/chats/chat_service";
const Users = ({ onChangeChatUser }) => {
  const [index, setIndex] = useState(0);
  const { isSuccess, isLoading, data: users } = getUsers();
  const dispatch = useDispatch();
  function onCardClick(index, id) {
    dispatch(removePreviousChat());
    setIndex(index);
    onChangeChatUser(id);
    dispatch(extendedSlice.util.invalidateTags(["Chats"]));
  }

  return (
    <>
      <Text variant="primary" className="font-bold text-xl pt-2">
        Chats
      </Text>
      {isSuccess &&
        users?.data.map((singleUser, i) => {
          return (
            <div
              className={classNames(
                "w-full py-2 rounded px-2 flex gap-2 cursor-pointer",
                "border active:border active:border-dark-placeholder",
                index === i
                  ? "bg-placeholder active:border active:border-white"
                  : ""
              )}
              onClick={() => onCardClick(i, singleUser._id)}
              key={singleUser._id}
            >
              <div className="w-[60px] h-[60px]">
                <Image
                  source={singleUser?.profilePicture}
                  isLoading={isLoading}
                />
              </div>

              <div>
                <Text variant="primary">{singleUser.name}</Text>
              </div>
            </div>
          );
        })}
      {isLoading && <PlaceHolderCards isLoading />}
    </>
  );
};
export default Users;
const PlaceHolderCards = ({ isLoading, numberOfCards = 2 }) => {
  const nullArrayStructure = [...Array(numberOfCards)];
  return (
    <>
      {nullArrayStructure.map((item, i) => {
        return (
          <div
            className={classNames(
              "w-full py-2 rounded px-2 flex gap-2 cursor-pointer",
              // "border active:border active:border-dark-placeholder",
              "bg-placeholder active:border active:border-white"
            )}
            key={i}
          >
            <div className="w-[60px] h-[60px]">
              <Image source={""} isLoading />
            </div>

            <div>
              <Text
                variant="primary"
                placeholderClassName="w-full"
                isLoading={isLoading}
              ></Text>
            </div>
          </div>
        );
      })}
    </>
  );
};
