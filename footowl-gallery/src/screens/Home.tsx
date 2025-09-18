import React, { useRef, useEffect, useCallback } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { Image as ExpoImage } from "expo-image";
import {
  useIsFocused,
  useNavigation,
  NavigationProp,
} from "@react-navigation/native";
import { InteractionManager, Platform } from "react-native";
import { SkeletonCard } from "../../components/skeletonCard";
import { useInfiniteImages } from "../hooks/useInfiniteImages";
import { FlashList } from "@shopify/flash-list";
import { useFavoritesStore } from "../../state/favorites";


type RootStackParamList = {
  Home: undefined;
  Viewer: { index: number; items: any[] };
};

export default function HomeScreen() {
  const {
    data,
    fetchNextPage,
    isFetchingNextPage,
    refetch,
    isRefetching,
    isLoading,
    isError,
    error,
  } = useInfiniteImages({ pageSize: 40 });

  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  useEffect(() => {
    if (isError) console.warn("Image load error", error);
  }, [isError, error]);

  const items = ((data?.pages as any[]) ?? []).flatMap((p: any) => p.items ?? []);
  const cols = Math.max(1, Math.floor(Dimensions.get("window").width / 150));

  // ✅ Refresh handler
  const handleRefresh = useCallback(() => {
    refetch();
  }, [refetch]);

  // ✅ Scroll offset handling
  const scrollOffsetRef = useRef(0);
  const flatListRef = useRef<any>(null);
  const isFocused = useIsFocused();
  const lastVisibleIndexRef = useRef(0);

  useEffect(() => {
    if (isFocused && flatListRef.current) {
      const restore = () => {
        const targetIndex = Math.max(0, lastVisibleIndexRef.current - 1);
        try {
          flatListRef.current?.scrollToIndex({ index: targetIndex, animated: false });
        } catch {
          flatListRef.current?.scrollToOffset({ offset: scrollOffsetRef.current, animated: false });
        }
      };

      if (Platform.OS === "web") {
        requestAnimationFrame(() => requestAnimationFrame(restore));
      } else {
        InteractionManager.runAfterInteractions(restore);
      }
    }
  }, [isFocused]);

  useEffect(() => {
    useFavoritesStore.getState().loadFavorites();
  }, []);

  const { favorites, toggleFavorite } = useFavoritesStore();

  if (isLoading) {
    const { height, width } = Dimensions.get("window");
    const rows = Math.ceil(height / (width / cols));
    const skeletons = new Array(rows * cols).fill(null);

    return (
      <FlashList
        data={skeletons}
        numColumns={cols}
        keyExtractor={(_, i) => `skeleton-${i}`}
        renderItem={({ index }) => <SkeletonCard key={`skeleton-${index}`} />}
      />
    );
  }

  if (isError) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Text>Error loading images</Text>
      </View>
    );
  }

  if (!isLoading && !isError && items.length === 0) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Text>No images found.</Text>
      </View>
    );
  }

  return (
  <View style={{ flex: 1 }}>
    {/* ✅ Floating Favorites button */}
    <TouchableOpacity
      style={{
        position: "absolute",
        top: 50,
        right: 20,
        zIndex: 10,
        backgroundColor: "rgba(0,0,0,0.6)",
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 20,
      }}
      onPress={() => navigation.navigate("Favorites")}
    >
      <Text style={{ color: "white", fontSize: 14 }}>❤️ Favorites</Text>
    </TouchableOpacity>

    {/* ✅ Main image grid */}
    <FlashList
      key={cols}
      ref={flatListRef}
      data={items}
      numColumns={cols}
      initialScrollIndex={lastVisibleIndexRef.current}
      keyExtractor={(item) => item.id}
      renderItem={({ item, index }) => (
        <View style={{ flex: 1 / cols, aspectRatio: 1, padding: 4 }}>
          {/* Whole card clickable for navigation */}
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

            {/* Favorite button overlay (heart) */}
            <TouchableOpacity
              style={{
                position: "absolute",
                top: 8,
                right: 8,
                backgroundColor: "rgba(0,0,0,0.5)",
                borderRadius: 16,
                padding: 4,
              }}
              onPress={() => toggleFavorite(item.id)}
            >
              <Text style={{ fontSize: 18, color: favorites[item.id] ? "red" : "white" }}>
                {favorites[item.id] ? "♥" : "♡"}
              </Text>
            </TouchableOpacity>
          </TouchableOpacity>
        </View>
      )}
      onViewableItemsChanged={({ viewableItems }) => {
        if (viewableItems && viewableItems.length > 0 && viewableItems[0].index != null) {
          lastVisibleIndexRef.current = viewableItems[0].index as number;
        }
      }}
      onScroll={(event) => {
        scrollOffsetRef.current = event.nativeEvent.contentOffset.y;
      }}
      onMomentumScrollEnd={(event) => {
        scrollOffsetRef.current = event.nativeEvent.contentOffset.y;
      }}
      onScrollEndDrag={(event) => {
        scrollOffsetRef.current = event.nativeEvent.contentOffset.y;
      }}
      scrollEventThrottle={16}
      onEndReached={() => {
        if (!isFetchingNextPage) fetchNextPage();
      }}
      onEndReachedThreshold={0.6}
      ListFooterComponent={() =>
        isFetchingNextPage ? <ActivityIndicator /> : null
      }
      refreshControl={
        <RefreshControl refreshing={!!isRefetching} onRefresh={handleRefresh} />
      }
      extraData={cols}
    />
  </View>
  );
}
