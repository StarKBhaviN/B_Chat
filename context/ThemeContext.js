import React, { createContext, useState } from "react";
import { Appearance } from "react-native";
import { Colors } from "../constants/Colors";

export const ThemeContext = createContext({});

export default function ThemeProvider({ children }) {
  const [colorScheme, setColorScheme] = useState(Appearance.getColorScheme());
  const theme = colorScheme === "dark" ? Colors.dark : Colors.light;

  const toggleThemeMode = () => {
    const nextMode = colorScheme === "light" ? "dark" : "light";
    setColorScheme(nextMode);
  };

  return (
    <ThemeContext.Provider
      value={{
        colorScheme,
        setColorScheme,
        theme,
        toggleThemeMode,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}
