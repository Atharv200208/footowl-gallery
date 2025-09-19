import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { QueryClient, QueryClientProvider } from  "@tanstack/react-query";
import RootNavigator from "./navigation/RootNavigator";


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
        <QueryClientProvider client={queryClient}>
            <NavigationContainer>
                <RootNavigator />
            </NavigationContainer>
        </QueryClientProvider>
    );
}