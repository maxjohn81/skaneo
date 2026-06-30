import { useRef, useState, useEffect } from "react";
import { Linking, Dimensions, Vibration } from "react-native";
import TextRecognition from "@react-native-ml-kit/text-recognition";
import * as ImageManipulator from "expo-image-manipulator";
import { detectOperator, ScanResult } from "@/utils/detectOperator";

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

    const scaleX = photo.width / SCREEN_WIDTH;
    const scaleY = photo.height / SCREEN_HEIGHT;

    const crop = {
     originX: (SCREEN_WIDTH / 2 - FRAME_WIDTH / 2) * scaleX,
     originY: (SCREEN_HEIGHT / 2 - FRAME_HEIGHT / 2) * scaleY,
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
      Linking.openURL(`tel:${detected.ussd}`);
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

 useEffect(() => {
  if (permissionGranted && cameraReady) {
   isRunningRef.current = true;
   scanLoop();
  }

  return () => {
   isRunningRef.current = false;
  };
 }, [permissionGranted, cameraReady]);

 const resetScan = () => {
  detectedRef.current = false;
  setResult(null);
  setScanning(true);
 };

 return { result, scanning, resetScan, FRAME_WIDTH, FRAME_HEIGHT };
}