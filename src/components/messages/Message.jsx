/* eslint-disable react/prop-types */

import { useEffect, useRef, useState } from "react";
import axiosForMessageSvc from "../../helpers/api/axios";
import useAuth from "../../hooks/useAuth";
import useNotification from "../../hooks/useNotification";
import useSocket from "../../hooks/useSocket";
import "./message.css";

const Message = ({ chatId }) => {
  const { user } = useAuth();
  const { socket } = useSocket();
  const { handleNotification } = useNotification();

  const [messages, setMessages] = useState([]);
  const [inputBoxValue, setInputBoxValue] = useState("");
  const [userIsTyping, setUserIsTyping] = useState(null);

  const scrollRef = useRef(null);

  // fetch all the messages for a chat by chatId.
  useEffect(() => {
    const controller = new AbortController();

    const options = {
      signal: controller.signal,
    };

    axiosForMessageSvc
      .get(`api/v1/messages?chatId=${chatId}`, options)
      .then((res) => setMessages(res.data.data))
      .catch(console.warn);

    return () => controller.abort();
  }, [chatId]);

  // Reset userIsTyping
  useEffect(() => {
    if (userIsTyping) {
      const timer = setTimeout(setUserIsTyping, 1000, null);

      return () => clearTimeout(timer);
    }
  }, [userIsTyping]);

  const handleReceivedMessageFromSocket = (receivedMessage) => {
    const isSameMessage = (prevMessage) =>
      prevMessage.createdAt === receivedMessage.createdAt &&
      prevMessage.content === receivedMessage.content;

    setMessages((previousMessages) => {
      const isReceivedMessageInMessages = previousMessages.some(isSameMessage);

      return isReceivedMessageInMessages
        ? [...previousMessages]
        : [...previousMessages, receivedMessage];
    });
  };

  useEffect(() => {
    socket.on("recieveMessage", handleReceivedMessageFromSocket);

    socket.on("isTyping", (userData) => {
      setUserIsTyping(userData.username + " is typing");
    });
  });

  useEffect(() => {
    scrollRef.current?.scrollIntoView({
      behaviour: "smooth",
      block: "end",
    });
  }, [messages]);

  const handleMessageInputBoxValue = (e) => {
    setInputBoxValue(e.target.value);
    setUserIsTyping(true);
    socket.emit("showIsTyping", chatId);
  };

  const handleCreateNewMessage = async () => {
    if (inputBoxValue.length === 0) {
      handleNotification.show("error", "You didn't write anything");
      return;
    }

    const data = {
      content: inputBoxValue,
      createdAt: new Date().toISOString(),
      senderId: user._id,
    };

    socket.emit("sendMessage", {
      room: chatId,
      message: data,
    });

    try {
      const res = await axiosForMessageSvc.post("api/v1/messages", {
        chatId,
        ...data,
      });

      setInputBoxValue("");
      setMessages((prevMessages) => [...prevMessages, res.data.data]);
      handleNotification.show("info", "Message Sent");
    } catch {}
  };

  const messagesList = messages?.map((message, i) => {
    return (
      <li
        key={i}
        className={
          message.senderId === user._id ? "message-item mine" : "message-item "
        }
      >
        <p>{message.content}</p>
        <small>{new Date(message.createdAt).toLocaleTimeString("en-US")}</small>
      </li>
    );
  });

  return (
    <div className="message-area">
      <div className="message-items">
        <ul className="message-items-wrapper" ref={scrollRef}>
          {messagesList}
        </ul>
      </div>
      <div className="message-input">
        {userIsTyping && <p className="activity">{userIsTyping}</p>}
        <div className="message-input-wrapper">
          <textarea
            placeholder="write something ..."
            onChange={handleMessageInputBoxValue}
          />
          <button id="submit-btn" onClick={handleCreateNewMessage}>
            SEND
          </button>
        </div>
      </div>
    </div>
  );
};

export default Message;
