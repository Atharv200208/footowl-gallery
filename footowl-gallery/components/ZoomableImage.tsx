import React, { useRef } from "react";
import { Dimensions } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import {
  Gesture,
  GestureDetector,
} from "react-native-gesture-handler";
import { Image as ExpoImage } from "expo-image";

const { width, height } = Dimensions.get("window");

export function ZoomableImage({ uri }: { uri: string }) {
  const scale = useSharedValue(1);
  const savedScale = useSharedValue(1);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const savedX = useSharedValue(0); const savedY = useSharedValue(0);
  // Pinch gesture
  const pinch = Gesture.Pinch()
    .onStart(() => {
      savedScale.value = scale.value;
    })
    .onUpdate((e) => {
      scale.value = savedScale.value * e.scale;
    })
    .onEnd(() => {
      if (scale.value < 1) {
        scale.value = withTiming(1);
      }
    });

  // Pan gesture (only active if zoomed in)
const pan = Gesture.Pan()
  .onBegin(() => {
    savedX.value = translateX.value;
    savedY.value = translateY.value;
  })
  .onUpdate((e) => {
    if (scale.value > 1) {
      translateX.value = savedX.value + e.translationX;
      translateY.value = savedY.value + e.translationY;
    }
  });


  // Double tap gesture
  const doubleTap = Gesture.Tap()
    .numberOfTaps(2)
    .onEnd(() => {
      scale.value = scale.value > 1 ? withTiming(1) : withTiming(2);
      translateX.value = withTiming(0);
      translateY.value = withTiming(0);
    });

  const composed = Gesture.Simultaneous(pinch, pan, doubleTap);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { translateX: translateX.value },
      { translateY: translateY.value },
    ],
  }));

  return (
    <GestureDetector gesture={composed}>
      <Animated.View style={{ width, height, alignItems: "center", justifyContent: "center" }}>
        <Animated.View style={animatedStyle}>
          <ExpoImage
            source={{ uri }}
            style={{ width, height }}
            contentFit="contain"
            cachePolicy="disk"
          />
        </Animated.View>
      </Animated.View>
    </GestureDetector>
  );
}
