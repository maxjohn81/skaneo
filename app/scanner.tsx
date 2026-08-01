import { CameraView, useCameraPermissions } from "expo-camera";
import { useRef, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useCardScanner } from "@/hooks/useCardScanner";

export default function ScannerScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<any>(null);
  const [cameraReady, setCameraReady] = useState(false);

  const { result, resetScan, FRAME_WIDTH, FRAME_HEIGHT } = useCardScanner(
    cameraRef,
    permission?.granted,
    cameraReady
  );

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

  return (
    <View style={styles.container}>
      <CameraView
        ref={cameraRef}
        style={styles.camera}
        animateShutter={false}
        onCameraReady={() => setCameraReady(true)}
      />

      <View style={styles.overlay}>
        <View
          style={[
            styles.frame,
            { width: FRAME_WIDTH, height: FRAME_HEIGHT },
            result && styles.frameSuccess,
          ]}
        />

        <Text style={styles.text}>
          {result
            ? `✔ ${result.operator} détecté : ${result.number}`
            : "Place la carte dans le cadre"}
        </Text>

        {result && (
          <Text onPress={resetScan} style={styles.btn}>
            Scanner une autre carte
          </Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  camera: { flex: 1 },

  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
  },

  frame: {
    borderWidth: 4,
    borderColor: "#00ff00",
    borderRadius: 12,
  },

  frameSuccess: {
    borderColor: "#FFBF00",
  },

  text: {
    marginTop: 20,
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    paddingHorizontal: 20,
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
  },
});