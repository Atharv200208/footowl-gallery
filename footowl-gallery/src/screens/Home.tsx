// // import React, { useRef, useEffect, useCallback } from "react";
// // import {
// //   View,
// //   Text,
// //   ActivityIndicator,
// //   RefreshControl,
// //   TouchableOpacity,
// //   Dimensions,
// //   TextInput,
// //   InteractionManager,
// //   Platform,
// // } from "react-native";
// // import { Image as ExpoImage } from "expo-image";
// // import {
// //   useIsFocused,
// //   useNavigation,
// //   NavigationProp,
// // } from "@react-navigation/native";
// // import { FlashList } from "@shopify/flash-list";
// // import Toast from "react-native-toast-message";

// // import { SkeletonCard } from "../../components/skeletonCard";
// // import { useInfiniteImages } from "../hooks/useInfiniteImages";
// // import { useFavoritesStore } from "../../state/favorites";
// // import { loadFromCache, saveToCache } from "../utils/imageCache";
// // import OfflineBanner from "../../components/OfflineBanner";
// // import { useNetwork } from "../hooks/useNetwork";
// // import { useTheme } from "../theme/ThemeProvider";

// // type RootStackParamList = {
// //   Home: undefined;
// //   Viewer: { eventId: number; imageId: number };
// //   Favorites: undefined;
// // };

// // export default function HomeScreen() {
// //   const [cachedItems, setCachedItems] = React.useState<any[]>([]);
// //   const [orderBy, setOrderBy] = React.useState<number>(2);
// //   const [orderAsc, setOrderAsc] = React.useState<boolean>(true);
// //   const [searchQuery, setSearchQuery] = React.useState("");

// //   const { isOfflineNetwork } = useNetwork();

// //   const {
// //     data,
// //     fetchNextPage,
// //     isFetchingNextPage,
// //     refetch,
// //     isRefetching,
// //     isLoading,
// //     isError,
// //     error,
// //   } = useInfiniteImages({ pageSize: 40, orderBy, orderAsc });

// //   const navigation = useNavigation<NavigationProp<RootStackParamList>>();

// //   const items = (data?.pages ?? []).flatMap((p: any) => p.items ?? []);

// //   const filteredItems = items.filter((item) => {
// //     const q = searchQuery.toLowerCase();
// //     return (
// //       item.name?.toLowerCase().includes(q) ||
// //       item.img_url?.toLowerCase().includes(q)
// //     );
// //   });

// //   const cols = Math.max(1, Math.floor(Dimensions.get("window").width / 150));

// //   const scrollOffsetRef = useRef(0);
// //   const flatListRef = useRef<any>(null);
// //   const isFocused = useIsFocused();
// //   const lastVisibleIndexRef = useRef(0);

// //   const { favorites, toggleFavorite, loadFavorites } = useFavoritesStore();
// //   const { theme } = useTheme();
// //   const screenW = Dimensions.get("window").width;
// //   const cell = Math.floor(screenW / cols);

// // const keyExtractor = React.useCallback((item: any) => String(item.id), []);

// // const getItemLayout = React.useCallback(
// //   (_: any, index: number) => ({
// //     length: cell,
// //     offset: cell * Math.floor(index / cols), // row-based approx; FlashList is forgiving
// //     index,
// //   }),
// //   [cell, cols]
// // );
// //   useEffect(() => {
// //     if (data?.pages?.length) {
// //       const latestItems = data.pages.flatMap((p: any) => p.items ?? []);
// //       if (latestItems.length > 0) {
// //         saveToCache(latestItems);
// //       }
// //     }
// //   }, [data]);

// //   useEffect(() => {
// //     (async () => {
// //       if (isOfflineNetwork) {
// //         const cache = await loadFromCache();
// //         setCachedItems(cache);
// //       }
// //     })();
// //   }, [isOfflineNetwork]);

// //   useEffect(() => {
// //     if (isError) console.warn("Image load error", error);
// //   }, [isError, error]);

// //   const handleRefresh = useCallback(() => {
// //     refetch();
// //   }, [refetch]);

// //   useEffect(() => {
// //     if (isFocused && flatListRef.current) {
// //       const restore = () => {
// //         const targetIndex = Math.max(0, lastVisibleIndexRef.current - 1);
// //         try {
// //           flatListRef.current?.scrollToIndex({
// //             index: targetIndex,
// //             animated: false,
// //           });
// //         } catch {
// //           flatListRef.current?.scrollToOffset({
// //             offset: scrollOffsetRef.current,
// //             animated: false,
// //           });
// //         }
// //       };

