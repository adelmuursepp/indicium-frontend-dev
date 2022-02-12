import React from "react";
import { ChakraProvider } from "@chakra-ui/react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { ProvideAuth } from "./utils/auth";

ReactDOM.render(
  <ChakraProvider>
    <ProvideAuth>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ProvideAuth>
  </ChakraProvider>,
  document.getElementById("root")
);
