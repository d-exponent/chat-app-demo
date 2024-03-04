import { useContext } from 'react';
import NotificationContext from '../contexts/notificationContext';

const useNotification = () => useContext(NotificationContext)
 
export default useNotification;