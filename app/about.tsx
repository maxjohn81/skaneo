import { Ionicons } from "@expo/vector-icons";
import { router, Stack } from "expo-router";
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AboutScreen() {
 return (
  <>
   <Stack.Screen options={{ headerShown: false}} />

   <SafeAreaView style={{ flex: 1 }}>
    <View style={styles.header}>
     <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
      <Ionicons name="chevron-back" size={24} />
     </TouchableOpacity>
     <Text style={styles.headerTitle}>À propos</Text>
     <View style={{ width: 40 }} />
    </View>

    <ScrollView contentContainerStyle={styles.container}>
     {/* <Image
      source={require("@/assets/images/icon_skaneo.png")}
      style={styles.logo}
     /> */}

     <Text style={styles.appName}>Skaneo</Text>
     <Text style={styles.version}>Version 1.0.0</Text>

     <Text style={styles.paragraph}>
      Skaneo vous permet de scanner et vérifier rapidement vos cartes à
      gratter Yas, Orange et Airtel directement depuis votre téléphone.
     </Text>

     <View style={styles.thanksBox}>
      <Ionicons name="heart" size={28} color="#FF4400" style={{ marginBottom: 8 }} />
      <Text style={styles.thanksTitle}>Merci à vous !</Text>
      <Text style={styles.thanksText}>
       Je vous partage Skaneo gratuitement, car je sais à quel point elle
       peut être utile dans la vie quotidienne. Chaque scan, chaque retour,
       chaque partage me motive un peu plus à continuer. Cette application
       est née d'une passion et grandit grâce à vous. Votre confiance est
       la plus belle des récompenses. 🙏
      </Text>
     </View>

     {/* <View style={styles.section}>
      <Text style={styles.sectionTitle}>Fonctionnalités</Text>
      <Text style={styles.item}>• Scan rapide via la caméra</Text>
      <Text style={styles.item}>• Compatible Yas, Orange et Airtel</Text>
      <Text style={styles.item}>• Résultats instantanés</Text>
     </View> */}

     <View style={styles.section}>
      <Text style={styles.sectionTitle}>Développeur</Text>
      <Text style={styles.item}>
       Skaneo est développée avec passion par un jeune développeur
       talentueux, déterminé à créer des outils utiles et accessibles
       à tous.
      </Text>
     </View>

     <View style={styles.warningBox}>
      <Ionicons name="information-circle" size={22} color="#D97706" style={{ marginBottom: 6 }} />
      <Text style={styles.warningText}>
       Skaneo n'est pas encore disponible sur le Play Store. La
       publication nécessite un compte développeur Google (25$ à vie)
       que nous n'avons pas encore les moyens de financer seul.
      </Text>
     </View>

     <TouchableOpacity
      style={styles.supportButton}
      onPress={() => router.push("/support")}
     >
      <Ionicons name="gift" size={20} color="white" />
      <Text style={styles.supportButtonText}>Soutenir Skaneo</Text>
     </TouchableOpacity>

     <View style={styles.section}>
      <Text style={styles.sectionTitle}>Contact</Text>
      <Text style={styles.item}>Email : rivoandriharisoa@gmail.com</Text>
      <Text style={styles.item}>Facebook : Rivo Andriharisoa</Text>
     </View>

     <Text style={styles.footerText}>
      © 2026 Skaneo. Tous droits réservés.
     </Text>
    </ScrollView>
   </SafeAreaView>
  </>
 );
}

const styles = StyleSheet.create({
 header: {
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  paddingHorizontal: 10,
  paddingVertical: 10,
 },
 backButton: {
  padding: 10,
 },
 headerTitle: {
  fontSize: 18,
  fontWeight: "bold",
 },
 container: {
  alignItems: "center",
  paddingHorizontal: 24,
  paddingTop: 20,
  paddingBottom: 60,
 },
 logo: {
  width: 100,
  height: 100,
  resizeMode: "contain",
  marginBottom: 16,
 },
 appName: {
  fontSize: 28,
  fontWeight: "bold",
 },
 version: {
  fontSize: 14,
  color: "#64748B",
  marginTop: 4,
  marginBottom: 24,
 },
 paragraph: {
  fontSize: 16,
  textAlign: "center",
  lineHeight: 22,
  marginBottom: 24,
 },
 thanksBox: {
  width: "100%",
  backgroundColor: "#FFF7E6",
  borderRadius: 16,
  padding: 20,
  alignItems: "center",
  marginBottom: 24,
 },
 thanksTitle: {
  fontSize: 18,
  fontWeight: "bold",
  marginBottom: 8,
 },
 thanksText: {
  fontSize: 14,
  textAlign: "center",
  lineHeight: 20,
  color: "#475569",
 },
 section: {
  width: "100%",
  marginBottom: 20,
 },
 sectionTitle: {
  fontSize: 16,
  fontWeight: "bold",
  marginBottom: 8,
 },
 item: {
  fontSize: 15,
  color: "#334155",
  marginBottom: 4,
  lineHeight: 20,
 },
 warningBox: {
  width: "100%",
  backgroundColor: "#FEF3C7",
  borderRadius: 16,
  padding: 18,
  alignItems: "center",
  marginBottom: 20,
 },
 warningText: {
  fontSize: 14,
  textAlign: "center",
  lineHeight: 20,
  color: "#92400E",
 },
 supportButton: {
  flexDirection: "row",
  gap: 10,
  backgroundColor: "#FF4400",
  paddingVertical: 16,
  paddingHorizontal: 30,
  borderRadius: 16,
  alignItems: "center",
  justifyContent: "center",
  marginBottom: 24,
  width: "100%",
 },
 supportButtonText: {
  color: "#FFFFFF",
  fontSize: 16,
  fontWeight: "bold",
 },
 footerText: {
  color: "#64748B",
  fontSize: 14,
  marginTop: 30,
 },
});