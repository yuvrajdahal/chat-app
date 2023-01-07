import { getUsers } from '../../appstate/users/user_service'
import { useState } from 'react'
import { classNames } from "../../lib/utils"
import { useNavigate } from 'react-router-dom'
import Text from '../../components/Text'
import { useSelector } from 'react-redux'
import { authSelector } from '../../appstate/auth/auth_slice'
import { useEffect } from 'react';
import { io } from "socket.io-client";
import { chatSelector } from '../../appstate/chats/chat_slice'

const Users = ({ onChangeChatUser }) => {
  const { userIsLoading, user } = useSelector(authSelector);
  const [index, setIndex] = useState(0)
  const { activeChats } = useSelector(chatSelector);
  const { isSuccess, isLoading, data: users, } =
    getUsers()
  function onCardClick(index, id) {
    setIndex(index)
    onChangeChatUser(id)
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
      {isLoading && 'loading'}
      {isSuccess && (
        <>
          <Text variant='primary' className="font-bold text-xl pt-2">Chats</Text>

          {reMappedOnlineUsers.map((singleUser, i) => {
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
                <button className={classNames('w-[60px] h-[60px] rounded-full focus:ring-2',
                  index === i ? "bg-dark-placeholder " : "bg-placeholder",
                  index === i ? " focus:ring-dark-placeholder" : " focus:ring-placeholder"
                )}>
                  <img
                    src={singleUser.profilePicture}
                    className='w-full h-full object-contain'
                  />
                </button>
                <div>
                  <Text variant='primary'>{singleUser.name}</Text>
                  {singleUser?.active === true && <Text variant='primary'>Active</Text>}
                </div>
              </div>
            )
          })}
        </>
      )}{' '}
    </>
  )
}
export default Users
