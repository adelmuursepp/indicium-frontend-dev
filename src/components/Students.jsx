import React, { useEffect, useState, useCallback } from "react";
import {
  Heading,
  Box,
  Stack,
  useColorModeValue,
  HStack,
  Avatar,
  Text,
  IconButton,
} from "@chakra-ui/react";
import LoadingScreen from "./LoadingScreen";
import sendRequestAndGetPromise from "../utils/requests";
import { useAuth } from "../utils/auth";
import { CloseIcon } from "@chakra-ui/icons";
import AlertDialogComponent from "./dashboard/AlertDialogComponent";

const Students = ({ courseId }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [students, setStudents] = useState([]);

  const auth = useAuth();

  const fetchStudents = useCallback(() => {
    fetch(`/api/get_students/${courseId}`)
      .then((response) => response.json())
      .then((data) => {
        setStudents(data["students"]);
        setIsLoading(false);
      });
  }, [courseId]);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  const handleRemove = async (studentID) => {
    const data = {
      courseId: courseId,
      studentId: studentID,
    };
    const err = await sendRequestAndGetPromise(`/api/remove_student`, data);
    if (err) {
      alert(err);
    } else {
      setIsLoading(true);
      fetchStudents();
    }
  };

  const StudentCard = ({ student }) => {
    const [showRemoveStudentDialog, setShowRemoveStudentDialog] =
      useState(false);
    const bg = useColorModeValue("orange.200", "gray.600");
    return (
      <Box p={4} borderWidth="2px" shadow="md" bg={bg}>
        <HStack justify="space-between" width="100%">
          <HStack>
            <Avatar size="md" my={4} src={student.avatar} />
            <Heading size="sm">{student.name}</Heading>
          </HStack>
          <HStack>
            <Text fontSize="md">{student.email}</Text>
            {!auth.student && (
              <IconButton
                color="red"
                isRound="true"
                size="sm"
                aria-label="Remove student"
                icon={<CloseIcon />}
                onClick={(event) => {
                  event.stopPropagation();
                  event.preventDefault();
                  setShowRemoveStudentDialog(true);
                }}
              />
            )}
          </HStack>
        </HStack>
        <AlertDialogComponent
          open={showRemoveStudentDialog}
          onClose={() => setShowRemoveStudentDialog(false)}
          onCloseAccept={() => {
            setShowRemoveStudentDialog(false);
            handleRemove(student.uid);
          }}
          alertDialogHeader={`Remove ${student.name}`}
          alertDialogBody="Are you sure? You can't undo this action afterwards."
          alertDialogAccept="Remove"
          alertDialogReject="No"
        />
      </Box>
    );
  };

  const renderStudentCards = () => {
    if (students.length === 0) {
      return <p>No students enrolled.</p>;
    }

    return students.map((student, index) => (
      <StudentCard key={index} student={student} />
    ));
  };

  return (
    <Box>
      <Stack spacing={8} m={4}>
        {isLoading ? <LoadingScreen /> : renderStudentCards()}
      </Stack>
    </Box>
  );
};

export default Students;
