import { Ionicons } from "@expo/vector-icons";
import { router, Tabs } from "expo-router";
import { useState } from "react";
import {
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  useWindowDimensions,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS } from "@/constants/colors";
import { useTranslation } from "@/hooks/useTranslation";

export default function DeveloperScreen() {
  const { t } = useTranslation();
  const [imageVisible, setImageVisible] = useState(false);
  const colorScheme = useColorScheme();
  const { width: screenWidth } = useWindowDimensions();
  const isDark = colorScheme === "dark";
  const bubbleLeft = Math.max(0, screenWidth / 2 - 4);
  const bubbleMaxWidth = Math.max(148, screenWidth - bubbleLeft - 16);

  return (
    <>
    <Tabs.Screen options={{ headerShown: false }} />
      <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
          accessibilityRole="button"
          accessibilityLabel="Retour"
        >
          <Ionicons name="chevron-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t("developer_title")}</Text>
        <View style={styles.backButton} />
      </View>

      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.hero}>
          <TouchableOpacity
            onPress={() => setImageVisible(true)}
            accessibilityRole="button"
            accessibilityLabel="Afficher la photo du développeur"
            activeOpacity={0.85}
          >
            <Image
              source={require("@/assets/images/moi.png")}
              style={styles.profileImage}
              resizeMode="cover"
            />
          </TouchableOpacity>
          <View style={[styles.photoHintWrapper, { left: bubbleLeft, maxWidth: bubbleMaxWidth }]}>
            <View
              style={[
                styles.photoHintBubble,
                { maxWidth: bubbleMaxWidth },
                isDark && styles.photoHintBubbleDark,
              ]}
            >
              <Text style={[styles.photoHint, isDark && styles.photoHintDark]}>
                {t("developer_photo_hint")}
              </Text>
            </View>
            <View
              style={[
                styles.photoHintTail,
                isDark && styles.photoHintTailDark,
              ]}
            />
          </View>
          <Text style={styles.eyebrow}>{t("developer_created_by")}</Text>
          <Text style={styles.name}>Rivo Andriharisoa</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>{t("developer_story_title")}</Text>
          <Text style={styles.body}>{t("developer_story")}</Text>
        </View>

        <View style={styles.supportCard}>
          <Ionicons name="heart-outline" size={24} color="#B8860B" />
          <Text style={styles.supportTitle}>{t("developer_support_title")}</Text>
          <Text style={styles.supportText}>{t("developer_support_text")}</Text>
        </View>
      </ScrollView>
      </SafeAreaView>

      <Modal
        visible={imageVisible}
        transparent
        animationType="fade"
        statusBarTranslucent
        onRequestClose={() => setImageVisible(false)}
      >
        <View style={styles.imageModal}>
          <Pressable
            style={styles.modalBackdrop}
            onPress={() => setImageVisible(false)}
            accessibilityRole="button"
            accessibilityLabel="Fermer la photo"
          />
          <Image
            source={require("@/assets/images/moi.png")}
            style={styles.fullscreenImage}
            resizeMode="contain"
          />
          <TouchableOpacity
            onPress={() => setImageVisible(false)}
            style={styles.closeButton}
            accessibilityRole="button"
            accessibilityLabel="Retour"
            hitSlop={10}
          >
            <Ionicons name="close" size={28} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </Modal>
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
  backButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    color: COLORS.text,
    fontSize: 17,
    fontWeight: "700",
  },
  container: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  hero: {
    alignItems: "center",
    position: "relative",
    paddingTop: 74,
    paddingBottom: 28,
  },
  profileImage: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 3,
    borderColor: "#FFBF00",
  },
  photoHintWrapper: {
    position: "absolute",
    top: 30,
    alignSelf: "flex-start",
    zIndex: 2,
  },
  photoHintBubble: {
    alignSelf: "flex-start",
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    paddingHorizontal: 10,
    paddingVertical: 8,
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 5,
    elevation: 3,
  },
  photoHint: {
    color: COLORS.text,
    fontSize: 10,
    lineHeight: 14,
    textAlign: "left",
  },
  photoHintBubbleDark: {
    backgroundColor: "#1E293B",
  },
  photoHintDark: {
    color: "#FFFFFF",
  },
  photoHintTail: {
    position: "absolute",
    left: -6,
    bottom: 8,
    top:30,
    width: 15,
    height: 15,
    borderRadius: 6,
    backgroundColor: "#FFFFFF",
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  photoHintTailDark: {
    backgroundColor: "#1E293B",
  },
  imageModal: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#000000",
  },
  modalBackdrop: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: "rgba(0,0,0,0.96)",
  },
  fullscreenImage: {
    width: "100%",
    height: "100%",
  },
  closeButton: {
    position: "absolute",
    top: 48,
    right: 20,
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(15,23,42,0.75)",
  },
  eyebrow: {
    color: COLORS.muted,
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 6,
  },
  name: {
    color: COLORS.text,
    fontSize: 24,
    fontWeight: "800",
    textAlign: "center",
  },
  card: {
    backgroundColor: "#F8FAFC",
    borderRadius: 18,
    padding: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    color: COLORS.text,
    fontSize: 17,
    fontWeight: "700",
    marginBottom: 12,
  },
  body: {
    color: "#475569",
    fontSize: 15,
    lineHeight: 24,
  },
  supportCard: {
    alignItems: "center",
    backgroundColor: "#FFF7E0",
    borderRadius: 18,
    padding: 22,
  },
  supportTitle: {
    color: COLORS.text,
    fontSize: 17,
    fontWeight: "700",
    marginTop: 10,
    marginBottom: 8,
    textAlign: "center",
  },
  supportText: {
    color: "#475569",
    fontSize: 14,
    lineHeight: 22,
    textAlign: "center",
  },
});
