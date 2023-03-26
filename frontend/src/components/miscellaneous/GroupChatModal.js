/* eslint-disable no-unused-vars */
import {
  Button,
  FormControl,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { Box, Flex } from "@chakra-ui/layout";
import axios from "axios";
import { useState } from "react";
import { ChatState } from "../../Context/ChatProvider";
import UserBadgeItem from "../UserAvatar/UserBadgeItem";
import UserListItem from "../UserAvatar/UserListItem";

const GroupChatModal = ({ children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [groupChatName, setGroupChatName] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);

  // Toast
  const toast = useToast();

  // Importing the chat state
  const { user, chats, setChats } = ChatState();

  // Handles the user search by making api call to the api/users?search endpoint
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

  // Handles the group chat creation
  const handleSubmit = async () => {
    if (!groupChatName || !selectedUsers) {
      toast({
        title: "Please enter a name and select users",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      return;
    }
    if (selectedUsers.length < 2) {
      toast({
        title: "Please select at least 2 users",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      return;
    }
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.post(
        "/api/chats/group",
        {
          users: JSON.stringify(selectedUsers.map((u) => u._id)),
          chatName: groupChatName,
        },
        config
      );
      setChats([data, ...chats]);
      onClose();
      toast({
        title: "Group Chat Created!",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: error.response.data,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  // Adds the user to the selected users array
  const handleGroup = (usertoadd) => {
    if (selectedUsers.includes(usertoadd)) {
      toast({
        title: "User already Added!",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      return;
    }
    setSelectedUsers([...selectedUsers, usertoadd]);
  };

  // Removes the user from the selected users array
  const handleDelete = (usertoremove) => {
    setSelectedUsers(
      selectedUsers.filter((sel) => sel._id !== usertoremove._id)
    );
  };
  return (
    <>
      <span onClick={onOpen}>{children}</span>

      <Modal closeOnOverlayClick={true} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontSize={"35px"}
            fontFamily={"Work Sans"}
            fontWeight={"bold"}
            display={"flex"}
            justifyContent={"center"}
          >
            Create Group Chat
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody
            display={"flex"}
            flexDirection={"column"}
            alignItems={"start"}
            pb={6}
          >
            <FormControl>
              <Input
                placeholder="Enter Chat Name"
                mb={3}
                onChange={(e) => setGroupChatName(e.target.value)}
              />
            </FormControl>
            <FormControl>
              <Input
                placeholder="Add users"
                mb={1}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </FormControl>
            {/* This is where the selected users are displayed 
            as we are typing in the search bar. We are making an api call to the api/users?search endpoint
            */}
            <Flex>
              {selectedUsers.map((user) => (
                <Box
                  key={user._id}
                  w={"50%"}
                  justifyContent={"space-evenly"}
                  alignItems={"start"}
                  display={"flex"}
                  flexDirection={"row"}
                >
                  <UserBadgeItem
                    key={user._id}
                    user={user}
                    handleFunction={() => handleDelete(user)}
                  />
                </Box>
              ))}
            </Flex>

            {loading ? (
              <div>loading...</div>
            ) : (
              searchResults
                ?.slice(0, 4)
                .map((user) => (
                  <UserListItem
                    key={user._id}
                    user={user}
                    handleFunction={() => handleGroup(user)}
                  />
                ))
            )}
          </ModalBody>
          <ModalFooter>
            <Button color="rebeccapurple" mr={3} onClick={handleSubmit}>
              Create Chat
            </Button>
            <Button color="red" onClick={onClose}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default GroupChatModal;
