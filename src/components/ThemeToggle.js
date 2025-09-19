import React, { useContext } from "react";
import { CryptoContext } from "../context/CryptoContext";

export const ThemeToggle = () => {
  const { theme, setTheme } = useContext(CryptoContext);

  const themes = [
    { id: "dark", name: "Dark", icon: "🌙" },
    { id: "light", name: "Light", icon: "☀️" }
  ];

  const getThemeClasses = () => {
    switch (theme) {
      case "light":
        return {
          container: "bg-white border-gray-300 text-gray-800 shadow-lg",
          button: "bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-300",
          active: "bg-blue-600 text-white border-blue-600"
        };
      default: // dark
        return {
          container: "bg-white/10 border-white/20 text-white",
          button: "bg-white/10 text-white hover:bg-white/20",
          active: "bg-primary-500 text-white"
        };
    }
  };

  const classes = getThemeClasses();

  return (
    <div className={`glass-card p-4 ${classes.container}`}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold">Theme</h3>
        <div className="w-2 h-2 bg-primary-500 rounded-full animate-pulse"></div>
      </div>
      
      <div className="flex space-x-2">
        {themes.map((themeOption) => (
          <button
            key={themeOption.id}
            onClick={() => setTheme(themeOption.id)}
            className={`px-3 py-2 text-xs font-medium rounded-lg transition-all duration-200 ${
              theme === themeOption.id 
                ? classes.active 
                : classes.button
            }`}
          >
            <span className="mr-1">{themeOption.icon}</span>
            {themeOption.name}
          </button>
        ))}
      </div>
    </div>
  );
};
