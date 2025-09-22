// components/ImageCard.tsx
import React from "react";
import { TouchableOpacity, View } from "react-native";
import { Image as ExpoImage } from "expo-image";

export type ImageCardProps = {
  item: any;
  size: number;
  onPress: () => void;
  isFav: boolean;
  onToggleFav: () => void;
};

const ImageCardBase: React.FC<ImageCardProps> = ({ item, size, onPress, isFav, onToggleFav }) => {
  return (
    <View style={{ width: size, height: size, padding: 4 }}>
      <TouchableOpacity
        style={{ flex: 1, borderRadius: 8, overflow: "hidden" }}
        activeOpacity={0.9}
        onPress={onPress}
      >
        <ExpoImage
          source={{ uri: item.thumbnail_url ?? item.img_url }}
          style={{ flex: 1, borderRadius: 8 }}
          contentFit="cover"
          cachePolicy="disk"
        />
        <TouchableOpacity
          onPress={onToggleFav}
          style={{
            position: "absolute",
            top: 8,
            right: 8,
            backgroundColor: "rgba(0,0,0,0.5)",
            borderRadius: 16,
            padding: 4,
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