// //       if (Platform.OS === "web") {
// //         requestAnimationFrame(() => requestAnimationFrame(restore));
// //       } else {
// //         InteractionManager.runAfterInteractions(restore);
// //       }
// //     }
// //   }, [isFocused]);

// //   useEffect(() => {
// //     loadFavorites();
// //   }, [loadFavorites]);

// //   const handleFavoriteToggle = (item: any) => {
// //     const isCurrentlyFavorite = !!favorites[item.id];
// //     toggleFavorite(item);

// //     Toast.show({
// //       type: "success",
// //       text1: isCurrentlyFavorite
// //         ? "Removed from favorites"
// //         : "Added to favorites",
// //       position: "top",
// //       visibilityTime: 1500,
// //     });
// //   };

// //   const displayItems =
// //     filteredItems.length > 0 || searchQuery
// //       ? filteredItems
// //       : items.length > 0
// //       ? items
// //       : cachedItems;

// //   if (isLoading) {
// //     const { height, width } = Dimensions.get("window");
// //     const rows = Math.ceil(height / (width / cols));
// //     const skeletons = new Array(rows * cols).fill(null);

// //     return (
// //       <FlashList
// //         data={skeletons}
// //         numColumns={cols}
// //         keyExtractor={(_, i) => `skeleton-${i}`}
// //         renderItem={({ index }) => <SkeletonCard key={`skeleton-${index}`} />}
// //       />
// //     );
// //   }

// //   if (isError) {
// //     return (
// //       <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
// //         <Text>Error loading images</Text>
// //       </View>
// //     );
// //   }

// //   if (!isLoading && !isError && items.length === 0) {
// //     return (
// //       <View
// //         style={{
// //           flex: 1,
// //           alignItems: "center",
// //           justifyContent: "center",
// //           backgroundColor: theme.background,
// //         }}
// //       >
// //         <Text style={{ fontSize: 16, color: theme.text }}>No images found.</Text>
// //       </View>
// //     );
// //   }

// //   return (
// //     <View style={{ flex: 1, backgroundColor: theme.background }}>
// //       {isOfflineNetwork && <OfflineBanner />}

// //       <TextInput
// //         placeholder="Search images..."
// //         value={searchQuery}
// //         onChangeText={setSearchQuery}
// //         style={{
// //           margin: 10,
// //           padding: 8,
// //           borderWidth: 1,
// //           borderColor: "#ccc",
// //           borderRadius: 8,
// //           backgroundColor: "white",
// //         }}
// //       />

// //       {/* Sorting buttons (unchanged) */}

// //       <FlashList
// //         key={cols}
// //         ref={flatListRef}
// //         data={isOfflineNetwork ? cachedItems : displayItems}
// //         numColumns={cols}
// //   keyExtractor={keyExtractor}
// //     estimatedItemSize={cell}
// //      getItemType={() => "row"}
// //        drawDistance={cell * 3}

// //         renderItem={({ item }) => (
// //           <View style={{ flex: 1 / cols, aspectRatio: 1, padding: 4 }}>
// //             <TouchableOpacity
// //               style={{ flex: 1, borderRadius: 8, overflow: "hidden" }}
// //               activeOpacity={0.9}
// //               onPress={() =>
// //                 navigation.navigate("Viewer", {
// //                   eventId: item.event_id,
// //                   imageId: item.id,
// //                 })
// //               }
// //             >
// //               <ExpoImage
// //                 source={{ uri: item.thumbUrl ?? item.img_url }}
// //                 style={{ flex: 1, borderRadius: 8 }}
// //                 contentFit="cover"
// //                 cachePolicy="disk"
// //               />

