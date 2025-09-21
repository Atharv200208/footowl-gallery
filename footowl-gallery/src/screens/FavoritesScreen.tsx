// screens/FavoritesScreen.tsx
import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { FlashList } from "@shopify/flash-list";
import { Image as ExpoImage } from "expo-image";
import { useFavoritesStore } from "../../state/favorites";
import Toast from "react-native-toast-message";
import { useTheme } from "../theme/ThemeProvider";
import { lightTheme, darkTheme } from "../theme/theme";

type RootStackParamList = {
  Home: undefined;
  Viewer: { index: number; items: any[] };
};

export default function FavoritesScreen() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { favorites, loadFavorites, toggleFavorite } = useFavoritesStore();
  const items = Object.values(favorites); // now full ImageItem objects

  const flatListRef = useRef<any>(null);
  const cols = Math.max(1, Math.floor(Dimensions.get("window").width / 150));
  const handleFavoriteToggle = (item: any) => {
  const isCurrentlyFavorite = !!favorites[item.id]; // check before toggle
  toggleFavorite(item);


  Toast.show({
    type: 'success',
    text1: isCurrentlyFavorite ? 'Removed from favorites' : 'Added to favorites',
    position: 'top',
    visibilityTime: 1500,
  });
};

  // load favorites on mount
  useEffect(() => {
    loadFavorites();
  }, [loadFavorites]);

    const { theme } = useTheme();
  const colors = theme === "dark" ? darkTheme : lightTheme; 

  if (!items || items.length === 0) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text style={{ fontSize: 16, color: "#666" }}>No favorites yet.</Text>
      </View>
    );
  }

  //console.log("Favorites state:", favorites);

  return (
    <FlashList
      ref={flatListRef}
      data={items}
      numColumns={cols}
      key={cols}
      keyExtractor={(item: any) => item.id}
      renderItem={({ item, index }) => (
        <View style={{ flex: 1 / cols, aspectRatio: 1, padding: 4 , backgroundColor: colors.background}}>
          <TouchableOpacity
            style={{ flex: 1, borderRadius: 8, overflow: "hidden" }}
            activeOpacity={0.9}
            onPress={() => navigation.navigate("Viewer", { index, items })}
          >
            <ExpoImage
              source={{ uri: item.thumbUrl }}
              style={{ flex: 1, borderRadius: 8 }}
              contentFit="cover"
              cachePolicy="disk"
            />

            {/* Heart toggle */}
            <TouchableOpacity
              style={{
                position: "absolute",
                top: 8,
                right: 8,
                backgroundColor: "rgba(0,0,0,0.5)",
                borderRadius: 16,
                padding: 4,
              }}
              onPress={() => handleFavoriteToggle(item)} // ✅ pass full object
            >
              <Text style={{ fontSize: 18, color: "red" }}>♥</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        </View>
      )}
      ListFooterComponent={<ActivityIndicator animating={false} />}
    />
  );
}
