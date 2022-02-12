import React, { useEffect, useState } from "react";
import { Flex, Stack, IconButton } from "@chakra-ui/react";
import CourseCard from "./CourseCard";
import { AddIcon } from "@chakra-ui/icons";
import { useHistory } from "react-router-dom";
import { sendDeleteRequestAndGetPromise } from "../../utils/dashboard";
import AlertDialogComponent from "./AlertDialogComponent";
import { useAuth } from "../../utils/auth";
import LoadingScreen from "../LoadingScreen";

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [courseIdToDelete, setCourseIdToDelete] = useState("");
  const [alertDialogView, setAlertDialogView] = useState(false);
  let history = useHistory();
  let auth = useAuth();

  const closeDialogAccept = () => {
    setAlertDialogView(false);
    handleDelete(courseIdToDelete);
  };

  const closeDialog = () => {
    setAlertDialogView(false);
    setCourseIdToDelete("");
  };

  const showDeleteDialog = (courseId) => {
    setCourseIdToDelete(courseId);
    setAlertDialogView(true);
  };

  const handleDelete = async (courseId) => {
    const error = await sendDeleteRequestAndGetPromise(
      `/api/leave_course/${courseId}`
    );
    if (error) {
      alert(error);
    } else {
      setCourses(courses.filter((course) => course.courseId !== courseId));
    }
  };

  useEffect(() => {
    const getData = async () => {
      const courses_data = await (await fetch("/api/courses")).json();
      courses_data.courses.sort(function (a, b) {
        return b.year - a.year;
      });
      setCourses(courses_data.courses);
      setLoading(false);
    };
    getData();
  }, []);

  const handleClick = () => {
    if (auth.student) {
      history.push("/enroll-course");
    } else {
      history.push("/create-course");
    }
  };

  const coursesStack = courses.length ? (
    <Stack spacing={8} width="100%">
      {courses.map((course, index) => {
        return (
          <CourseCard
            title={course.course}
            desc={course.description}
            term={course.term}
            year={course.year}
            courseId={course.courseId}
            key={index}
            handleDelete={(courseId) => showDeleteDialog(courseId)}
          />
        );
      })}
    </Stack>
  ) : (
    <Flex
      height="100vh"
      width="100vh"
      justifyContent="center"
      alignItems="center"
    >
      <p>You aren't enrolled in any courses.</p>
    </Flex>
  );

  return (
    <>
      <IconButton
        right="true"
        isRound="true"
        size="sm"
        aria-label="Search database"
        icon={<AddIcon />}
        onClick={handleClick}
      />

      <AlertDialogComponent
        open={alertDialogView}
        onClose={closeDialog}
        onCloseAccept={closeDialogAccept}
        alertDialogHeader={auth.student ? "Leave Course" : "Delete Course"}
        alertDialogBody="Are you sure? You can't undo this action afterwards."
        alertDialogAccept={auth.student ? "Leave" : "Delete"}
        alertDialogReject="No"
      />

      <Flex margin="auto" width="75%" mt={5}>
        {loading ? <LoadingScreen /> : coursesStack}
      </Flex>
    </>
  );
};

export default Courses;
