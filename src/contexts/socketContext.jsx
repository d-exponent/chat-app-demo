import { createContext, useEffect, useState } from "react";
import { io } from "socket.io-client";

const SocketContext = createContext({
  socket: {
    on: (event, data) => {},
    emit: (event, d) => {},
    disconnect: () => {},
  },
});

const wsURL = "https://api.taronapp.com/chats";
// const wsURL = "http://localhost:8080/chats";

const socket = io(wsURL, {
  path: "/micro-sockets/",
  autoConnect: false,
});

export const SocketContextProvider = (props) => {
  const [message, setMessage] = useState({
    chatId: "6651b54b925cc559c703c23d",
    senderId: "64892168c709274d688b78eb",
    content:
      "Lovely duesday. It's sunny here. Really nice weather and lovely scenery",
    category: "text",
    isLocation: false,
    isDelivered: false,
    isRead: false,
    _id: "669e8d89389ef8cc016ee669",
    createdAt: "2024-07-22T16:49:13.176Z",
    updatedAt: "2024-07-22T16:49:13.176Z",
    __v: 0,
  });




  socket.on("roomUsers", (payload) => {
    console.log("RoomUSers", payload);
  });

  socket.on("updateDelivered", (message) => {
    console.log("👍👍 updateDelivered Message", message);
  });

  socket.on("updateIsRead", (message) => {
    console.log("👍👍 updateIsRead Message", message);
  });

  socket.on("online", (data) => {
    console.log("🛑 getting Online Users", data);
  });

  socket.on("asyncNamespaceError", (e) => {
    console.warn("🛑Async Error from backend", e);
  });

  socket.on("activity", (payload) => {
    console.log("Got activity 🛑🛑");
    console.log(payload);
  });

  const handleSeeOnlineUsers = () => {
    console.log("Emitting Online Event 🛑");
    socket.emit("online");
  };

  return (
    <SocketContext.Provider value={{ socket, socketMsg: message, setMessage }}>
      <button onClick={handleSeeOnlineUsers}> See Online Users</button>
      {props.children}
    </SocketContext.Provider>
  );
};

export default SocketContext;
