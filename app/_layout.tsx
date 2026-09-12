import { DarkTheme, DefaultTheme, ThemeProvider } from "expo-router/react-navigation";
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
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

    const initialize = async () => {
      const notificationsEnabled = await initializeNotifications();
      if (!cancelled) {
        await checkForUpdates(notificationsEnabled);
      }
    };

    void initialize().catch(() => undefined);
    return () => {
      cancelled = true;
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
