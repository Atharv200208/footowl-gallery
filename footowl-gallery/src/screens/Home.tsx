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
import * as Network from "expo-network";
import { loadFromCache, saveToCache } from "../utils/imageCache";
import Toast from "react-native-toast-message";

type RootStackParamList = {
  Home: undefined;
  Viewer: { index: number; items: any[] };
  Favorites: undefined;
};

export default function HomeScreen() {
  const [cachedItems, setCachedItems] = React.useState<any[]>([]);
  const [isOffline, setIsOffline] = React.useState(false);
  //  const [refreshing, setRefreshing] = React.useState(false);
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
    if (data?.pages?.length) {
      const latestItems = data.pages.flatMap((p: any) => p.items ?? []);
      if (latestItems.length > 0) {
        saveToCache(latestItems);
      }
    }
  }, [data]);


  useEffect(() => {
    const checkNetwork = async () => {
      const status = await Network.getNetworkStateAsync();
      setIsOffline(!status.isConnected);
    };

    checkNetwork();
    const interval = setInterval(checkNetwork, 5000); // recheck every 5s
    return () => clearInterval(interval);
  }, []);

  // ✅ Hydrate from cache if offline
  useEffect(() => {
    (async () => {
      if (isOffline) {
        const cache = await loadFromCache();
        setCachedItems(cache);
      }
    })();
  }, [isOffline]);

  useEffect(() => {
    if (isError) console.warn("Image load error", error);
  }, [isError, error]);

  const items = (data?.pages ?? []).flatMap((p: any) => p.items ?? []);
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



  const { favorites, toggleFavorite, loadFavorites } = useFavoritesStore();

  useEffect(() => {
    loadFavorites();
  }, [loadFavorites]);

  useEffect(() => {
    (async () => {
      const status = await Network.getNetworkStateAsync();
      if (!status.isConnected) {
        const cache = (await loadFromCache()) ?? [];
        setCachedItems(cache);
      }
    })();
  }, []);

  const handleFavoriteToggle = (item) => {
    const isCurrentlyFavorite = !!favorites[item.id]; // check before toggle
    toggleFavorite(item);
  
    Toast.show({
      type: 'success',
      text1: isCurrentlyFavorite ? 'Removed from favorites' : 'Added to favorites',
      position: 'top',
      visibilityTime: 1500,
    });
  };

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

  // console.log('Favorites store state:', useFavoritesStore.getState());

  const displayItems = items.length > 0 ? items : cachedItems;
  return (
    <View style={{ flex: 1 }}>
      {/* ✅ Main image grid */}
      <FlashList
        key={cols}
        ref={flatListRef}
        data={displayItems}
        numColumns={cols}
        initialScrollIndex={displayItems.length > 0 ? lastVisibleIndexRef.current : undefined}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <View style={{ flex: 1 / cols, aspectRatio: 1, padding: 4 }}>
            {/* Whole card clickable for navigation */}
            <TouchableOpacity
              style={{ flex: 1, borderRadius: 8, overflow: "hidden" }}
              activeOpacity={0.9}
              onPress={() => navigation.navigate("Viewer", { index, items: displayItems })}
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
                onPress={() => handleFavoriteToggle(item)}
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
