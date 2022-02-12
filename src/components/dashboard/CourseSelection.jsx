import React, { useState } from "react";
import {
  Flex,
  Heading,
  Box,
  FormControl,
  FormLabel,
  Input,
  Button,
  useColorModeValue,
  CircularProgress,
  Select,
} from "@chakra-ui/react";
import { sendCourseDetails } from "../../utils/dashboard";
import { useHistory } from "react-router-dom";
import ErrorAlert from "./../ErrorAlert";

const CourseSelection = () => {
  // will keep track of course and term using state variables
  const [courseName, setCourseName] = useState("");
  const [term, setTerm] = useState("");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false); // for when we make API call
  const [error, setError] = useState(""); // for when theres an error
  const [year, setYear] = useState("");
  let history = useHistory();

  const formBackground = useColorModeValue("orange.100", "gray.700");

  const handleSubmit = async (event) => {
    // make API call to backend here
    event.preventDefault();
    setIsLoading(true);

    const error = await sendCourseDetails({
      courseName,
      description,
      term,
      year,
    });
    if (error) {
      setError(error);
      // reset the form
      setIsLoading(false);
    } else {
      setIsLoading(false);
      setError("");
      history.push("/courses");
    }
  };

  return (
    <React.Fragment>
      <Flex height="100vh" width="full" align="center" justifyContent="center">
        <Box
          p={10}
          borderWidth={1}
          borderRadius={8}
          boxShadow="dark-lg"
          width="700px"
          background={formBackground}
        >
          <Box textAlign="center">
            <Heading>Create Course</Heading>
          </Box>

          <Box my={4} textAlign="left">
            <form onSubmit={handleSubmit}>
              {error && <ErrorAlert message={error} />}
              <FormControl isRequired>
                <FormLabel>Enter Course</FormLabel>
                <Input
                  type="input"
                  placeholder="CSC209"
                  onChange={(event) => setCourseName(event.currentTarget.value)}
                  variant="filled"
                />
                <FormLabel>Course Description</FormLabel>
                <Input
                  type="input"
                  placeholder="Software Tools and System Programming"
                  onChange={(event) =>
                    setDescription(event.currentTarget.value)
                  }
                  variant="filled"
                />
                <FormLabel>Term</FormLabel>
                <Select
                  placeholder="Select a Term"
                  size="lg"
                  variant="filled"
                  onChange={(event) => setTerm(event.currentTarget.value)}
                >
                  <option value="Fall">Fall</option>
                  <option value="Winter">Winter</option>
                </Select>
                <FormLabel>Year</FormLabel>
                <Input
                  type="input"
                  placeholder="2021"
                  onChange={(event) => setYear(event.currentTarget.value)}
                  variant="filled"
                />
              </FormControl>
              <Button type="submit" colorScheme="orange" width="full" mt={4}>
                {isLoading ? (
                  <CircularProgress isIndeterminate size="24px" color="red" />
                ) : (
                  "Create Course"
                )}
              </Button>
            </form>
          </Box>
        </Box>
      </Flex>
    </React.Fragment>
  );
};

export default CourseSelection;
