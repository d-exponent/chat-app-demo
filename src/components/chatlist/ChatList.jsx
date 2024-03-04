/* eslint-disable react/prop-types */

import useAuth from '../../hooks/useAuth';
import useSocket from '../../hooks/useSocket';

import './chatlist.css'

const ChatList = ({ chats, focusOnCurrentChat, previousChatId }) => {
  const { user } = useAuth();
  const { socket } = useSocket();

  const getMember = (chat) =>
    chat.members.find((member) => member.username !== user.username);

  const handleClick = (chatId) => {
    const newChatData = {
      chat: chatId,
      username: user.username,
      id: user._id,
    };


    return () => {
 
        if (previousChatId && previousChatId !== chatId) {
          socket.emit('leaveChat', {
            chat: previousChatId,
            username: user.username,
            id: user._id,
          });
        }


      socket.emit('enterChat', newChatData);
      focusOnCurrentChat(chatId);
    };
  };

  return (
    <ul>
      {chats?.map((chat, i) => (
        <li key={i} onClick={handleClick(chat._id)} className='chat-item'>
          {chat.category === 'group' ? chat.name : getMember(chat).username}
        </li>
      ))}
    </ul>
  );
};

export default ChatList;
