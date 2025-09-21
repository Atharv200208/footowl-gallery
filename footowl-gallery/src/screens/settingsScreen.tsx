// src/screens/SettingsScreen.tsx
import React from "react";
import { View, Text, Switch } from "react-native";
import { useTheme } from "../theme/ThemeProvider";
import { lightTheme, darkTheme } from "../theme/theme";

export default function SettingsScreen() {
  const { theme, toggleTheme } = useTheme();
  const colors = theme === "dark" ? darkTheme : lightTheme; 

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center",  backgroundColor: colors.background,   }}>
      <Text style={{ fontSize: 20, marginBottom: 10,  color: colors.text, }}>
        Current theme: {theme.toUpperCase()}
      </Text>
      <Switch
        value={theme === "dark"}
        onValueChange={toggleTheme}
      />
    </View>
  );
}
