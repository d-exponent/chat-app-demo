import { useContext } from 'react';

import MessagesContext from '../contexts/messagesContext'

const useMessages = () => useContext(MessagesContext);
 
export default useMessages;