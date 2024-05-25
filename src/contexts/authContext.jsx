/* eslint-disable react/prop-types */
import { createContext, useEffect, useState } from "react";

import useSocket from "../hooks/useSocket";
import useNotification from "../hooks/useNotification";

const AuthContext = createContext({
  logout: () => {},
  isAuthenticated: false,
  user: {},
  setUser: () => {},
});

const SESSION_STORAGE_KEY = "Radical!@#$&#*#";

export const AuthContextProvider = (props) => {
  const { socket } = useSocket();
  const { handleNotification } = useNotification();

  const [logout, setLogout] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authDetials, setAuthDetials] = useState(null);

  // on component mount, try to retrive user from session storage
  useEffect(() => {
    const savedDetails = sessionStorage.getItem(SESSION_STORAGE_KEY);

    if (savedDetails) {
      setAuthDetials(JSON.parse(savedDetails));
      setIsAuthenticated(true)
    }
  }, []);

  // Connect to socket server with the id of connected user for server side authentication
  // store user details in session storage
  useEffect(() => {
    if (isAuthenticated === true && authDetials?._id) {
      socket.auth = { id: authDetials._id };
      socket.connect();

      sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(authDetials));
    }
  }, [authDetials, isAuthenticated, socket]);

  useEffect(() => {
    if (logout === true) {
      socket.disconnect();

      setAuthDetials(null);
      setIsAuthenticated(false);

      handleNotification.show("success", "Logout successfull.");
    }
  }, [logout]);

  const handleLogout = () => {
    setLogout(true);
  };

  const handleSetUser = (user) => {
    setAuthDetials(user);
    setIsAuthenticated(!!user);
  };

  const contextValue = {
    isAuthenticated,
    user: authDetials,
    logout: handleLogout,
    setUser: handleSetUser,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
