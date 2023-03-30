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
  const [notifications, setNotifications] = useState([]);
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
    // This is the provider that will be used in the app
    // The value prop is the state variables and the functions
    // that will be used in the app.
    <ChatContext.Provider
      value={{
        user,
        setUser,
        selectedChat,
        setSelectedChat,
        chats,
        setChats,
        notifications,
        setNotifications,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
export const ChatState = () => {
  return useContext(ChatContext);
};

export default ChatProvider;
