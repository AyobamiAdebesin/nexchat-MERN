import { TabPanels, Text } from "@chakra-ui/react";
import React from "react";
import { Container, Box } from "@chakra-ui/react";
import { Tabs, TabList, Tab, TabPanel } from "@chakra-ui/react";
import SignIn from "../components/authentication/SignIn";
import SignUp from "../components/authentication/SignUp";

const HomePage = () => {
  return (
    <Container maxW="xl" centerContent>
      <Box
        d="flex"
        justifyContent={"center"}
        p={3}
        background="white"
        w="100%"
        m="40px 0 15px 0"
        borderRadius={"lg"}
        borderWidth="1px"
      >
        <Text
          align={"center"}
          color={"black"}
          fontFamily="Work sans"
          fontSize="5xl"
        >
          nexChat
        </Text>
      </Box>
      <Box
        d="flex"
        justifyContent={"center"}
        p={4}
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
