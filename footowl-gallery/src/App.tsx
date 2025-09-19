import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { QueryClient, QueryClientProvider } from  "@tanstack/react-query";
import RootNavigator from "./navigation/RootNavigator";
import Toast from "react-native-toast-message";
import { Button } from "react-native";

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
        <QueryClientProvider client={queryClient}>
            <NavigationContainer>
                <RootNavigator />
            </NavigationContainer>


        </QueryClientProvider>
                <Toast />
            {/* <Button
  title="Show Toast"
  onPress={() => Toast.show({ type: 'success', text1: 'Hello from root' })}
/> */}
        </>
    );
}