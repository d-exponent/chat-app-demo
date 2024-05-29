/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { createContext, useEffect, useMemo } from "react";
import { io } from "socket.io-client";

const SocketContext = createContext({
  socket: {
    on: (event, data) => {},
    emit: (event, d) => {},
    disconnect: () => {},
  },
});


const socket = io("http://localhost:8080/chats", {
  autoConnect: false, // hold off on emmiting a connection event 
});

export const SocketContextProvider = (props) => {
  return (
    <SocketContext.Provider value={{ socket }}>
      {props.children}
    </SocketContext.Provider>
  );
};

export default SocketContext;
