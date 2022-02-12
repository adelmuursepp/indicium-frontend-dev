import React, { useCallback, useEffect, useState } from "react";
import InputModal from "./InputModal";
import {
  Heading,
  Box,
  Stack,
  useColorModeValue,
  useDisclosure,
  IconButton,
  HStack,
} from "@chakra-ui/react";
import { CloseIcon } from "@chakra-ui/icons";
import { parse } from "papaparse";
import { NavLink } from "react-router-dom";
import sendRequestAndGetPromise from "../utils/requests";
import { useAuth } from "../utils/auth";
import LoadingScreen from "./LoadingScreen";
import AlertDialogComponent from "./dashboard/AlertDialogComponent";

const Assignments = ({ courseId }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [assignments, setAssignments] = useState([]);
  const [error, setError] = useState("");

  const { isOpen, onClose, onOpen } = useDisclosure();
  const auth = useAuth();

  const fetchCourseInfo = useCallback(async () => {
    const assignments_data = await (
      await fetch(`/api/${courseId}/assignments`)
    ).json();
    setAssignments(assignments_data["assignments"]);
    setIsLoading(false);
  }, [courseId]);

  useEffect(() => {
    fetchCourseInfo();
  }, [fetchCourseInfo]);

  const handleSubmit = (event) => {
    event.preventDefault();
    const elements = event.target.elements;
    parse(elements.StudentsFile.files[0], {
      delimiter: ",",
      header: true,
      complete: async (results) => {
        const data = {
          course_id: courseId,
          name: elements.AssignmentName.value,
          due: elements.DueDate.value,
          students: results.data,
        };
        const err = await sendRequestAndGetPromise(
          "/api/create_assignment",
          data
        );
        if (err) {
          setError(err);
        } else {
          onClose();
          setIsLoading(true);
          fetchCourseInfo();
        }
      },
    });
  };

  const handleDelete = async (assignmentId) => {
    const data = {
      courseId: courseId,
      assignmentId: assignmentId,
    };
    const err = await sendRequestAndGetPromise(`/api/delete_assignment`, data);
    if (err) {
      alert(err);
    } else {
      setIsLoading(true);
      fetchCourseInfo();
    }
  };

  const createModalObj = {
    handleSubmit: handleSubmit,
    modalHeader: "Create Assignment",
    openButtonText: "Create Assignment",
    attributes: [
      {
        id: "AssignmentName",
        type: "text",
        label: "Assignment Name",
        isRequired: true,
      },
      {
        id: "DueDate",
        type: "date",
        label: "Due Date",
        isRequired: true,
      },
      {
        id: "StudentsFile",
        type: "file",
        label: "Student Information File",
        isRequired: true,
        accept: ".csv,.xls,.xlsx",
      },
    ],
    submitBtnText: "Create Assignment",
  };

  const AssignmentCard = ({ assignmentInfo }) => {
    const bg = useColorModeValue("orange.200", "gray.600");
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    return (
      <NavLink
        to={`/course/${courseId}/assignments/${assignmentInfo.assignmentId}/groups`}
        activeClassName="is-active"
      >
        <Box p={4} borderWidth="2px" shadow="md" bg={bg}>
          <HStack justify="space-between">
            <Heading size="lg">{assignmentInfo.assignmentName}</Heading>
            <HStack>
              <Heading size="sm">Due Date: {assignmentInfo.due}</Heading>
              {!auth.student && (
                <IconButton
                  color="red"
                  isRound="true"
                  size="sm"
                  aria-label="Delete assignment"
                  icon={<CloseIcon />}
                  onClick={(event) => {
                    event.stopPropagation();
                    event.preventDefault();
                    setShowDeleteDialog(true);
                  }}
                />
              )}
            </HStack>
          </HStack>
        </Box>
        <AlertDialogComponent
          open={showDeleteDialog}
          onClose={() => setShowDeleteDialog(false)}
          onCloseAccept={() => {
            setShowDeleteDialog(false);
            handleDelete(assignmentInfo.assignmentId);
          }}
          alertDialogHeader={`Delete ${assignmentInfo.assignmentName}`}
          alertDialogBody="Are you sure? You can't undo this action afterwards."
          alertDialogAccept="Delete"
          alertDialogReject="No"
        />
      </NavLink>
    );
  };

  const renderAssignmentCards = () => {
    if (assignments.length === 0) {
      return <p>No assignments have been made.</p>;
    }

    return assignments.map((assignment, index) => (
      <AssignmentCard key={index} assignmentInfo={assignment} />
    ));
  };

  return (
    <Box>
      <Stack spacing={8} m={4}>
        {!auth.student && (
          <InputModal
            modalInfo={createModalObj}
            isOpen={isOpen}
            onOpen={onOpen}
            onClose={onClose}
            error={error}
          />
        )}
        {isLoading ? <LoadingScreen /> : renderAssignmentCards()}
      </Stack>
    </Box>
  );
};

export default Assignments;
