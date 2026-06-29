import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  const handleScan = () => {
    router.push("/scanner");
  };

  return (
    <>
      <SafeAreaView style={{flex:1}}>
        <View style={styles.container}>
          <View style={styles.logoContainer}>
            <View style={styles.logo}>
              <Image
                source={require('@/assets/images/icon_skaneo.png')}
                style={{ width: 200, height: 200, position: "absolute", left: -215, top: -45 }}
              />
              <Text style={styles.slogan}>kaneo</Text>
            </View>

            <Text style={styles.title}>
              Scanner votre carte à gratter
            </Text>
            <Text style={styles.title}>
              <Text style={styles.yas}>Yas, </Text>
              <Text style={styles.orange}>Orange, </Text>
              <Text style={styles.airtel}>Airtel</Text>
            </Text>
          </View>

          <TouchableOpacity style={styles.scanButton} onPress={handleScan}>
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
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    borderRadius: 50,
    position: 'relative'
  },

  title: {
    top: 200,
    fontSize: 18,
    fontWeight: "bold",
    // color: "#FFFFFF",
    marginTop: 10,
  },

  slogan: {
    position: 'absolute',
    top: 0,
    left: -72,
    fontSize: 100,
    marginTop: 10,
    fontWeight: "bold"
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
    top: 100,
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
    width: "100%",
    backgroundColor: "#FFBF00",
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