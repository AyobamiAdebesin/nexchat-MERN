/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { useDisclosure } from "@chakra-ui/hooks";
import { Button } from "@chakra-ui/button";
import { IconButton } from "@chakra-ui/button";
import { ViewIcon } from "@chakra-ui/icons";
import axios from "axios";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
} from "@chakra-ui/modal";
import { ChatState } from "../../Context/ChatProvider";
import {
  Box,
  Flex,
  FormControl,
  Input,
  Spinner,
  useToast,
} from "@chakra-ui/react";
import UserBadgeItem from "../UserAvatar/UserBadgeItem";
import UserListItem from "../UserAvatar/UserListItem";
const UpdateGroupChatModal = ({ fetchAgain, setFetchAgain }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { selectedChat, setSelectedChat, user } = ChatState();
  const [groupChatName, setGroupChatName] = useState("");
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [renameloading, setRenameLoading] = useState(false);
  const toast = useToast();

  /**
   * Functions handlers
   */
  const handleRemove = async (user1) => {
    // Check if user is the group admin and if the user to be removed is the group admin
    //
    if (selectedChat.groupAdmin._id !== user._id && user1._id !== user._id) {
      toast({
        title: "Error",
        description: "Operation denied! You are not the group admin.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.put(
        "api/chats/removeuser",
        { userId: user1._id, chatId: selectedChat._id },
        config
      );
      // If the user has removed himself, then set the selected chat to null
      // since we don't want to show the chat anymore
      user1._id === user._id ? setSelectedChat() : setSelectedChat(data);
      // Fetch again to update the chats
      setFetchAgain(!fetchAgain);
      // Stop loading
      setLoading(false);
    } catch (error) {
      toast({
        title: "Error",
        description: error.response.data.message,
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }
  };
  const handleRename = async () => {
    if (!groupChatName) return;

    try {
      setRenameLoading(true);
      console.log(`Token: ${user.token}`);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.put(
        `/api/chats/rename`,
        { chatId: selectedChat._id, chatName: groupChatName },
        config
      );
      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setRenameLoading(false);
    } catch (error) {
      toast({
        title: "Error",
        description: error.response.data.message,
        status: "error",
        duration: 9000,
        isClosable: true,
      });
      setRenameLoading(false);
    }
    setGroupChatName("");
  };
  const handleAddUser = async (user1) => {
    if (selectedChat.users.find((u) => u._id === user1._id)) {
      toast({
        title: "Error",
        description: "User already in group",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
      return;
    }
    if (selectedChat.groupAdmin._id !== user._id) {
      toast({
        title: "Error",
        description: "Operation denied! You are not the group admin.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.put(
        "api/chats/adduser",
        { userId: user1._id, chatId: selectedChat._id },
        config
      );
      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setLoading(false);
    } catch (error) {
      toast({
        title: "Error",
        description: error.response.data.message,
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }
  };
  const handleSearch = async (value) => {
    setSearch(value);

    if (!value) {
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(`api/users?search=${value}`, config);
      console.log(data);
      setLoading(false);
      setSearchResults(data);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to load search results",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };
  return (
    <>
      <IconButton
        display={{ base: "flex" }}
        icon={<ViewIcon />}
        onClick={onOpen}
      />

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontSize={"40px"}
            fontFamily={"Work sans"}
            display={"flex"}
            justifyContent={"center"}
          >
            {selectedChat.chatName}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Flex>
              <Box
                wwidth={"100%"}
                display={"flex"}
                flexWrap={"wrap"}
                pb={"3}"}
                flexDirection={"row"}
              >
                {selectedChat.users.map((u) => (
                  <UserBadgeItem
                    user={u}
                    key={u._id}
                    handleFunction={() => handleRemove(u)}
                  />
                ))}
              </Box>
            </Flex>
            <FormControl d={"flex"}>
              <Flex>
                <Input
                  placeholder={"Chat Name"}
                  mb={"3"}
                  value={groupChatName}
                  onChange={(e) => setGroupChatName(e.target.value)}
                />
                <Button
                  variant={"solid"}
                  colorScheme={"teal"}
                  ml={"1"}
                  isLoading={renameloading}
                  onClick={handleRename}
                >
                  Update
                </Button>
              </Flex>
            </FormControl>
            <FormControl>
              <Input
                placeholder="Add user to a group chat"
                mb={"1"}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </FormControl>
            {loading ? (
              <Spinner size={"lg"} />
            ) : (
              searchResults?.map((u) => (
                <UserListItem
                  key={u.timestamp}
                  user={u}
                  handleFunction={() => handleAddUser(u)}
                />
              ))
            )}
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="red" mr={3} onClick={() => handleRemove(user)}>
              Exit Group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default UpdateGroupChatModal;
