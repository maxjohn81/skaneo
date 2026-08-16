import { router, Tabs } from "expo-router";
import { useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { setLanguage } from "@/hooks/useTranslation";
import type { Language } from "@/constants/translations";
import { TERMS_VERSION } from "@/constants/terms";
import { STORAGE_KEY } from "@/constants/storage_key";

const LANGUAGE_CHOSEN_KEY = "skaneo_language_chosen";

export default function LanguageSelectScreen() {
    const [selected, setSelected] = useState<Language | null>(null);
    const [submitting, setSubmitting] = useState(false);

    const handleContinue = async () => {
        if (!selected || submitting) return;
        setSubmitting(true);

        await setLanguage(selected);
        await AsyncStorage.setItem(LANGUAGE_CHOSEN_KEY, "true");

        const acceptedVersion = await AsyncStorage.getItem(STORAGE_KEY);
        if (acceptedVersion !== TERMS_VERSION) {
            router.replace("/terms");
        } else {
            router.replace("/");
        }
    };

    return (
        <>
            <Tabs.Screen options={{ headerShown: false }} />
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.container}>
                    <Image
                        source={require("@/assets/images/icon.png")}
                        style={styles.logo}
                        resizeMode="contain"
                    />

                    <Text style={styles.title}>Bienvenue sur Skaneo</Text>
                    <Text style={styles.subtitle}>Choisis ta langue · Safidio ny fiteninao</Text>

                    <View style={styles.options}>
                        <TouchableOpacity
                            style={[styles.option, selected === "fr" && styles.optionSelected]}
                            onPress={() => setSelected("fr")}
                            activeOpacity={0.8}
                        >
                            <Text style={styles.optionFlag}>🇫🇷</Text>
                            <Text style={styles.optionLabel}>Français</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.option, selected === "mg" && styles.optionSelected]}
                            onPress={() => setSelected("mg")}
                            activeOpacity={0.8}
                        >
                            <Text style={styles.optionFlag}>🇲🇬</Text>
                            <Text style={styles.optionLabel}>Malagasy</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.footer}>
                    <TouchableOpacity
                        style={[styles.continueButton, !selected && styles.continueButtonDisabled]}
                        onPress={handleContinue}
                        disabled={!selected || submitting}
                        activeOpacity={0.85}
                    >
                        <Text style={styles.continueButtonText}>
                            {selected === "mg" ? "Manohy" : "Continuer"}
                        </Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        </>
    );
}

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: "#FFFFFF" },
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 32,
        gap: 8,
    },
    logo: { width: 88, height: 88, marginBottom: 16 },
    title: {
        fontSize: 22,
        fontWeight: "800",
        color: "#0F172A",
        textAlign: "center",
    },
    subtitle: {
        fontSize: 14,
        color: "#64748B",
        textAlign: "center",
        marginBottom: 32,
    },
    options: {
        width: "100%",
        gap: 12,
    },
    option: {
        flexDirection: "row",
        alignItems: "center",
        gap: 14,
        borderWidth: 2,
        borderColor: "#E2E8F0",
        borderRadius: 16,
        paddingVertical: 18,
        paddingHorizontal: 20,
    },
    optionSelected: {
        borderColor: "#FFBF00",
        backgroundColor: "#FFF8E6",
    },
    optionFlag: { fontSize: 28 },
    optionLabel: { fontSize: 17, fontWeight: "700", color: "#0F172A" },
    footer: { padding: 20 },
    continueButton: {
        backgroundColor: "#FFBF00",
        paddingVertical: 16,
        borderRadius: 14,
        alignItems: "center",
    },
    continueButtonDisabled: { opacity: 0.4 },
    continueButtonText: { color: "#FFFFFF", fontSize: 16, fontWeight: "700" },
});