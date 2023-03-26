import { Box } from "@chakra-ui/layout";
import { useState } from "react";
import ChatsBox from "../components/ChatsBox";
import SideDrawer from "../components/miscellaneous/SideDrawer";
import MyChats from "../components/MyChats";
import { ChatState } from "../Context/ChatProvider";

const ChatPage = () => {
  const { user } = ChatState();
  const [fetchAgain, setFetchAgain] = useState(false);
  return (
    <div style={{ width: "100%" }}>
      {user && <SideDrawer />}
      <Box display="flex" justifyContent={"space-between"} flexDirection="row" width="100%" h="91.5vh" p="10px">
        {user && <MyChats fetchAgain={fetchAgain}/>}
        {user && (
          <ChatsBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
        )}
      </Box>
    </div>
  );
};

export default ChatPage;
