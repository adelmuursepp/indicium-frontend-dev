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
import { sendFeedbackDetails } from "../../utils/dashboard";
import ErrorAlert from "../ErrorAlert";
import SuccessAlert from "../SuccessAlert";
import {
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  SliderMark,
} from '@chakra-ui/react'
import { Input } from '@chakra-ui/react'

const FeedbackForm = () => {
  const formBackground = useColorModeValue("orange.100", "gray.700");
  const [scores, setScores] = useState(new Array(15).fill("0"));
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleUpdate = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    const error = await sendFeedbackDetails({
      scores,
    });
    console.log(scores);
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

  const FeedbackQuestionSlider = ({ index, question }) => {
    const [sliderValue, setSliderValue] = useState(50)
    return (
      <FormControl
        as="fieldset"
        background={formBackground}
        id={question}
        p={4}
        marginBottom={10}
        // padding={10}
      >
        <FormLabel fontWeight="bold" as="legend">
          {question}
        </FormLabel>

        <Slider defaultValue={50} min={0} max={100} step={10} onChange={(val) => setSliderValue(val)}
        >
          {[...Array(11)].map((_, i) => 
            <SliderMark value={i * 10} mt='1' ml='-2.5' fontSize='sm'
              paddingTop={2}
            >
              {i * 10}
            </SliderMark>
            // return i * ;
          )}

        <SliderTrack bg='red.100'>
          <Box position='relative' right={10} />
          <SliderFilledTrack bg='tomato' />
        </SliderTrack>
        <SliderThumb boxSize={4} />
      </Slider>        
      </FormControl>
    );
  }

    const FeedbackQuestionTextInput = ({ index, question }) => {
      const [value, setValue] = React.useState('')
      const handleChange = (event) => setValue(event.target.value)

      return (
        <FormControl
          as="fieldset"
          background={formBackground}
          id={question}
          p={4}
          marginBottom={3}
        >
          <FormLabel fontWeight="bold" as="legend">
            {question}
          </FormLabel>
          {/* <Text mb='8px'>Value: {value}</Text> */}
          <Input
            value={value}
            onChange={handleChange}
            placeholder='Here is a sample placeholder'
            size='sm'
            // border={"black"}
            variant='filled'
          />
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
            index < 3 ? <FeedbackQuestion key={index} index={index} question={q} /> : index < 7 && index >= 3 ? <FeedbackQuestionTextInput key={index} index={index} question={q} /> : <FeedbackQuestionSlider key={index} index={index} question={q} />
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
