/* eslint-disable react/prop-types */
import { createContext, useEffect, useState } from 'react';

import useSocket from '../hooks/useSocket';

const AuthContext = createContext({
  logout: () => {},
  isAuthenticated: false,
  user: {},
  setUser: () => {},
});

const SESSION_STORAGE_KEY = 'Radical!@#$&#*#';

export const AuthContextProvider = (props) => {
  const { socket } = useSocket();

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authDetials, setAuthDetials] = useState(null);

  useEffect(() => {
    const savedDetails = sessionStorage.getItem(SESSION_STORAGE_KEY);

    if (savedDetails) {
      setAuthDetials(JSON.parse(savedDetails));
    }
    
  }, []);

  useEffect(() => {
    setIsAuthenticated(Boolean(authDetials));
  }, [authDetials]);

  useEffect(() => {
    if (isAuthenticated) {
      socket.auth = { id: authDetials?._id };
      socket.connect();
      return sessionStorage.setItem(
        SESSION_STORAGE_KEY,
        JSON.stringify(authDetials)
      );
    }
  }, [authDetials, isAuthenticated, socket]);

  const logout = () => {
    socket.disconnect();
    sessionStorage.removeItem(SESSION_STORAGE_KEY);
    setAuthDetials(null)
  };

  const contextValue = {
    logout,
    isAuthenticated,
    user: authDetials,
    setUser: (user) => setAuthDetials(user),
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
