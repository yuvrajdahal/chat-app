import { getUsers } from '../../appstate/users/user_service'
import { useState } from 'react'
import { classNames } from "../../lib/utils"
import Text from '../../components/Text'
import { useDispatch, useSelector } from 'react-redux'
import { authSelector } from '../../appstate/auth/auth_slice'
import { chatSelector } from '../../appstate/chats/chat_slice'
import Image from '../../components/Images'
import { extendedSlice, useRefetchChatsMutation } from "../../appstate/chats/chat_service"
const Users = ({ onChangeChatUser }) => {
  const { userIsLoading, user } = useSelector(authSelector);
  const [index, setIndex] = useState(0)
  const { activeChats } = useSelector(chatSelector);
  const { isSuccess, isLoading, data: users, } =
    getUsers();
  const [refetchChats] = useRefetchChatsMutation();
  function onCardClick(index, id) {
    setIndex(index)
    onChangeChatUser(id);
    refetchChats({ from: user._id, to: id });
  }
  const onlineUsers = isSuccess && users?.data?.filter(everyUser => {
    return activeChats.filter(activeUser => {
      return everyUser._id === activeUser
    })
  })
  const reMappedOnlineUsers = isSuccess && onlineUsers.map(everyOnlineUser => {
    return { ...everyOnlineUser, active: true }
  })
  return (
    <>
      <Text variant='primary' className="font-bold text-xl pt-2">Chats</Text>
      {isSuccess && reMappedOnlineUsers.map((singleUser, i) => {
        return (
          <div
            className={classNames(
              'w-full py-2 rounded px-2 flex gap-2 cursor-pointer',
              "border active:border active:border-dark-placeholder",
              index === i ? "bg-placeholder active:border active:border-white" : ""
            )}
            onClick={() => onCardClick(i, singleUser._id)}
            key={singleUser._id}
          >
            <div className="w-[60px] h-[60px]">
              <Image source={singleUser?.profilePicture} isLoading={isLoading} />
            </div>

            <div>
              <Text variant='primary'>{singleUser.name}</Text>
              {singleUser?.active === true && <Text variant='primary'>Active</Text>}
            </div>
          </div>
        )
      })}
      {isLoading && (
        <PlaceHolderCards isLoading />
      )}

    </>
  )
}
export default Users
const PlaceHolderCards = ({ isLoading, numberOfCards = 2 }) => {
  const nullArrayStructure = [...Array(numberOfCards)]
  return (
    <>
      {nullArrayStructure.map((item, i) => {
        return (
          <div
            className={classNames(
              'w-full py-2 rounded px-2 flex gap-2 cursor-pointer',
              // "border active:border active:border-dark-placeholder",
              "bg-placeholder active:border active:border-white"
            )}
            key={i}
          >
            <div className="w-[60px] h-[60px]">
              <Image source={""} isLoading />
            </div>

            <div>
              <Text variant='primary' placeholderClassName="w-full" isLoading={isLoading}></Text>
            </div>
          </div>
        )
      })}
    </>
  )
}