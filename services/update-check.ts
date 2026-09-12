import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";
import { Alert, Linking } from "react-native";
import { APP_VERSION } from "@/constants/storage_key";
import { sendLocalNotification } from "@/services/notifications";

const VERSION_URL = "https://skaneo.vercel.app/api/version";
const UPDATE_NOTIFIED_VERSION_KEY = "skaneo_update_notified_version";

type VersionManifest = {
  version: string;
  url: string;
  notes?: string;
};

function compareVersions(left: string, right: string): number {
  const parse = (value: string) =>
    value.split(".").map((part) => Number.parseInt(part, 10) || 0);
  const leftParts = parse(left);
  const rightParts = parse(right);
  const length = Math.max(leftParts.length, rightParts.length);

  for (let index = 0; index < length; index += 1) {
    const difference = (leftParts[index] ?? 0) - (rightParts[index] ?? 0);
    if (difference !== 0) return difference;
  }
  return 0;
}

function getInstalledVersion(): string {
  return Constants.expoConfig?.version ?? APP_VERSION;
}

export async function checkForUpdates(notificationsEnabled: boolean): Promise<void> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);

  try {
    let response: Response;
    try {
      response = await fetch(VERSION_URL, {
        signal: controller.signal,
        headers: { Accept: "application/json" },
      });
    } catch {
      return;
    }

    if (!response.ok) return;

    const manifest = (await response.json()) as Partial<VersionManifest>;
    if (!manifest.version || !manifest.url) return;

    if (compareVersions(manifest.version, getInstalledVersion()) <= 0) return;

    const notifiedVersion = await AsyncStorage.getItem(UPDATE_NOTIFIED_VERSION_KEY);
    if (notificationsEnabled && notifiedVersion !== manifest.version) {
      await AsyncStorage.setItem(UPDATE_NOTIFIED_VERSION_KEY, manifest.version);
      await sendLocalNotification(
        "Nouvelle version disponible",
        `Skaneo ${manifest.version} est disponible au téléchargement.`,
        "skaneo-update"
      );
    }

    Alert.alert(
      "Mise à jour disponible",
      manifest.notes
        ? `Skaneo ${manifest.version} est disponible.\n\n${manifest.notes}`
        : `Skaneo ${manifest.version} est disponible.`,
      [
        { text: "Plus tard", style: "cancel" },
        { text: "Télécharger", onPress: () => void Linking.openURL(manifest.url!) },
      ]
    );
  } finally {
    clearTimeout(timeout);
  }
}
