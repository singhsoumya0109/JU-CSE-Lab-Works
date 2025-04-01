import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./styles.css";

const role = window.location.port === "5174" ? "admin" : "student";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App role={role} />
  </StrictMode>
);
