import React, { useState, useRef } from "react";
import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  Button,
  CircularProgress,
  useColorModeValue,
  Icon,
  IconButton,
} from "@chakra-ui/react";
import { CloseIcon } from "@chakra-ui/icons";
import { FiFile } from "react-icons/fi";
import ErrorAlert from "../ErrorAlert";

const Account = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false); // for when we make API call
  const [error, setError] = useState(""); // for when theres an error
  const inputRef = useRef();

  const [selectedAvatarFile, setSelectedAvatarFile] = useState(null);
  const [isAvatarPicked, setIsAvatarPicked] = useState(false);

  const formBackground = useColorModeValue("orange.100", "gray.700");

  const getBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const callUpdate = (updateBody) => {
    fetch("/api/user/update", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updateBody),
    }).then((response) => {
      setIsLoading(false);
      if (!response.ok) {
        response.text().then((text) => setError(text));
      } else {
        setError("");
      }
      setCurrentPassword("");
      setNewPassword("");
    });
  };

  const handleUpdate = async (event) => {
    event.preventDefault();

    let updateBody = {
      newPassword: "",
      currentPassword: "",
      avatar: null,
    };

    // check if password is entered, then both must be
    if (
      currentPassword === "" &&
      newPassword === "" &&
      selectedAvatarFile == null
    ) {
      setError("Please Provide a new Password or Avatar");
    } else if (currentPassword === "" && newPassword !== "") {
      setError("Please Provide your Current Password");
    } else if (currentPassword !== "" && newPassword === "") {
      setError("Please Provide a New Password");
    } else {
      if (currentPassword !== "" && newPassword !== "") {
        updateBody.newPassword = newPassword;
        updateBody.currentPassword = currentPassword;
      }

      setIsLoading(true);

      if (selectedAvatarFile != null) {
        await getBase64(selectedAvatarFile).then((data) => {
          updateBody.avatar = data;
        });
      }

      // issue backend request with body
      await callUpdate(updateBody);
    }
  };

  const changeHandler = (event) => {
    setSelectedAvatarFile(event.target.files[0]);
    setIsAvatarPicked(true);
  };

  return (
    <Flex
      height="100vh"
      justifyContent="center"
      alignItems="center"
      width="75%"
    >
      <Box
        p={10}
        borderWidth={1}
        borderRadius={8}
        boxShadow="dark-lg"
        width="700px"
        background={formBackground}
      >
        <Box my={4} textAlign="left">
          <form onSubmit={handleUpdate}>
            {error && <ErrorAlert message={error} />}
            <FormControl mt={6}>
              <FormLabel>Current Password</FormLabel>
              <Input
                type="password"
                placeholder="*******"
                onChange={(event) =>
                  setCurrentPassword(event.currentTarget.value)
                }
                variant="filled"
                value={currentPassword}
              />
            </FormControl>

            <FormControl mt={6}>
              <FormLabel>New Password</FormLabel>
              <Input
                type="password"
                placeholder="*******"
                onChange={(event) => setNewPassword(event.currentTarget.value)}
                variant="filled"
                value={newPassword}
              />
            </FormControl>

            <FormControl mt={6}>
              <FormLabel>New Avatar</FormLabel>
              <input
                hidden
                accept={"image/*"}
                type="file"
                name="file"
                onChange={changeHandler}
                ref={inputRef}
              />
              {isAvatarPicked && (
                <>
                  <span>Filename: {selectedAvatarFile.name}</span>
                  <span style={{ marginLeft: "10px" }}>
                    <IconButton
                      aria-label="remove file"
                      fontSize="15px"
                      colorScheme="red"
                      onClick={() => {
                        inputRef.current.value = "";
                        setSelectedAvatarFile(null);
                        setIsAvatarPicked(false);
                      }}
                      icon={<CloseIcon />}
                    />
                  </span>
                </>
              )}

              <Box mt={3}>
                <Button
                  onClick={() => inputRef.current.click()}
                  leftIcon={<Icon as={FiFile} />}
                >
                  Upload
                </Button>
              </Box>
            </FormControl>

            <Button type="submit" colorScheme="orange" width="full" mt={4}>
              {isLoading ? (
                <CircularProgress isIndeterminate size="24px" color="red" />
              ) : (
                "Update Account"
              )}
            </Button>
          </form>
        </Box>
      </Box>
    </Flex>
  );
};

export default Account;