// //               <TouchableOpacity
// //                 style={{
// //                   position: "absolute",
// //                   top: 8,
// //                   right: 8,
// //                   backgroundColor: "rgba(0,0,0,0.5)",
// //                   borderRadius: 16,
// //                   padding: 4,
// //                 }}
// //                 onPress={() => handleFavoriteToggle(item)}
// //               >
// //                 <Text
// //                   style={{
// //                     fontSize: 18,
// //                     color: favorites[item.id] ? "red" : "white",
// //                   }}
// //                 >
// //                   {favorites[item.id] ? "♥" : "♡"}
// //                 </Text>
// //               </TouchableOpacity>
// //             </TouchableOpacity>
// //           </View>
// //         )}
// //         onEndReached={() => {
// //           if (!isFetchingNextPage && !isOfflineNetwork) {
// //             fetchNextPage();
// //           }
// //         }}
// //         onEndReachedThreshold={0.6}
// //         removeClippedSubviews
// //         ListFooterComponent={() =>
// //           isFetchingNextPage && !isOfflineNetwork ? (
// //             <ActivityIndicator />
// //           ) : null
// //         }
// //         refreshControl={
// //           <RefreshControl
// //             refreshing={!!isRefetching}
// //             onRefresh={() => {
// //               if (!isOfflineNetwork) handleRefresh();
// //             }}
// //           />
// //         }
// //       />
// //     </View>
// //   );
// // }

// import React, { useRef, useEffect, useCallback, useState } from "react";
// import {
//   View,
//   Text,
//   ActivityIndicator,
//   RefreshControl,
//   TouchableOpacity,
//   Dimensions,
//   TextInput,
//   InteractionManager,
//   Platform,
//   StatusBar,
// } from "react-native";
// import { Image as ExpoImage } from "expo-image";
// import {
//   useIsFocused,
//   useNavigation,
//   NavigationProp,
// } from "@react-navigation/native";
// import { FlashList } from "@shopify/flash-list";
// import Toast from "react-native-toast-message";

// import { SkeletonCard } from "../../components/skeletonCard";
// import { useInfiniteImages } from "../hooks/useInfiniteImages";
// import { useFavoritesStore } from "../../state/favorites";
// import { loadFromCache, saveToCache } from "../utils/imageCache";
// import OfflineBanner from "../../components/OfflineBanner";
// import { useNetwork } from "../hooks/useNetwork";
// import { useTheme } from "../theme/ThemeProvider";

// type RootStackParamList = {
//   Home: undefined;
//   Viewer: { eventId: number; imageId: number };
//   Favorites: undefined;
// };

// // ✅ memoized card
// const ImageCard = React.memo(
//   ({ item, cols, navigation, favorites, onToggleFav }: any) => (
//     <View style={{ flex: 1 / cols, aspectRatio: 1, padding: 4 }}>
//       <TouchableOpacity
//         style={{ flex: 1, borderRadius: 8, overflow: "hidden" }}
//         activeOpacity={0.9}
//         onPress={() =>
//           navigation.navigate("Viewer", {
//             eventId: item.event_id,
//             imageId: item.id,
//             items: displayItems,  
//           })
//         }
//         accessibilityRole="imagebutton"
//         accessibilityLabel={`Open image ${item.name ?? `ID ${item.id}`}`}
//         accessibilityHint="Opens in full screen viewer"
//       >
//         <ExpoImage
//           source={{ uri: item.thumbUrl ?? item.img_url }}
//           style={{ flex: 1, borderRadius: 8 }}
//           contentFit="cover"
//           transition={300}
//           cachePolicy="disk"
//         />


//         <TouchableOpacity
//           style={{
//             position: "absolute",
//             top: 8,
//             right: 8,
//             backgroundColor: "rgba(0,0,0,0.5)",
//             borderRadius: 16,
//             padding: 4,
//           }}
//           onPress={() => onToggleFav(item)}
//         >
//           <Text
//             style={{
//               fontSize: 18,
//               color: favorites[item.id] ? "red" : "white",
//             }}
//           >
//             {favorites[item.id] ? "♥" : "♡"}
//           </Text>
//         </TouchableOpacity>
//       </TouchableOpacity>
//     </View>
//   ),
//   (prev, next) =>
//     prev.item.id === next.item.id &&
//     prev.favorites[prev.item.id] === next.favorites[next.item.id]
// );

// export default function HomeScreen() {
//   const [cachedItems, setCachedItems] = React.useState<any[]>([]);
//   const [orderBy, setOrderBy] = React.useState<number>(2);
//   const [orderAsc, setOrderAsc] = React.useState<boolean>(true);
//   const [searchQuery, setSearchQuery] = React.useState("");
//   const [compact, setCompact] = useState(false);
//   const [showFab, setShowFab] = useState(false);

//   const { isOfflineNetwork } = useNetwork();

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

