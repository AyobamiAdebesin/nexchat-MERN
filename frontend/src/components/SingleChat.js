/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { ArrowBackIcon } from "@chakra-ui/icons";
import {
  Box,
  Flex,
  FormControl,
  IconButton,
  Input,
  Spinner,
  Text,
  Toast,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import "./styles.css";
import React, { useEffect, useState } from "react";
import { getSender, getFullSender } from "../config/ChatLogic";
import { ChatState } from "../Context/ChatProvider";
import ProfileModal from "./miscellaneous/ProfileModal";
import UpdateGroupChatModal from "./miscellaneous/UpdateGroupChatModal";
import ScrollableChat from "./ScrollableChat";
import io from "socket.io-client";

const ENDPOINT = "http://localhost:5000";

var socket, selectedChatCompare;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [display, setDisplay] = useState(false);
  const [socketConnected, setSocketConnected] = useState(false);
  const { user, selectedChat, setSelectedChat } = ChatState();
  const toast = useToast();

  // This useEffect is used to connect to the socket
  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user); // Emitting a setup event to the socket
    socket.on("connection", () => {
      setSocketConnected(true);
    });
  }, []);

  useEffect(() => {
    fetchMessages();
    selectedChatCompare = selectedChat;
  }, [selectedChat]);

  const sendMessage = async (e) => {
    /**
     * This function is used to send a message to the other user
     * It is called when the user presses the enter key
     * It is also called when the user clicks on the send button
     * It will emit a newMessage event to the other user
     */
    if (e.key === "Enter" && newMessage) {
      try {
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };
        // Clear the input field before making the api call
        setNewMessage("");
        const { data } = await axios.post(
          "/api/messages/",
          { content: newMessage, chatId: selectedChat._id },
          config
        );

        console.log(data);
        socket.emit("new message", data);
        setMessages([...messages, data]);
      } catch (error) {
        toast({
          title: "Error Occured!",
          description: "Failed to send the message",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
      }
    }
  };

  useEffect(() => {
    socket.on("message received", (newMessageReceived) => {
      if (
        !selectedChatCompare ||
        selectedChatCompare._id !== newMessageReceived.chat._id
      ) {
        // If the chat is not selected, then we will not add the message to the chat
        // We will give a notification to the user
      } else {
        setMessages([...messages, newMessageReceived]);
      }
    });
  });

  const fetchMessages = async () => {
    /**
     * This function is used to fetch the messages of the selected chat
     * It is called when the selected chat changes
     * It will emit a join chat event to the other user
     */
    if (!selectedChat) return;

    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      setLoading(true);
      const { data } = await axios.get(
        `/api/messages/${selectedChat._id}`,
        config
      );
      console.log(data);
      setMessages(data);
      setLoading(false);

      // Emitting a join chat event to the socket using the chat id
      socket.emit("join chat", selectedChat._id);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to load messages",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };

  const typingHandler = (e) => {
    // This function is used to set the new message before sending it
    setNewMessage(e.target.value);
  };

  return (
    <>
      {selectedChat ? (
        <>
          <Text
            fontSize={{ base: "2xl", md: "3xl" }}
            pb={3}
            px={3}
            w="100%"
            fontFamily="Work Sans"
            display={"flex"}
            justifyContent={{ base: "space-between" }}
            alignItems="center"
          >
            <IconButton
              display={{ base: "flex", md: "none" }}
              icon={<ArrowBackIcon />}
              onClick={() => setSelectedChat("")}
            />
            {!selectedChat.isGroupChat ? (
              <>
                {/** Display the name of the second user in the chat */}
                {getSender(user, selectedChat.users)}

                {/** Display the profile details of the second user in the chat */}
                <ProfileModal user={getFullSender(user, selectedChat.users)} />
              </>
            ) : (
              <>
                {selectedChat.chatName.toUpperCase()}
                <UpdateGroupChatModal
                  fetchAgain={fetchAgain}
                  setFetchAgain={setFetchAgain}
                  fetchMessages={fetchMessages}
                />
              </>
            )}
          </Text>
          <Box
            display={"flex"}
            flexDirection={"column"}
            justifyContent={"flex-end"}
            p={"3"}
            bg={"#E8E8E8"}
            w={"100%"}
            h={"100%"}
            borderRadius={"lg"}
            overflowY={"hidden"}
          >
            {loading ? (
              <Spinner
                size={"xl"}
                width={"20"}
                height={"20"}
                alignSelf={"center"}
                margin={"auto"}
              />
            ) : (
              <div className="messages">
                <ScrollableChat messages={messages} />
              </div>
            )}
            <FormControl onKeyDown={sendMessage} isRequired mt={"1"}>
              <Input
                placeholder="Enter your message"
                variant="filled"
                bg={"white"}
                onChange={typingHandler}
                value={newMessage}
              />
            </FormControl>
          </Box>
        </>
      ) : (
        <Box
          display="flex"
          alignItems={"center"}
          justifyContent={"center"}
          height="100%"
        >
          <Text fontSize={"3xl"} paddingBottom={"3"} fontFamily={"Work sans"}>
            Click on a user to start chatting
          </Text>
        </Box>
      )}
    </>
  );
};

export default SingleChat;
