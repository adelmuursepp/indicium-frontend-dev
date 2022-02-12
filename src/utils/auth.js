import { createContext, useContext, useState } from "react";
import sendRequestAndGetPromise from "./requests";

async function sendLogoutRequest(url) {
  return fetch(url, {
    method: "POST",
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
      console.log("Invalid Request", e);
    });
}

const authContext = createContext();

export const ProvideAuth = ({ children }) => {
  const auth = useProvideAuth();
  return <authContext.Provider value={auth}>{children}</authContext.Provider>;
};

export const useAuth = () => {
  return useContext(authContext);
};

export const useProvideAuth = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [email, setEmail] = useState("");
  const [student, setStudent] = useState(true);
  const [uid, setUid] = useState("");

  const checkAuthenticated = (cb) => {
    fetch("/api").then(async (response) => {
      if (!response.ok) {
        setLoggedIn(false);
        setEmailVerified(false);
        setEmail("");
        setStudent(true);
        setUid("");
      } else {
        const data = await response.json();
        setLoggedIn(response.ok);
        setEmailVerified(data.email_verified);
        setEmail(data.email);
        setStudent(data.student);
        setUid(data.uid);
      }
      cb();
    });
  };

  const loginUser = async (data, cb) => {
    const result = await sendRequestAndGetPromise("/api/sign_in", data);
    checkAuthenticated(() => cb(result));
  };

  const registerUser = async (data, cb) => {
    const result = await sendRequestAndGetPromise("/api/sign_up", data);
    checkAuthenticated(() => cb(result));
  };

  const logoutUser = (cb) => {
    sendLogoutRequest("/api/logout").then(() => checkAuthenticated(cb));
  };

  return {
    loggedIn,
    emailVerified,
    email,
    student,
    uid,
    checkAuthenticated,
    loginUser,
    registerUser,
    logoutUser,
  };
};
