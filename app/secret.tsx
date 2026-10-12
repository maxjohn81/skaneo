import { Ionicons } from "@expo/vector-icons";
import { router, Tabs } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import {
  Alert,
  Modal,
  PermissionsAndroid,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import RNImmediatePhoneCall from "react-native-immediate-phone-call";
import { COLORS } from "@/constants/colors";
import {
  SHORTCUTS_STORAGE_KEY,
  type Shortcut,
  type ShortcutOperator,
} from "@/constants/shortcuts";
import { useTranslation } from "@/hooks/useTranslation";

const OPERATORS: ShortcutOperator[] = ["orange", "airtel", "yas"];

const OPERATOR_STYLES: Record<ShortcutOperator, { color: string; bg: string; label: string }> = {
  orange: { color: "#FF4400", bg: "#FFE9E0", label: "Orange" },
  airtel: { color: "#E00000", bg: "#FFE0E0", label: "Airtel" },
  yas: { color: "#B8860B", bg: "#FFF7E0", label: "Yas" },
};

function isShortcut(value: unknown): value is Shortcut {
  if (!value || typeof value !== "object") return false;
  const shortcut = value as Partial<Shortcut>;
  return (
    typeof shortcut.id === "string" &&
    typeof shortcut.label === "string" &&
    typeof shortcut.ussd === "string" &&
    (shortcut.operator === "orange" ||
      shortcut.operator === "airtel" ||
      shortcut.operator === "yas")
  );
}

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

type ShortcutButtonProps = {
  shortcut: Shortcut;
  onEdit: (shortcut: Shortcut) => void;
  onDelete: (shortcut: Shortcut) => void;
};

function ShortcutButton({ shortcut, onEdit, onDelete }: ShortcutButtonProps) {
  const [loading, setLoading] = useState(false);
  const opStyle = OPERATOR_STYLES[shortcut.operator];
  const { t } = useTranslation();

  const handlePress = async () => {
    if (Platform.OS === "ios") {
      Alert.alert(t("secret_ios_title"), t("secret_ios_text"));
      return;
    }

    setLoading(true);
    try {
      const hasPermission = await ensureCallPermission();
      if (!hasPermission) {
        Alert.alert(t("secret_permission_denied_title"), t("secret_permission_denied_text"));
        return;
      }

      await RNImmediatePhoneCall.immediatePhoneCall(shortcut.ussd);
      Alert.alert(t("secret_executed_title"), `${shortcut.label} (${shortcut.ussd})`);
    } catch (error) {
      console.error("Unable to execute shortcut", error);
      Alert.alert(t("secret_error_title"), t("secret_error_text"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.shortcutRow}>
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

        <View style={styles.shortcutText}>
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

      <TouchableOpacity
        style={styles.rowAction}
        onPress={() => onEdit(shortcut)}
        accessibilityRole="button"
        accessibilityLabel={`${t("secret_edit")}: ${shortcut.label}`}
        hitSlop={8}
      >
        <Ionicons name="create-outline" size={20} color={COLORS.muted} />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.rowAction}
        onPress={() => onDelete(shortcut)}
        accessibilityRole="button"
        accessibilityLabel={`${t("secret_delete")}: ${shortcut.label}`}
        hitSlop={8}
      >
        <Ionicons name="trash-outline" size={19} color={COLORS.danger} />
      </TouchableOpacity>
    </View>
  );
}

type OperatorSectionProps = {
  operator: ShortcutOperator;
  shortcuts: Shortcut[];
  onEdit: (shortcut: Shortcut) => void;
  onDelete: (shortcut: Shortcut) => void;
};

function OperatorSection({ operator, shortcuts, onEdit, onDelete }: OperatorSectionProps) {
  const { t } = useTranslation();
  const opStyle = OPERATOR_STYLES[operator];

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
        {shortcuts.length === 0 ? (
          <Text style={styles.emptyText}>{t("secret_empty")}</Text>
        ) : (
          shortcuts.map((shortcut, index) => (
            <View key={shortcut.id}>
              <ShortcutButton
                shortcut={shortcut}
                onEdit={onEdit}
                onDelete={onDelete}
              />
              {index !== shortcuts.length - 1 && <View style={styles.separator} />}
            </View>
          ))
        )}
      </View>
    </View>
  );
}

export default function SecretScreen() {
  const { t } = useTranslation();
  const [shortcuts, setShortcuts] = useState<Shortcut[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [operatorMenuVisible, setOperatorMenuVisible] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [label, setLabel] = useState("");
  const [ussd, setUssd] = useState("");
  const [operator, setOperator] = useState<ShortcutOperator>("orange");

  useEffect(() => {
    let active = true;

    AsyncStorage.getItem(SHORTCUTS_STORAGE_KEY)
      .then((value) => {
        if (!active || value === null) return;
        const parsed: unknown = JSON.parse(value);
        if (!Array.isArray(parsed) || !parsed.every(isShortcut)) {
          throw new Error("Stored shortcuts have an invalid format");
        }
        setShortcuts(parsed);
      })
      .catch((error) => {
        console.error("Unable to load shortcuts", error);
        Alert.alert(t("secret_error_title"), t("secret_storage_error"));
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [t]);

  const persistShortcuts = async (nextShortcuts: Shortcut[]) => {
    try {
      await AsyncStorage.setItem(SHORTCUTS_STORAGE_KEY, JSON.stringify(nextShortcuts));
      setShortcuts(nextShortcuts);
      return true;
    } catch (error) {
      console.error("Unable to save shortcuts", error);
      Alert.alert(t("secret_error_title"), t("secret_storage_error"));
      return false;
    }
  };

  const openAddModal = () => {
    setEditingId(null);
    setLabel("");
    setUssd("");
    setOperator("orange");
    setOperatorMenuVisible(false);
    setModalVisible(true);
  };

  const openEditModal = (shortcut: Shortcut) => {
    setEditingId(shortcut.id);
    setLabel(shortcut.label);
    setUssd(shortcut.ussd);
    setOperator(shortcut.operator);
    setOperatorMenuVisible(false);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setOperatorMenuVisible(false);
  };

  const handleSave = async () => {
    const cleanLabel = label.trim();
    const cleanUssd = ussd.trim();
    if (!cleanLabel || !/^[*#][0-9*#]*#$/.test(cleanUssd)) {
      Alert.alert(t("secret_error_title"), t("secret_required_fields"));
      return;
    }

    const nextShortcut: Shortcut = {
      id: editingId ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      operator,
      label: cleanLabel,
      ussd: cleanUssd,
    };
    const nextShortcuts = editingId
      ? shortcuts.map((shortcut) => shortcut.id === editingId ? nextShortcut : shortcut)
      : [...shortcuts, nextShortcut];

    if (await persistShortcuts(nextShortcuts)) closeModal();
  };

  const handleDelete = (shortcut: Shortcut) => {
    Alert.alert(t("secret_delete_title"), t("secret_delete_message"), [
      { text: t("secret_cancel"), style: "cancel" },
      {
        text: t("secret_delete"),
        style: "destructive",
        onPress: () => {
          void persistShortcuts(shortcuts.filter((item) => item.id !== shortcut.id));
        },
      },
    ]);
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
          <Text style={styles.headerTitle}>{t("secret_title")}</Text>
          <TouchableOpacity
            onPress={openAddModal}
            accessibilityRole="button"
            accessibilityLabel={t("secret_add")}
            hitSlop={10}
          >
            <Ionicons name="add-circle" size={28} color={COLORS.danger} />
          </TouchableOpacity>
        </View>

        <ScrollView
          contentContainerStyle={styles.container}
          showsVerticalScrollIndicator={false}
        >
          {loading ? (
            <Text style={styles.loadingText}>{t("secret_loading")}</Text>
          ) : (
            OPERATORS.map((operatorId) => (
              <OperatorSection
                key={operatorId}
                operator={operatorId}
                shortcuts={shortcuts.filter((shortcut) => shortcut.operator === operatorId)}
                onEdit={openEditModal}
                onDelete={handleDelete}
              />
            ))
          )}
        </ScrollView>
      </SafeAreaView>

      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={closeModal}
      >
        <View style={styles.modalRoot}>
          <TouchableOpacity
            style={styles.modalBackdrop}
            activeOpacity={1}
            onPress={closeModal}
            accessibilityLabel={t("secret_cancel")}
          />
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>
              {editingId ? t("secret_edit") : t("secret_add")}
            </Text>

            <Text style={styles.fieldLabel}>{t("secret_title_label")}</Text>
            <TextInput
              style={styles.input}
              value={label}
              onChangeText={setLabel}
              placeholder={t("secret_title_placeholder")}
              placeholderTextColor={COLORS.muted}
              maxLength={60}
              autoCapitalize="sentences"
              accessibilityLabel={t("secret_title_label")}
            />

            <Text style={styles.fieldLabel}>{t("secret_code_label")}</Text>
            <TextInput
              style={styles.input}
              value={ussd}
              onChangeText={setUssd}
              placeholder={t("secret_code_placeholder")}
              placeholderTextColor={COLORS.muted}
              autoCapitalize="none"
              autoCorrect={false}
              accessibilityLabel={t("secret_code_label")}
            />

            <Text style={styles.fieldLabel}>{t("secret_operator_label")}</Text>
            <TouchableOpacity
              style={styles.dropdownButton}
              onPress={() => setOperatorMenuVisible((visible) => !visible)}
              accessibilityRole="button"
              accessibilityLabel={`${t("secret_operator_label")}: ${OPERATOR_STYLES[operator].label}`}
              accessibilityState={{ expanded: operatorMenuVisible }}
            >
              <Text style={styles.dropdownText}>{OPERATOR_STYLES[operator].label}</Text>
              <Ionicons
                name={operatorMenuVisible ? "chevron-up" : "chevron-down"}
                size={18}
                color={COLORS.muted}
              />
            </TouchableOpacity>

            {operatorMenuVisible && (
              <View style={styles.dropdownOptions}>
                {OPERATORS.map((operatorId) => (
                  <TouchableOpacity
                    key={operatorId}
                    style={styles.dropdownOption}
                    onPress={() => {
                      setOperator(operatorId);
                      setOperatorMenuVisible(false);
                    }}
                  >
                    <Text style={styles.dropdownText}>
                      {OPERATOR_STYLES[operatorId].label}
                    </Text>
                    {operator === operatorId && (
                      <Ionicons name="checkmark" size={18} color={COLORS.danger} />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            )}

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={closeModal}
                accessibilityRole="button"
              >
                <Text style={styles.cancelButtonText}>{t("secret_cancel")}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.saveButton}
                onPress={() => void handleSave()}
                accessibilityRole="button"
              >
                <Text style={styles.saveButtonText}>{t("secret_save")}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  loadingText: { marginTop: 32, textAlign: "center", color: COLORS.muted },
  section: { marginTop: 24 },
  sectionHeader: { flexDirection: "row", marginBottom: 10 },
  operatorBadge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  operatorBadgeText: { fontSize: 13, fontWeight: "700" },
  group: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: "hidden",
  },
  emptyText: { padding: 16, fontSize: 13, color: COLORS.muted },
  separator: { height: 1, backgroundColor: COLORS.border, marginLeft: 68 },
  shortcutRow: { flexDirection: "row", alignItems: "center", paddingRight: 8 },
  shortcutButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 14,
    paddingLeft: 14,
  },
  shortcutIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  shortcutText: { flex: 1 },
  shortcutLabel: { fontSize: 15, fontWeight: "700", color: COLORS.text },
  shortcutCode: { fontSize: 13, color: COLORS.muted, marginTop: 2 },
  callBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  rowAction: {
    width: 38,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  modalRoot: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 22,
  },
  modalBackdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: "rgba(15,23,42,0.48)",
  },
  modalCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 20,
    gap: 9,
  },
  modalTitle: {
    fontSize: 19,
    fontWeight: "800",
    color: COLORS.text,
    marginBottom: 5,
  },
  fieldLabel: { fontSize: 13, fontWeight: "700", color: COLORS.text, marginTop: 5 },
  input: {
    minHeight: 46,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    paddingHorizontal: 12,
    color: COLORS.text,
    fontSize: 15,
  },
  dropdownButton: {
    minHeight: 46,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  dropdownText: { fontSize: 15, color: COLORS.text },
  dropdownOptions: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    overflow: "hidden",
  },
  dropdownOption: {
    minHeight: 42,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  modalActions: { flexDirection: "row", justifyContent: "flex-end", gap: 10, marginTop: 12 },
  cancelButton: {
    minHeight: 44,
    paddingHorizontal: 15,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F1F5F9",
  },
  cancelButtonText: { fontSize: 14, fontWeight: "700", color: COLORS.text },
  saveButton: {
    minHeight: 44,
    paddingHorizontal: 18,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.danger,
  },
  saveButtonText: { fontSize: 14, fontWeight: "700", color: "#FFFFFF" },
});
