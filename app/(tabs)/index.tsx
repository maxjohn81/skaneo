import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Image, Pressable, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Animated, {
  FadeIn,
  FadeInDown,
  FadeInUp,
  ZoomIn,
} from "react-native-reanimated";

export default function HomeScreen() {
  const handleScan = () => {
    router.push("/scanner");
  };

  return (
    <>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.container}>
          <Animated.View
            entering={FadeIn.delay(600).duration(400)}
            style={{ position: "absolute", right: 15, top: 15 }}
          >
            <Pressable
              style={{ backgroundColor: "transparent", padding: 15 }}
              onPress={() => router.push("/about")}
            >
              <Ionicons name="ellipsis-vertical" size={20} />
            </Pressable>
          </Animated.View>

          <View style={styles.logoContainer}>
            <Animated.View
              entering={ZoomIn.delay(100).duration(700).springify()}
              style={styles.logo}
            >
              <Image
                source={require('@/assets/images/icon_skaneo.png')}
                style={{ width: 200, height: 200, position: "absolute", left: -215, top: -45 }}
              />
              <Animated.Text
                entering={FadeInDown.delay(350).duration(600).springify()}
                style={styles.slogan}
              >
                kaneo
              </Animated.Text>
            </Animated.View>

            <Animated.Text
              entering={FadeInUp.delay(550).duration(500)}
              style={styles.title}
            >
              Scanner votre carte à gratter
            </Animated.Text>

            <Animated.Text
              entering={FadeInUp.delay(650).duration(500)}
              style={styles.title}
            >
              <Text style={styles.yas}>Yas, </Text>
              <Text style={styles.orange}>Orange, </Text>
              <Text style={styles.airtel}>Airtel</Text>
            </Animated.Text>
          </View>

          <Animated.View
            entering={FadeInUp.delay(800).duration(600).springify()}
            style={{ width: "100%", top: 100 }}
          >
            <TouchableOpacity style={styles.scanButton} onPress={handleScan}>
              <Ionicons name="camera" size={20} color="white" />
              <Text style={styles.scanButtonText}>Scanner une carte</Text>
            </TouchableOpacity>
          </Animated.View>

          <Animated.View
            entering={FadeIn.delay(1000).duration(500)}
            style={styles.footer}
          >
            <Text style={styles.footerText}>
              © 2026 Skaneo. Tous droits réservés.
            </Text>
          </Animated.View>
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