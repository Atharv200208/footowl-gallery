// src/hooks/useNetwork.ts
import { useEffect, useState } from "react";
import * as Network from "expo-network";

export function useNetwork() {
  const [isOfflineNetwork, setIsOffline] = useState(false);

  useEffect(() => {
    async function checkNetwork() {
      const status = await Network.getNetworkStateAsync();
      setIsOffline(!status.isConnected);
    }

    checkNetwork();

    const interval = setInterval(checkNetwork, 5000); // check every 5s
    return () => clearInterval(interval);
  }, []);

  return { isOfflineNetwork };
}
