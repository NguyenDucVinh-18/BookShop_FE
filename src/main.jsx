import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { AuthWrapper } from "./components/context/auth.context";

createRoot(document.getElementById("root")).render(
  <StrictMode>
     <AuthWrapper>
      <App />
    </AuthWrapper>
  </StrictMode>
);
