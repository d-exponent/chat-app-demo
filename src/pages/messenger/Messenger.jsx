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
  const { socket } = useSocket();
  const { handleNotification } = useNotification();

  const [userChats, setUserChats] = useState([]);
  const [fetchUserChats, setFetchUserChats] = useState(true);
  const [selectedChatId, setSelectedChatId] = useState(null);

  const userNameInputRef = useRef(null);

  useEffect(() => {
    userChats.forEach((chat) => {
      socket.emit("createRoom", chat._id, console.warn);
    });
  }, [userChats]);

  // /api/v1/chats?memberId=65bce1e36925e90008b3aff3

  // Get All the conversations (chats/CHATS) of the current user from db
  useEffect(() => {
    if (!(user && fetchUserChats)) return;

    const controller = new AbortController();

    const options = {
      signal: controller.signal,
    };

    const handleError = (e) => {
      if (e.status !== 404) {
        handleNotification.show(
          "error",
          e.message ?? "couldn't find any chats"
        );
      } else {
        console.error(e);
      }
    };

    axiosForMessageSvc
      .get(`api/v1/chats?memberId=${user._id}`, options)
      .catch(handleError)
      .then((res) => setUserChats(res.data.data))
      .finally(() => setFetchUserChats(false))

    return () => controller.abort();
  }, [user, fetchUserChats]);

  const getChatIdByMemberUsername = (memberUsername) => {
    const hasMemberUsername = (chat) => {
      return chat.members.some((member) => member.userName === memberUsername);
    };

    const targetChat = userChats.find(hasMemberUsername);

    return targetChat ? targetChat._id : null;
  };

  const deleteChat = async (username) => {
    // must be delete then. GOD I MISS TYPESCRIPT. Why didn't i use typescript here 😒
    const chatId = getChatIdByMemberUsername(username);

    if (chatId == null) {
      return handleNotification.show(
        "error",
        `There is no chat with a friend with username ${username}`
      );
    }

    try {
      await axiosForMessageSvc.delete(`api/v1/chats/${chatId}`);
      console.log("Delte Success 🛑");
    } catch (e) {
      console.error("end chat error", e);
    }
    setFetchUserChats(true);
  };

  const newChat = async (username) => {
    const getUserUrl = `http://localhost:3000/user?userName=${username}`;

    try {
      const { data } = await axios.get(getUserUrl);

      const res = await axiosForMessageSvc.post("api/v1/chats", {
        members: [user._id, data.data._id],
      });

      console.log(res.data);
    } catch (e) {
      if (e.status === 404) {
        handleNotification.show("error", e.message ?? "opps");
      }
      console.error("start new chat error", e);
    }
    setFetchUserChats(true);
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

  return (
    <div className="chats-container">
      <div className="chat-aside-left">
        <div className="chat-items-wrapper">
          <ChatList
            chats={userChats}
            focusOnChat={setSelectedChatId}
            focusedChatId={selectedChatId}
          />
        </div>
      </div>
      <div className="chat-main">
        <div className="chat-main-wrapper">
          {selectedChatId === null && <h2>Your friends await you.</h2>}
          {selectedChatId !== null && <Message chatId={selectedChatId} />}
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
