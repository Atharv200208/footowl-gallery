// components/ImageCard.tsx
import React from "react";
import { TouchableOpacity, View } from "react-native";
import { Image as ExpoImage } from "expo-image";
import { useTheme } from "../src/theme/ThemeProvider";

export type ImageCardProps = {
  item: any;
  size: number;
  onPress: () => void;
  isFav: boolean;
  onToggleFav: () => void;
};

const ImageCardBase: React.FC<ImageCardProps> = ({ item, size, onPress, isFav, onToggleFav }) => {
  const { theme } = useTheme();
  return (
    <View style={{ width: size, height: size, padding: 6 }}>
      <TouchableOpacity
        style={{
          flex: 1,
          borderRadius: 12,
          overflow: "hidden",
          backgroundColor: theme.card,
          shadowColor: theme.shadow.color,
          shadowOpacity: theme.shadow.opacity,
          shadowRadius: theme.shadow.radius,
          shadowOffset: { width: 0, height: 4 },
          elevation: theme.shadow.elevation,
        }}
        activeOpacity={0.9}
        onPress={onPress}
      >
        <ExpoImage
          source={{ uri: item.thumbnail_url ?? item.img_url }}
          style={{ flex: 1 }}
          contentFit="cover"
          transition={300}
          cachePolicy="disk"
        />
        <TouchableOpacity
          onPress={onToggleFav}
          style={{
            position: "absolute",
            top: 8,
            right: 8,
            backgroundColor: theme.overlay,
            borderRadius: 18,
            padding: 6,
          }}
        >
          <View>
            <ExpoImage
              source={{
                uri: isFav
                  ? "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='20' height='20'><text y='14' x='2' fill='red'>♥</text></svg>"
                  : "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='20' height='20'><text y='14' x='2' fill='white'>♡</text></svg>",
              }}
              style={{ width: 20, height: 20 }}
            />
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
    </View>
  );
};

export const ImageCard = React.memo(
  ImageCardBase,
  (prev, next) =>
    prev.item.id === next.item.id &&
    prev.isFav === next.isFav &&
    prev.size === next.size
);
