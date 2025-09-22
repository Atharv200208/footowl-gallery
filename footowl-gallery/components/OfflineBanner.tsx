// src/components/OfflineBanner.tsx
import React, { useEffect } from "react";
import { View, Text } from "react-native";
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withRepeat } from "react-native-reanimated";
import { useTheme } from "../src/theme/ThemeProvider";

export default function OfflineBanner() {
  const { theme } = useTheme();
  const opacity = useSharedValue(0.85);
  useEffect(() => {
    opacity.value = withRepeat(withTiming(1, { duration: 1000 }), -1, true);
  }, [opacity]);

  const animatedStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return (
    <Animated.View
      style={[
        {
          backgroundColor: "#EF4444",
          padding: 8,
          alignItems: "center",
        },
        animatedStyle,
      ]}
    >
      <Text style={{ color: theme.surface, fontWeight: "700" }}>You’re offline</Text>
    </Animated.View>
  );
}
