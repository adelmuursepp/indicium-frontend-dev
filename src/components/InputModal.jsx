import React from "react";
import {
  Box,
  Button,
  Modal,
  ModalContent,
  ModalOverlay,
  ModalHeader,
  ModalCloseButton,
  ModalFooter,
  ModalBody,
  FormControl,
  FormLabel,
  Input,
  HStack,
} from "@chakra-ui/react";
import ErrorAlert from "./ErrorAlert";

const ModalAttribute = ({ attributeInfo }) => {
  return (
    <FormControl id={attributeInfo.id} isRequired={attributeInfo.isRequired}>
      <FormLabel>{attributeInfo.label}</FormLabel>
      <Input type={attributeInfo.type} accept={attributeInfo.accept} />
    </FormControl>
  );
};

const InputModal = ({ modalInfo, isOpen, onOpen, onClose, error }) => {
  return (
    <>
      <Box>
        <Button colorScheme="teal" onClick={onOpen}>
          {modalInfo.openButtonText}
        </Button>
      </Box>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{modalInfo.modalHeader}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form onSubmit={modalInfo.handleSubmit}>
              {error && <ErrorAlert message={error} />}
              {modalInfo.attributes.map((a, id) => (
                <ModalAttribute key={id} attributeInfo={a} />
              ))}
              <HStack pt="8">
                <Button colorScheme="blue" type="submit">
                  {modalInfo.submitBtnText}
                </Button>
                <Button onClick={onClose}>Cancel</Button>
              </HStack>
            </form>
          </ModalBody>
          <ModalFooter />
        </ModalContent>
      </Modal>
    </>
  );
};

export default InputModal;
