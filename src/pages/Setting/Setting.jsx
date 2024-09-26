import React, { useState } from "react";
import { useSettings } from "../../Context/SettingContext";
import { SketchPicker } from "react-color"; // Color picker for custom color
import styles from "./Setting.module.css";
import Layout from "../../components/Layout/Layout";

const SettingsPage = () => {
  const { settings, updateSettings } = useSettings(); // Access settings and updater
  const [color, setColor] = useState(settings.color); // Color state for picker
  const [showPicker, setShowPicker] = useState(false); // Toggle for custom picker

  // Predefined default settings
  const defaultSettings = {
    color: "#000000", // Default text color
    fontSize: "16px", // Default font size
    fontStyle: "Arial", // Default font style
    theme: "light", // Default theme
  };

  const presetColors = [
    "#FF5733",
    "#33FF57",
    "#3357FF",
    "#FF33A1",
    "#A1FF33",
    "#33A1FF",
    "#FFD700",
    "#800080",
  ]; // Predefined palette colors

  // Font options
  const fontStyles = [
    "Arial",
    "Courier New",
    "Georgia",
    "Times New Roman",
    "Verdana",
  ];

  // Handle changes
  const handlePresetColorChange = (selectedColor) => {
    setColor(selectedColor);
    updateSettings({ color: selectedColor }); // Update text color
  };

  const handleCustomColorChange = (newColor) => {
    setColor(newColor.hex);
    updateSettings({ color: newColor.hex }); // Update text color
  };

  const handleFontSizeChange = (e) => {
    updateSettings({ fontSize: `${e.target.value}px` }); // Update font size
  };

  const handleFontStyleChange = (e) => {
    updateSettings({ fontStyle: e.target.value }); // Update font style
  };

  const handleThemeChange = (e) => {
    updateSettings({ theme: e.target.value }); // Update theme (light/dark)
  };

  const toggleColorPicker = () => {
    setShowPicker(!showPicker); // Toggle the custom color picker visibility
  };

  // Reset to default settings
  const handleResetSettings = () => {
    setColor(defaultSettings.color); // Reset color state
    updateSettings(defaultSettings); // Restore default settings
  };

  return (
    <Layout>
      <div className={styles.settingsPage}>
        <h1>Settings</h1>

        {/* Color Section */}
        <div className={styles.settingSection}>
          <label>Text Color:</label>
          <div className={styles.colorPalette}>
            {/* Preset color selection */}
            {presetColors.map((presetColor) => (
              <button
                key={presetColor}
                className={styles.colorSwatch}
                style={{ backgroundColor: presetColor }}
                onClick={() => handlePresetColorChange(presetColor)}
              />
            ))}
          </div>

          {/* Custom color picker toggle */}
          <button
            className={styles.customColorButton}
            onClick={toggleColorPicker}
          >
            {showPicker ? "Close Custom Color Picker" : "Pick Custom Color"}
          </button>

          {/* Custom color picker */}
          {showPicker && (
            <div className={styles.pickerContainer}>
              <SketchPicker
                color={color}
                onChangeComplete={handleCustomColorChange}
              />
            </div>
          )}

          {/* Real-time preview of the color */}
          <div className={styles.previewBox} style={{ color }}>
            This is a preview of your selected text color.
          </div>
        </div>

        {/* Font Size Section */}
        <div className={styles.settingSection}>
          <label>Font Size:</label>
          <input
            type="range"
            min="12"
            max="36"
            value={parseInt(settings.fontSize)}
            onChange={handleFontSizeChange}
          />
          <span>{settings.fontSize}</span>
        </div>

        {/* Font Style Section */}
        <div className={styles.settingSection}>
          <label>Font Style:</label>
          <select value={settings.fontStyle} onChange={handleFontStyleChange}>
            {fontStyles.map((font) => (
              <option key={font} value={font}>
                {font}
              </option>
            ))}
          </select>
        </div>

        {/* Theme Section */}
        <div className={styles.settingSection}>
          <label>Theme:</label>
          <div className={styles.themeOptions}>
            <label>
              <input
                type="radio"
                value="light"
                checked={settings.theme === "light"}
                onChange={handleThemeChange}
              />
              Light
            </label>
            <label>
              <input
                type="radio"
                value="dark"
                checked={settings.theme === "dark"}
                onChange={handleThemeChange}
              />
              Dark
            </label>
          </div>
        </div>

        {/* Reset Button */}
        <div>
          <button className={styles.resetButton} onClick={handleResetSettings}>
            Reset to Default Settings
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default SettingsPage;
