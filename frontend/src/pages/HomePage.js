/* eslint-disable no-unused-vars */
import { TabPanels, Text } from "@chakra-ui/react";
import React, { useEffect } from "react";
import { Container, Box } from "@chakra-ui/react";
import { Tabs, TabList, Tab, TabPanel } from "@chakra-ui/react";
import SignIn from "../components/authentication/SignIn";
import SignUp from "../components/authentication/SignUp";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  //Redirects to the chats page if the user is already logged in
  const navigate = useNavigate();
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userInfo"));
    if (user) {
      navigate("/chats");
    }
  }, [navigate]);

  return (
    <Container maxW="xl" centerContent>
      <Box
        d="flex"
        justifyContent={"center"}
        p={2}
        bgGradient="linear(to-l, #7928CA, #FF0080)"
        w="100%"
        m="30px 0 10px 0"
        borderRadius={"lg"}
        borderWidth="1px"
      >
        <Text
          align={"center"}
          color={"black"}
          fontFamily="Work sans"
          fontSize="4xl"
        >
          nexChat
        </Text>
      </Box>
      <Box
        d="flex"
        justifyContent={"center"}
        p={2}
        background="white"
        w="100%"
        borderRadius={"lg"}
        borderWidth="1px"
        color={"black"}
      >
        <Tabs size={"lg"} variant={"soft-rounded"} colorScheme={"green"}>
          <TabList mb={"1em"}>
            <Tab width={"50%"}>Sign in</Tab>
            <Tab width={"50%"}>Sign up</Tab>
          </TabList>

          <TabPanels>
            <TabPanel>
              <SignIn />
            </TabPanel>
            <TabPanel>
              <SignUp />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Container>
  );
};

export default HomePage;
