/* eslint-disable react/prop-types */

import { useEffect, useRef, useState } from 'react';
import myAxios from '../../helpers/api/axios';
import useAuth from '../../hooks/useAuth';
import useNotification from '../../hooks/useNotification';
import useSocket from '../../hooks/useSocket';
import './message.css';

const Message = ({ chatId }) => {
  const { user } = useAuth();
  const { socket } = useSocket();
  const { handleNotification } = useNotification();

  const [sendMessage, setSendMessage] = useState('');
  const [activityUsername, setActivityUsername] = useState(null);
  const [memberStatus, setMemberStatus] = useState(null);

  const [messages, setMessages] = useState([]);

  const scrollRef = useRef(null);

  useEffect(() => {
    const controller = new AbortController();

    myAxios
      .get(`/api/v1/messages?chatId=${chatId}`, {
        signal: controller.signal,
      })
      .then((res) => setMessages(res.data.data))
      .catch((e) => console.log(e));

    return () => controller.abort();
  }, [chatId]);

  useEffect(() => {
    let timer;

    timer = setTimeout(() => {
      if (activityUsername) setActivityUsername(null);
      if (memberStatus) setMemberStatus(null);
    }, 1000);

    return () => clearTimeout(timer);
  }, [activityUsername, memberStatus]);

  useEffect(() => {
    socket.on('receiveMessage', (data) => {
      setMessages((prev) =>
        prev.some((p) => p.text === data.text && p.createdAt === data.createdAt)
          ? [...prev]
          : [...prev, data]
      );
    });

    socket.on('activity', (user) => {
      setActivityUsername(user.username);
    });

    socket.on('status', (status) => {
      setMemberStatus(status);
    });
  }, [socket]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({
      behaviour: 'smooth',
      block: 'end',
    });
  }, [messages]);

  const handleSetSendMessage = (e) => {
    socket.emit('activity', { chat: chatId, username: user.username });
    setSendMessage(e.target.value);
  };

  const handleCLick = async () => {
    if (sendMessage.length === 0) {
      return handleNotification.show('error', "You didn't write anything");
    }

    const data = {
      senderId: user._id,
      text: sendMessage,
      createdAt: new Date().toISOString(),
    };

    try {
      socket.emit('sendMessage', { chat: chatId, type: 'text', ...data });

      await myAxios.post('/api/v1/messages', {
        chatId: chatId,
        ...data,
      });

      setSendMessage('');
      handleNotification.show('info', 'Message Sent');
    } catch (e) {
      //
    }
  };

  return (
    <div className='message-area'>
      <div className='message-items'>
        <ul className='message-items-wrapper' ref={scrollRef}>
          {messages?.map((m, i) => {
            return (
              <li
                key={i}
                className={
                  m.senderId === user._id
                    ? 'message-item mine'
                    : 'message-item '
                }
              >
                <p>{m.text}</p>
                <small>
                  {new Date(m.createdAt).toLocaleTimeString('en-US')}
                </small>
              </li>
            );
          })}
        </ul>
      </div>
      <div className='message-input'>
        <p className='activity'>
          {activityUsername ? `${activityUsername} is typing ...` : null}
        </p>
        <div className='message-input-wrapper'>
          <textarea
            placeholder='write something ...'
            onChange={handleSetSendMessage}
          />
          <button id='submit-btn' onClick={handleCLick}>
            SEND
          </button>
        </div>
      </div>
    </div>
  );
};

export default Message;
