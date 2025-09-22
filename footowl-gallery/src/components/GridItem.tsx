import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";

export default function GridItem({
  id,
  title,
  thumbnailUrl,
  isFavorited,
  onPress,
  onToggleFavorite,
}: {
  id: string;
  title: string;
  thumbnailUrl: string;
  isFavorited: boolean;
  onPress: () => void;
  onToggleFavorite: () => void;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      testID="griditem-touchable" // Add testID for the touchable wrapper
      style={{ margin: 8, borderRadius: 8, overflow: "hidden" }}
    >
      <Image
        source={{ uri: thumbnailUrl }}
        testID="griditem-image" // Add testID for the image
        style={{ width: "100%", height: 150 }}
      />
      <View style={{ padding: 8 }}>
        <Text>{title}</Text>
        <TouchableOpacity
          onPress={onToggleFavorite}
          testID="griditem-fav-button" // Add testID for the favorite button
          style={{
            position: "absolute",
            top: 8,
            right: 8,
            backgroundColor: "rgba(0,0,0,0.5)",
            borderRadius: 16,
            padding: 4,
          }}
        >
          <Text style={{ color: isFavorited ? "red" : "white" }}>
            {isFavorited ? "♥" : "♡"}
          </Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}