//   const filteredItems = items.filter((item) => {
//     const q = searchQuery.toLowerCase();
//     return (
//       item.name?.toLowerCase().includes(q) ||
//       item.img_url?.toLowerCase().includes(q)
//     );
//   });

//   const baseColWidth = compact ? 120 : 150;
//   const cols = Math.max(1, Math.floor(Dimensions.get("window").width / baseColWidth));
//   const screenW = Dimensions.get("window").width;
//   const cell = Math.floor(screenW / cols);

//   const scrollOffsetRef = useRef(0);
//   const flatListRef = useRef<any>(null);
//   const isFocused = useIsFocused();
//   const lastVisibleIndexRef = useRef(0);

//   const { favorites, toggleFavorite, loadFavorites } = useFavoritesStore();
//   const { theme, mode } = useTheme();

//   const keyExtractor = useCallback((item: any) => String(item.id), []);

//   const getItemLayout = useCallback(
//     (_: any, index: number) => ({
//       length: cell,
//       offset: cell * Math.floor(index / cols), // approx for rows
//       index,
//     }),
//     [cell, cols]
//   );

//   useEffect(() => {
//     if (data?.pages?.length) {
//       const latestItems = data.pages.flatMap((p: any) => p.items ?? []);
//       if (latestItems.length > 0) {
//         saveToCache(latestItems);
//       }
//     }
//   }, [data]);

//   useEffect(() => {
//     (async () => {
//       if (isOfflineNetwork) {
//         const cache = await loadFromCache();
//         setCachedItems(cache);
//       }
//     })();
//   }, [isOfflineNetwork]);

//   useEffect(() => {
//     if (isError) console.warn("Image load error", error);
//   }, [isError, error]);

//   const handleRefresh = useCallback(() => {
//     refetch();
//   }, [refetch]);

//   useEffect(() => {
//     if (isFocused && flatListRef.current) {
//       const restore = () => {
//         const targetIndex = Math.max(0, lastVisibleIndexRef.current - 1);
//         try {
//           flatListRef.current?.scrollToIndex({
//             index: targetIndex,
//             animated: false,
//           });
//         } catch {
//           flatListRef.current?.scrollToOffset({
//             offset: scrollOffsetRef.current,
//             animated: false,
//           });
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

//   const handleFavoriteToggle = (item: any) => {
//     const isCurrentlyFavorite = !!favorites[item.id];
//     toggleFavorite(item);

//     Toast.show({
//       type: "success",
//       text1: isCurrentlyFavorite
//         ? "Removed from favorites"
//         : "Added to favorites",
//       position: "top",
//       visibilityTime: 1500,
//     });
//   };

//   const displayItems =
//     filteredItems.length > 0 || searchQuery
//       ? filteredItems
//       : items.length > 0
//         ? items
//         : cachedItems;

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
//       <View
//         style={{
//           flex: 1,
//           alignItems: "center",
//           justifyContent: "center",
//           backgroundColor: theme.background,
//         }}
//       >
//         <Text style={{ fontSize: 16, color: theme.text }}>No images found.</Text>
//       </View>
//     );
//   }

//   return (
//     <View style={{ flex: 1, backgroundColor: theme.background }}>
//       <StatusBar barStyle={mode === "dark" ? "light-content" : "dark-content"} backgroundColor={theme.background as any} />
//       {isOfflineNetwork && <OfflineBanner />}

//       <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginHorizontal: 12, marginTop: 10 }}>
//         <TextInput
//           placeholder="Search images..."
//           value={searchQuery}
//           onChangeText={setSearchQuery}
//           style={{
//             flex: 1,
//             marginRight: 10,
//             paddingVertical: 10,
//             paddingHorizontal: 12,
//             borderWidth: 1,
//             borderColor: theme.border,
//             borderRadius: 12,
//             backgroundColor: theme.surface,
//             color: theme.text,
//             shadowColor: theme.shadow.color,
//             shadowOpacity: theme.shadow.opacity,
//             shadowRadius: theme.shadow.radius,
//             shadowOffset: { width: 0, height: 2 },
//             elevation: theme.shadow.elevation,
//           }}
//           placeholderTextColor={theme.muted}
//         />

