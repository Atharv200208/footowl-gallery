import { View } from "react-native";
import React from "react";
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withRepeat } from "react-native-reanimated";
import { useTheme } from "../theme/ThemeProvider";
export function SkeletonCard() {
  const { theme } = useTheme();
  const shimmer = useSharedValue(0.6);
  React.useEffect(() => {
    shimmer.value = withRepeat(withTiming(1, { duration: 1200 }), -1, true);
  }, [shimmer]);
  const animatedStyle = useAnimatedStyle(() => ({ opacity: shimmer.value }));

  return (
    <Animated.View
      style={[
        {
          flex: 1,
          aspectRatio: 1,
          margin: 6,
          borderRadius: 12,
          backgroundColor: theme.surface,
          shadowColor: theme.shadow.color,
          shadowOpacity: theme.shadow.opacity,
          shadowRadius: theme.shadow.radius,
          shadowOffset: { width: 0, height: 4 },
          elevation: theme.shadow.elevation,
        },
        animatedStyle,
      ]}
    />
  );
}
