// import React, { useRef, useEffect, useCallback } from "react";
// import {
//   View,
//   Text,
//   ActivityIndicator,
//   RefreshControl,
//   TouchableOpacity,
//   Dimensions,
// } from "react-native";
// import { Image as ExpoImage } from "expo-image";
// import {
//   useIsFocused,
//   useNavigation,
//   NavigationProp,
// } from "@react-navigation/native";
// import { InteractionManager, Platform } from "react-native";
// import { SkeletonCard } from "../../components/skeletonCard";
// import { useInfiniteImages } from "../hooks/useInfiniteImages";
// import { FlashList } from "@shopify/flash-list";
// import { useFavoritesStore } from "../../state/favorites";
// import * as Network from "expo-network";
// import { loadFromCache, saveToCache } from "../utils/imageCache";
// import Toast from "react-native-toast-message";
// import { TextInput } from "react-native"; 
// import OfflineBanner from "../../components/OfflineBanner";
// import { useNetwork } from "../hooks/useNetwork";

// type RootStackParamList = {
//   Home: undefined;
//   Viewer: { index: number; items: any[] };
//   Favorites: undefined;
// };

// export default function HomeScreen() {
//   const [cachedItems, setCachedItems] = React.useState<any[]>([]);
//   const [isOffline, setIsOffline] = React.useState(false);
//   const [orderBy, setOrderBy] = React.useState<string | number>(2);
//   const [orderAsc, setOrderAsc] = React.useState<boolean>(true);
//   const [searchQuery, setSearchQuery] = React.useState("");
 
//   const {
//     data,
//     fetchNextPage,
//     isFetchingNextPage,
//     refetch,
//     isRefetching,
//     isLoading,
//     isError,
//     error,
//   } = useInfiniteImages({ pageSize: 40, orderBy, orderAsc });

//   const navigation = useNavigation<NavigationProp<RootStackParamList>>();

//   const items = (data?.pages ?? []).flatMap((p: any) => p.items ?? []);
// const filteredItems = items.filter((item) => {
//   const q = searchQuery.toLowerCase();
//   return (
//     item.name?.toLowerCase().includes(q) ||
//     item.img_url?.toLowerCase().includes(q)
//   );
// });
//   const cols = Math.max(1, Math.floor(Dimensions.get("window").width / 150));
//   // ✅ Scroll offset handling
//   const scrollOffsetRef = useRef(0);
//   const flatListRef = useRef<any>(null);
//   const isFocused = useIsFocused();
//   const lastVisibleIndexRef = useRef(0);

//   const { favorites, toggleFavorite, loadFavorites } = useFavoritesStore();


//   useEffect(() => {
//     if (data?.pages?.length) {
//       const latestItems = data.pages.flatMap((p: any) => p.items ?? []);
//       if (latestItems.length > 0) {
//         saveToCache(latestItems);
//       }
//     }
//   }, [data]);

//   // useEffect(() => {
//   //   const checkNetwork = async () => {
//   //     const status = await Network.getNetworkStateAsync();
//   //     setIsOffline(!status.isConnected);
//   //   };

//   //   checkNetwork();
//   //   const interval = setInterval(checkNetwork, 5000); // recheck every 5s
//   //   return () => clearInterval(interval);
//   // }, []);

//   // ✅ Hydrate from cache if offline
//   useEffect(() => {
//     (async () => {
//       if (isOffline) {
//         const cache = await loadFromCache();
//         setCachedItems(cache);
//       }
//     })();
//   }, [isOffline]);

//   useEffect(() => {
//     if (isError) console.warn("Image load error", error);
//   }, [isError, error]);

//   // ✅ Refresh handler
//   const handleRefresh = useCallback(() => {
//     refetch();
//   }, [refetch]);

//   useEffect(() => {
//     if (isFocused && flatListRef.current) {
//       const restore = () => {
//         const targetIndex = Math.max(0, lastVisibleIndexRef.current - 1);
//         try {
//           flatListRef.current?.scrollToIndex({ index: targetIndex, animated: false });
//         } catch {
//           flatListRef.current?.scrollToOffset({ offset: scrollOffsetRef.current, animated: false });
//         }
//       };

