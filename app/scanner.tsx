import { CameraView, useCameraPermissions } from "expo-camera";
import { useRef, useState, useEffect } from "react";
import { View, Text, StyleSheet, Linking, Vibration } from "react-native";
import TextRecognition from "@react-native-ml-kit/text-recognition";
import * as ImageManipulator from "expo-image-manipulator";
import { Dimensions } from "react-native";


const FRAME_WIDTH = 320;
const FRAME_HEIGHT = 180;

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } =
  Dimensions.get("window");

export default function ScannerScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<any>(null);

  const [locked, setLocked] = useState(false);
  const [result, setResult] = useState<any>(null);

  const isRunningRef = useRef(true);

  const delay = (ms: number) =>
    new Promise((res) => setTimeout(res, ms));

  // -----------------------------
  // 🧠 DETECTION + EXTRACTION
  // -----------------------------
  // const detectOperator = (text: string) => {
  //   const clean = text.replace(/\s+/g, " ");

  //   // --------------------
  //   // YAS
  //   // --------------------
  //   const isYas =
  //     /kikiso/i.test(clean) ||
  //     /tsindrio/i.test(clean) ||
  //     /service client\s*:?\s*800/i.test(clean);

  //   if (isYas) {
  //     const numbers = clean.match(/\d{12,20}/g);

  //     if (numbers?.length) {
  //       const code = numbers.sort(
  //         (a, b) => b.length - a.length
  //       )[0];

  //       return {
  //         operator: "YAS",
  //         number: code,
  //         ussd: `#321*${code}#`,
  //       };
  //     }
  //   }

  //   // --------------------
  //   // AIRTEL
  //   // --------------------
  //   const isAirtel =
  //     /raha\s*credit/i.test(clean) ||
  //     /raha\s*internet/i.test(clean) ||
  //     /raha\s*antso/i.test(clean);

  //   if (isAirtel) {
  //     // const digits = clean.replace(/[^\d]/g, "");

  //     const match = text.match(/(\d{5})\s+(\d{5})\s+(\d{5})/);


  //     if (match) {
  //       const code = match[0];

  //       return {
  //         operator: "AIRTEL",
  //         number: code,
  //         ussd: `*888*${code}#`,
  //       };
  //     }
  //   }

  //   // --------------------
  //   // ORANGE
  //   // --------------------
  //   const isOrange =
  //     /\b202\b/.test(text) &&
  //     /14\s*chiffres/i.test(text); // présence structure 14 chiffres

  //   if (isOrange) {
  //     const match = text.match(/(\d{4})\s*(\d{4})\s*(\d{4})\s*(\d{2})/);

  //     if (match) {
  //       const code = match.slice(1).join("");

  //       return {
  //         operator: "ORANGE",
  //         number: code,
  //         ussd: `202${code}`,
  //       };
  //     }

  //     const fallback = text.replace(/[^\d]/g, "");
  //     if (fallback.length === 14) {
  //       return {
  //         operator: "ORANGE",
  //         number: fallback,
  //         ussd: `202${fallback}`,
  //       };
  //     }
  //   }

  //   return null;
  // };

  type ScanResult = {
    operator: "YAS" | "ORANGE" | "AIRTEL";
    number: string;
    ussd: string;
  };

  const detectOperator = (
    text: string
  ): ScanResult | null => {
    const clean = text.replace(/\s+/g, " ").trim();

    // =====================
    // SCORES
    // =====================
    let yasScore = 0;
    let orangeScore = 0;
    let airtelScore = 0;

    // =====================
    // MOTS CLÉS YAS
    // =====================
    if (/kikiso/i.test(clean)) yasScore += 10;
    if (/tsindrio/i.test(clean)) yasScore += 10;
    if (/service client\s*:?\s*800/i.test(clean))
      yasScore += 15;
    if (/#321/i.test(clean)) yasScore += 20;

    // =====================
    // MOTS CLÉS ORANGE
    // =====================
    if (/orange/i.test(clean)) orangeScore += 10;
    if (/raha\s*hampiditra/i.test(clean))
      orangeScore += 20;
    if (/14\s*chiffres/i.test(clean))
      orangeScore += 20;
    if (/code\s*à\s*14/i.test(clean))
      orangeScore += 15;

    // =====================
    // MOTS CLÉS AIRTEL
    // =====================
    if (/raha\s*credit/i.test(clean))
      airtelScore += 15;
    if (/raha\s*internet/i.test(clean))
      airtelScore += 15;
    if (/raha\s*antso/i.test(clean))
      airtelScore += 15;
    if (/\*436\*/i.test(clean))
      airtelScore += 20;

    // ==================================================
    // PRIORITÉ 1 : DÉTECTION PAR FORMAT DE CODE
    // ==================================================

    // ---------- ORANGE ----------
    const orangeMatch = clean.match(
      /(\d{4})\s+(\d{4})\s+(\d{4})\s+(\d{2})/
    );

    if (orangeMatch) {
      const code = orangeMatch
        .slice(1)
        .join("");

      return {
        operator: "ORANGE",
        number: code,
        ussd: `202${code}`,
      };
    }

    // ---------- AIRTEL ----------
    const airtelMatch = clean.match(
      /(\d{5})\s+(\d{5})\s+(\d{5})/
    );

    if (airtelMatch) {
      const code = airtelMatch[0];

      return {
        operator: "AIRTEL",
        number: code,
        ussd: `*888*${code}#`,
      };
    }

    // ---------- YAS ----------
    const yasMatch = clean.match(/\d{13,16}/g);

    if (yasMatch?.length) {
      const code = yasMatch.sort(
        (a, b) => b.length - a.length
      )[0];

      return {
        operator: "YAS",
        number: code,
        ussd: `#321*${code}#`,
      };
    }

    // ==================================================
    // PRIORITÉ 2 : SCORE SI OCR IMPARFAIT
    // ==================================================

    const scores = [
      { operator: "YAS", score: yasScore },
      { operator: "ORANGE", score: orangeScore },
      { operator: "AIRTEL", score: airtelScore },
    ];

    const best = scores.sort(
      (a, b) => b.score - a.score
    )[0];

    if (best.score < 20) {
      return null;
    }

    // ==================================================
    // EXTRACTION SECONDAIRE
    // ==================================================

    const digits = clean.replace(/\D/g, "");

    switch (best.operator) {
      case "ORANGE":
        if (digits.length >= 14) {
          const code = digits.slice(0, 14);

          return {
            operator: "ORANGE",
            number: code,
            ussd: `202${code}`,
          };
        }
        break;

      case "AIRTEL":
        if (digits.length >= 15) {
          const code = digits.slice(0, 15);

          return {
            operator: "AIRTEL",
            number: code,
            ussd: `*888*${code}#`,
          };
        }
        break;

      case "YAS":
        if (digits.length >= 13) {
          return {
            operator: "YAS",
            number: digits,
            ussd: `#321*${digits}#`,
          };
        }
        break;
    }

    return null;
  };

  // -----------------------------
  // 📡 SCAN LOOP TEMPS RÉEL
  // -----------------------------


  // const scanLoop = async () => {
  //   if (!cameraRef.current || locked) return;

  //   try {
  //     const photo = await cameraRef.current.takePictureAsync({
  //       quality: 0.6,
  //       skipProcessing: true,
  //     });

  //     // Conversion écran -> photo
  //     const scaleX = photo.width / SCREEN_WIDTH;
  //     const scaleY = photo.height / SCREEN_HEIGHT;

  //     const crop = {
  //       originX:
  //         (SCREEN_WIDTH / 2 - FRAME_WIDTH / 2) *
  //         scaleX,

  //       originY:
  //         (SCREEN_HEIGHT / 2 - FRAME_HEIGHT / 2) *
  //         scaleY,

  //       width: FRAME_WIDTH * scaleX,
  //       height: FRAME_HEIGHT * scaleY,
  //     };

  //     // Découpe uniquement le cadre vert
  //     const cropped =
  //       await ImageManipulator.manipulateAsync(
  //         photo.uri,
  //         [{ crop }],
  //         {
  //           compress: 1,
  //           format:
  //             ImageManipulator.SaveFormat.JPEG,
  //         }
  //       );

  //     // OCR uniquement sur la zone découpée
  //     const ocr =
  //       await TextRecognition.recognize(
  //         cropped.uri
  //       );

  //     const text = ocr.text || "";

  //     console.log("OCR:", text);

  //     const detected = detectOperator(text);

  //     if (detected) {
  //       setLocked(true);
  //       setResult(detected);

  //       Vibration.vibrate(200);

  //       setTimeout(() => {
  //         Linking.openURL(
  //           `tel:${detected.ussd}`
  //         );
  //       }, 100);

  //       return;
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }

  //   setTimeout(scanLoop, 900);
  // };

  const scanLoop = async () => {
    while (isRunningRef.current) {
      if (!cameraRef.current) {
        await delay(500);
        continue;
      }

      try {
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.6,
          skipProcessing: true,
        });

        const scaleX = photo.width / SCREEN_WIDTH;
        const scaleY = photo.height / SCREEN_HEIGHT;

        const crop = {
          originX:
            (SCREEN_WIDTH / 2 - FRAME_WIDTH / 2) * scaleX,
          originY:
            (SCREEN_HEIGHT / 2 - FRAME_HEIGHT / 2) * scaleY,
          width: FRAME_WIDTH * scaleX,
          height: FRAME_HEIGHT * scaleY,
        };

        const cropped = await ImageManipulator.manipulateAsync(
          photo.uri,
          [{ crop }],
          {
            compress: 1,
            format: ImageManipulator.SaveFormat.JPEG,
          }
        );

        const ocr = await TextRecognition.recognize(cropped.uri);
        const text = ocr.text || "";

        const detected = detectOperator(text);

        if (detected) {
          setResult(detected);

          Vibration.vibrate(200);

          Linking.openURL(`tel:${detected.ussd}`);

          // ⛔ pause courte pour éviter multi-détection
          await delay(2500);

          // relance automatique (sans bloquer le loop)
          continue;
        }
      } catch (e) {
        console.log("scan error:", e);
      }

      await delay(700);
    }
  };

  // -----------------------------
  // 🚀 START
  // -----------------------------
  useEffect(() => {
    if (permission?.granted) {
      isRunningRef.current = true;
      scanLoop();
    }

    return () => {
      isRunningRef.current = false;
    };
  }, [permission]);
  // -----------------------------
  if (!permission) return <View />;

  if (!permission.granted) {
    return (
      <View style={styles.center}>
        <Text style={styles.text}>Autorisez la caméra</Text>
        <Text onPress={requestPermission} style={styles.btn}>
          Autoriser
        </Text>
      </View>
    );
  }

  // -----------------------------
  return (
    <View style={styles.container}>
      <CameraView ref={cameraRef} style={styles.camera} />

      {/* 🎯 FRAME VISUEL */}
      <View style={styles.overlay}>
        <View style={styles.frame} />

        <Text style={styles.text}>
          {result
            ? `✔ ${result.operator} : ${result.number}`
            : "Place la carte dans le cadre"}
        </Text>
      </View>
    </View>
  );
}

// -----------------------------
const styles = StyleSheet.create({
  container: { flex: 1 },
  camera: { flex: 1 },

  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
  },

  frame: {
    width: FRAME_WIDTH,
    height: FRAME_HEIGHT,
    borderWidth: 4,
    borderColor: "#00ff00",
    borderRadius: 12,
  },

  text: {
    marginTop: 20,
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  btn: {
    marginTop: 20,
    color: "#0EA5E9",
    fontSize: 16,
    fontWeight: "bold",
  }
});