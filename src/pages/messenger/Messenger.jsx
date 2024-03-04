import { useEffect, useState } from 'react';

import useAuth from '../../hooks/useAuth';
import useNotification from '../../hooks/useNotification';

import myAxios from '../../helpers/api/axios';

import ChatList from '../../components/chatlist/ChatList';
import Message from '../../components/messages/Message';

import './messenger.css';

const Messenger = () => {
  const { user } = useAuth();
  const { handleNotification } = useNotification();

  const [chats, setChats] = useState([]);
  const [currentChatId, setCurrentChatId] = useState(null);

  // Get All the conversations (chatS/CHATS) of the current user from db
  useEffect(() => {
    const controller = new AbortController();
    const url = `/api/v1/chats?memberId=${user?._id}`;
    const signal = controller.signal;

    myAxios
      .get(url, { signal })
      .then((res) => setChats(res.data.data))
      .catch((e) => {
        if (e.request.status === 404)
          return handleNotification.show('info', 'Start a new conversation');
        console.log(e.message);
      });

    return () => controller.abort();
  }, [handleNotification, user._id]);

  return (
    <div className='chats-container'>
      <div className='chat-aside-left'>
        <div className='chat-aside-left-wrapper'>
          <ChatList chats={chats} focusOnCurrentChat={setCurrentChatId} previousChatId={currentChatId} />
        </div>
      </div>
      <div className='chat-main'>
        <div className='chat-main-wrapper'>
          {currentChatId === null ? (
            <h2>Your friends await you.</h2>
          ) : (
            <Message chatId={currentChatId} />
          )}
        </div>
      </div>
      <div className='chat-aside-right'></div>
    </div>
  );
};

export default Messenger;