//       if (Platform.OS === "web") {
//         requestAnimationFrame(() => requestAnimationFrame(restore));
//       } else {
//         InteractionManager.runAfterInteractions(restore);
//       }
//     }
//   }, [isFocused]);

//   useEffect(() => {
//     loadFavorites();
//   }, [loadFavorites]);

//   useEffect(() => {
//     (async () => {
//       const status = await Network.getNetworkStateAsync();
//       if (!status.isConnected) {
//         const cache = (await loadFromCache()) ?? [];
//         setCachedItems(cache);
//       }
//     })();
//   }, []);

//   const handleFavoriteToggle = (item: any) => {
//     const isCurrentlyFavorite = !!favorites[item.id]; // check before toggle
//     toggleFavorite(item);

//     Toast.show({
//       type: 'success',
//       text1: isCurrentlyFavorite ? 'Removed from favorites' : 'Added to favorites',
//       position: 'top',
//       visibilityTime: 1500,
//     });
//   };

// const displayItems = (filteredItems.length > 0 || searchQuery)
//   ? filteredItems
//   : (items.length > 0 ? items : cachedItems);

//   if (isLoading) {
//     const { height, width } = Dimensions.get("window");
//     const rows = Math.ceil(height / (width / cols));
//     const skeletons = new Array(rows * cols).fill(null);


//     return (
//       <FlashList
//         data={skeletons}
//         numColumns={cols}
//         keyExtractor={(_, i) => `skeleton-${i}`}
//         renderItem={({ index }) => <SkeletonCard key={`skeleton-${index}`} />}
//       />
//     );
//   }

//   if (isError) {
//     return (
//       <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
//         <Text>Error loading images</Text>
//       </View>
//     );
//   }

//   if (!isLoading && !isError && items.length === 0) {
//     return (
//       <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
//         <Text>No images found.</Text>
//       </View>
//     );
//   }

//   // console.log('Favorites store state:', useFavoritesStore.getState());




//   return (
//   <View style={{ flex: 1 }}>
//     {/* ✅ Offline banner at top */}
//     {isOfflineNetwork && <OfflineBanner />}

//     <TextInput
//       placeholder="Search images..."
//       value={searchQuery}
//       onChangeText={setSearchQuery}
//       style={{
//         margin: 10,
//         padding: 8,
//         borderWidth: 1,
//         borderColor: "#ccc",
//         borderRadius: 8,
//         backgroundColor: "white",
//       }}
//     />

//     {/* Filters */}
//     <View
//       style={{
//         flexDirection: "row",
//         justifyContent: "space-around",
//         padding: 8,
//       }}
//     >
//       <TouchableOpacity
//         onPress={() => {
//           setOrderBy(2);
//           setOrderAsc(false); // newest
//         }}
//         style={{ padding: 6, backgroundColor: "#222", borderRadius: 6 }}
//         disabled={isOfflineNetwork} // ✅ disable filter when offline
//       >
//         <Text style={{ color: "white" }}>Newest</Text>
//       </TouchableOpacity>

//       <TouchableOpacity
//         onPress={() => {
//           setOrderBy(2);
//           setOrderAsc(true); // oldest
//         }}
//         style={{ padding: 6, backgroundColor: "#222", borderRadius: 6 }}
//         disabled={isOfflineNetwork}
//       >
//         <Text style={{ color: "white" }}>Oldest</Text>
//       </TouchableOpacity>
//     </View>

//     {/* ✅ Main image grid */}
//     <FlashList
//       key={cols}
//       ref={flatListRef}
//       data={isOfflineNetwork ? cachedItems : displayItems} // ✅ offline = cached
//       numColumns={cols}
//       keyExtractor={(item) => item.id}
//       renderItem={({ item, index }) => (
//         <View style={{ flex: 1 / cols, aspectRatio: 1, padding: 4 }}>
//           <TouchableOpacity
//             style={{ flex: 1, borderRadius: 8, overflow: "hidden" }}
//             activeOpacity={0.9}
//             onPress={() =>
//               navigation.navigate("Viewer", {
//                 index,
//                 items: isOfflineNetwork ? cachedItems : displayItems,
//               })
//             }
//           >
//             <ExpoImage
//               source={{ uri: item.thumbUrl }}
//               style={{ flex: 1, borderRadius: 8 }}
//               contentFit="cover"
//               cachePolicy="disk"
//             />

