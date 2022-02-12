import React from "react";
import {
  Heading,
  Text,
  LinkBox,
  LinkOverlay,
  IconButton,
} from "@chakra-ui/react";
import { CloseIcon } from "@chakra-ui/icons";
import { useHistory } from "react-router-dom";

const CourseCard = ({ title, desc, term, year, courseId, handleDelete }) => {
  let history = useHistory();

  function randomCardColour() {
    let cardColours = ["#C9E4E7", "#CAFFD0", "#C8C8C8", "#E1FAF9", "#E2EB98"];
    return cardColours[Math.floor(Math.random() * cardColours.length)];
  }

  const handleClick = () => {
    history.push(`/course/${courseId}`);
  };

  return (
    <LinkBox
      className="courseCard"
      p={5}
      shadow="md"
      borderRadius="10px"
      background={randomCardColour()}
      color="black"
      borderWidth="2px"
      onClick={handleClick}
    >
      <LinkOverlay href="#">
        <Heading fontSize="xl">{title}</Heading>
      </LinkOverlay>
      <IconButton
        right="true"
        color="red"
        isRound="true"
        size="sm"
        float="right"
        aria-label="Delete course"
        icon={<CloseIcon />}
        onClick={(event) => {
          event.stopPropagation();
          handleDelete(courseId);
        }}
      />
      <Text mt={4}>{desc}</Text>
      <Text float="right">
        {term} {year} {term === "Winter" ? " ❄️" : " 🍂"}
      </Text>
    </LinkBox>
  );
};

export default CourseCard;
