import React, { useState, useRef } from "react";
import {
  Flex,
  Heading,
  Box,
  FormControl,
  FormLabel,
  Input,
  Button,
  useColorModeValue,
  CircularProgress,
  Switch,
  IconButton,
  Icon,
} from "@chakra-ui/react";
import { CloseIcon } from "@chakra-ui/icons";
import { FiFile } from "react-icons/fi";
import ErrorAlert from "./ErrorAlert";
import { useHistory } from "react-router-dom";
import { useAuth } from "../utils/auth";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [student, setStudent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedAvatarFile, setSelectedAvatarFile] = useState(null);
  const [isAvatarPicked, setIsAvatarPicked] = useState(false);

  let history = useHistory();
  let auth = useAuth();

  const formBackground = useColorModeValue("orange.100", "gray.700");
  const inputRef = useRef();

  const getBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    let avatar = null;
    if (selectedAvatarFile !== null) {
      getBase64(selectedAvatarFile)
        .then((data) => {
          avatar = data;
        })
        .then(async () => {
          setIsLoading(true);
          await auth.registerUser(
            { email, password, student, avatar },
            (authenticate) => {
              setIsLoading(false);
              if (authenticate) {
                setError(authenticate);
              } else {
                history.push("/");
              }
            }
          );
        });
    } else {
      setError("Please enter a profile picture");
    }
  };

  const changeHandler = (event) => {
    setSelectedAvatarFile(event.target.files[0]);
    setIsAvatarPicked(true);
  };

  return (
    <React.Fragment>
      <Flex height="100vh" width="full" align="center" justifyContent="center">
        <Box
          p={10}
          borderWidth={1}
          borderRadius={8}
          boxShadow="dark-lg"
          width="700px"
          background={formBackground}
        >
          <Box textAlign="center">
            <Heading>Register</Heading>
          </Box>

          <Box my={4} textAlign="left">
            <form onSubmit={handleSubmit}>
              {error && <ErrorAlert message={error} />}
              <FormControl isRequired>
                <FormLabel>UofT Email</FormLabel>
                <Input
                  type="email"
                  placeholder="test@test.com"
                  onChange={(event) => setEmail(event.currentTarget.value)}
                  variant="filled"
                />
              </FormControl>
              <FormControl mt={6} isRequired>
                <FormLabel>Password</FormLabel>
                <Input
                  type="password"
                  placeholder="Enter Password"
                  onChange={(event) => setPassword(event.currentTarget.value)}
                  variant="filled"
                />
              </FormControl>
              <FormControl mt={6}>
                <FormLabel>Are You a Student?</FormLabel>
                <Switch
                  onChange={() => setStudent(!student)}
                  colorScheme="orange"
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
                  "Create Account"
                )}
              </Button>
            </form>
          </Box>
        </Box>
      </Flex>
    </React.Fragment>
  );
};

export default Register;
