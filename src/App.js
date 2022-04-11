import React from "react";
import "./styles/global.css";
import { Flex } from "@chakra-ui/react";
import Login from "./components/Login";
import Register from "./components/Register";
import Survey from "./components/dashboard/Survey";
import Courses from "./components/dashboard/Courses";
import Account from "./components/dashboard/Account";
import Groups from "./components/Groups";
import AuthRoute from "./components/AuthRoute";
import { Switch, Redirect, Route } from "react-router-dom";
import CourseSelection from "./components/dashboard/CourseSelection";
import CourseEnroll from "./components/dashboard/CourseEnroll";
import Course from "./components/Course";
import ToggleTheme from "./components/ToggleTheme";
import Navigation from "./components/Navigation";
import FeedbackForm from "./components/dashboard/FeedbackForm";

function App() {
  return (
    <React.Fragment>
      <ToggleTheme />
      <Switch>
        {/* Public Routes */}
        <AuthRoute exact path="/" isPrivate={false} redirectTo={"/account"}>
          <Login />
        </AuthRoute>
        <AuthRoute
          exact
          path="/register"
          isPrivate={false}
          redirectTo={"/account"}
        >
          <Register />
        </AuthRoute>

        {/* Private Routes */}
        <Route>
          <Flex height="100vh" direction="row" maxW="2000px">
            <Navigation />

            <Switch>
              <AuthRoute
                exact
                path="/account"
                isPrivate={true}
                redirectTo={"/"}
              >
                <Account />
              </AuthRoute>
              <AuthRoute exact path="/survey" isPrivate={true} redirectTo={"/"}>
                <Survey />
              </AuthRoute>
              <AuthRoute exact path="/feedbackform" isPrivate={true} redirectTo={"/"}>
                <FeedbackForm />
              </AuthRoute>
              <AuthRoute
                exact
                path="/courses"
                isPrivate={true}
                redirectTo={"/"}
              >
                <Courses />
              </AuthRoute>
              <AuthRoute
                exact
                path="/create-course"
                isPrivate={true}
                redirectTo={"/"}
              >
                <CourseSelection />
              </AuthRoute>
              <AuthRoute
                exact
                path="/enroll-course"
                isPrivate={true}
                redirectTo={"/"}
              >
                <CourseEnroll />
              </AuthRoute>

              <AuthRoute
                exact
                path="/course/:course_id"
                isPrivate={true}
                redirectTo={"/"}
              >
                <Course />
              </AuthRoute>
              <AuthRoute
                exact
                path="/course/:course_id/assignments/:assignment_id/groups"
                isPrivate={true}
                redirectTo={"/"}
              >
                <Groups />
              </AuthRoute>
            </Switch>
          </Flex>
        </Route>

        <Redirect to="/" />
      </Switch>
    </React.Fragment>
  );
}

export default App;
