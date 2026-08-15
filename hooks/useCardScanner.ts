import { useRef, useState, useEffect, useCallback } from "react";
import { Dimensions, Vibration, Platform, PermissionsAndroid } from "react-native";
import TextRecognition from "@react-native-ml-kit/text-recognition";
import * as ImageManipulator from "expo-image-manipulator";
import { detectOperator, ScanResult } from "@/utils/detectOperator";
import RNImmediatePhoneCall from "react-native-immediate-phone-call";
import * as ImagePicker from "expo-image-picker";

const FRAME_WIDTH = 320;
const FRAME_HEIGHT = 180;

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

  const onCameraLayout = useCallback((event: any) => {
    const { width, height } = event.nativeEvent.layout;
    setViewSize({ width, height });
  }, []);

  const isRunningRef = useRef(true);
  const isBusyRef = useRef(false);
  const detectedRef = useRef(false);

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

        const scaleX = photo.width / viewSize.width;
        const scaleY = photo.height / viewSize.height;

        const crop = {
          originX: (viewSize.width / 2 - FRAME_WIDTH / 2) * scaleX,
          originY: (viewSize.height / 2 - FRAME_HEIGHT / 2) * scaleY,
          width: FRAME_WIDTH * scaleX,
          height: FRAME_HEIGHT * scaleY,
        };

        const cropped = await ImageManipulator.manipulateAsync(
          photo.uri,
          [{ crop }],
          { compress: 1, format: ImageManipulator.SaveFormat.JPEG }
        );

        const ocr = await TextRecognition.recognize(cropped.uri);
        const text = ocr.text || "";

        const detected = detectOperator(text);

        if (detected && !detectedRef.current) {
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
            // iOS : pas de solution directe possible, à gérer côté UI (voir ScannerScreen)
          }, 300);
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
  };

  return { result, scanning, resetScan, scanFromGallery, onCameraLayout, FRAME_WIDTH, FRAME_HEIGHT };
}