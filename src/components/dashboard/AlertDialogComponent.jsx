import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Button,
} from "@chakra-ui/react";
import React from "react";

const AlertDialogComponent = ({
  open,
  onClose,
  onCloseAccept,
  alertDialogHeader,
  alertDialogBody,
  alertDialogAccept,
  alertDialogReject,
}) => {
  const cancelRef = React.useRef();

  return (
    <AlertDialog
      isOpen={open}
      leastDestructiveRef={cancelRef}
      onClose={onClose}
    >
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader fontSize="lg" fontWeight="bold">
            {alertDialogHeader}
          </AlertDialogHeader>

          <AlertDialogBody>{alertDialogBody}</AlertDialogBody>

          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={onClose}>
              {alertDialogReject}
            </Button>
            <Button colorScheme="red" onClick={onCloseAccept} ml={3}>
              {alertDialogAccept}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
};

export default AlertDialogComponent;
