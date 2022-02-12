/*
 * mockAPI concept from following tutorial: https://blog.logrocket.com/how-to-create-forms-with-chakra-ui-in-react-apps/
 */

export const userLogin = async ({ email, password }) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // hard coded
      if (email === "tony@uoft.com" && password === "pass") {
        resolve();
      } else {
        reject();
      }
    }, 4000);
  });
};
