// import React from "react";
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   FlatList,
//   Dimensions,
// } from "react-native";
// // import { Image as ExpoImage } from "expo-image";
// import { StatusBar } from "expo-status-bar";
// import { useRoute, useNavigation } from "@react-navigation/native";
// import { ZoomableImage } from "../../components/ZoomableImage";
// import Ionicons from "@expo/vector-icons/Ionicons";

// export default function ViewerScreen() {
//   const route = useRoute<any>();
//   const navigation = useNavigation();
//   const { index, items } = route.params; // 👈 must pass from HomeScreen
//   const { width, height } = Dimensions.get("window");

//   return (
//     <View style={{ flex: 1, backgroundColor: "#000" }}>
//       <StatusBar hidden />
//       <FlatList
//         data={items}
//         horizontal
//         pagingEnabled
//         showsHorizontalScrollIndicator={false}
//         showsVerticalScrollIndicator={false}
//         initialScrollIndex={index}
//         keyExtractor={(item) => item.id}
//         getItemLayout={(data, i) => ({
//           length: width,
//           offset: width * i,
//           index: i,
//         })}
//         renderItem={({ item }) => <ZoomableImage uri={item.url} />}        
//       />

//       {/* Close button overlay */}
//       <TouchableOpacity
//         onPress={() => navigation.goBack()}
//         style={{ position: "absolute", top: 40, right: 20 }}
//       >
//         <Ionicons name="close" size={30} color="white" />
//       </TouchableOpacity>
//     </View>
//   );
// }



// src/screens/ViewerScreen.tsx
// import React, { useRef } from 'react';
// import { View, Dimensions, StyleSheet, StatusBar, TouchableOpacity } from 'react-native';
// import PagerView from 'react-native-pager-view';
// import Ionicons from '@expo/vector-icons/Ionicons';
// import { useRoute, useNavigation } from '@react-navigation/native';
// import { ZoomableImage } from '../../components/ZoomableImage';
// const { width, height } = Dimensions.get('window');

// export default function ViewerScreen() {
//   const route = useRoute<any>();
//   const navigation = useNavigation();
//   const { index = 0, items = [] } = route.params ?? {};
//   const pagerRef = useRef<PagerView | null>(null);

//   return (
//     <View style={styles.container}>
//       <StatusBar hidden />
//       <PagerView
//         style={styles.pager}
//         initialPage={index}
//         ref={pagerRef}
//       >
//         {items.map((item: any, i: number) => (
//           <View key={item.id ?? i} style={styles.page}>
//             <ZoomableImage uri={item.url ?? item.fullUrl ?? item.thumbnailUrl} />
//           </View>
//         ))}
//       </PagerView>

//       <TouchableOpacity
//         onPress={() => navigation.goBack()}
//         style={styles.closeBtn}
//         accessibilityLabel="Close viewer"
//       >
//         <Ionicons name="close" size={30} color="white" />
//       </TouchableOpacity>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: '#000' },
//   pager: { flex: 1 },
//   page: { width, height, justifyContent: 'center', alignItems: 'center' },
//   closeBtn: { position: 'absolute', top: 40, right: 20 },
// });



// src/screens/Viewer.tsx
// src/screens/Viewer.tsx
// // src/screens/Viewer.tsx
import React, { useRef, useEffect } from "react";
import {
  View,
  FlatList,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Platform,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { ZoomableImage } from "../../components/ZoomableImage";
const { width, height } = Dimensions.get("window");

export default function ViewerScreen() {
  const route = useRoute<any>();
  const navigation = useNavigation();
  const { index = 0, items = [] } = route.params ?? {};
  const listRef = useRef<FlatList<any>>(null);

  useEffect(() => {
    // Ensure we scroll to the tapped index
    if (listRef.current) {
      setTimeout(() => {
        try {
          listRef.current?.scrollToIndex({ index, animated: false });
        } catch {
          // fallback if index is out of range
        }
      }, 50);
    }
  }, [index]);

  return (
    <View style={styles.container}>
      <StatusBar hidden />
      <FlatList
        ref={listRef}
        data={items}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        initialScrollIndex={index}
        keyExtractor={(item, i) => item.id ?? String(i)}
        getItemLayout={(_, i) => ({
          length: width,
          offset: width * i,
          index: i,
        })}
        renderItem={({ item }) => (
          <View style={styles.page}>
            <ZoomableImage uri={item.url ?? item.fullUrl ?? item.thumbnailUrl} />
          </View>
        )}
        // Fix occasional scrollToIndex error
        onScrollToIndexFailed={(info) => {
          setTimeout(() => {
            listRef.current?.scrollToOffset({
              offset: info.averageItemLength * info.index,
              animated: false,
            });
          }, 50);
        }}
      />

      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.closeBtn}
        accessibilityLabel="Close viewer"
      >
        <Ionicons name="close" size={30} color="white" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  page: { width, height, justifyContent: "center", alignItems: "center" },
  closeBtn: { position: "absolute", top: 40, right: 20 },
});
