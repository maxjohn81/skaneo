import { CameraView, useCameraPermissions } from "expo-camera";
import { useRef, useState } from "react";
import { View, Text, StyleSheet, Pressable, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
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

  if (!permission) return <View style={styles.safeArea} />;

  if (!permission.granted) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.permissionContainer}>
          <View style={styles.iconCircle}>
            <Ionicons name="camera-outline" size={40} color="#B8860B" />
          </View>

          <Text style={styles.permissionTitle}>Accès à la caméra requis</Text>
          <Text style={styles.permissionSubtitle}>
            Nous avons besoin de la caméra pour scanner ta carte automatiquement
          </Text>

          <Pressable onPress={requestPermission} style={styles.permissionButton}>
            <Ionicons name="camera" size={20} color="white" />
            <Text style={styles.permissionButtonText}>Autoriser la caméra</Text>
          </Pressable>
        </View>
      </SafeAreaView>
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

      <SafeAreaView style={styles.overlaySafeArea}>
        <View style={styles.topBar}>
          <View style={styles.statusPill}>
            <View
              style={[
                styles.statusDot,
                { backgroundColor: result ? "#FFBF00" : "#22C55E" },
              ]}
            />
            <Text style={styles.statusText}>
              {result ? "Carte détectée" : "Scan en cours"}
            </Text>
          </View>
        </View>

        <View style={styles.overlay}>
          <View
            style={[
              styles.frame,
              { width: FRAME_WIDTH, height: FRAME_HEIGHT },
              result && styles.frameSuccess,
            ]}
          />

          <View style={styles.resultCard}>
            <Text style={styles.text}>
              {result
                ? `✔ ${result.operator} détecté : ${result.number}`
                : "Place la carte dans le cadre"}
            </Text>

            {result && (
              <Pressable onPress={resetScan} style={styles.rescanButton}>
                <Ionicons name="scan-outline" size={18} color="white" />
                <Text style={styles.rescanButtonText}>Scanner une autre carte</Text>
              </Pressable>
            )}
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  container: { flex: 1, backgroundColor: "#000000" },
  camera: { flex: 1 },

  overlaySafeArea: {
    ...StyleSheet.absoluteFillObject,
  },

  topBar: {
    alignItems: "center",
    paddingTop: 16,
  },

  statusPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "rgba(255,255,255,0.95)",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },

  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },

  statusText: {
    color: "#1E293B",
    fontSize: 13,
    fontWeight: "700",
  },

  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  frame: {
    borderWidth: 4,
    borderColor: "#FFBF00",
    borderRadius: 12,
  },

  frameSuccess: {
    borderColor: "#22C55E",
  },

  resultCard: {
    marginTop: 28,
    backgroundColor: "rgba(255,255,255,0.97)",
    borderRadius: 20,
    paddingVertical: 20,
    paddingHorizontal: 24,
    alignItems: "center",
    maxWidth: "85%",
  },

  text: {
    color: "#1E293B",
    fontSize: 16,
    fontWeight: "700",
    textAlign: "center",
  },

  rescanButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 16,
    backgroundColor: "#FFBF00",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 14,
  },

  rescanButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "700",
  },

  // --- Écran de permission ---

  permissionContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },

  iconCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: "#FFF9E6",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
    shadowColor: "#FFBF00",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 4,
  },

  permissionTitle: {
    color: "#1E293B",
    fontSize: 20,
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 8,
  },

  permissionSubtitle: {
    color: "#64748B",
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 28,
    maxWidth: 280,
  },

  permissionButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "#FFBF00",
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 16,
    shadowColor: "#FFBF00",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 5,
  },

  permissionButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});