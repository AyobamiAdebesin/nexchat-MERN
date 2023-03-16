/* eslint-disable no-unused-vars */
import { FormControl, FormLabel, Input, VStack } from "@chakra-ui/react";
import React, { useState } from "react";

const SignUp = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pic, setPic] = useState("");

  return (
    <VStack spacing={"5px"} color="black">
      <FormControl id="first-name" isRequired>
        <FormLabel>Username</FormLabel>
        <Input
          type="text"
          placeholder="Username"
          onChange={(e) => setName(e.target.value)}
        />
      </FormControl>
      <FormControl id="email" isRequired>
        <FormLabel>Email</FormLabel>
        <Input
          type="text"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />
      </FormControl>
      <FormControl id="password" isRequired>
        <FormLabel>Pasword</FormLabel>
        <Input
          type="text"
          placeholder="Username"
          onChange={(e) => setName(e.target.value)}
        />
      </FormControl>
    </VStack>
  );
};

export default SignUp;
