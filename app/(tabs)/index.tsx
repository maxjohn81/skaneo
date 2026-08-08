import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  const handleScan = () => {
    router.push("/scanner");
  };

  const handleAbout = () => {
    router.push("/about/about");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.aboutButton}
          onPress={handleAbout}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="information-circle-outline" size={26} color="#94A3B8" />
        </TouchableOpacity>

        <View style={styles.logoContainer}>
          <Image
            source={require('@/assets/images/icon.png')}
            style={styles.logoImage}
            resizeMode="contain"
          />
          <Text style={styles.slogan}>Skaneo</Text>

          <Text style={styles.title}>Scannez votre carte à gratter</Text>

          <Text style={styles.subtitle}>
            <Text style={styles.yas}>Yas </Text>
            <Text style={styles.dot}>· </Text>
            <Text style={styles.orange}>Orange </Text>
            <Text style={styles.dot}>· </Text>
            <Text style={styles.airtel}>Airtel</Text>
          </Text>
        </View>

        <TouchableOpacity
          style={styles.scanButton}
          onPress={handleScan}
          activeOpacity={0.85}
        >
          <Ionicons name="camera" size={20} color="white" />
          <Text style={styles.scanButtonText}>Scanner une carte</Text>
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            © 2026 Skaneo. Tous droits réservés.
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  container: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 40,
  },

  aboutButton: {
    position: "absolute",
    top: 40,
    right: 24,
    zIndex: 1,
  },

  logoContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
  },

  logoImage: {
    width: 120,
    height: 120,
    borderRadius: 20,
  },

  slogan: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#1E293B",
  },

  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1E293B",
    textAlign: "center",
    marginTop: 8,
  },

  subtitle: {
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },

  dot: {
    color: "#94A3B8",
  },

  yas: {
    color: "#FFBF00",
  },
  orange: {
    color: "#FF4400",
  },
  airtel: {
    color: "#FF0000",
  },

  scanButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
    width: "100%",
    backgroundColor: "#FFBF00",
    paddingVertical: 18,
    borderRadius: 16,
  },

  scanButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },

  footer: {
    marginTop: 20,
  },

  footerText: {
    color: "#64748B",
    fontSize: 14,
  },
});