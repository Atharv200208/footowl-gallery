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


const queryClient = new QueryClient({
    defaultOptions: {
        queries:{
            retry: false,
            refetchOnWindowFocus: false
        },
    },
});


export default function App(){
    return (
        <>
        <ThemeProvider>
        <GestureHandlerRootView style={styles.flex}>
        <QueryClientProvider client={queryClient}>
            <NavigationContainer>
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