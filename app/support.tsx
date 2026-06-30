import { Ionicons } from "@expo/vector-icons";
import { router, Stack } from "expo-router";
import { useState } from "react";
import { Linking, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Operator = "yas" | "airtel" | null;

// ⚠️ Remplace ces numéros par les vrais numéros mobile money de Skaneo
const PHONE_NUMBERS: Record<"yas" | "airtel", string> = {
 yas: "038 69 309 42",
 airtel: "033 53 415 52",
};

export default function SupportScreen() {
 const [selected, setSelected] = useState<Operator>(null);

 const handleSend = () => {
  if (!selected) return;
  const number = PHONE_NUMBERS[selected];
  Linking.openURL(`tel:${number}`);
 };

 return (
   <>
   <Stack.Screen options={{ headerShown: false }} />
  <SafeAreaView style={{ flex: 1 }}>
   <View style={styles.header}>
    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
     <Ionicons name="chevron-back" size={24} />
    </TouchableOpacity>
    <Text style={styles.headerTitle}>Soutenir Skaneo</Text>
    <View style={{ width: 40 }} />
   </View>

   <View style={styles.container}>
    <Ionicons name="heart-circle" size={70} color="#FF4400" />
    <Text style={styles.title}>Aidez Skaneo à rejoindre le Play Store</Text>
    <Text style={styles.paragraph}>
     Skaneo est développée par un seul développeur, avec passion et
     beaucoup d'heures de travail. Pour publier officiellement
     l'application sur le Play Store, Google demande des frais uniques
     de 25$ pour un compte développeur valable à vie. Votre soutien,
     même petit, nous rapproche de cet objectif.
    </Text>

    <Text style={styles.label}>Choisissez votre opérateur</Text>

    <View style={styles.operatorRow}>
     <TouchableOpacity
      style={[
       styles.operatorCard,
       selected === "yas" && styles.operatorCardSelected,
       { borderColor: "#FFBF00" },
      ]}
      onPress={() => setSelected("yas")}
     >
      <Text style={[styles.operatorText, { color: "#FFBF00" }]}>Yas</Text>
     </TouchableOpacity>

     <TouchableOpacity
      style={[
       styles.operatorCard,
       selected === "airtel" && styles.operatorCardSelected,
       { borderColor: "#FF0000" },
      ]}
      onPress={() => setSelected("airtel")}
     >
      <Text style={[styles.operatorText, { color: "#FF0000" }]}>Airtel</Text>
     </TouchableOpacity>
    </View>

    {selected && (
     <View style={styles.numberBox}>
      <Text style={styles.numberLabel}>Numéro de dépôt</Text>
      <Text style={styles.numberValue}>{PHONE_NUMBERS[selected]}</Text>
     </View>
    )}

    <TouchableOpacity
     style={[styles.sendButton, !selected && styles.sendButtonDisabled]}
     onPress={handleSend}
     disabled={!selected}
    >
     <Ionicons name="call" size={20} color="white" />
     <Text style={styles.sendButtonText}>Faire un dépôt</Text>
    </TouchableOpacity>

    <Text style={styles.note}>
     Vous serez redirigé vers votre composeur pour effectuer le
     transfert via {selected === "yas" ? "Yas Money" : selected === "airtel" ? "Airtel Money" : "Yas Money ou Airtel Money"}.
    </Text>

    <Text style={styles.thanksFooter}>
     Merci infiniment pour votre générosité. Chaque contribution, peu
     importe le montant, fait avancer Skaneo vers sa publication
     officielle. 💛
    </Text>
   </View>
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
  flex: 1,
  alignItems: "center",
  paddingHorizontal: 24,
  paddingTop: 10,
 },
 title: {
  fontSize: 20,
  fontWeight: "bold",
  textAlign: "center",
  marginTop: 12,
  marginBottom: 10,
 },
 paragraph: {
  fontSize: 15,
  textAlign: "center",
  lineHeight: 21,
  color: "#475569",
  marginBottom: 30,
 },
 label: {
  fontSize: 16,
  fontWeight: "bold",
  marginBottom: 14,
  alignSelf: "flex-start",
 },
 operatorRow: {
  flexDirection: "row",
  gap: 14,
  width: "100%",
  marginBottom: 20,
 },
 operatorCard: {
  flex: 1,
  borderWidth: 2,
  borderRadius: 16,
  paddingVertical: 24,
  alignItems: "center",
  backgroundColor: "#F8FAFC",
 },
 operatorCardSelected: {
  backgroundColor: "#FFF7E6",
 },
 operatorText: {
  fontSize: 18,
  fontWeight: "bold",
 },
 numberBox: {
  width: "100%",
  backgroundColor: "#F1F5F9",
  borderRadius: 16,
  padding: 18,
  alignItems: "center",
  marginBottom: 20,
 },
 numberLabel: {
  fontSize: 13,
  color: "#64748B",
  marginBottom: 4,
 },
 numberValue: {
  fontSize: 22,
  fontWeight: "bold",
  letterSpacing: 1,
 },
 sendButton: {
  flexDirection: "row",
  gap: 10,
  backgroundColor: "#FF4400",
  paddingVertical: 16,
  paddingHorizontal: 30,
  borderRadius: 16,
  alignItems: "center",
  justifyContent: "center",
  width: "100%",
 },
 sendButtonDisabled: {
  backgroundColor: "#CBD5E1",
 },
 sendButtonText: {
  color: "#FFFFFF",
  fontSize: 16,
  fontWeight: "bold",
 },
 note: {
  fontSize: 13,
  color: "#94A3B8",
  textAlign: "center",
  marginTop: 16,
 },
 thanksFooter: {
  fontSize: 14,
  textAlign: "center",
  color: "#475569",
  marginTop: 30,
  lineHeight: 20,
 },
});