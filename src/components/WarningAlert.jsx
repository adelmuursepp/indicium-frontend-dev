import React from "react";
import { Box, Alert, AlertIcon, AlertDescription } from "@chakra-ui/react";

const WarningAlert = ({ message }) => {
  return (
    <Box my={4}>
      <Alert status="warning" borderRadius={4}>
        <AlertIcon />
        <AlertDescription>{message}</AlertDescription>
      </Alert>
    </Box>
  );
};

export default WarningAlert;
