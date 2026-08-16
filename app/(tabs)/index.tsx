// app/index.tsx (Home)
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { TERMS_VERSION } from "@/constants/terms";
import { STORAGE_KEY } from "@/constants/storage_key";
import { Modal, Pressable } from "react-native";
import { useTranslation } from "@/hooks/useTranslation";

const COLORS = {
  primary: "#FFBF00",
  primaryLight: "#FFF8E6",
  primaryBorder: "#FFF8E6",
  danger: "#E8402A",
  dangerLight: "#FDEDEA",
  dangerBorder: "#FDEDEA",
  text: "#0F172A",
  muted: "#64748B",
  border: "#E2E8F0",
  yas: "#FFBF00",
  orange: "#FF4400",
  airtel: "#FF0000",
};

type ActionCardProps = {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
  buttonLabel: string;
  variant: "primary" | "danger";
  onPress: () => void;
};

function ActionCard({ icon, title, description, buttonLabel, variant, onPress }: ActionCardProps) {
  const isPrimary = variant === "primary";
  return (
    <TouchableOpacity
      style={[
        styles.card,
        {
          backgroundColor: isPrimary ? COLORS.primaryLight : COLORS.dangerLight,
          borderColor: isPrimary ? COLORS.primaryBorder : COLORS.dangerBorder,
        },
      ]}
      onPress={onPress}
      activeOpacity={0.8}
      accessibilityRole="button"
      accessibilityLabel={title}
    >
      <View style={styles.cardHeader}>
        <View
          style={[
            styles.cardIconWrap,
            { backgroundColor: isPrimary ? "#FDECC0" : "#FBD9D2" },
          ]}
        >
          <Ionicons name={icon} size={22} color={isPrimary ? COLORS.primary : COLORS.danger} />
        </View>

        <View style={styles.cardTextWrap}>
          <Text style={styles.cardTitle}>{title}</Text>
          <Text style={styles.cardDescription}>{description}</Text>
        </View>

        <Ionicons name="chevron-forward" size={20} color={COLORS.muted} />
      </View>

      <View
        style={[
          styles.cardButton,
          { backgroundColor: isPrimary ? COLORS.primary : COLORS.danger },
        ]}
      >
        <Ionicons
          name={isPrimary ? "camera" : "arrow-up"}
          size={18}
          color="#FFFFFF"
        />
        <Text style={styles.cardButtonText}>{buttonLabel}</Text>
      </View>
    </TouchableOpacity>
  );
}


export default function HomeScreen() {
  const { t } = useTranslation();
  const [checkingTerms, setCheckingTerms] = useState(true);
  const [menuVisible, setMenuVisible] = useState(false);

  useEffect(() => {
    const checkOnboarding = async () => {
      try {
        const languageChosen = await AsyncStorage.getItem("skaneo_language_chosen");
        if (languageChosen !== "true") {
          router.replace("/language-select");
          return;
        }

        const acceptedVersion = await AsyncStorage.getItem(STORAGE_KEY);
        if (acceptedVersion !== TERMS_VERSION) {
          router.replace("/terms");
          return;
        }
      } catch (e) {
        console.log("Erreur vérification onboarding:", e);
      }
      setCheckingTerms(false);
    };

    checkOnboarding();
  }, []);


  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <TouchableOpacity
          style={styles.menuButton}
          onPress={() => setMenuVisible(true)}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          accessibilityRole="button"
          accessibilityLabel="Ouvrir le menu"
        >
          <Ionicons name="ellipsis-vertical" size={22} color="#64748B" />
        </TouchableOpacity>

        <Modal
          visible={menuVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setMenuVisible(false)}
        >
          <Pressable style={styles.menuOverlay} onPress={() => setMenuVisible(false)}>
            <View style={styles.menuCard}>
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => {
                  setMenuVisible(false);
                  router.push("/settings");
                }}
              >
                <Ionicons name="settings-outline" size={20} color="#1E293B" />
                <Text style={styles.menuItemText}>{t("menu_settings")}</Text>
              </TouchableOpacity>

              <View style={styles.menuSeparator} />

              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => {
                  setMenuVisible(false);
                  router.push("/about/about");
                }}
              >
                <Ionicons name="information-circle-outline" size={20} color="#1E293B" />
                <Text style={styles.menuItemText}>{t("menu_about")}</Text>
              </TouchableOpacity>
            </View>
          </Pressable>
        </Modal>

        <View style={styles.header}>
          <Image
            source={require("@/assets/images/icon.png")}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.appName}>Skaneo</Text>
          <Text style={styles.tagline}>{t("home_tagline")}</Text>

          <Text style={styles.operators}>
            <Text style={{ color: COLORS.yas }}>Yas</Text>
            <Text style={{ color: COLORS.muted }}> · </Text>
            <Text style={{ color: COLORS.orange }}>Orange</Text>
            <Text style={{ color: COLORS.muted }}> · </Text>
            <Text style={{ color: COLORS.airtel }}>Airtel</Text>
          </Text>
        </View>

        <View style={styles.actions}>
          <ActionCard
            icon="camera"
            title={t("home_scan_title")}
            description={t("home_scan_description")}
            buttonLabel={t("home_scan_button")}
            variant="primary"
            onPress={() => router.push("/scanner")}
          />

          <ActionCard
            icon="arrow-up-circle-outline"
            title={t("home_withdraw_title")}
            description={t("home_withdraw_description")}
            buttonLabel={t("home_withdraw_button")}
            variant="danger"
            onPress={() => router.push("/withdraw")}
          />
        </View>

        <Text style={styles.footerText}>{t("home_footer")}</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  container: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingBottom: 32,
    justifyContent: "space-between"
  },
  infoButton: {
    alignSelf: "flex-end",
    padding: 8,
    marginTop: 8,
  },
  header: {
    alignItems: "center",
    marginTop: 8,
    marginBottom: 32,
    gap: 6,
  },
  logo: {
    width: 88,
    height: 88,
  },
  appName: {
    fontSize: 30,
    fontWeight: "800",
    color: COLORS.text,
    marginTop: 4,
  },
  tagline: {
    fontSize: 15,
    color: COLORS.muted,
  },
  operators: {
    fontSize: 15,
    fontWeight: "600",
    marginTop: 4,
  },
  actions: {
    gap: 16,
  },
  card: {
    borderWidth: 1,
    borderRadius: 20,
    padding: 16,
    gap: 16,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  cardIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  cardTextWrap: {
    flex: 1,
    gap: 2,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.text,
  },
  cardDescription: {
    fontSize: 13,
    color: COLORS.muted,
  },
  cardButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 14,
    borderRadius: 14,
  },
  cardButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },
  footerText: {
    textAlign: "center",
    color: COLORS.muted,
    fontSize: 13,
    marginTop: 24,
  },
  menuButton: {
    alignSelf: "flex-end",
    padding: 8,
    marginTop: 8,
  },

  menuOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.2)",
  },

  menuCard: {
    position: "absolute",
    top: 60,
    right: 20,
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    paddingVertical: 6,
    minWidth: 180,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },

  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },

  menuItemText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1E293B",
  },

  menuSeparator: {
    height: 1,
    backgroundColor: "#EEF2F6",
    marginHorizontal: 8,
  },
});