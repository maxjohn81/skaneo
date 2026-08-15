import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, Tabs } from "expo-router";
import { useState } from "react";
import {
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { TERMS_CONTENT, TERMS_VERSION } from "@/constants/terms";
import { STORAGE_KEY } from "@/constants/storage_key";



export default function TermsScreen() {
    const [accepted, setAccepted] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const handleContinue = async () => {
        if (!accepted || submitting) return;
        setSubmitting(true);

        try {
            await AsyncStorage.setItem(STORAGE_KEY, TERMS_VERSION);
            router.replace("/");
        } catch (e) {
            console.log("Erreur sauvegarde acceptation CGU:", e);
            setSubmitting(false);
        }
    };

    return (
        <>
            <Tabs.Screen options={{ headerShown: false }} />

            <SafeAreaView style={styles.safeArea}>
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Conditions d'utilisation</Text>
                </View>

                <ScrollView
                    style={styles.scroll}
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={true}
                >
                    <Text style={styles.body}>{TERMS_CONTENT}</Text>
                </ScrollView>

                <View style={styles.footer}>
                    <Pressable
                        style={styles.checkboxRow}
                        onPress={() => setAccepted((prev) => !prev)}
                        accessibilityRole="checkbox"
                        accessibilityState={{ checked: accepted }}
                        accessibilityLabel="J'accepte les conditions d'utilisation"
                    >
                        <View style={[styles.checkbox, accepted && styles.checkboxChecked]}>
                            {accepted && <Ionicons name="checkmark" size={16} color="#FFFFFF" />}
                        </View>
                        <Text style={styles.checkboxLabel}>
                            J'ai lu et j'accepte les conditions d'utilisation de Skaneo.
                        </Text>
                    </Pressable>

                    <TouchableOpacity
                        style={[styles.continueButton, !accepted && styles.continueButtonDisabled]}
                        onPress={handleContinue}
                        disabled={!accepted || submitting}
                        activeOpacity={0.85}
                        accessibilityRole="button"
                        accessibilityLabel="Continuer"
                    >
                        <Text style={styles.continueButtonText}>
                            {submitting ? "Chargement..." : "Continuer"}
                        </Text>
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
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: "#E2E8F0",
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: "700",
        color: "#0F172A",
        textAlign: "center",
    },
    scroll: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingVertical: 20,
    },
    body: {
        fontSize: 14,
        color: "#334155",
        lineHeight: 22,
    },
    footer: {
        padding: 20,
        borderTopWidth: 1,
        borderTopColor: "#E2E8F0",
        gap: 16,
    },
    checkboxRow: {
        flexDirection: "row",
        alignItems: "flex-start",
        gap: 12,
    },
    checkbox: {
        width: 22,
        height: 22,
        borderRadius: 6,
        borderWidth: 2,
        borderColor: "#CBD5E1",
        alignItems: "center",
        justifyContent: "center",
        marginTop: 1,
    },
    checkboxChecked: {
        backgroundColor: "#FFBF00",
        borderColor: "#FFBF00",
    },
    checkboxLabel: {
        flex: 1,
        fontSize: 14,
        color: "#334155",
        lineHeight: 20,
    },
    continueButton: {
        backgroundColor: "#FFBF00",
        paddingVertical: 16,
        borderRadius: 14,
        alignItems: "center",
    },
    continueButtonDisabled: {
        opacity: 0.4,
    },
    continueButtonText: {
        color: "#FFFFFF",
        fontSize: 16,
        fontWeight: "700",
    },
});