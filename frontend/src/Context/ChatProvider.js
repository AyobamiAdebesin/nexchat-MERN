/**
 * This file contains the context provider for the chat app
 * Author: Ayobami Adebesin
 * @requires react
 * @requires react-router-dom
 * @exports ChatProvider
 * @exports ChatState
 *
 */
const { createContext, useState, useEffect, useContext } = require("react");
const { useNavigate } = require("react-router-dom");
const ChatContext = createContext();
const ChatProvider = ({ children }) => {
  // State variables
  const [user, setUser] = useState();
  const [selectedChat, setSelectedChat] = useState();
  const [chats, setChats] = useState([]);

  const history = useNavigate();
  // A function to check if the user is logged in or not
  // If the user is not logged in, redirect to the home page
  // This function will be called in the useEffect hook
  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    setUser(userInfo);

    if (!userInfo) {
      history("/");
    }
  }, [history]);
  return (
    <ChatContext.Provider
      value={{ user, setUser, selectedChat, setSelectedChat, chats, setChats }}
    >
      {children}
    </ChatContext.Provider>
  );
};
export const ChatState = () => {
  return useContext(ChatContext);
};

export default ChatProvider;
