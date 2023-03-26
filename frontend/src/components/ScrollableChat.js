import { Avatar, Tooltip } from "@chakra-ui/react";
import React from "react";
import ScrollableFeed from "react-scrollable-feed";
import {
  isLastMessage,
  isSameSender,
  isSameSenderMargin,
  isSameUser,
} from "../config/ChatLogic";
import { ChatState } from "../Context/ChatProvider";

const ScrollableChat = ({ messages }) => {
  const { user } = ChatState();
  return (
    <ScrollableFeed>
      {messages &&
        messages.map((message, idx) => (
          <div style={{ width: "100%", display: "flex"}} key={message._id}>
            {(isSameSender(messages, message, idx, user._id) ||
              isLastMessage(messages, idx, user._id)) && (
              <Tooltip
                label={message.sender.name}
                placement="bottom-start"
                hasArrow
              >
                <Avatar
                  size={"sm"}
                  mt="7px"
                  mr={"1px"}
                  cursor="pointer"
                  name={message.sender.name}
                  src={message.sender.pic}
                />
              </Tooltip>
            )}
            <span
              style={{
                display: "flex",
                backgroundColor: `${
                  message.sender._id === user._id ? "#BEE3F8" : "#B9F5D0"
                }`,
                borderRadius: "20px",
                padding: "5px 15px",
                maxWidth: "100%",
                flexDirection: "row",
                marginLeft: isSameSenderMargin(
                  messages,
                  message,
                  idx,
                  user._id
                ),
                marginTop: isSameUser(messages, message, idx, user._id)
                  ? "3px"
                  : "10px",
              }}
            >
              {message.content}
            </span>
          </div>
        ))}
    </ScrollableFeed>
  );
};

export default ScrollableChat;
