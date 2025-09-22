import React from "react";
import { View, Alert, Share, Platform, TouchableOpacity, Text } from "react-native";
import * as MediaLibrary from "expo-media-library";
import * as Sharing from "expo-sharing";
import * as FileSystem from "expo-file-system";
import { useTheme } from "../src/theme/ThemeProvider";

type Props = {
    uri: string; // e.g. "https://storage.fotoowl.ai/events/154770/...jpg"
};


export const ImageActions: React.FC<Props> = ({ uri }) => {
    const { theme } = useTheme();
    const onShare = async () => {
        try {
            if (await Sharing.isAvailableAsync()) {
                await Sharing.shareAsync(uri);
            } else {
                await Share.share({ url: uri });
            }
        } catch (err) {
            console.error("Share error:", err);
            Alert.alert("Error", "Unable to share image.");
        }
    };

    const onSave = async () => {
  if (Platform.OS === "web") {
    try {
      const link = document.createElement("a");
      link.href = uri;
      link.download = `fotoowl_${Date.now()}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error("Web save error:", err);
      Alert.alert("Error", "Unable to download image in web.");
    }
    return;
  }

  // Native (iOS / Android)
  const { status } = await MediaLibrary.requestPermissionsAsync();
  if (status !== "granted") {
    Alert.alert("Permission needed", "We need storage permission to save images.");
    return;
  }

  try {
    // Pick a safe directory for the temp file
    const dir =
      (FileSystem as any).cacheDirectory ??
      (FileSystem as any).documentDirectory ??
      "";

    const fileUri = dir + `fotoowl_${Date.now()}.jpg`;

    // Download the image
    const downloadRes = await FileSystem.downloadAsync(uri, fileUri);
    console.log("Download result:", downloadRes);

    if (downloadRes.status !== 200) {
      Alert.alert("Error", `Download failed (${downloadRes.status})`);
      return;
    }

    // Save to gallery
    await MediaLibrary.saveToLibraryAsync(downloadRes.uri);
    Alert.alert("Saved", "Image has been saved to your gallery.");
  } catch (err) {
    console.error("Native save error:", err);
    Alert.alert("Error", "Unable to save image.");
  }
};

    const ButtonLike = ({ label, onPress }: { label: string; onPress: () => void }) => (
        <TouchableOpacity
            onPress={onPress}
            activeOpacity={0.8}
            style={{
                backgroundColor: theme.primary,
                paddingHorizontal: 16,
                paddingVertical: 10,
                borderRadius: 24,
                marginHorizontal: 8,
                shadowColor: theme.shadow.color,
                shadowOpacity: theme.shadow.opacity,
                shadowRadius: theme.shadow.radius,
                shadowOffset: { width: 0, height: 4 },
                elevation: theme.shadow.elevation,
            }}
        >
            <Text style={{ color: "white", fontWeight: "600" }}>{label}</Text>
        </TouchableOpacity>
    );

    return (
        <View
            style={{
                position: "absolute",
                bottom: 24,
                left: 0,
                right: 0,
                alignItems: "center",
            }}
        >
            <View
                style={{
                    flexDirection: "row",
                    backgroundColor: theme.overlay,
                    padding: 8,
                    borderRadius: 28,
                }}
            >
                <ButtonLike label="Share" onPress={onShare} />
                <ButtonLike label="Save" onPress={onSave} />
            </View>
        </View>
    );
};
