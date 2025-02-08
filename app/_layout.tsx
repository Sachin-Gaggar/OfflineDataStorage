import { NetworkStatusProvider } from "@/components/NetworkStatusContext";
import { store } from "@/store";
import { getAllUsers } from "@/store/userDB";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { Provider } from "react-redux";
// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });
  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, []);
  if (!loaded) {
    return null;
  }
  return (
    <Provider store={store}>
      <NetworkStatusProvider>
        <Stack />
      </NetworkStatusProvider>
    </Provider>
  );
}
