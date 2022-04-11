import React, { useCallback, useEffect, useState } from "react";
import InputModal from "./InputModal";
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Avatar,
  Heading,
  Box,
  Stack,
  useColorModeValue,
  Grid,
  HStack,
  VStack,
  Button,
  useDisclosure,
  Text,
  IconButton,
} from "@chakra-ui/react";
import { UnlockIcon, LockIcon, CloseIcon } from "@chakra-ui/icons";
import { useHistory, useParams } from "react-router-dom";
import sendRequestAndGetPromise from "../utils/requests";
import { useAuth } from "../utils/auth";
import ErrorAlert from "./ErrorAlert";
import LoadingScreen from "./LoadingScreen";
import AlertDialogComponent from "./dashboard/AlertDialogComponent";

const Groups = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [assignmentInfo, setAssignmentInfo] = useState({});
  const [error, setError] = useState("");
  const [formGroupsError, setFormGroupsError] = useState("");
  const [isFormingGroups, setIsFormingGroups] = useState(false);

  let { course_id, assignment_id } = useParams();
  let history = useHistory();
  let auth = useAuth();

  const { isOpen, onClose, onOpen } = useDisclosure();

  const handleJoin = async (event, groupId) => {
    event.preventDefault();
    const data = {
      courseId: course_id,
      assignmentId: assignment_id,
      groupId: groupId,
    };
    await sendRequestAndGetPromise(`/api/join_group`, data);
    setIsLoading(true);
    fetchGroupInfo();
  };

  const handleLeave = async (event, groupId) => {
    event.preventDefault();
    const data = {
      courseId: course_id,
      assignmentId: assignment_id,
      groupId: groupId,
    };
    await sendRequestAndGetPromise(`/api/leave_group`, data);
    setIsLoading(true);
    fetchGroupInfo();
  };

  const fetchGroupInfo = useCallback(async () => {
    const assignmentResponse = await fetch(
      `/api/${course_id}/assignments/${assignment_id}`
    );
    const groupsResponse = await fetch(
      `/api/courses/${course_id}/assignments/${assignment_id}/groups`
    );
    if (!assignmentResponse.ok) history.push("/courses");
    if (!groupsResponse.ok) history.push(`/course/${course_id}`);

    const assignment = await assignmentResponse.json();
    const groups = await groupsResponse.json();

    const info = {
      assignmentName: assignment["assignmentName"],
      groups: groups["groups"],
    };

    setAssignmentInfo(info);
    setIsLoading(false);
  }, [course_id, assignment_id, history]);

  const handleCreateGroup = async (event) => {
    event.preventDefault();
    const elements = event.target.elements;
    const data = {
      courseId: course_id,
      assignmentId: assignment_id,
      groupName: elements.GroupName.value,
      // model name: kmeans/kmodes/smth
    };
    const err = await sendRequestAndGetPromise(`/api/create_group`, data);
    if (err) {
      setError(err);
    } else {
      onClose();
      setIsLoading(true);
      fetchGroupInfo();
    }
  };

  const createModalObj = {
    handleSubmit: handleCreateGroup,
    modalHeader: "Create Group",
    openButtonText: "Create Group",
    attributes: [
      {
        id: "GroupName",
        type: "text",
        label: "Group Name",
        isRequired: true,
      },
    ],
    submitBtnText: "Create Group",
  };

  useEffect(() => {
    fetchGroupInfo();
  }, [fetchGroupInfo]);

  const handleDelete = async (groupId) => {
    const data = {
      courseId: course_id,
      assignmentId: assignment_id,
      groupId: groupId,
    };
    const err = await sendRequestAndGetPromise(`/api/delete_group`, data);
    if (err) {
      alert(err);
    } else {
      setIsLoading(true);
      fetchGroupInfo();
    }
  };

  const GroupCard = ({ groupInfo }) => {
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const bg = useColorModeValue("orange.200", "gray.600");
    const icon = groupInfo.locked ? <LockIcon /> : <UnlockIcon />;
    const inGroup = groupInfo.students.includes(auth.uid);

    return (
      <AccordionItem>
        {({ isExpanded }) => (
          <>
            <Heading>
              <AccordionButton as="div" _focus={{ outline: "none" }}>
                <Box p={4} width="100%" borderWidth="2px" shadow="md" bg={bg}>
                  <HStack justify="space-between">
                    <HStack>
                      <Heading
                        autoCapitalize="words"
                        size="md"
                        whiteSpace="nowrap"
                      >
                        {groupInfo.groupName}
                      </Heading>
                      {!isExpanded && (
                        <Grid templateColumns="repeat(5,1fr)" gap={4}>
                          {groupInfo.students.map(({ avatar }, index) => (
                            <Avatar key={index} size="md" my={4} src={avatar} />
                          ))}
                        </Grid>
                      )}
                    </HStack>
                    <HStack spacing="1vw">
                      {inGroup ? (
                        <Button
                          onClick={(event) =>
                            handleLeave(event, groupInfo.groupId)
                          }
                        >
                          Leave Group
                        </Button>
                      ) : (
                        <Button
                          onClick={(event) =>
                            handleJoin(event, groupInfo.groupId)
                          }
                          isDisabled={groupInfo.locked || !auth.student}
                          leftIcon={icon}
                        >
                          Join Group
                        </Button>
                      )}
                      {!auth.student && (
                        <IconButton
                          color="red"
                          isRound="true"
                          size="sm"
                          aria-label="Delete group"
                          icon={<CloseIcon />}
                          onClick={(event) => {
                            event.stopPropagation();
                            event.preventDefault();
                            setShowDeleteDialog(true);
                          }}
                        />
                      )}
                      <Heading size="xs">
                        Size: {groupInfo.students.length}
                      </Heading>
                      <AccordionIcon />
                    </HStack>
                  </HStack>
                </Box>
              </AccordionButton>
              <AlertDialogComponent
                open={showDeleteDialog}
                onClose={() => setShowDeleteDialog(false)}
                onCloseAccept={() => {
                  setShowDeleteDialog(false);
                  handleDelete(groupInfo.groupId);
                }}
                alertDialogHeader={`Delete ${groupInfo.groupName}`}
                alertDialogBody="Are you sure? You can't undo this action afterwards."
                alertDialogAccept="Delete"
                alertDialogReject="No"
              />
            </Heading>
            <AccordionPanel>
              <Box p={4} width="100%" borderWidth="2px" shadow="md" bg={bg}>
                <VStack justify="space-between" alignItems="start">
                  {groupInfo.students.map(({ avatar, name, email }, index) => (
                    <HStack key={index} justify="space-between" width="100%">
                      <HStack>
                        <Avatar size="md" my={4} src={avatar} />
                        <Heading size="sm">{name}</Heading>
                      </HStack>
                      <Text fontSize="md">{email}</Text>
                    </HStack>
                  ))}
                </VStack>
              </Box>
            </AccordionPanel>
          </>
        )}
      </AccordionItem>
    );
  };

  const formGroups = async () => {
    setIsFormingGroups(true);
    const data = {
      courseId: course_id,
      assignmentId: assignment_id,
    };
    const err = await sendRequestAndGetPromise("/api/form_groups", data);
    setIsFormingGroups(false);
    if (err) {
      setFormGroupsError(err);
    } else {
      setFormGroupsError("");
      setIsLoading(true);
      fetchGroupInfo();
    }
  };

  return (
    <Box width="80%">
      <Stack spacing={8} m={4}>
        <Heading autoCapitalize="words">
          {assignmentInfo.assignmentName}
        </Heading>
        <HStack>
          <InputModal
            modalInfo={createModalObj}
            isOpen={isOpen}
            onOpen={onOpen}
            onClose={onClose}
            error={error}
          />
          {!auth.student && (
            <Box>
              <Button
                colorScheme="teal"
                onClick={() => formGroups()}
                isLoading={isFormingGroups}
                loadingText="Forming groups..."
              >
                Form Groups
              </Button>
              {formGroupsError && <ErrorAlert message={formGroupsError} />}
            </Box>
          )}
        </HStack>
        {isLoading ? (
          <LoadingScreen />
        ) : (
          <Accordion allowToggle>
            {assignmentInfo.groups.map((group, index) => (
              <GroupCard key={index} groupInfo={group} />
            ))}
          </Accordion>
        )}
      </Stack>
    </Box>
  );
};

export default Groups;
