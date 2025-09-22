// screens/FavoritesScreen.tsx
import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  StatusBar,
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
  const [showFab, setShowFab] = useState(false);
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
  // const colors = theme === "dark" ? darkTheme : lightTheme; 

  if (!items || items.length === 0) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: theme.background }}>
        <Text style={{ fontSize: 16, color: theme.text }}>No favorites yet.</Text>
      </View>
    );
  }

  //console.log("Favorites state:", favorites);

return (
   <View style={{ flex: 1, backgroundColor: theme.background }}>
  <StatusBar barStyle={theme.text === '#E5E7EB' ? 'light-content' : 'dark-content'} backgroundColor={theme.background as any} />
  <FlashList
    ref={flatListRef}
    data={items}
    numColumns={cols}
    key={cols}
    keyExtractor={(item: any) => item.id}
    renderItem={({ item, index }) => (
      <View style={{ flex: 1 / cols, aspectRatio: 1, padding: 6 }}>
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
          onPress={() => navigation.navigate("Viewer", { index, items })}
        >
          <ExpoImage
            source={{ uri: item.thumbUrl }}
            style={{ flex: 1 }}
            contentFit="cover"
            transition={300}
            cachePolicy="disk"
          />
          <TouchableOpacity
            style={{
              position: "absolute",
              top: 8,
              right: 8,
              backgroundColor: theme.overlay,
              borderRadius: 18,
              padding: 6,
            }}
            onPress={() => handleFavoriteToggle(item)}
          >
            <Text style={{ fontSize: 18, color: "red" }}>♥</Text>
          </TouchableOpacity>
        </TouchableOpacity>
      </View>
    )}
    onScroll={(e) => {
      const offset = e.nativeEvent.contentOffset.y;
      setShowFab(offset > 300);
    }}
    scrollEventThrottle={16}
    ListFooterComponent={<ActivityIndicator animating={false} />}
  />

  {showFab && (
    <TouchableOpacity
      onPress={() => flatListRef.current?.scrollToOffset?.({ offset: 0, animated: true })}
      activeOpacity={0.9}
      style={{
        position: "absolute",
        right: 16,
        bottom: 24,
        backgroundColor: theme.primary,
        borderRadius: 28,
        paddingVertical: 12,
        paddingHorizontal: 14,
        shadowColor: theme.shadow.color,
        shadowOpacity: theme.shadow.opacity,
        shadowRadius: theme.shadow.radius,
        shadowOffset: { width: 0, height: 4 },
        elevation: theme.shadow.elevation,
      }}
      accessibilityLabel="Scroll to top"
    >
      <Text style={{ color: "white", fontWeight: "700" }}>Top</Text>
    </TouchableOpacity>
  )}
  </View>
);

}
