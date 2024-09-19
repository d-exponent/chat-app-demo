/* eslint-disable react/prop-types */

import { useEffect, useRef, useState } from "react";

import useAuth from "../../hooks/useAuth";
import useNotification from "../../hooks/useNotification";
import useSocket from "../../hooks/useSocket";

import axiosForMessageSvc from "../../helpers/api/axios";
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
    setMessages([]);

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
    // Two messages may have the same content but can never be created at the same time to the millisecond. So we use that
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

  // handle new incoming socket messages
  useEffect(() => {
    socket.on("roomUsers", (payload) => {
      console.log("😁 ROOM USERS", payload);
    });

    socket.on("recieveMessage", handleReceivedMessageFromSocket, console.warn);

    // Handle show is typing

  });

  socket.on("activity", (data) => {
    console.log('Activity Socket response 🛑', data)
    setUserIsTyping(data.userName + " is typing");
  });

  // scroll to bottom of messages pane
  useEffect(() => {
    scrollRef.current?.scrollIntoView({
      behaviour: "smooth",
      block: "end",
    });
  }, [messages]);

  const handleMessageInputBoxValue = (e) => {
    setInputBoxValue(e.target.value);

    //
    socket.emit("showActivity", chatId, (e) => {
      console.log("Show activity Error", e);
    });
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

    setMessages((prevMessages) => [...prevMessages, data]);

    // keep a record of the message in the db so when user logins or refresehes. They can see the message
    try {
      await axiosForMessageSvc.post("api/v1/messages", {
        chatId,
        ...data,
      });

      setInputBoxValue("");
      handleNotification.show("info", "Message Sent");
    } catch {}
  };

  const messagesList = messages?.map((message, i) => {
    return (
      <li
        key={i}
        className={
          message.senderId === user._id ? "message-item mine" : "message-item"
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
            value={inputBoxValue}
          />
          <button id="submit-btn" onClick={handleCreateNewMessage}>
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default Message;
