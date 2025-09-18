import { View } from "react-native";

export function SkeletonCard() {
  return (
    <View
      style={{
        flex: 1,
        aspectRatio: 1,
        margin: 4,
        borderRadius: 8,
        backgroundColor: "#e1e1e1",
        opacity: 0.6,
      }}
    />
  );
}
