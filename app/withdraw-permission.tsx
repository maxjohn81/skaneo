import { Ionicons } from "@expo/vector-icons";
import { router, Tabs } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS } from "@/constants/colors";
import { useCallPermission } from "@/hooks/useCallPermission";
import { useTranslation } from "@/hooks/useTranslation";

export default function WithdrawPermissionScreen() {
  const { t } = useTranslation();
  const { status, checking, requestPermission } = useCallPermission();

  const handleAuthorize = async () => {
    const granted = await requestPermission();
    if (granted) {
      router.replace("/withdraw");
    }

  };

  return (
    <>
      <Tabs.Screen options={{ headerShown: false }} />

      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            accessibilityRole="button"
            accessibilityLabel="Retour"
            hitSlop={10}
          >
            <Ionicons name="chevron-back" size={24} color={COLORS.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{t("withdraw_title")}</Text>
          <View style={{ width: 24 }} />
        </View>

        <View style={styles.content}>
          <View style={styles.iconWrap}>
            <Ionicons name="call" size={36} color={COLORS.danger} />
          </View>

          <Text style={styles.title}>{t("withdraw_permission_title_screen")}</Text>
          <Text style={styles.description}>{t("withdraw_permission_description")}</Text>

          {status === "denied" && (
            <Text style={styles.deniedNote}>{t("withdraw_permission_denied_note")}</Text>
          )}
        </View>

        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.authorizeButton}
            onPress={handleAuthorize}
            disabled={checking}
            activeOpacity={0.85}
            accessibilityRole="button"
            accessibilityLabel="Autoriser l'appel"
          >
            <Ionicons name="checkmark-circle" size={18} color="#FFFFFF" />
            <Text style={styles.authorizeButtonText}>{t("withdraw_permission_authorize_button")}</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: COLORS.text,
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
    gap: 12,
  },
  iconWrap: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: COLORS.dangerLight,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.text,
    textAlign: "center",
  },
  description: {
    fontSize: 14,
    color: COLORS.muted,
    textAlign: "center",
    lineHeight: 20,
  },
  deniedNote: {
    fontSize: 13,
    color: COLORS.danger,
    textAlign: "center",
    marginTop: 8,
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  authorizeButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: COLORS.danger,
    paddingVertical: 16,
    borderRadius: 14,
  },
  authorizeButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
});