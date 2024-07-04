import { createContext } from "react";
import { io } from "socket.io-client";

const SocketContext = createContext({
  socket: {
    on: (event, data) => {},
    emit: (event, d) => {},
    disconnect: () => {},
  },
});

// const socket = io("https://api.taronapp.com/chats", {
//   path: "/micro-sockets/",
//   autoConnect: false, // hold off on emmiting a connection event so the user can be authenticated. The server needs the user id
// });

const socket = io("http://localhost:8080/chats", {
  autoConnect: false,
  path: "/micro-sockets/",
});

export const SocketContextProvider = (props) => {
  return (
    <SocketContext.Provider value={{ socket }}>
      {props.children}
    </SocketContext.Provider>
  );
};

export default SocketContext;
