import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

import { AuthContextProvider } from './contexts/authContext.jsx';
import { NotificationProvider } from './contexts/notificationContext.jsx';
import { SocketContextProvider } from './contexts/socketContext.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <NotificationProvider>
      <SocketContextProvider>
        <AuthContextProvider>
          <App />
        </AuthContextProvider>
      </SocketContextProvider>
    </NotificationProvider>
  </React.StrictMode>
);
