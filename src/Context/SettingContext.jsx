import React, { createContext, useContext, useState, useEffect } from "react";

// Create a context for settings
const SettingsContext = createContext();

// Default settings, including a theme
const defaultSettings = {
  color: "black", // Default text color
  fontSize: "16px", // Default font size
  fontStyle: "Arial", // Default font style
  theme: "light", // Default theme
};

// Provider component to wrap the app
export const SettingsProvider = ({ children }) => {
  // Initial state for settings
  const [settings, setSettings] = useState(defaultSettings);

  // Load settings from local storage on mount
  useEffect(() => {
    const savedSettings = JSON.parse(localStorage.getItem("userSettings"));
    if (savedSettings) {
      setSettings(savedSettings);
    }
  }, []);

  // Save settings to local storage whenever they change
  useEffect(() => {
    localStorage.setItem("userSettings", JSON.stringify(settings));
  }, [settings]);

  // Function to update settings
  const updateSettings = (newSettings) => {
    setSettings((prevSettings) => ({
      ...prevSettings,
      ...newSettings,
    }));
  };

  // Function to reset settings to defaults
  const resetSettings = () => {
    setSettings(defaultSettings);
  };

  return (
    <SettingsContext.Provider
      value={{ settings, updateSettings, resetSettings }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

// Custom hook to use settings context
export const useSettings = () => useContext(SettingsContext);
