import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { AuthWrapper } from "./components/context/auth.context";
import { GoogleOAuthProvider } from "@react-oauth/google";

const clientID = import.meta.env.VITE_CLIENT_ID;

createRoot(document.getElementById("root")).render(
  <StrictMode>
     <AuthWrapper>
     <GoogleOAuthProvider clientId={clientID}>
        <App />
      </GoogleOAuthProvider>
    </AuthWrapper>
  </StrictMode>
);
