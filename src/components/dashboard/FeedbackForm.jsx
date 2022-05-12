import React, { useCallback, useState, useEffect } from "react";
import {GROUPEVALUATIONQUESTIONS, MARKEVALUATIONQUESTIONS, COMMENTS} from "./FeedbackQuestions";
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
  Text
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
import { useAuth } from "../../utils/auth";
import { useParams } from "react-router-dom";
import { useHistory } from "react-router-dom";



const FeedbackForm = () => {
  const formBackground = useColorModeValue("orange.100", "gray.700");
  const [scores, setScores] = useState(new Array(15).fill("0"));
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  let { assignment_id, course_id } = useParams();
  let auth = useAuth();
  let history = useHistory();
  const [groupMembers, setGroupMembers] = useState([]);


  const handleUpdate = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    const error = await sendFeedbackDetails({
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

  const fetchGroupInfo = useCallback(async () => {
    const groupsResponse = await fetch(
      `/api/courses/${course_id}/assignments/${assignment_id}/groups`
    );
    // if (!assignmentResponse.ok) history.push("/courses");
    if (!groupsResponse.ok) history.push(`/course/${course_id}`);

    const groups = await groupsResponse.json();

    const info = {
      groups: groups["groups"],
    };
    console.log("auth object[][]: ", auth.uid);
    console.log("Groups1234:" ,info.groups);
    const objArray = info.groups;
    // const studentAuthIds = objArray.map(person => person.uid);
    // const inGroup = studentAuthIds.includes(auth.uid);
    // console.log(objArray);
    const result = objArray.map(group => {
      const studentAuthIds = group.students.map(person => person.uid);
      console.log(studentAuthIds);
      console.log("my uid:", auth.uid);
      if(studentAuthIds.includes(auth.uid)) {
        // console.log("INN!")
        return group.students;
      }else {
        return null;
      }
    })
    console.log(result);

    result.forEach(element => {
      console.log(element);
      if (Array.isArray(element)) {
        console.log("in");
        setGroupMembers(element);
      }
    });
    // setGroupMembers(info.groups);
    console.log("State:", groupMembers);
    setIsLoading(false);
  }, [course_id, assignment_id, history]);

  useEffect(() => {
    fetchGroupInfo();
  }, [fetchGroupInfo]);

  const FeedbackQuestion = ({ index, question }) => {
    return (
      <FormControl
        as="fieldset"
        background={formBackground}
        id={question}
        p={4}
        key={index}
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
    console.log("Inside slider state", groupMembers);
    return (
      <FormControl
        as="fieldset"
        background={formBackground}
        id={question}
        p={4}
        marginBottom={10}
        key={index}
      >
        <FormLabel fontWeight="bold" as="legend">
          {question}
        </FormLabel>

        <Slider defaultValue={50} min={0} max={100} step={10} onChange={(val) => setSliderValue(val)}
        width="93%"
        marginLeft={5}
        >
          {[...Array(11)].map((_, i) => 
            <SliderMark value={i * 10} mt='1' ml='-2.5' fontSize='sm' key={i}
            >
              {i * 10}
            </SliderMark>
          )}

        <SliderTrack bg='red.100' width="90%">
          <Box position='relative' right={10} margin={4}/>
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
          key={index}
        >
          <FormLabel fontWeight="bold" as="legend">
            {question}
          </FormLabel>
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
        <Heading ml={3} mb={3} size={"md"} marginTop={9}>
          Group Evaluation
        </Heading>
        <Text fontSize='lg' ml={3} mb={3} lineHeight={5} style={{fontSize: 17 }}>Please answer the following questions as honestly as possible
        . Your responses to the following questions will not be considered in the marking scheme.
        </Text>

        <form onSubmit={handleUpdate}>
          {GROUPEVALUATIONQUESTIONS.map((q, index) => (
            <FeedbackQuestion key={index} index={index} question={q} />
          ))}


          <Heading ml={3} mb={3} size={"md"} marginTop={9}>
            Mark Evaluation
          </Heading>
          <Text fontSize='lg' ml={3} mb={3} lineHeight={5} style={{fontSize: 17 }}>Please answer the following questions considering the overall contributions
          you and your teamates made to the final deliverable(s). You can use the previous section's questions as
          a guide when determining the level of contributions. Your response to the following questions will be
          considered when assigning the final marks.
          </Text>

          {MARKEVALUATIONQUESTIONS.map((q, index) => {
            if(q.includes("[Group members]")) {
              console.log("innn");
              const result = groupMembers.map((member) => {
                if (member.uid !== auth.uid) {
                  const question = `How much time, effort and work did ${member.name} contribute?`;
                  return (<FeedbackQuestionSlider key={index} index={index} question={question} />)
                }
              })
              return result;
            }else {
              return (
                <FeedbackQuestionSlider key={index} index={index} question={q} />
              )
            }
          })}


          <Heading ml={3} mb={3} size={"md"} marginTop={9}>
            Last Comments
          </Heading>
          {COMMENTS.map((q, index) => (
            <FeedbackQuestionTextInput key={index} index={index} question={q} />
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
