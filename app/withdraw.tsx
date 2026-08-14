import { Ionicons } from "@expo/vector-icons";
import { router, Tabs } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { call } from "react-native-phone-call";
import { COLORS } from "@/constants/colors";
import { OPERATORS, type OperatorId } from "@/constants/operators";
import { buildUssdCode } from "@/utils/ussd";
import { useCallPermission } from "@/hooks/useCallPermission";
import { OperatorButton } from "@/components/OperatorButton";
import { SecurityBanner } from "@/components/SecurityBanner";

export default function WithdrawScreen() {
  const { status, checking, checkPermission } = useCallPermission();
  const [operator, setOperator] = useState<OperatorId>("yas");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [amount, setAmount] = useState("");

  const isValid = phoneNumber.trim().length > 0 && Number(amount) > 0;

  // Sécurité : si la permission a été révoquée entre-temps (réglages système),
  // on renvoie l'utilisateur vers l'écran d'autorisation.
  useEffect(() => {
    if (!checking && status !== "granted") {
      router.replace("/withdraw-permission");
    }
  }, [checking, status]);

  const handleSubmit = async () => {
    if (!isValid) return;

    const ussdCode = buildUssdCode(operator, phoneNumber.trim(), amount.trim());

    if (Platform.OS === "ios") {
      Alert.alert(
        "Non disponible sur iOS",
        "L'exécution directe des codes USSD n'est pas autorisée par Apple sur cette plateforme."
      );
      return;
    }

    try {
      await call({ number: ussdCode, prompt: false });
    } catch {
      Alert.alert("Erreur", "Impossible d'exécuter l'opération.");
    }
  };

  if (checking || status !== "granted") {
    return null; // évite un flash d'UI pendant la redirection
  }

  return (
    <>
      <Tabs.Screen options={{ headerShown: false }} />

      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <View style={styles.header}>
            <TouchableOpacity
              onPress={() => router.back()}
              accessibilityRole="button"
              accessibilityLabel="Retour"
              hitSlop={10}
            >
              <Ionicons name="chevron-back" size={24} color={COLORS.text} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Faire un retrait</Text>
            <View style={{ width: 24 }} />
          </View>

          <ScrollView
            contentContainerStyle={styles.container}
            keyboardShouldPersistTaps="handled"
          >
            <SecurityBanner
              title="Vos opérations sont sécurisées."
              description="Aucun code secret n'est stocké dans l'application."
            />

            <Text style={styles.sectionLabel}>Opérateur</Text>
            <View style={styles.operatorRow}>
              {OPERATORS.map((op) => (
                <OperatorButton
                  key={op.id}
                  operator={op}
                  selected={operator === op.id}
                  onPress={() => setOperator(op.id)}
                />
              ))}
            </View>

            <Text style={styles.sectionLabel}>Numéro destinataire</Text>
            <View style={styles.inputWrap}>
              <Ionicons name="call-outline" size={18} color={COLORS.muted} />
              <TextInput
                style={styles.input}
                placeholder="034 XX XXX XX"
                placeholderTextColor={COLORS.muted}
                keyboardType="phone-pad"
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                accessibilityLabel="Numéro destinataire"
              />
            </View>
            <Text style={styles.helperText}>Entrez le numéro du destinataire.</Text>

            <Text style={styles.sectionLabel}>Montant</Text>
            <View style={styles.inputWrap}>
              <Ionicons name="wallet-outline" size={18} color={COLORS.muted} />
              <TextInput
                style={styles.input}
                placeholder="0 Ar"
                placeholderTextColor={COLORS.muted}
                keyboardType="numeric"
                value={amount}
                onChangeText={setAmount}
                accessibilityLabel="Montant à retirer"
              />
            </View>
            <Text style={styles.helperText}>Entrez le montant à retirer.</Text>
          </ScrollView>

          <View style={styles.footer}>
            <TouchableOpacity
              style={[styles.submitButton, !isValid && styles.submitButtonDisabled]}
              onPress={handleSubmit}
              disabled={!isValid}
              activeOpacity={0.85}
              accessibilityRole="button"
              accessibilityLabel="Confirmer le retrait"
            >
              <Ionicons name="arrow-up" size={18} color="#FFFFFF" />
              <Text style={styles.submitButtonText}>Retrait</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#FFFFFF" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerTitle: { fontSize: 17, fontWeight: "700", color: COLORS.text },
  container: { paddingHorizontal: 20, paddingBottom: 20, gap: 4 },
  sectionLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.text,
    marginTop: 16,
    marginBottom: 10,
  },
  operatorRow: { flexDirection: "row", gap: 10 },
  inputWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 14,
    paddingHorizontal: 14,
    backgroundColor: COLORS.inputBg,
  },
  input: { flex: 1, paddingVertical: 14, fontSize: 15, color: COLORS.text },
  helperText: { fontSize: 12, color: COLORS.muted, marginTop: 6 },
  footer: { padding: 20, borderTopWidth: 1, borderTopColor: COLORS.border },
  submitButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: COLORS.danger,
    paddingVertical: 16,
    borderRadius: 14,
  },
  submitButtonDisabled: { opacity: 0.5 },
  submitButtonText: { color: "#FFFFFF", fontSize: 16, fontWeight: "700" },
});