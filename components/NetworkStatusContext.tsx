import React, { createContext, useContext, useEffect, useState } from "react";
import NetInfo, { NetInfoState } from "@react-native-community/netinfo";

interface NetworkStatusContextType {
  isConnected: boolean | null;
}

const NetworkStatusContext = createContext<NetworkStatusContextType>({
  isConnected: null,
});

interface NetworkStatusProviderProps {
  children: React.ReactNode;
}

export const NetworkStatusProvider: React.FC<NetworkStatusProviderProps> = ({
  children,
}) => {
  // null means netinfo is not initialised
  const [isConnected, setIsConnected] = useState<boolean | null>(null);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state: NetInfoState) => {
      setIsConnected(!!state.isConnected);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <NetworkStatusContext.Provider value={{ isConnected }}>
      {children}
    </NetworkStatusContext.Provider>
  );
};

export const useNetworkStatus = (): NetworkStatusContextType => {
  return useContext(NetworkStatusContext);
};
