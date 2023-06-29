import { getUsers } from "../../appstate/users/user_service";
import { useState } from "react";
import { classNames } from "../../lib/utils";
import Text from "../../components/Text";
import { useDispatch, useSelector } from "react-redux";
import { removeAll, removePreviousChat } from "../../appstate/chats/chat_slice";
import Image from "../../components/Images";
import {
  extendedSlice,
  useRefetchChatsMutation,
} from "../../appstate/chats/chat_service";
import store from "../../appstate/store";
import { authSelector } from "../../appstate/auth/auth_slice";
import useSocket from "../../lib/useSocket";

const Users = ({ onChangeChatUser }) => {
  const [index, setIndex] = useState(0);
  const { isSuccess, isLoading, data: users } = getUsers();
  const { user } = useSelector(authSelector);
  const dispatch = useDispatch();
  const [refetchChats] = useRefetchChatsMutation();
  const socket = useSocket();
  function onCardClick(index, id) {
    dispatch(removePreviousChat());
    setIndex(index);
    onChangeChatUser(id);
    refetchChats({ from: user?._id, to: id });
  }
  const paramId = window.location.pathname.split("/")[3];
  return (
    <>
      <Text variant="primary" className="font-bold text-xl pt-2">
        Chats
      </Text>
      {users?.data.length < 1 && (
        <div
          className={classNames(
            "w-full py-4 rounded px-2 flex gap-2 cursor-pointer ",
            "border active:border active:border-dark-placeholder",
            "flex justfify-center items-center "
          )}
        >
          <div>
            <Text variant="primary">No Users</Text>
          </div>
        </div>
      )}
      {isSuccess &&
        users?.data.map((singleUser, i) => {
          return (
            <div
              className={classNames(
                "w-full py-2 rounded px-2 flex gap-2 cursor-pointer",
                "border active:border active:border-dark-placeholder",
                paramId === singleUser._id &&
                  "bg-placeholder active:border active:border-white"
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
