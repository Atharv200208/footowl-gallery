
import React from "react";
import { View, Text, Switch } from "react-native";
import { useTheme } from "../theme/ThemeProvider";

export default function SettingsScreen() {
  const { theme, mode, toggleTheme } = useTheme();

  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: theme.background,
        padding: 16,
      }}
    >
      <View
        style={{
          width: "100%",
          maxWidth: 480,
          backgroundColor: theme.surface,
          borderRadius: 16,
          padding: 20,
          shadowColor: theme.shadow.color,
          shadowOpacity: theme.shadow.opacity,
          shadowRadius: theme.shadow.radius,
          shadowOffset: { width: 0, height: 4 },
          elevation: theme.shadow.elevation,
        }}
      >
        <Text
          style={{
            fontSize: 20,
            marginBottom: 14,
            color: theme.text,
            fontWeight: "600",
          }}
        >
          Appearance
        </Text>

        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
          <Text style={{ color: theme.muted }}>Dark mode</Text>
          <Switch testID="theme-switch" value={mode === "dark"} onValueChange={toggleTheme} />
        </View>
      </View>
    </View>
  );
}
