// app/index.tsx (Home)
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

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
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <TouchableOpacity
          style={styles.infoButton}
          onPress={() => router.push("/about/about")}
          accessibilityRole="button"
          accessibilityLabel="À propos"
        >
          <Ionicons name="information-circle-outline" size={22} color={COLORS.muted} />
        </TouchableOpacity>

        <View style={styles.header}>
          <Image
            source={require("@/assets/images/icon.png")}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.appName}>Skaneo</Text>
          <Text style={styles.tagline}>Simplifiez vos opérations mobiles</Text>

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
            title="Scanner une carte"
            description="Scannez votre carte à gratter et rechargez facilement."
            buttonLabel="Scanner une carte"
            variant="primary"
            onPress={() => router.push("/scanner")}
          />

          <ActionCard
            icon="arrow-up-circle-outline"
            title="Faire un retrait"
            description="Retirez de l'argent facilement sans composer de code."
            buttonLabel="Faire un retrait"
            variant="danger"
            onPress={() => router.push("/withdraw")}
          />
        </View>

        <Text style={styles.footerText}>© 2026 Skaneo. Tous droits réservés.</Text>
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
    justifyContent:"space-between"
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
});