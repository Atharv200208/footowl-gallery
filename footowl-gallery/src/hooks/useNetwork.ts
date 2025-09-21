// src/hooks/useNetwork.ts
import { useEffect, useState } from "react";
import * as Network from "expo-network";

export function useNetwork() {
  const [isOfflineNetwork, setIsOffline] = useState(false);

  useEffect(() => {
    async function checkNetwork() {
      try {
        const status = await Network.getNetworkStateAsync();
        console.log("Network state:", status); // Log network state for testing
        setIsOffline(!status.isConnected); // Update state based on network connection
      } catch (error) {
        console.error("Failed to get network state:", error);
        setIsOffline(true); // Assume offline if the check fails
      }
    }

    checkNetwork(); // Initial check

    const interval = setInterval(checkNetwork, 5000); // Check every 5 seconds

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, []);

  return { isOfflineNetwork };
}
