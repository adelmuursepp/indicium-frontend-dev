import { Flex } from "@chakra-ui/layout";
import { CircularProgress } from "@chakra-ui/progress";
import React, { useEffect, useState } from "react";
import { Redirect, Route } from "react-router-dom";
import { useAuth } from "../utils/auth";

const AuthRoute = ({ isPrivate, redirectTo, children, ...rest }) => {
  let auth = useAuth();

  const [validatingToken, setValidatingToken] = useState(true);

  useEffect(() => {
    auth.checkAuthenticated(() => {
      setValidatingToken(false);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return validatingToken ? (
    <Flex height="100vh" justifyContent="center" alignItems="center">
      <CircularProgress />
    </Flex>
  ) : (
    <Route
      {...rest}
      render={({ location }) =>
        (auth.loggedIn && auth.emailVerified) === isPrivate ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: redirectTo,
              state: { from: location },
            }}
          />
        )
      }
    />
  );
};

export default AuthRoute;
