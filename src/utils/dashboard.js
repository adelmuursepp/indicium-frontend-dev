import sendRequestAndGetPromise from "./requests";

export const sendCourseDetails = (data) => {
  return sendRequestAndGetPromise("/api/course", data);
};

export const sendEnrollmentDetails = (data) => {
  return sendRequestAndGetPromise("/api/enroll_course", data);
};

export const sendSurveyDetails = (data) => {
  return sendRequestAndGetPromise("/api/survey", data);
};

export const sendFeedbackDetails = (data) => {
  return sendRequestAndGetPromise("/api/feedbackform", data);
};

export async function sendDeleteRequestAndGetPromise(url) {
  return fetch(url, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then(async function (response) {
      if (!response.ok) {
        return response.text();
      }
    })
    .catch((e) => {
      console.log("Invalid Request");
    });
}
