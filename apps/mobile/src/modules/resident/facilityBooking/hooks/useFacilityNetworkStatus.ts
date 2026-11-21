import { useEffect, useState } from 'react';
import * as Network from 'expo-network';

export interface FacilityNetworkStatus {
  readonly isOffline: boolean;
  readonly isChecking: boolean;
}

export function useFacilityNetworkStatus(): FacilityNetworkStatus {
  const [isOffline, setIsOffline] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    let active = true;
    void Network.getNetworkStateAsync().then((state) => {
      if (!active) return;
      setIsOffline(state.isConnected === false || state.isInternetReachable === false);
      setIsChecking(false);
    }).catch(() => {
      if (active) setIsChecking(false);
    });
    const subscription = Network.addNetworkStateListener((state) => {
      setIsOffline(state.isConnected === false || state.isInternetReachable === false);
      setIsChecking(false);
    });
    return () => {
      active = false;
      subscription.remove();
    };
  }, []);

  return { isOffline, isChecking };
}
