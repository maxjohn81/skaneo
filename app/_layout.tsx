import { DarkTheme, DefaultTheme, ThemeProvider } from "expo-router/react-navigation";
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { AppState, type AppStateStatus } from "react-native";
import 'react-native-reanimated';
import { useEffect } from "react";

import { useColorScheme } from '@/hooks/use-color-scheme';
import { initializeNotifications } from "@/services/notifications";
import { checkForUpdates } from "@/services/update-check";

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
    const colorScheme = useColorScheme();

  useEffect(() => {
    let cancelled = false;
    let notificationsEnabled = false;
    let checking = false;
    let initialized = false;

    const checkUpdates = async () => {
      if (checking || cancelled) return;
      checking = true;
      try {
        await checkForUpdates(notificationsEnabled);
      } finally {
        checking = false;
      }
    };

    const initialize = async () => {
      try {
        notificationsEnabled = await initializeNotifications();
      } catch (error) {
        if (__DEV__) console.warn("Notifications initialization failed", error);
      }
      initialized = true;
      await checkUpdates();
    };

    void initialize().catch(() => undefined);
    const handleAppStateChange = (state: AppStateStatus) => {
      if (state === "active" && initialized && !cancelled) {
        void checkUpdates().catch(() => undefined);
      }
    };
    const subscription = AppState.addEventListener("change", handleAppStateChange);

    return () => {
      cancelled = true;
      subscription.remove();
    };
  }, []);

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="scanner" options={{ headerShown: false }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
