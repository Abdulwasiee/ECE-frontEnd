import React from "react";
import { SettingsProvider, useSettings } from "./Context/SettingContext.jsx"; // Import your context
import { BrowserRouter } from "react-router-dom";
import Router from "./Router";
import "./App.css";
import { AuthProvider } from "./components/Auth/Auth.jsx"; // Use AuthProvider here

function App() {
  return (
    <SettingsProvider>
      <AuthProvider>
        <MainApp />
      </AuthProvider>
    </SettingsProvider>
  );
}

// MainApp component to access settings
const MainApp = () => {
  const { settings } = useSettings();

  // Apply global styles
  React.useEffect(() => {
    // Apply font size and font family
    document.body.style.fontSize = settings.fontSize;
    document.body.style.fontFamily = settings.fontStyle;

    // Apply theme styles (background)
    if (settings.theme === "dark") {
      document.body.style.backgroundColor = "#333"; // Dark background
    } else {
      document.body.style.backgroundColor = "#fff"; // Light background
    }

    // Apply text color
    document.body.style.color = settings.color; // Text color
  }, [settings]); // Re-run effect when settings change

  return (
    <BrowserRouter>
      <Router />
    </BrowserRouter>
  );
};

export default App;
