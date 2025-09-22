  import React, { useRef, useEffect, useState } from "react";
  import {
    View,
    FlatList,
    Dimensions,
    StyleSheet,
    TouchableOpacity,
    StatusBar,
    Text,
    ActivityIndicator,
  } from "react-native";
  import { useRoute, useNavigation } from "@react-navigation/native";
  import Ionicons from "@expo/vector-icons/Ionicons";
  import { ZoomableImage } from "../../components/ZoomableImage";
  import { ImageActions } from "../../components/ImageActions";
  import HomeScreen from "./Home";
  const { width, height } = Dimensions.get("window");
import { NativeSecurity } from "../utils/NativeSecurity";

  type RouteParams = {
   Home: undefined;
    eventId: string;  // ✅ always strings in React Navigation
    imageId: string;
  };

  export default function ViewerScreen() {
    const route = useRoute<any>();
    const navigation = useNavigation();

    const { eventId, imageId } = (route.params ?? {}) as RouteParams;

    const [items, setItems] = useState<any[]>([]);
    const [startIndex, setStartIndex] = useState(0);
    const [loading, setLoading] = useState(true);

    const listRef = useRef<FlatList<any>>(null);

    useEffect(() => {
      if (!eventId) {
        console.error("❌ ViewerScreen: missing eventId");
        return;
      }


      async function fetchImagesForEvent() {
        try {
          setLoading(true);
          const res = await fetch(
            `https://openapi.fotoowl.ai/open/event/image-list?event_id=${eventId}&page=0&page_size=40&key=4030&order_by=2&order_asc=true`
          );
          const json = await res.json();
          const imgs = json?.items ?? json?.data?.image_list ?? []; // handle both response formats
          setItems(imgs);

          // find tapped image index
          const idx = imgs.findIndex((img: any) => String(img.id) === String(imageId));
          setStartIndex(idx >= 0 ? idx : 0);
        } catch (err) {
          console.error("❌ Failed to load images:", err);
        } finally {
          setLoading(false);
        }
      }

      fetchImagesForEvent();
    }, [eventId, imageId]);

    
    useEffect(() => {
      // Enable capture prevention on mount
      NativeSecurity.preventCapture(true);

      // Disable when leaving screen
      return () => {
        NativeSecurity.preventCapture(false);
      };
    }, []);

    if (loading) {
      return (
        <View style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
          <ActivityIndicator size="large" color="#fff" />
          <Text style={{ color: "white", marginTop: 10 }}>Loading images...</Text>
        </View>
      );
    }

    return (
      <View style={styles.container}>
        <StatusBar hidden />

        {items.length > 0 ? (
          <FlatList
            ref={listRef}
            data={items}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            initialScrollIndex={startIndex}
            getItemLayout={(_, i) => ({
              length: width,
              offset: width * i,
              index: i,
            })}
            keyExtractor={(item) => String(item.id)}
            renderItem={({ item }) => (
              <View style={styles.page}>
                <ZoomableImage uri={item.img_url ?? item.high_url ?? item.med_url} />
              </View>
            )}
          />
        ) : (
          <Text style={{ color: "white" }}>No images found.</Text>
        )}

        {/* Close button */}
        <TouchableOpacity
        onPress={() => {
  if (navigation.canGoBack()) {
    navigation.goBack();
  } else {
    // Correct way to jump into a nested navigator
    navigation.navigate("Tabs", { screen: "Home" } as never);
  }
}}

    style={styles.closeBtn}
    accessibilityLabel="Close viewer"
  >
    <Ionicons name="close" size={30} color="white" />
  </TouchableOpacity>
        {/* Actions (share / save) */}
        {items[startIndex] && <ImageActions uri={items[startIndex].img_url} />}
      </View>
    );
  }

  const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#000" },
    page: { width, height, justifyContent: "center", alignItems: "center" },
    closeBtn: { position: "absolute", top: 44, right: 20, backgroundColor: "rgba(0,0,0,0.35)", padding: 8, borderRadius: 20 },
  });
