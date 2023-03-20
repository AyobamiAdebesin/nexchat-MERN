import { Box } from "@chakra-ui/react";
import ChatsBox from "../components/ChatsBox";
import SideDrawer from "../components/miscellaneous/SideDrawer";
import MyChats from "../components/MyChats";
import { ChatState } from "../Context/ChatProvider";

const ChatPage = () => {
  const { user } = ChatState();
  return (
    <div style={{ width: "100%" }}>
      {user && <SideDrawer />}
      <Box d="flex" justifyContent={"center"} w="100%" h="91.5vh" p={"10px"}>
        {user && <MyChats />}
        {user && <ChatsBox />}
      </Box>
    </div>
  );
};

export default ChatPage;
