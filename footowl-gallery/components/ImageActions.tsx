import React from "react";
import { View, Button, Alert, Share, Platform } from "react-native";
import * as MediaLibrary from "expo-media-library";
import * as Sharing from "expo-sharing";
import * as FileSystem from "expo-file-system";

type Props = {
    uri: string; // e.g. "https://storage.fotoowl.ai/events/154770/...jpg"
};


export const ImageActions: React.FC<Props> = ({ uri }) => {
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

    return (
        <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
            <Button title="Share" onPress={onShare} />
            <Button title="Save" onPress={onSave} />
        </View>
    );
};
