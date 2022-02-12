import { Flex, CircularProgress } from "@chakra-ui/react";

const LoadingScreen = () => {
  return (
    <Flex
      height="100vh"
      width="100vh"
      justifyContent="center"
      alignItems="center"
    >
      <CircularProgress />
    </Flex>
  );
};

export default LoadingScreen;
