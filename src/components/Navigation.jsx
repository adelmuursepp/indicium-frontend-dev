import React, { useEffect, useState } from "react";
import {
  Flex,
  Text,
  Avatar,
  Box,
  useColorModeValue,
  Container,
  AvatarBadge,
  Heading,
  Spinner,
} from "@chakra-ui/react";
import { NavLink, useHistory, useLocation } from "react-router-dom";
import { WarningTwoIcon } from "@chakra-ui/icons";
import { useAuth } from "../utils/auth";
import AlertDialogComponent from "./dashboard/AlertDialogComponent";

const Navigation = () => {
  const formBackground = useColorModeValue("orange.100", "gray.700");
  const buttonBackground = useColorModeValue("teal.500", "teal.200");
  const buttonTextColor = useColorModeValue("white", "black");
  const [displayName, setDisplayName] = useState("");
  const [avatarSrc, setAvatarSrc] = useState("");
  const [isBusy, setBusy] = useState(true);
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);

  let auth = useAuth();
  let history = useHistory();
  let location = useLocation();

  useEffect(() => {
    setBusy(true);
    const fetchData = async () => {
      fetch("/api/user")
        .then((response) => response.json())
        .then((data) => {
          setBusy(false);
          setDisplayName(data.name);
          setAvatarSrc(data.avatar);
        });
    };
    fetchData();
  }, []);

  const openLogoutPopup = () => {
    setShowLogoutPopup(true);
  };

  const closeLogoutPopup = () => {
    setShowLogoutPopup(false);
  };

  const handleLogout = async () => {
    setShowLogoutPopup(false);
    await auth.logoutUser(() => {
      history.push("/");
    });
  };

  return (
    <Box
      width="25%"
      direction="column"
      background={formBackground}
      boxShadow="dark-lg"
      m={5}
      borderRadius={15}
    >
      <Container className="navContainer">
        <Flex height="100vh" direction="column">
          <Flex flexDir="column" alignItems="center">
            <Flex mt={30} mb={50} direction="column" alignItems="center">
              {isBusy ? (
                <Spinner
                  thickness="4px"
                  speed="0.65s"
                  emptyColor="gray.200"
                  color="blue.500"
                  size="xl"
                />
              ) : (
                <Avatar size="xl" my={4} src={avatarSrc}>
                  <AvatarBadge boxSize="0.9em" bg="green.500" />
                </Avatar>
              )}
              <Heading textAlign="center" size="lg">
                {displayName}
              </Heading>
            </Flex>
          </Flex>
          <Flex direction="column" alignItems="center" overflow="hidden">
            <Flex className="nav-items" bg={buttonBackground}>
              <NavLink to="/account" activeClassName="is-active">
                <Text fontSize="lg" color={buttonTextColor}>
                  Account
                </Text>
              </NavLink>
            </Flex>
            <Flex className="nav-items" bg={buttonBackground}>
              <NavLink to="/courses" activeClassName="is-active">
                <Text fontSize="lg" color={buttonTextColor}>
                  Courses
                </Text>
              </NavLink>
            </Flex>
            <Flex className="nav-items" bg={buttonBackground}>
              <NavLink to="/survey" activeClassName="is-active">
                <Text fontSize="lg" color={buttonTextColor}>
                  My Survey <WarningTwoIcon color="yellow.500" />
                </Text>
              </NavLink>
            </Flex>
            <Flex className="nav-items" bg={buttonBackground}>
              <NavLink to={location.pathname} onClick={openLogoutPopup}>
                <Text fontSize="lg" color={buttonTextColor}>
                  Sign Out
                </Text>
              </NavLink>
            </Flex>
          </Flex>
        </Flex>
      </Container>
      <AlertDialogComponent
        open={showLogoutPopup}
        onClose={closeLogoutPopup}
        onCloseAccept={handleLogout}
        alertDialogHeader="Log out"
        alertDialogBody="Are you sure you want to log out?"
        alertDialogAccept="Log out"
        alertDialogReject="Cancel"
      />
    </Box>
  );
};

export default Navigation;
