import { Platform } from "react-native";
import Constants from "expo-constants";

export const UPDATE_NOTIFICATION_ID = "skaneo-update";
export const USAGE_NOTIFICATION_ID = "skaneo-usage";

type NotificationsModule = typeof import("expo-notifications");

let notificationsModule: NotificationsModule | null | undefined;

async function getNotificationsModule(): Promise<NotificationsModule | null> {
  if (notificationsModule !== undefined) return notificationsModule;
  if (Constants.appOwnership === "expo") {
    notificationsModule = null;
    return null;
  }

  try {
    const module = await import("expo-notifications");
    module.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowBanner: true,
        shouldShowList: true,
        shouldPlaySound: false,
        shouldSetBadge: false,
      }),
    });
    notificationsModule = module;
  } catch (error) {
    notificationsModule = null;
    if (__DEV__) {
      console.warn(
        "Native notifications are unavailable in Expo Go. Use a development build to enable them.",
        error
      );
    }
  }

  return notificationsModule;
}

export async function initializeNotifications(): Promise<boolean> {
  const Notifications = await getNotificationsModule();
  if (!Notifications) return false;

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "Skaneo",
      importance: Notifications.AndroidImportance.DEFAULT,
      vibrationPattern: [0, 250],
      sound: undefined,
    });
  }

  const current = await Notifications.getPermissionsAsync();
  if (current.granted) return true;

  const requested = await Notifications.requestPermissionsAsync();
  return requested.granted;
}

export async function sendLocalNotification(
  title: string,
  body: string,
  identifier: string
): Promise<void> {
  const Notifications = await getNotificationsModule();
  if (!Notifications) return;

  await Notifications.scheduleNotificationAsync({
    identifier,
    content: { title, body },
    trigger: null,
  });
}
