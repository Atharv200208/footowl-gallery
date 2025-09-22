// // src/screens/SettingsScreen.tsx
// import React from "react";
// import { View, Text, Switch } from "react-native";
// import { useTheme } from "../theme/ThemeProvider";
// import { lightTheme, darkTheme } from "../theme/theme";

// export default function SettingsScreen() {
//   const { theme, toggleTheme } = useTheme();
//   const colors = theme === "dark" ? darkTheme : lightTheme; 

//   return (
//     <View style={{ flex: 1, alignItems: "center", justifyContent: "center",  backgroundColor: colors.background,   }}>
//       <Text style={{ fontSize: 20, marginBottom: 10,  color: colors.text, }}>
//         Current theme: {theme.toUpperCase()}
//       </Text>
//       <Switch
//         value={theme === "dark"}
//         onValueChange={toggleTheme}
//       />
//     </View>
//   );
// }

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
      }}
    >
      <Text
        style={{
          fontSize: 20,
          marginBottom: 10,
          color: theme.text,
        }}
      >
        Current theme: {mode.toUpperCase()}
      </Text>

      <Switch
        value={mode === "dark"}   // ✅ check mode (string)
        onValueChange={toggleTheme}
      />
    </View>
  );
}
