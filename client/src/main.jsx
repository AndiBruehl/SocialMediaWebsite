import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { AuthContextProvider } from "./context/AuthContext.jsx";
import SocketProvider from "./context/SocketProvider.jsx";
import { ThemeProvider } from "./context/ThemeContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthContextProvider>
        <SocketProvider>
          <ThemeProvider>
            <App />
          </ThemeProvider>
        </SocketProvider>
      </AuthContextProvider>
    </BrowserRouter>
  </React.StrictMode>
);
