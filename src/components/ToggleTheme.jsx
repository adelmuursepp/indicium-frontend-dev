import React from "react";
import { useColorMode, Box, IconButton } from "@chakra-ui/react";
import { MoonIcon, SunIcon } from "@chakra-ui/icons";

const ToggleTheme = (props) => {
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <Box
      position="absolute"
      top="0"
      right="0"
      py={4}
      mr={props.mr ? props.mr : 12}
    >
      <IconButton
        icon={colorMode === "light" ? <MoonIcon /> : <SunIcon />}
        onClick={toggleColorMode}
        variant="ghost"
      />
    </Box>
  );
};

export default ToggleTheme;
