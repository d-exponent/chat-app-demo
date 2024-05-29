import useAuth from "../../hooks/useAuth";
import useSocket from "../../hooks/useSocket";

import "./chatlist.css";

const ChatList = ({ chats, focusOnChat, focusedChatId }) => {
  const { user } = useAuth();
  const { socket } = useSocket();

  socket.on("roomUsers", console.table);

  const getOtherChatMember = (chat) =>
    chat.members.find((member) => member.userName !== user.userName);

  const handleDisplayedChatName = (chat) =>
    chat.category === "group" ? chat.name : getOtherChatMember(chat).userName;

  const handleChatItemClick = (chatId) => {
    // Closures are a beautiful thing

    return () => {
      /**
       * This is to ensure that each time the user clicks on a new chat ...
       * ... they are removed from the previous chat room on the server.
       *
       * Also it prevents repitition  of the action if the same chat item is clicked multpile times...
       * ... as it becomes th fcoused chat after the first click
       * */
      if (focusedChatId !== chatId) {
        socket.emit("leaveRoom", {
          room: focusedChatId, // this becomes the previous chatId (room)
          userId: user._id,
        });
      }

      // add the user to a new chat room when ever user focuses on a chat
      // Server ensures the same socket cannot be put in the same room
      const joinRoomData = {
        room: chatId,
        userId: user._id,
      };

      socket.emit("joinRoom", joinRoomData, console.warn);

      focusOnChat(chatId);
    };
  };

  /**
   * The server groups chats into two types.
   * The group chats that can consist of more that two members.
   * The private chats with only two members.
   *
   * Every group chat must have a name assigned only by the admin (creator of the chat).
   * Private chats do not have a name so it's referenced by the other member's userName.
   */
  const chatItems = chats?.map((chat, i) => (
    <li key={i} onClick={handleChatItemClick(chat._id)} className="chat-item">
      {handleDisplayedChatName(chat)}
    </li>
  ));

  return <ul>{chatItems}</ul>;
};

export default ChatList;
