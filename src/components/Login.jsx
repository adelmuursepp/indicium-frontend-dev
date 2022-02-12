import React, { useEffect, useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import {
  Flex,
  Heading,
  Input,
  Button,
  useColorModeValue,
  Image,
  GridItem,
  Grid,
  HStack,
} from "@chakra-ui/react";
import { gsap } from "gsap";
import { TextPlugin } from "gsap/TextPlugin";
import { RoughEase } from "gsap/EasePack";
import hexagons from "../assets/hex.png";
import ErrorAlert from "./ErrorAlert";
import WarningAlert from "./WarningAlert";
import { useAuth } from "../utils/auth";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  let history = useHistory();
  let auth = useAuth();

  const formBackground = useColorModeValue("orange.100", "gray.700");
  const formRef = useRef();
  const hexRef = useRef();
  const initTextRef = useRef();
  const textRef = useRef();

  const verifiedMessage = `Please go to your email (${auth.email}) and verify your account and refresh the page once verified`;

  /*
   * handleSubmit() function idea from following tutorial:
   * concepts includes loading hook, setting hooks on error and mockAPI.
   * https://blog.logrocket.com/how-to-create-forms-with-chakra-ui-in-react-apps/
   */

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    await auth.loginUser({ email, password }, (authenticate) => {
      setIsLoading(false);
      if (authenticate) {
        setError(authenticate);
      } else {
        history.push("/account");
      }
    });
  };

  useEffect(() => {
    const words = [
      [" groups.", "#FFA500"],
      [" success.", "#FF8172"],
      ["the future.", "#FFC04D"],
    ];

    gsap.registerPlugin(TextPlugin, RoughEase);

    gsap.from(hexRef.current, {
      duration: 1.4,
      opacity: 0,
      scale: 1.2,
      y: 340,
      ease: "back",
    });
    gsap.from(formRef.current, { duration: 1.4, opacity: 0, delay: 0.5 });
    gsap.from(initTextRef.current, { duration: 1.4, opacity: 0, delay: 1.1 });

    // start after delay finishes for inittext
    let masterTl = gsap.timeline({ repeat: -1, delay: 1.1 });
    words.forEach((word) => {
      let tl = gsap.timeline({ repeat: 1, yoyo: true, repeatDelay: 1.4 });
      tl.to(textRef.current, { duration: 1, text: word[0], color: word[1] });
      masterTl.add(tl);
    });
  }, [formRef, hexRef, textRef]);

  return (
    <Grid>
      <GridItem colStart={1} colSpan={3}>
        <Flex
          direction="column"
          height="100vh"
          alignItems="center"
          justifyContent="center"
        >
          <Flex ref={hexRef} alignItems="center" justifyContent="center">
            <Image objectFit="cover" src={hexagons} alt="hex" width="40vw" />
          </Flex>

          <HStack height="8vh" mt={10}>
            <Heading ref={initTextRef} as="h2" size="xl">
              find
            </Heading>
            <Heading ref={textRef} as="h2" size="xl"></Heading>
          </HStack>
        </Flex>
      </GridItem>

      <GridItem colSpan={3} colStart={4}>
        <Flex ref={formRef} height="100vh" justifyContent="flex-end">
          <Flex
            direction="column"
            background={formBackground}
            p={12}
            justifyContent="center"
            width="100%"
          >
            <Heading mb={6}>log In</Heading>

            <form onSubmit={handleSubmit}>
              {auth.loggedIn && !auth.emailVerified ? (
                <WarningAlert message={verifiedMessage} />
              ) : (
                <>
                  {error && <ErrorAlert message={error} />}

                  <Input
                    placeholder="tony.stark@mail.utoronto.ca"
                    variant="filled"
                    mb={3}
                    type="email"
                    onChange={(event) => setEmail(event.currentTarget.value)}
                  />
                  <Input
                    placeholder="Enter Passsword"
                    variant="filled"
                    mb={3}
                    type="password"
                    onChange={(event) => setPassword(event.currentTarget.value)}
                  />
                  <Button
                    width="100%"
                    type="submit"
                    colorScheme="orange"
                    mb={6}
                    isLoading={isLoading}
                    loadingText="Logging in"
                  >
                    Log In
                  </Button>
                </>
              )}
            </form>

            <Button
              onClick={() => {
                history.push("/register");
              }}
            >
              Register
            </Button>
          </Flex>
        </Flex>
      </GridItem>
    </Grid>
  );
};

export default Login;
