const { createContext, useState, useEffect, useContext } = require("react");
const { useNavigate } = require("react-router-dom");

const ChatContext = createContext();
const ChatProvider = ({ children }) => {
  // State variables
  const [user, setUser] = useState();
  
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
    <ChatContext.Provider value={{ user, setUser }}>
      {children}
    </ChatContext.Provider>
  );
};
export const ChatState = () => {
  return useContext(ChatContext);
};

export default ChatProvider;
