import { CloseIcon } from "@chakra-ui/icons";
import { Box } from "@chakra-ui/react";
import React from "react";

const UserBadgeItem = ({ user, handleFunction }) => {
  return (
    <Box
      px={2}
      py={1}
      borderRadius="lg"
      m={1}
      mb={2}
      display="flex"
      variant="solid"
      fontSize="13px"
      flexDirection={"row"}
      backgroundColor={"purple"}
      color={"white"}
      cursor={"pointer"}
      onClick={handleFunction}
      _hover={{ bg: "purple.100" }}
    >
      {user.name}
      <CloseIcon marginLeft={1} pl={"1"} marginTop={1} />
    </Box>
  );
};

export default UserBadgeItem;
