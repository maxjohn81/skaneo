import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function HomeScreen() {
  const handleScan = () => {
    router.push("/scanner");
  };

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <View style={styles.logo}>
            <Image
              source={require('../../assets/images/skaneo.png')}
              style={{ width: 200, height: 200 }}
            />
        </View>
        <Text style={styles.slogan}>Scanner votre carte crédit</Text>
      </View>

      <TouchableOpacity style={styles.scanButton} onPress={handleScan}>
        <Ionicons name="camera" size={20} color="white" />
        <Text style={styles.scanButtonText}>Scanner une carte</Text>
      </TouchableOpacity>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          © 2024 Skaneo. Tous droits réservés.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0A0F1E",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 60,
    paddingHorizontal: 20,
  },

  logoContainer: {
    alignItems: "center",
    marginTop: 80,
  },

  logo: {
    fontSize: 80,
    borderRadius: 50,
    backgroundColor: "#0EA5E9",
    // padding: 20,
    overflow: "hidden",
  },

  title: {
    fontSize: 42,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginTop: 10,
  },

  slogan: {
    fontSize: 18,
    color: "#7DD3FC",
    marginTop: 10,
  },

  scanButton: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
    width: "100%",
    backgroundColor: "#0EA5E9",
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: "center",
  },

  scanButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },

  footer: {
    marginBottom: 20,
  },

  footerText: {
    color: "#64748B",
    fontSize: 14,
  },
});