//             <TouchableOpacity
//               style={{
//                 position: "absolute",
//                 top: 8,
//                 right: 8,
//                 backgroundColor: "rgba(0,0,0,0.5)",
//                 borderRadius: 16,
//                 padding: 4,
//               }}
//               onPress={() => handleFavoriteToggle(item)}
//             >
//               <Text
//                 style={{
//                   fontSize: 18,
//                   color: favorites[item.id] ? "red" : "white",
//                 }}
//               >
//                 {favorites[item.id] ? "♥" : "♡"}
//               </Text>
//             </TouchableOpacity>
//           </TouchableOpacity>
//         </View>
//       )}
//       onEndReached={() => {
//         if (!isFetchingNextPage && !isOfflineNetwork) {
//           fetchNextPage();
//         }
//       }}
//       onEndReachedThreshold={0.6}
//       ListFooterComponent={() =>
//         isFetchingNextPage && !isOfflineNetwork ? (
//           <ActivityIndicator />
//         ) : null
//       }
//       refreshControl={
//         <RefreshControl
//           refreshing={!!isRefetching}
//           onRefresh={() => {
//             if (!isOfflineNetwork) handleRefresh();
//           }}
//         />
//       }
//     />
//   </View>
// );

// }



import React, { useRef, useEffect, useCallback } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
  Dimensions,
  TextInput, // ✅ moved up with other imports
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
import { loadFromCache, saveToCache } from "../utils/imageCache";
import Toast from "react-native-toast-message";
import OfflineBanner from "../../components/OfflineBanner"; // ✅ banner
import { useNetwork } from "../hooks/useNetwork"; // ✅ network hook

type RootStackParamList = {
  Home: undefined;
  Viewer: { index: number; items: any[] };
  Favorites: undefined;
};

