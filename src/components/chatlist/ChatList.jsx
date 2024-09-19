import useAuth from "../../hooks/useAuth";
import useSocket from "../../hooks/useSocket";

import "./chatlist.css";

const ChatList = ({ chats, focusOnChat, focusedChatId }) => {
  const { user } = useAuth();
  const { socket } = useSocket();

  const getOtherChatMemberUserName = (chat) => {
    const otherMember = chat.members.find(
      (member) => member.userName !== user.userName
    );

    if (otherMember?.userName == null) {
      return 'UnkownUserName';
    } 

    return otherMember.userName;
  };

  /**
   * The server groups chats into two categories.
   * The <group> chats that can consist of more that two members.
   * The <private> chats with only two members.
   *
   * Every <group>chat must have a name assigned only by the admin (creator of the chat).
   * Private chats do not have a name so it's referenced by the other member's userName in this app.
   */
  const chatName = (chat) =>
    chat.category === "group" ? chat.name : getOtherChatMemberUserName(chat);

  const handleChatItemClick = (chatId) => {
    return () => {
      /**
       * This is to ensure that each time the user clicks on a new chat ...
       * ... they are removed from the previous chat room on the server.
       *
       * Also it prevents repitition  of the action if the same chat item is clicked multpile times...
       * ... as it becomes the focused chat after the first click
       * */
      if (focusedChatId !== chatId) {
        socket.emit("leaveRoom", focusedChatId);
      }

      // add the user to a new chat room when ever user focuses on a chat
      // Server ensures the same socket cannot be put in the same room they are already in
      socket.emit("joinRoom", chatId, console.warn);

      focusOnChat(chatId);
    };
  };

  const chatItems = chats?.map((chat, i) => (
    <li key={i} onClick={handleChatItemClick(chat._id)} className="chat-item">
      {chatName(chat)}
    </li>
  ));

  return <ul>{chatItems}</ul>;
};

export default ChatList;
