import { createContext, useEffect, useState } from "react";
import { io } from "socket.io-client";

const SocketContext = createContext({
  socket: {
    on: (event, data) => {},
    emit: (event, d) => {},
    disconnect: () => {},
  },
});

const ioConfig = {
  path: "/micro-sockets/",
  autoConnect: false,
};

// const baseUrl = "http://localhost:8080";
const baseUrl = "https://api.taron.app";

export const SocketContextProvider = (props) => {
  const [lvConn, setLvConn] = useState(false);
  const [LvROOM] = useState("myroom");
  const [EvROOM] = useState("67e5342e2dca0592c1b44541-private");

  const [livestreamSocket] = useState(io(baseUrl + "/livestream", ioConfig));
  const [chatsSocket] = useState(io(baseUrl + "/chats", ioConfig));
  const [socket] = useState(io(baseUrl, ioConfig));

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

  useEffect(() => {
    if (lvConn) return;

    livestreamSocket.auth = { id: "672e50398a94f26295c5c5b1" };
    livestreamSocket.connect();
    setLvConn(true);
  }, [lvConn]);

  useEffect(() => {
    livestreamSocket.on("activity", console.log);
    livestreamSocket.on("online", console.log);
    // livestreamSocket.on("updateDelivered", console.log);
    // livestreamSocket.on("updateIsRead", console.log);
    livestreamSocket.on("roomUsers", console.log);
    livestreamSocket.on("asyncNamespaceError", console.log);
    livestreamSocket.on("newLiveReaction", console.log);
    livestreamSocket.on("liveStreamDetails", console.log);
    livestreamSocket.on("newLiveView", console.log);
    livestreamSocket.on("newDonation", console.log);
    livestreamSocket.on("updateShowComments", console.log);
    
    return () => {
      livestreamSocket.off("roomUsers", console.log);
      // livestreamSocket.off("updateDelivered", console.log);
      // livestreamSocket.off("updateIsRead", console.log);
      livestreamSocket.off("online", console.log);
      livestreamSocket.off("asyncNamespaceError", console.log);
      livestreamSocket.off("newLiveReaction", console.log);
      livestreamSocket.off("activity", console.log);
      livestreamSocket.off("liveStreamDetails", console.log);
      livestreamSocket.off("newLiveView", console.log);
      livestreamSocket.off("newDonation", console.log);
      livestreamSocket.off("updateShowComments", console.log);
    };
  }, []);

  const createRooms = () => {
    livestreamSocket.emit("createRoom", EvROOM, (success) => {
      console.log("Create", EvROOM, success);
      livestreamSocket.emit("createRoom", LvROOM, (success) => {
        console.log("Create", LvROOM, success);
        setLvConn(true);
      });
    });
  };

  const handleAddReaction = () => {
    livestreamSocket.emit("newLiveReaction", {
      room: LvROOM,
      liveId: "67d2ec924fca6609ea75764f",
      eventId: "67cf5fd10a64ba519129bb32",
      reactionType: "love",
      action: "add",
    });
  };

  const handleDeleteReaction = () => {
    livestreamSocket.emit("newLiveReaction", {
      room: LvROOM,
      liveId: "67d2ec924fca6609ea75764f",
      eventId: "67cf5fd10a64ba519129bb32",
      reactionType: "love",
      action: "delete",
    });
  };

  const handleAddView = () => {
    livestreamSocket.emit("newLiveView", {
      room: LvROOM,
      liveId: "67d2ec924fca6609ea75764f",
      eventId: "67cf5fd10a64ba519129bb32",
      action: "add",
    });
  };

  const handleDeleteView = () => {
    livestreamSocket.emit("newLiveView", {
      room: LvROOM,
      liveId: "67d2ec924fca6609ea75764f",
      eventId: "67cf5fd10a64ba519129bb32",
      action: "delete",
    });
  };

  const handleFetchMyLiveStreamDetails = () => {
    livestreamSocket.emit("liveStreamDetails", "67d2ec924fca6609ea75764f");
  };

  const handleSeeOnlineUsers = () => {
    livestreamSocket.emit("online");
  };

  const getRoomMembers = () => {
    console.log("Getting room members");

    livestreamSocket.emit("getMembers", LvROOM);
    livestreamSocket.emit("getMembers", EvROOM);
  };

  const values = {
    socket,
    chatsSocket,
    livestreamSocket,
    socketMsg: message,
    setMessage,
  };

  return (
    <SocketContext.Provider value={values}>
      {lvConn && (
        <>
          <button onClick={handleAddReaction}>Add React</button>
          <button onClick={handleDeleteReaction}>Delete React</button>
          <button onClick={handleAddView}>Add View</button>
          <button onClick={handleDeleteView}>Delete View</button>
          <button onClick={getRoomMembers}> Room </button>
          <button onClick={createRooms}> Create Room </button>
          <button onClick={handleSeeOnlineUsers}> Online </button>
          <button onClick={handleFetchMyLiveStreamDetails}>
            {" "}
            Live Details{" "}
          </button>
        </>
      )}

      {props.children}
    </SocketContext.Provider>
  );
};

export default SocketContext;
