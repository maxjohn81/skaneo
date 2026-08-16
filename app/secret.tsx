import { Ionicons } from "@expo/vector-icons";
import { router, Tabs } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Platform,
  PermissionsAndroid,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import RNImmediatePhoneCall from "react-native-immediate-phone-call";
import { COLORS } from "@/constants/colors";
import { SHORTCUTS, type Shortcut, type ShortcutOperator } from "@/constants/shortcuts";
import { useTranslation } from "@/hooks/useTranslation";

const OPERATOR_STYLES: Record<ShortcutOperator, { color: string; bg: string; label: string }> = {
  yas: { color: "#B8860B", bg: "#FFF7E0", label: "Yas" },
  airtel: { color: "#E00000", bg: "#FFE0E0", label: "Airtel" },
};

async function ensureCallPermission(): Promise<boolean> {
  if (Platform.OS !== "android") return true;

  const alreadyGranted = await PermissionsAndroid.check(
    PermissionsAndroid.PERMISSIONS.CALL_PHONE
  );
  if (alreadyGranted) return true;

  const result = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.CALL_PHONE,
    {
      title: "Autorisation d'appel requise",
      message: "Skaneo a besoin d'exécuter ce code directement.",
      buttonPositive: "Autoriser",
      buttonNegative: "Refuser",
    }
  );
  return result === PermissionsAndroid.RESULTS.GRANTED;
}

function ShortcutButton({ shortcut }: { shortcut: Shortcut }) {
  const [loading, setLoading] = useState(false);
  const opStyle = OPERATOR_STYLES[shortcut.operator];
  const { t } = useTranslation();

  const handlePress = async () => {
    if (Platform.OS === "ios") {
      Alert.alert(t("secret_ios_title"), t("secret_ios_text"));
      return;
    }

    setLoading(true);

    const hasPermission = await ensureCallPermission();
    if (!hasPermission) {
      setLoading(false);
      Alert.alert(t("secret_permission_denied_title"), t("secret_permission_denied_text"));
      return;
    }

    try {
      RNImmediatePhoneCall.immediatePhoneCall(shortcut.ussd);
      Alert.alert(t("secret_executed_title"), `${shortcut.label} (${shortcut.ussd})`);
    } catch (e) {
      Alert.alert(t("secret_error_title"), t("secret_error_text"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <TouchableOpacity
      style={styles.shortcutButton}
      onPress={handlePress}
      activeOpacity={0.8}
      disabled={loading}
      accessibilityRole="button"
      accessibilityLabel={`Exécuter ${shortcut.label}`}
    >
      <View style={[styles.shortcutIcon, { backgroundColor: opStyle.bg }]}>
        <Ionicons name="flash" size={18} color={opStyle.color} />
      </View>

      <View style={{ flex: 1 }}>
        <Text style={styles.shortcutLabel}>{shortcut.label}</Text>
        <Text style={styles.shortcutCode}>{shortcut.ussd}</Text>
      </View>

      {loading ? (
        <Ionicons name="ellipsis-horizontal" size={20} color={COLORS.muted} />
      ) : (
        <View style={[styles.callBadge, { backgroundColor: opStyle.color }]}>
          <Ionicons name="call" size={16} color="#FFFFFF" />
        </View>
      )}
    </TouchableOpacity>
  );
}

function OperatorSection({ operator }: { operator: ShortcutOperator }) {
  const opStyle = OPERATOR_STYLES[operator];
  const items = SHORTCUTS.filter((s) => s.operator === operator);

  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <View style={[styles.operatorBadge, { backgroundColor: opStyle.bg }]}>
          <Text style={[styles.operatorBadgeText, { color: opStyle.color }]}>
            {opStyle.label}
          </Text>
        </View>
      </View>

      <View style={styles.group}>
        {items.map((s, index) => (
          <View key={s.id}>
            <ShortcutButton shortcut={s} />
            {index !== items.length - 1 && <View style={styles.separator} />}
          </View>
        ))}
      </View>
    </View>
  );
}

export default function SecretScreen() {
   const { t } = useTranslation();
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
          <Text style={styles.headerTitle}>{t("secret_title")}</Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView
          contentContainerStyle={styles.container}
          showsVerticalScrollIndicator={false}
        >
          {/* <View style={styles.introBanner}>
            <Ionicons name="flash-outline" size={20} color={COLORS.danger} />
            <Text style={styles.introText}>
              Exécute directement un code de transformation en forfait, sans passer par
              l'application Téléphone.
            </Text>
          </View> */}

          <OperatorSection operator="yas" />
          <OperatorSection operator="airtel" />
        </ScrollView>
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
  container: { paddingHorizontal: 20, paddingBottom: 40 },

  introBanner: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    backgroundColor: COLORS.dangerLight,
    borderRadius: 16,
    padding: 14,
    marginBottom: 8,
  },
  introText: {
    flex: 1,
    fontSize: 13,
    color: COLORS.text,
    lineHeight: 19,
  },

  section: {
    marginTop: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    marginBottom: 10,
  },
  operatorBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  operatorBadgeText: {
    fontSize: 13,
    fontWeight: "700",
  },

  group: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: "hidden",
  },
  separator: {
    height: 1,
    backgroundColor: COLORS.border,
    marginLeft: 68,
  },

  shortcutButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 14,
    paddingHorizontal: 14,
  },
  shortcutIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  shortcutLabel: { fontSize: 15, fontWeight: "700", color: COLORS.text },
  shortcutCode: { fontSize: 13, color: COLORS.muted, marginTop: 2 },

  callBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
});