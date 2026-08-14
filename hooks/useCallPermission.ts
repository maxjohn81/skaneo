import { useCallback, useEffect, useState } from "react";
import { PermissionsAndroid, Platform } from "react-native";

export type CallPermissionStatus = "unknown" | "granted" | "denied";

export function useCallPermission() {
  const [status, setStatus] = useState<CallPermissionStatus>("unknown");
  const [checking, setChecking] = useState(true);

  const checkPermission = useCallback(async () => {
    setChecking(true);
    if (Platform.OS !== "android") {
      setStatus("granted"); // iOS: pas concerné, fallback tel: classique géré ailleurs
      setChecking(false);
      return;
    }

    const alreadyGranted = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.CALL_PHONE
    );
    setStatus(alreadyGranted ? "granted" : "denied");
    setChecking(false);
  }, []);

  const requestPermission = useCallback(async (): Promise<boolean> => {
    if (Platform.OS !== "android") {
      setStatus("granted");
      return true;
    }

    const result = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.CALL_PHONE,
      {
        title: "Autorisation d'appel requise",
        message:
          "Skaneo a besoin d'exécuter l'opération USSD directement pour préparer votre transaction Mobile Money.",
        buttonPositive: "Autoriser",
        buttonNegative: "Refuser",
      }
    );

    const granted = result === PermissionsAndroid.RESULTS.GRANTED;
    setStatus(granted ? "granted" : "denied");
    return granted;
  }, []);

  useEffect(() => {
    checkPermission();
  }, [checkPermission]);

  return { status, checking, checkPermission, requestPermission };
}