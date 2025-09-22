import 'react-native-gesture-handler';
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { QueryClient, QueryClientProvider } from  "@tanstack/react-query";
import RootNavigator from "./navigation/RootNavigator";
import Toast from "react-native-toast-message";
import { Button } from "react-native";
import { StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ThemeProvider } from './theme/ThemeProvider';
import * as Linking from 'expo-linking';

const queryClient = new QueryClient({
    defaultOptions: {
        queries:{
            retry: false,
            refetchOnWindowFocus: false
        },
    },
});

const prefix = Linking.createURL("/");

const linking = {
  prefixes: ["http://localhost:8081", "myapp://"],
  config: {
    screens: {
      Tabs: {
        screens: {
          Home: "event/:eventId", // Home can be tied to eventId if needed
          Favorites: "favorites",
          Settings: "settings",
        },
      },
      Viewer: "event/:eventId/image/:imageId",
    },
  },
};

export default function App(){
    return (
        <>
        <ThemeProvider>
        <GestureHandlerRootView style={styles.flex}>
        <QueryClientProvider client={queryClient}>
            <NavigationContainer linking={linking}>
                <RootNavigator />
            </NavigationContainer>
        </QueryClientProvider>
                <Toast />
    </GestureHandlerRootView>
    </ThemeProvider>
        </>
    );
}

const styles = StyleSheet.create({
    flex: { flex: 1 },
  });