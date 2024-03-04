/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { createContext, useEffect, useMemo, useState } from 'react';

import Notifification from '../helpers/notification';

const NotificationContext = createContext({
  handleNotification: { show: (_status, _message) => {} },
  content: '',
});

export const NotificationProvider = (props) => {
  const [notifcation, setNotification] = useState(null);

  const appNotification = useMemo(
    () => new Notifification(setNotification),
    [setNotification]
  );

  // Hide notification after five seconds
  useEffect(() => {
    const timeOut = setTimeout(() => {
      appNotification.hide();
    }, 4000);
    return () => clearTimeout(timeOut);
  }, [notifcation, appNotification]);

  const notificationContextValue = {
    content: notifcation,
    handleNotification: appNotification,
  };

  return (
    <NotificationContext.Provider value={notificationContextValue}>
      {props.children}
    </NotificationContext.Provider>
  );
};

export default NotificationContext;
