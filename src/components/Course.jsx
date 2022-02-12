import React, { useEffect, useState } from "react";
import { CircularProgress } from "@chakra-ui/progress";
import { useHistory, useParams } from "react-router-dom";
import {
  Stack,
  Center,
  Flex,
  Heading,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Text,
} from "@chakra-ui/react";
import Assignments from "./Assignments";
import Students from "./Students";

const Course = () => {
  const [course, setCourse] = useState({});
  const [loading, setLoading] = useState(true);

  let { course_id } = useParams();
  let history = useHistory();

  useEffect(() => {
    const getCourseInfo = () => {
      fetch(`/api/course/${course_id}`)
        .then((response) => {
          if (!response.ok) {
            history.push("/courses");
          }
          return response.json();
        })
        .then((data) => {
          setCourse(data);
          setLoading(false);
        });
    };

    getCourseInfo();
  }, [course_id, history]);

  return (
    <Flex margin="auto" width="75%" mt={5}>
      {loading ? (
        <Flex
          height="100vh"
          width="100vw"
          justifyContent="center"
          alignItems="center"
        >
          <CircularProgress />
        </Flex>
      ) : (
        <Stack spacing={8} width="100%">
          <Center>
            <Heading>{course.course}</Heading>
          </Center>
          <Center>
            <Text>{course.description}</Text>
          </Center>

          <Tabs isFitted isLazy variant="enclosed">
            <TabList mb="1em">
              <Tab>Assignments</Tab>
              <Tab>Students</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <Assignments courseId={course_id} />
              </TabPanel>
              <TabPanel>
                <Students courseId={course_id} />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Stack>
      )}
    </Flex>
  );
};

export default Course;
