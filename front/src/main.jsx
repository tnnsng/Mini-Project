import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
//import App from "./App.jsx";
import Login from "./components/Login.jsx";
//import Menu from "./components/Menu.jsx";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Login />
  </StrictMode>
);
