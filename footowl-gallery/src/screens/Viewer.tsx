import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Dimensions,
} from "react-native";
import { Image as ExpoImage } from "expo-image";
import { StatusBar } from "expo-status-bar";
import { useRoute, useNavigation } from "@react-navigation/native";
import { ZoomableImage } from "../../components/ZoomableImage";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function ViewerScreen() {
  const route = useRoute<any>();
  const navigation = useNavigation();
  const { index, items } = route.params; // 👈 must pass from HomeScreen
  const { width, height } = Dimensions.get("window");

  return (
    <View style={{ flex: 1, backgroundColor: "#000" }}>
      <StatusBar hidden />
      <FlatList
        data={items}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        initialScrollIndex={index}
        keyExtractor={(item) => item.id}
        getItemLayout={(data, i) => ({
          length: width,
          offset: width * i,
          index: i,
        })}
        renderItem={({ item }) => <ZoomableImage uri={item.url} />}        
      />

      {/* Close button overlay */}
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={{ position: "absolute", top: 40, right: 20 }}
      >
        <Ionicons name="close" size={30} color="white" />
      </TouchableOpacity>
    </View>
  );
}
