import { CameraView, useCameraPermissions } from "expo-camera";
import { useRef, useState, useEffect } from "react";
import { View, Text, StyleSheet, Pressable, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useCardScanner } from "@/hooks/useCardScanner";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColorScheme } from "react-native";
import { useTranslation } from "@/hooks/useTranslation";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MULTISCAN_STORAGE_KEY } from "@/constants/settings";

export default function ScannerScreen() {
  const { t } = useTranslation();
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<any>(null);
  const [cameraReady, setCameraReady] = useState(false);
  const [torchOn, setTorchOn] = useState(false);
  const colorScheme = useColorScheme(); // "light" | "dark" | null
  const isDark = colorScheme === "dark";
  const [multiscanEnabled, setMultiscanEnabled] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(MULTISCAN_STORAGE_KEY).then((value) => {
      setMultiscanEnabled(value === "true");
    });
  }, []);

  const {
    result,
    resetScan,
    scanFromGallery,
    onCameraLayout,
    rawDigits,
    scannedItems
  } = useCardScanner(cameraRef, permission?.granted, cameraReady);
  const insets = useSafeAreaInsets();
  if (!permission) return <View style={styles.safeArea} />;

  if (!permission.granted) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.permissionContainer}>
          <View style={styles.iconCircle}>
            <Ionicons name="camera-outline" size={40} color="#B8860B" />
          </View>

          <Text style={styles.permissionTitle}>{t("scanner_permission_title")}</Text>
          <Text style={styles.permissionSubtitle}>{t("scanner_permission_subtitle")}</Text>

          <Pressable onPress={requestPermission} style={styles.permissionButton}>
            <Ionicons name="camera" size={20} color="white" />
            <Text style={styles.permissionButtonText}>{t("scanner_permission_button")}</Text>
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
        enableTorch={torchOn}
        animateShutter={false}
        onCameraReady={() => setCameraReady(true)}
        onLayout={onCameraLayout}
      />

      <SafeAreaView style={styles.overlaySafeArea}>
        {scannedItems.length > 0 && (
          <View style={styles.scannedList}>
            {scannedItems.map((item, index) => (
              <View key={`${item.ussd}-${index}`} style={styles.scannedItem}>
                <Ionicons name="checkmark-circle" size={16} color="#22C55E" />
                <Text style={styles.scannedItemText} numberOfLines={1}>
                  {item.operator} · {item.number}
                </Text>
              </View>
            ))}
          </View>
        )}
        <View style={styles.topBar}>
          <View style={{ width: 40 }} />

          <View style={{ alignItems: "center", gap: 6 }}>
            <View style={styles.statusPill}>
              <View
                style={[
                  styles.statusDot,
                  { backgroundColor: result ? "#FFBF00" : "#22C55E" },
                ]}
              />
              <Text style={styles.statusText}>
                {result ? t("scanner_status_detected") : t("scanner_status_scanning")}
              </Text>
            </View>

            {multiscanEnabled && (
              <View style={styles.multiscanBadge}>
                <Ionicons name="layers" size={12} color="#FFFFFF" />
                <Text style={styles.multiscanBadgeText}>{t("scanner_multiscan_badge")}</Text>
              </View>
            )}
          </View>

          <Pressable
            onPress={() => setTorchOn((prev) => !prev)}
            style={[styles.torchButton, torchOn && styles.torchButtonActive]}
            accessibilityRole="button"
            accessibilityLabel={torchOn ? "Désactiver le flash" : "Activer le flash"}
            hitSlop={10}
          >
            <Ionicons
              name={torchOn ? "flash" : "flash-outline"}
              size={20}
              color={torchOn ? "#1E293B" : "white"}
            />
          </Pressable>
        </View>

        {result && (
          <View style={styles.overlay}>
            <View style={styles.resultCard}>
              <Text style={styles.text}>
                ✔ {result.operator} détecté : {result.number}
              </Text>

              <Pressable onPress={resetScan} style={styles.rescanButton}>
                <Ionicons name="scan-outline" size={18} color="white" />
                <Text style={styles.rescanButtonText}>{t("scanner_rescan_button")}</Text>
              </Pressable>
            </View>
          </View>
        )}

        {!result && (
          <View
            style={[
              styles.tabBar,
              { bottom: insets.bottom + 16 },
              isDark ? styles.tabBarDark : styles.tabBarLight,
            ]}
          >
            <View style={styles.tabBarInfo}>
              <Text style={[styles.tabBarLabel, isDark && styles.tabBarLabelDark]}>
                {t("scanner_digits_label")}
              </Text>
              <Text style={styles.tabBarDigits} numberOfLines={1}>
                {rawDigits || "—"}
              </Text>
            </View>

            <Pressable
              onPress={scanFromGallery}
              style={styles.tabBarAction}
              accessibilityRole="button"
              accessibilityLabel="Importer une photo depuis la galerie"
            >
              <View style={[styles.galleryIcon, isDark && styles.galleryIconDark]}>
                <Ionicons name="image" size={20} color={isDark ? "white" : "#1E293B"} />
              </View>
              <Text style={[styles.tabBarActionLabel, isDark && styles.tabBarActionLabelDark]}>
                {t("scanner_import_label")}
              </Text>
            </Pressable>
          </View>
        )}
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
  multiscanBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(255,191,0,0.9)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  multiscanBadgeText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#1E293B",
  },
  scannedList: {
    position: "absolute",
    bottom: 110,
    left: 16,
    right: 16,
    gap: 6,
  },
  scannedItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "rgba(20,20,20,0.75)",
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  scannedItemText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "600",
    flex: 1,
  },

  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  bottomBar: {
    position: "absolute",
    bottom: 40,
    left: 0,
    right: 0,
    alignItems: "center",
    gap: 16,
  },

  digitsPill: {
    backgroundColor: "rgba(0,0,0,0.6)",
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 20,
  },

  digitsText: {
    color: "#FFBF00",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 1,
  },

  bottomActions: {
    alignItems: "center",
    gap: 8,
  },

  galleryFab: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "rgba(0,0,0,0.55)",
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.8)",
    alignItems: "center",
    justifyContent: "center",
  },

  galleryFabLabel: {
    color: "white",
    fontSize: 12,
    fontWeight: "600",
    textShadowColor: "rgba(0,0,0,0.6)",
    textShadowRadius: 4,
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

  torchButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.4)",
    alignItems: "center",
    justifyContent: "center",
  },

  torchButtonActive: {
    backgroundColor: "#FFBF00",
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

  // remplace le tabBar existant par :
  tabBar: {
    position: "absolute",
    left: 16,
    right: 16,
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  tabBarDark: {
    backgroundColor: "rgba(20,20,20,0.85)",
  },

  tabBarLight: {
    backgroundColor: "rgba(255,255,255,0.92)",
  },

  tabBarLabel: {
    fontSize: 10,
    fontWeight: "600",
    color: "rgba(30,41,59,0.6)", // texte foncé par défaut (mode clair)
  },

  tabBarLabelDark: {
    color: "rgba(255,255,255,0.5)",
  },

  tabBarActionLabel: {
    fontSize: 10,
    fontWeight: "600",
    color: "rgba(30,41,59,0.7)", // mode clair par défaut
  },

  tabBarActionLabelDark: {
    color: "rgba(255,255,255,0.7)",
  },

  galleryIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(30,41,59,0.08)", // mode clair par défaut
    alignItems: "center",
    justifyContent: "center",
  },

  galleryIconDark: {
    backgroundColor: "rgba(255,255,255,0.12)",
  },

  tabBarInfo: {
    flex: 1,
    paddingLeft: 8,
    paddingRight: 12,
  },



  tabBarDigits: {
    fontSize: 15,
    fontWeight: "700",
    color: "#FFBF00",
    letterSpacing: 0.5,
    marginTop: 2,
  },

  tabBarAction: {
    alignItems: "center",
    gap: 4,
  },
});