//         <TouchableOpacity
//           onPress={() => setCompact((v) => !v)}
//           activeOpacity={0.85}
//           style={{
//             backgroundColor: theme.surface,
//             borderWidth: 1,
//             borderColor: theme.border,
//             paddingVertical: 10,
//             paddingHorizontal: 12,
//             borderRadius: 12,
//           }}
//           accessibilityLabel="Toggle compact grid"
//         >
//           <Text style={{ color: theme.text }}>{compact ? "Compact" : "Cozy"}</Text>
//         </TouchableOpacity>
//       </View>

//       <FlashList
//         key={cols}
//         ref={flatListRef}
//         data={isOfflineNetwork ? cachedItems : displayItems}
//         numColumns={cols}
//         keyExtractor={keyExtractor}
        
        
//         drawDistance={cell * 3}
//         removeClippedSubviews
//         onScroll={(e) => {
//           const offset = e.nativeEvent.contentOffset.y;
//           scrollOffsetRef.current = offset;
//           setShowFab(offset > 300);
//         }}
//         scrollEventThrottle={16}
//         renderItem={({ item }) => (
//           <ImageCard
//             item={item}
//             cols={cols}
//             navigation={navigation}
//             favorites={favorites}
//             onToggleFav={handleFavoriteToggle}
//           />
//         )}
//         onEndReached={() => {
//           if (!isFetchingNextPage && !isOfflineNetwork) {
//             fetchNextPage();
//           }
//         }}
//         onEndReachedThreshold={0.6}
//         ListFooterComponent={() =>
//           isFetchingNextPage && !isOfflineNetwork ? (
//             <ActivityIndicator />
//           ) : null
//         }
//         refreshControl={
//           <RefreshControl
//             refreshing={!!isRefetching}
//             onRefresh={() => {
//               if (!isOfflineNetwork) handleRefresh();
//             }}
//           />
//         }
//       />

//       {showFab && (
//         <TouchableOpacity
//           onPress={() => flatListRef.current?.scrollToOffset?.({ offset: 0, animated: true })}
//           activeOpacity={0.9}
//           style={{
//             position: "absolute",
//             right: 16,
//             bottom: 24,
//             backgroundColor: theme.primary,
//             borderRadius: 28,
//             paddingVertical: 12,
//             paddingHorizontal: 14,
//             shadowColor: theme.shadow.color,
//             shadowOpacity: theme.shadow.opacity,
//             shadowRadius: theme.shadow.radius,
//             shadowOffset: { width: 0, height: 4 },
//             elevation: theme.shadow.elevation,
//           }}
//           accessibilityLabel="Scroll to top"
//         >
//           <Text style={{ color: "white", fontWeight: "700" }}>Top</Text>
//         </TouchableOpacity>
//       )}
//     </View>
//   );
// }


import React, { useRef, useEffect, useCallback, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
  Dimensions,
  TextInput,
  InteractionManager,
  Platform,
  StatusBar,
} from "react-native";
import { Image as ExpoImage } from "expo-image";
import {
  useIsFocused,
  useNavigation,
  NavigationProp,
} from "@react-navigation/native";
import { FlashList } from "@shopify/flash-list";
import Toast from "react-native-toast-message";

import { SkeletonCard } from "../../components/skeletonCard";
import { useInfiniteImages } from "../hooks/useInfiniteImages";
import { useFavoritesStore } from "../../state/favorites";
import { loadFromCache, saveToCache } from "../utils/imageCache";
import OfflineBanner from "../../components/OfflineBanner";
import { useNetwork } from "../hooks/useNetwork";
import { useTheme } from "../theme/ThemeProvider";

type RootStackParamList = {
  Home: undefined;
  Viewer: { eventId: string; imageId: string; items: any[] };
  Favorites: undefined;
};

// ✅ memoized card
const ImageCard = React.memo(
  ({ item, cols, navigation, favorites, onToggleFav, allItems }: any) => (
    <View style={{ flex: 1 / cols, aspectRatio: 1, padding: 4 }}>
      <TouchableOpacity
        style={{ flex: 1, borderRadius: 8, overflow: "hidden" }}
        activeOpacity={0.9}
        onPress={() =>
          navigation.navigate("Viewer", {
            eventId: String(item.event_id),
            imageId: String(item.id),
            items: allItems,// 👈 pass full list
          })
        }
        accessibilityRole="imagebutton"
        accessibilityLabel={`Open image ${item.name ?? `ID ${item.id}`}`}
        accessibilityHint="Opens in full screen viewer"
      >
        <ExpoImage
          source={{ uri: item.thumbUrl ?? item.img_url }}
          style={{ flex: 1, borderRadius: 8 }}
          contentFit="cover"
          transition={300}
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
          onPress={() => onToggleFav(item)}
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
  ),
  (prev, next) =>
    prev.item.id === next.item.id &&
    prev.favorites[prev.item.id] === next.favorites[next.item.id]
);

