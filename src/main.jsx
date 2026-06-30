import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { TaskProvider } from "./TaskContext";
import { AuthProvider } from "./AuthContext";
import { FocusProvider } from "./FocusContext";
import "./index.css";
import App from "./App.jsx";


createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <FocusProvider>
        <TaskProvider>
          <App />
        </TaskProvider>
      </FocusProvider>
    </AuthProvider>
  </StrictMode>
);
