import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "../screens/Home";
import ViewerScreen from '../screens/Viewer';
import FavoritesScreen from "../screens/FavoritesScreen";
export type RootStackParamList = {
    Home: undefined;
    Viewer: {index: number; id?: string} | undefined;
}

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator(){
    return(
        <Stack.Navigator>
            <Stack.Screen name="Home" component={HomeScreen}/>
            <Stack.Screen
                name="Viewer"
                component={ViewerScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen name="Favorites" component={FavoritesScreen} />
        </Stack.Navigator>
    )
}