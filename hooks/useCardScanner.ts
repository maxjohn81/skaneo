import { useRef, useState, useEffect, useCallback } from "react";
import { Dimensions, Vibration, Platform, PermissionsAndroid, AppState } from "react-native";
import TextRecognition from "@react-native-ml-kit/text-recognition";
import { detectOperator, ScanResult } from "@/utils/detectOperator";
import RNImmediatePhoneCall from "react-native-immediate-phone-call";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MULTISCAN_STORAGE_KEY, MULTISCAN_MAX_STORAGE_KEY, MULTISCAN_MAX_DEFAULT } from "@/constants/settings";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

export function useCardScanner(
  cameraRef: React.RefObject<any>,
  permissionGranted: boolean | undefined,
  cameraReady: boolean
) {
  const [result, setResult] = useState<ScanResult | null>(null);
  const [scanning, setScanning] = useState(true);
  const [viewSize, setViewSize] = useState({ width: SCREEN_WIDTH, height: SCREEN_HEIGHT });
  const [rawDigits, setRawDigits] = useState<string>("");
  const [scannedItems, setScannedItems] = useState<ScanResult[]>([]);
  const [batchExecutionStatus, setBatchExecutionStatus] = useState<{
    active: boolean;
    currentIndex: number;
    total: number;
    countdown: number;
  } | null>(null);

  const onCameraLayout = useCallback((event: any) => {
    const { width, height } = event.nativeEvent.layout;
    setViewSize({ width, height });
  }, []);

  const isRunningRef = useRef(true);
  const isBusyRef = useRef(false);
  const detectedRef = useRef(false);


  const waitForCallToFinish = (): Promise<void> => {
    return new Promise((resolve) => {
      let wasBackgrounded = false;
      let resolved = false;

      const finish = () => {
        if (resolved) return;
        resolved = true;
        subscription.remove();
        resolve();
      };

      const subscription = AppState.addEventListener("change", (state) => {
        if (state !== "active") {
          wasBackgrounded = true;
        } else if (wasBackgrounded && state === "active") {
          finish();
        }
      });

      // Sécurité : si l'app ne repasse jamais en arrière-plan (cas double SIM
      // où l'utilisateur met du temps à choisir), on ne bloque pas indéfiniment.
      setTimeout(finish, 4000);
    });
  };

  const waitWithCountdown = async (
    seconds: number,
    onTick: (remaining: number) => void
  ): Promise<void> => {
    for (let s = seconds; s > 0; s--) {
      onTick(s);
      await delay(1000);
    }
    onTick(0);
  };


  const scanLoop = async () => {
    while (isRunningRef.current) {
      if (!cameraRef.current || isBusyRef.current || detectedRef.current) {
        await delay(300);
        continue;
      }

      isBusyRef.current = true;

      try {
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.5,
          skipProcessing: true,
          shutterSound: false,
        });

        const ocr = await TextRecognition.recognize(photo.uri);
        const text = ocr.text || "";

        const digitsOnly = text.replace(/\D/g, "");
        if (digitsOnly.length > 0) {
          setRawDigits(digitsOnly);
        }

        const multiscanEnabled = (await AsyncStorage.getItem(MULTISCAN_STORAGE_KEY)) === "true";

        if (multiscanEnabled && !detectedRef.current) {
          const maxRaw = await AsyncStorage.getItem(MULTISCAN_MAX_STORAGE_KEY);
          const maxCount = maxRaw ? parseInt(maxRaw, 10) : MULTISCAN_MAX_DEFAULT;

          const blocks = ocr.blocks || [];
          const found: ScanResult[] = [];
          const seenUssd = new Set<string>();

          for (const block of blocks) {
            if (found.length >= maxCount) break;
            const d = detectOperator(block.text || "");
            if (d && !seenUssd.has(d.ussd)) {
              seenUssd.add(d.ussd);
              found.push(d);
            }
          }

          if (found.length > 0) {
            detectedRef.current = true;
            setResult(found[found.length - 1]);
            setScanning(false);
            Vibration.vibrate(200);
            setScannedItems(found);

            (async () => {
              for (let i = 0; i < found.length; i++) {
                setBatchExecutionStatus({
                  active: true,
                  currentIndex: i,
                  total: found.length,
                  countdown: 0,
                });

                if (Platform.OS === "android") {
                  try {
                    RNImmediatePhoneCall.immediatePhoneCall(found[i].ussd);
                  } catch (e) {
                    console.log("immediatePhoneCall error:", e);
                  }
                }

                if (i < found.length - 1) {
                  // Compte à rebours visible immédiat (cas mono-SIM, appel rapide),
                  // en parallèle de l'attente réelle de fin d'appel (cas double SIM).
                  const countdownPromise = waitWithCountdown(3, (remaining) => {
                    setBatchExecutionStatus({
                      active: true,
                      currentIndex: i,
                      total: found.length,
                      countdown: remaining,
                    });
                  });

                  await Promise.all([waitForCallToFinish(), countdownPromise]);
                }
              }

              setBatchExecutionStatus(null);
            })();
          }
        } else if (!multiscanEnabled && !detectedRef.current) {
          const detected = detectOperator(text);

          if (detected) {
            detectedRef.current = true;
            setResult(detected);
            setScanning(false);
            Vibration.vibrate(200);
            setScannedItems((prev) => [...prev, detected]);

            setTimeout(() => {
              if (Platform.OS === "android") {
                try {
                  RNImmediatePhoneCall.immediatePhoneCall(detected.ussd);
                } catch (e) {
                  console.log("immediatePhoneCall error:", e);
                }
              }
            }, 300);
          }
        }
      } catch (e) {
        console.log("scan error:", e);
      } finally {
        isBusyRef.current = false;
      }

      await delay(600);
    }
  };

  const scanFromGallery = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      console.log("Permission galerie refusée");
      return;
    }

    const pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (pickerResult.canceled || !pickerResult.assets?.[0]) return;

    const imageUri = pickerResult.assets[0].uri;

    try {
      const ocr = await TextRecognition.recognize(imageUri);
      const text = ocr.text || "";
      const detected = detectOperator(text);

      if (detected) {
        detectedRef.current = true;
        setResult(detected);
        setScanning(false);
        Vibration.vibrate(200);

        setTimeout(() => {
          if (Platform.OS === "android") {
            try {
              RNImmediatePhoneCall.immediatePhoneCall(detected.ussd);
            } catch (e) {
              console.log("immediatePhoneCall error:", e);
            }
          }
        }, 300);
      } else {
        console.log("Aucun code détecté sur l'image importée");
      }
    } catch (e) {
      console.log("gallery scan error:", e);
    }
  };

  useEffect(() => {
    const start = async () => {
      if (Platform.OS === "android") {
        const alreadyGranted = await PermissionsAndroid.check(
          PermissionsAndroid.PERMISSIONS.CALL_PHONE
        );
        if (!alreadyGranted) {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.CALL_PHONE,
            {
              title: "Autorisation d'appel requise",
              message: "Skaneo a besoin d'exécuter le code de recharge directement après le scan.",
              buttonPositive: "Autoriser",
              buttonNegative: "Refuser",
            }
          );
          if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
            console.log("Permission refusée, scan désactivé");
            return;
          }
        }
      }

      if (permissionGranted && cameraReady) {
        isRunningRef.current = true;
        scanLoop();
      }
    };

    start();

    return () => {
      isRunningRef.current = false;
    };
  }, [permissionGranted, cameraReady]);

  const resetScan = () => {
    detectedRef.current = false;
    setResult(null);
    setScanning(true);
    setRawDigits("");
    setScannedItems([]);
  };

  return {
    result, scanning, resetScan, scanFromGallery, rawDigits, onCameraLayout,
    scannedItems, batchExecutionStatus,
  };
}