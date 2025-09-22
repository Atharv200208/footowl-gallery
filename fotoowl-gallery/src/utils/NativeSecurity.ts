// src/utils/NativeSecurity.ts
import * as ScreenCapture from "expo-screen-capture";
import { Platform } from "react-native";

export class NativeSecurity {
  /**
   * Enable or disable screen capture prevention.
   * - iOS: blocks screenshots + screen recording.
   * - Android: blocks screen recording (screenshot depends on OEM).
   * - Web: not supported, no-op.
   */
  static async preventCapture(enable: boolean) {
    if (Platform.OS === "ios" || Platform.OS === "android") {
      try {
        if (enable) {
          await ScreenCapture.preventScreenCaptureAsync();
          console.log("🔒 Screen capture prevention enabled");
        } else {
          await ScreenCapture.allowScreenCaptureAsync();
          console.log("🔓 Screen capture prevention disabled");
        }
      } catch (err) {
        console.warn("⚠️ Screen capture toggle failed:", err);
      }
    } else {
      // Stub for web
      console.log(
        `ℹ️ Screen capture prevention is not supported on ${Platform.OS}`
      );
    }
  }
}
