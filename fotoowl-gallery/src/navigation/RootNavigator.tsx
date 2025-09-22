
import React from "react";
import { BottomTabBarButtonProps, createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import { Pressable } from "react-native";

import HomeScreen from "../screens/HomeScreen";
import FavoritesScreen from "../screens/FavoritesScreen";
import SettingsScreen from "../screens/settingsScreen";
import ViewerScreen from "../screens/ViewerScreen";
import { useTheme } from "../theme/ThemeProvider"; // 👈 import theme hook

// ✅ Tab params
export type RootTabParamList = {
  Home: undefined;
  Favorites: undefined;
  Settings: undefined;
};

// ✅ Stack params (includes tabs + viewer)
export type RootStackParamList = {
  Home: undefined;
  Tabs: undefined;
  Viewer: { index: number; items: any[]; eventId: number; imageId: number };
};

const Tab = createBottomTabNavigator<RootTabParamList>();
const Stack = createNativeStackNavigator<RootStackParamList>();

function CustomTabButton({ children, onPress, accessibilityState }: BottomTabBarButtonProps) {
  const { theme } = useTheme();
  const focused = accessibilityState?.selected;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: pressed
          ? theme.overlay
          : focused
          ? theme.overlay
          : "transparent",
        borderRadius: 14,
        margin: 6,
        padding: 8,
      })}
    >
      {children}
    </Pressable>
  );
}

// ✅ Tabs definition
function TabNavigator() {
  const { theme } = useTheme(); // 👈 access theme

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarButton: (props) => <CustomTabButton {...props} />,
        tabBarIcon: ({ color, size, focused }) => {
          let iconName: keyof typeof Ionicons.glyphMap = "home";

          if (route.name === "Home") {
            iconName = "home";
          } else if (route.name === "Favorites") {
            iconName = "heart";
          } else if (route.name === "Settings") {
            iconName = "settings";
          }

          const scale = focused ? 1.2 : 1.0;

          return <Ionicons name={iconName} size={size * scale} color={color} />;
        },
        headerShown: false,

        // 👇 Dynamic theme colors
        tabBarActiveTintColor: theme.primary,
        tabBarInactiveTintColor: theme.muted,
        tabBarStyle: {
          backgroundColor: theme.surface,
          borderTopColor: theme.border,
          borderTopWidth: 1,
          height: 58,
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Favorites" component={FavoritesScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}


// ✅ Root stack
export default function RootNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Tabs" component={TabNavigator} />
      <Stack.Screen name="Viewer" component={ViewerScreen} />
    </Stack.Navigator>
  );
}
