// src/components/OfflineBanner.tsx
import React from "react";
import { View, Text } from "react-native";

export default function OfflineBanner() {
  return (
    <View
      style={{
        backgroundColor: "red",
        padding: 6,
        alignItems: "center",
      }}
    >
      <Text style={{ color: "white", fontWeight: "bold" }}>
        You’re offline
      </Text>
    </View>
  );
}