export default function HomeScreen() {
  const [cachedItems, setCachedItems] = React.useState<any[]>([]);
  // ❌ Removed local isOffline (we’ll only use useNetwork)
  const [orderBy, setOrderBy] = React.useState<string | number>(2);
  const [orderAsc, setOrderAsc] = React.useState<boolean>(true);
  const [searchQuery, setSearchQuery] = React.useState("");

  const { isOfflineNetwork } = useNetwork(); // ✅ global offline state

  const {
    data,
    fetchNextPage,
    isFetchingNextPage,
    refetch,
    isRefetching,
    isLoading,
    isError,
    error,
  } = useInfiniteImages({ pageSize: 40, orderBy, orderAsc });

  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const items = (data?.pages ?? []).flatMap((p: any) => p.items ?? []);

  // ✅ Use caption (or name) for search since ImageItem mapping uses caption
  const filteredItems = items.filter((item) => {
    const q = searchQuery.toLowerCase();
    return (
      item.caption?.toLowerCase().includes(q) ||
      item.url?.toLowerCase().includes(q)
    );
  });

  const cols = Math.max(1, Math.floor(Dimensions.get("window").width / 150));

  // ✅ Scroll offset handling
  const scrollOffsetRef = useRef(0);
  const flatListRef = useRef<any>(null);
  const isFocused = useIsFocused();
  const lastVisibleIndexRef = useRef(0);

  const { favorites, toggleFavorite, loadFavorites } = useFavoritesStore();

  // ✅ Save fresh data to cache
  useEffect(() => {
    if (data?.pages?.length) {
      const latestItems = data.pages.flatMap((p: any) => p.items ?? []);
      if (latestItems.length > 0) {
        saveToCache(latestItems);
      }
    }
  }, [data]);

  // ✅ Hydrate from cache if offline
  useEffect(() => {
    (async () => {
      if (isOfflineNetwork) {
        const cache = await loadFromCache();
        setCachedItems(cache);
      }
    })();
  }, [isOfflineNetwork]);

  useEffect(() => {
    if (isError) console.warn("Image load error", error);
  }, [isError, error]);

  // ✅ Refresh handler
  const handleRefresh = useCallback(() => {
    refetch();
  }, [refetch]);

  // ✅ Restore scroll position
  useEffect(() => {
    if (isFocused && flatListRef.current) {
      const restore = () => {
        const targetIndex = Math.max(0, lastVisibleIndexRef.current - 1);
        try {
          flatListRef.current?.scrollToIndex({
            index: targetIndex,
            animated: false,
          });
        } catch {
          flatListRef.current?.scrollToOffset({
            offset: scrollOffsetRef.current,
            animated: false,
          });
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
    loadFavorites();
  }, [loadFavorites]);

  const handleFavoriteToggle = (item: any) => {
    const isCurrentlyFavorite = !!favorites[item.id];
    toggleFavorite(item);

    Toast.show({
      type: "success",
      text1: isCurrentlyFavorite
        ? "Removed from favorites"
        : "Added to favorites",
      position: "top",
      visibilityTime: 1500,
    });
  };

  // ✅ Decide items: offline → cache, else → search or items
  const displayItems =
    filteredItems.length > 0 || searchQuery
      ? filteredItems
      : items.length > 0
      ? items
      : cachedItems;

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

  // ✅ Main render
  return (
    <View style={{ flex: 1 }}>
      {/* ✅ Offline banner at top */}
      {isOfflineNetwork && <OfflineBanner />}

      <TextInput
        placeholder="Search images..."
        value={searchQuery}
        onChangeText={setSearchQuery}
        style={{
          margin: 10,
          padding: 8,
          borderWidth: 1,
          borderColor: "#ccc",
          borderRadius: 8,
          backgroundColor: "white",
        }}
      />

      {/* Filters */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-around",
          padding: 8,
        }}
      >
        <TouchableOpacity
          onPress={() => {
            setOrderBy(2);
            setOrderAsc(false); // newest
          }}
          style={{ padding: 6, backgroundColor: "#222", borderRadius: 6 }}
          disabled={isOfflineNetwork} // ✅ disable filter when offline
        >
          <Text style={{ color: "white" }}>Newest</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            setOrderBy(2);
            setOrderAsc(true); // oldest
          }}
          style={{ padding: 6, backgroundColor: "#222", borderRadius: 6 }}
          disabled={isOfflineNetwork}
        >
          <Text style={{ color: "white" }}>Oldest</Text>
        </TouchableOpacity>
      </View>

      {/* ✅ Main image grid */}
      <FlashList
        key={cols}
        ref={flatListRef}
        data={isOfflineNetwork ? cachedItems : displayItems} // ✅ offline = cached
        numColumns={cols}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <View style={{ flex: 1 / cols, aspectRatio: 1, padding: 4 }}>
            <TouchableOpacity
              style={{ flex: 1, borderRadius: 8, overflow: "hidden" }}
              activeOpacity={0.9}
              onPress={() =>
                navigation.navigate("Viewer", {
                  index,
                  items: isOfflineNetwork ? cachedItems : displayItems,
                })
              }
            >
              <ExpoImage
                source={{ uri: item.thumbUrl }}
                style={{ flex: 1, borderRadius: 8 }}
                contentFit="cover"
                cachePolicy="disk"
              />

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
                <Text
                  style={{
                    fontSize: 18,
                    color: favorites[item.id] ? "red" : "white",
                  }}
                >
                  {favorites[item.id] ? "♥" : "♡"}
                </Text>
              </TouchableOpacity>
            </TouchableOpacity>
          </View>
        )}
        onEndReached={() => {
          if (!isFetchingNextPage && !isOfflineNetwork) {
            fetchNextPage();
          }
        }}
        onEndReachedThreshold={0.6}
        ListFooterComponent={() =>
          isFetchingNextPage && !isOfflineNetwork ? (
            <ActivityIndicator />
          ) : null
        }
        refreshControl={
          <RefreshControl
            refreshing={!!isRefetching}
            onRefresh={() => {
              if (!isOfflineNetwork) handleRefresh();
            }}
          />
        }
      />
    </View>
  );
}