export default function HomeScreen() {
  const [cachedItems, setCachedItems] = React.useState<any[]>([]);
  const [orderBy, setOrderBy] = React.useState<number>(2);
  const [orderAsc, setOrderAsc] = React.useState<boolean>(true);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [compact, setCompact] = useState(false);
  const [showFab, setShowFab] = useState(false);

  const { isOfflineNetwork } = useNetwork();

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

  const filteredItems = items.filter((item) => {
    const q = searchQuery.toLowerCase();
    return (
      item.name?.toLowerCase().includes(q) ||
      item.img_url?.toLowerCase().includes(q)
    );
  });

  const baseColWidth = compact ? 120 : 150;
  const cols = Math.max(1, Math.floor(Dimensions.get("window").width / baseColWidth));
  const screenW = Dimensions.get("window").width;
  const cell = Math.floor(screenW / cols);

  const scrollOffsetRef = useRef(0);
  const flatListRef = useRef<any>(null);
  const isFocused = useIsFocused();
  const lastVisibleIndexRef = useRef(0);

  const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
  if (viewableItems.length > 0) {
    // track last fully visible item
    lastVisibleIndexRef.current = viewableItems[viewableItems.length - 1].index ?? 0;
  }
}).current;

  const { favorites, toggleFavorite, loadFavorites } = useFavoritesStore();
  const { theme, mode } = useTheme();

  const keyExtractor = useCallback((item: any) => String(item.id), []);

  useEffect(() => {
    if (data?.pages?.length) {
      const latestItems = data.pages.flatMap((p: any) => p.items ?? []);
      if (latestItems.length > 0) {
        saveToCache(latestItems);
      }
    }
  }, [data]);

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

  const handleRefresh = useCallback(() => {
    refetch();
  }, [refetch]);

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
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: theme.background,
        }}
      >
        <Text style={{ fontSize: 16, color: theme.text }}>No images found.</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <StatusBar barStyle={mode === "dark" ? "light-content" : "dark-content"} backgroundColor={theme.background as any} />
      {isOfflineNetwork && <OfflineBanner />}

      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginHorizontal: 12, marginTop: 10 }}>
        <TextInput
          placeholder="Search images..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          style={{
            flex: 1,
            marginRight: 10,
            paddingVertical: 10,
            paddingHorizontal: 12,
            borderWidth: 1,
            borderColor: theme.border,
            borderRadius: 12,
            backgroundColor: theme.surface,
            color: theme.text,
          }}
          placeholderTextColor={theme.muted}
        />

        <TouchableOpacity
          onPress={() => setCompact((v) => !v)}
          activeOpacity={0.85}
          style={{
            backgroundColor: theme.surface,
            borderWidth: 1,
            borderColor: theme.border,
            paddingVertical: 10,
            paddingHorizontal: 12,
            borderRadius: 12,
          }}
          accessibilityLabel="Toggle compact grid"
        >
          <Text style={{ color: theme.text }}>{compact ? "Compact" : "Cozy"}</Text>
        </TouchableOpacity>
      </View>

      <FlashList
        key={cols}
        ref={flatListRef}
        data={isOfflineNetwork ? cachedItems : displayItems}
        numColumns={cols}
        keyExtractor={keyExtractor}
        drawDistance={cell * 3}
        removeClippedSubviews
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{ itemVisiblePercentThreshold: 50 }}
        onScroll={(e) => {
          const offset = e.nativeEvent.contentOffset.y;
          scrollOffsetRef.current = offset;
          setShowFab(offset > 300);
        }}
        scrollEventThrottle={16}
        renderItem={({ item }) => (
          <ImageCard
            item={item}
            cols={cols}
            navigation={navigation}
            favorites={favorites}
            onToggleFav={handleFavoriteToggle}
            allItems={displayItems} // 👈 pass items
          />
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
          }}
          accessibilityLabel="Scroll to top"
        >
          <Text style={{ color: "white", fontWeight: "700" }}>Top</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
