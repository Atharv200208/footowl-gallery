import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";

import HomeScreen from "../screens/Home";
import FavoritesScreen from "../screens/FavoritesScreen";
import SettingsScreen from "../screens/settingsScreen";
import ViewerScreen from "../screens/Viewer";

// ✅ Tab params
export type RootTabParamList = {
  Home: undefined;
  Favorites: undefined;
  Settings: undefined;
};

// ✅ Stack params (includes tabs + viewer)
export type RootStackParamList = {
  Tabs: undefined;
  Viewer: { index: number; items: any[] };
};

const Tab = createBottomTabNavigator<RootTabParamList>();
const Stack = createNativeStackNavigator<RootStackParamList>();

// ✅ Tabs definition
function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = "home";

          if (route.name === "Home") {
            iconName = "home";
          } else if (route.name === "Favorites") {
            iconName = "heart";
          } else if (route.name === "Settings") {
            iconName = "settings";
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        headerShown: false,
        tabBarActiveTintColor: "tomato",
        tabBarInactiveTintColor: "gray",
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Favorites" component={FavoritesScreen}/>
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

