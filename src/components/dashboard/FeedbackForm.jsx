import React, { useState } from "react";
import FEEDBACKQUESTIONS from "./FeedbackQuestions";
import {
  Box,
  FormControl,
  FormLabel,
  Radio,
  RadioGroup,
  HStack,
  useColorModeValue,
  Button,
  Heading,
} from "@chakra-ui/react";
import { sendSurveyDetails } from "../../utils/dashboard";
import ErrorAlert from "../ErrorAlert";
import SuccessAlert from "../SuccessAlert";

const FeedbackForm = () => {
  const formBackground = useColorModeValue("orange.100", "gray.700");
  const [scores, setScores] = useState(new Array(15).fill("0"));
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleUpdate = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    const error = await sendSurveyDetails({
      scores,
    });
    setIsLoading(false);
    if (error) {
      setError(error);
      // reset the form
    } else {
      setError("");
      setSuccess("You have successfully submitted the form");
    }
  };

  const FeedbackQuestion = ({ index, question }) => {
    return (
      <FormControl
        as="fieldset"
        background={formBackground}
        id={question}
        p={4}
      >
        <FormLabel fontWeight="bold" as="legend">
          {question}
        </FormLabel>
        <RadioGroup
          value={scores[index]}
          onChange={(value) =>
            setScores(
              scores
                .slice(0, index)
                .concat([value])
                .concat(scores.slice(index + 1, scores.length))
            )
          }
        >
          <HStack spacing="24px">
            <Radio colorScheme="green" value="1">
              Disagree
            </Radio>
            <Radio colorScheme="green" value="2">
              Somewhat Disagree
            </Radio>
            <Radio colorScheme="green" value="3">
              Neutral
            </Radio>
            <Radio colorScheme="green" value="4">
              Somewhat Agree
            </Radio>
            <Radio colorScheme="green" value="5">
              Agree
            </Radio>
          </HStack>
        </RadioGroup>
      </FormControl>
    );
  };

  return (
    <Box
      borderWidth={1}
      borderRadius={8}
      boxShadow="dark-lg"
      width="700px"
      margin="auto"
      background={formBackground}
    >
      <Box my={4} textAlign="left">
        <Heading ml={3} mb={3} size={"lg"}>
          Feedback Form
        </Heading>
        <form onSubmit={handleUpdate}>
          {FEEDBACKQUESTIONS.map((q, index) => (
            <FeedbackQuestion key={index} index={index} question={q} />
          ))}
          <Button
            ml={3}
            colorScheme="blue"
            type="submit"
            isLoading={isLoading}
            loadingText="Submitting..."
          >
            Submit Form
          </Button>
          {error && <ErrorAlert message={error} />}
          {success && <SuccessAlert message={success} />}
        </form>
      </Box>
    </Box>
  );
};

export default FeedbackForm;
