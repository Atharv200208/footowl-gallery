// // src/theme/ThemeProvider.tsx
// import React, { createContext, useContext, useState, useEffect } from "react";
// import { useColorScheme } from "react-native";

// type Theme = "light" | "dark";

// type ThemeContextType = {
//   theme: Theme;
//   toggleTheme: () => void;
// };

// const ThemeContext = createContext<ThemeContextType>({
//   theme: "light",
//   toggleTheme: () => {},
// });

// export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
//   const systemScheme = useColorScheme(); // "light" | "dark"
//   const [theme, setTheme] = useState<Theme>(systemScheme || "light");

//   useEffect(() => {
//     setTheme(systemScheme || "light"); // auto-update when system changes
//   }, [systemScheme]);

//   const toggleTheme = () => {
//     setTheme((prev) => (prev === "light" ? "dark" : "light"));
//   };

//   return (
//     <ThemeContext.Provider value={{ theme, toggleTheme }}>
//       {children}
//     </ThemeContext.Provider>
//   );
// };

// export function useTheme() {
//   return useContext(ThemeContext);
// }


import React, { createContext, useContext, useState, useEffect } from "react";
import { useColorScheme } from "react-native";
import { lightTheme, darkTheme } from "./theme";

// infer the shape of your theme object
export type ThemeType = typeof lightTheme;

type ThemeContextType = {
  theme: ThemeType;           // actual object
  mode: "light" | "dark";     // keep the string mode if you need it
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType>({
  theme: lightTheme,
  mode: "light",
  toggleTheme: () => {},
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const systemScheme = useColorScheme();
  const [mode, setMode] = useState<"light" | "dark">(systemScheme || "light");

  useEffect(() => {
    setMode(systemScheme || "light");
  }, [systemScheme]);

  const toggleTheme = () => {
    setMode((prev) => (prev === "light" ? "dark" : "light"));
  };

  const theme = mode === "light" ? lightTheme : darkTheme;

  return (
    <ThemeContext.Provider value={{ theme, mode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export function useTheme() {
  return useContext(ThemeContext);
}
