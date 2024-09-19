import { useEffect, useState, useRef } from "react";

import useAuth from "../../hooks/useAuth";
import useNotification from "../../hooks/useNotification";
import useSocket from "../../hooks/useSocket";

import ChatList from "../../components/chatlist/ChatList";
import Message from "../../components/messages/Message";

import axiosForMessageSvc from "../../helpers/api/axios";

import "./messenger.css";
import axios from "axios";

const Messenger = () => {
  const { user } = useAuth();
  const { socket, socketMsg } = useSocket();
  const { handleNotification } = useNotification();

  const [userChats, setUserChats] = useState([]);
  const [fetchUserChats, setFetchUserChats] = useState(true);
  const [focusedChatId, setFocusedChatId] = useState(null);

  const userNameInputRef = useRef(null);

  useEffect(() => {
    console.log("Creating room 👍👍");
    socket.emit("createRoom", socketMsg.chatId, console.warn);
  }, []);

  // Focus on the first chat
  useEffect(() => {
    if (userChats.length && focusedChatId === null) {
      setFocusedChatId(userChats[0]._id);
    }
  }, [userChats, focusedChatId]);

  useEffect(() => {
    // Create a new room for each chat by chatId
    // If the room already exists or the socket is already in the room. It will be ingnored otherwise it will be added respectively
    userChats.forEach((chat) => {
      socket.emit("createRoom", chat._id, (e) => {
        console.warn("🛑Create room error", e);
      });
    });
  }, [userChats]);

  const handleFetchChatsForUserError = (e) => {
    if (e.status !== 404) {
      handleNotification.show("error", e.message ?? "couldn't find any chats");
      return;
    }
    console.error(e);
  };

  // Get All the conversations (chats/CHATS) of the current user from db
  useEffect(() => {
    if (!(user && fetchUserChats)) return;

    const controller = new AbortController();

    const options = {
      signal: controller.signal,
    };

    axiosForMessageSvc
      .get(`api/v1/chats?memberId=${user._id}`, options)
      .then((res) => setUserChats(res.data.data))
      .then(() => setFetchUserChats(false))
      .catch(handleFetchChatsForUserError);

    return () => controller.abort();
  }, [user, fetchUserChats]);

  const getChatIdByMemberUsername = (username) => {
    const hasMemberUsername = (chat) =>
      chat.members.some((member) => member.userName === username);

    const targetChat = userChats.find(hasMemberUsername);

    return targetChat ? targetChat._id : null;
  };

  const deleteChat = async (username) => {
    const chatId = getChatIdByMemberUsername(username);

    if (chatId == null) {
      return handleNotification.show(
        "error",
        `There is no chat with a friend with username ${username}`
      );
    }

    try {
      await axiosForMessageSvc.delete(`api/v1/chats/${chatId}`);
    } catch (e) {
      console.error("end chat error", e);
    } finally {
      setFetchUserChats(true);
    }
  };

  const newChat = async (username) => {
    try {
      // Get the friends User Object from db with their username
      const { data } = await axios.get(
        `http://localhost:3000/user?userName=${username}`
      );

      // Create a new chat with friend using the friendId from above fetch call
      await axiosForMessageSvc.post("api/v1/chats", {
        members: [user._id, data.data._id],
      });
    } catch (e) {
      console.error("start new chat error", e);
    } finally {
      setFetchUserChats(true);
    }
  };

  const handleStartDeleteChat = (action) => async () => {
    const userName = userNameInputRef.current?.value;

    if (!userName) {
      return handleNotification.show("error", "Provide your friends username");
    }

    if (userName === user.userName) {
      return handleNotification.show(
        "error",
        `You can not ${action} a chat with yourself`
      );
    }

    action === "start" ? await newChat(userName) : await deleteChat(userName);
  };

  const handleUpdateIsDelivered = () => {
    console.log("Updating delivered");

    const msg = {
      ...socketMsg,
      isDelivered: true,
      from: user.userName ?? user.email,
    };

    socketMsg.isDelivered = true;
    socket.emit("updateDelivered", msg, console.warn);
  };

  const handleUpdateIsRead = () => {
    console.log("Updating IsRead");

    const msg = structuredClone({
      ...socketMsg,
      isRead: true,
      isReadAt: new Date(),
      from: user.userName ?? user.email,
    });

    socket.emit("updateIsRead", msg, console.warn);

  };

  return (
    <div className="chats-container">
      <div>
        <button onClick={handleUpdateIsRead}> updateIsRead</button>
        <button onClick={handleUpdateIsDelivered}> updateIsDelivered</button>
      </div>
      <div className="chat-aside-left">
        <div className="chat-items-wrapper">
          <ChatList
            chats={userChats}
            focusOnChat={setFocusedChatId}
            focusedChatId={focusedChatId}
          />
        </div>
      </div>
      <div className="chat-main">
        <div className="chat-main-wrapper">
          {focusedChatId === null && (
            <h2>{"Start chatting with friends and family"}</h2>
          )}

          {focusedChatId !== null && <Message chatId={focusedChatId} />}
        </div>
      </div>
      <div className="chat-aside-right">
        <div className="start-chat-wrapper">
          <input
            type="text"
            placeholder="Friends username"
            ref={userNameInputRef}
          />
          <div>
            <button onClick={handleStartDeleteChat("start")}>start</button>
            <button onClick={handleStartDeleteChat("delete")}>delete</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Messenger;
