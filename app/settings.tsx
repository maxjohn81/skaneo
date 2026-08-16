import { Ionicons } from "@expo/vector-icons";
import { router, Tabs } from "expo-router";
import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { COLORS } from "@/constants/colors";
import { MULTISCAN_STORAGE_KEY, MULTISCAN_MAX_STORAGE_KEY, MULTISCAN_MAX_DEFAULT } from "@/constants/settings";
import { useTranslation, setLanguage } from "@/hooks/useTranslation";
import type { Language } from "@/constants/translations";


export default function SettingsScreen() {
    const [multiscan, setMultiscan] = useState(false);
    const [loaded, setLoaded] = useState(false);
    const [maxCount, setMaxCount] = useState(2);
    const { t, lang } = useTranslation();

    useEffect(() => {
        Promise.all([
            AsyncStorage.getItem(MULTISCAN_STORAGE_KEY),
            AsyncStorage.getItem(MULTISCAN_MAX_STORAGE_KEY),
        ]).then(([enabledValue, maxValue]) => {
            setMultiscan(enabledValue === "true");
            setMaxCount(maxValue ? parseInt(maxValue, 10) : MULTISCAN_MAX_DEFAULT);
            setLoaded(true);
        });
    }, []);

    const toggleMultiscan = async (value: boolean) => {
        setMultiscan(value);
        await AsyncStorage.setItem(MULTISCAN_STORAGE_KEY, String(value));
    };

    const changeMaxCount = async (value: number) => {
        setMaxCount(value);
        await AsyncStorage.setItem(MULTISCAN_MAX_STORAGE_KEY, String(value));
    };
    const handleLanguageChange = async (newLang: Language) => {
        await setLanguage(newLang);
    };

    if (!loaded) return null;

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
                    <Text style={styles.headerTitle}>{t("settings_title")}</Text>
                    <View style={{ width: 24 }} />
                </View>

                <ScrollView contentContainerStyle={styles.container}>
                    <Text style={styles.sectionLabel}>{t("settings_language")}</Text>

                    <View style={styles.card}>
                        <View style={styles.row}>
                            <View style={styles.rowIcon}>
                                <Ionicons name="language-outline" size={20} color={COLORS.text} />
                            </View>

                            <View style={{ flex: 1 }}>
                                <Text style={styles.rowTitle}>{t("settings_language")}</Text>
                            </View>

                            <View style={styles.segmentedControl}>
                                <TouchableOpacity
                                    style={[styles.segment, lang === "fr" && styles.segmentActive]}
                                    onPress={() => handleLanguageChange("fr")}
                                >
                                    <Text style={[styles.segmentText, lang === "fr" && styles.segmentTextActive]}>
                                        FR
                                    </Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={[styles.segment, lang === "mg" && styles.segmentActive]}
                                    onPress={() => handleLanguageChange("mg")}
                                >
                                    <Text style={[styles.segmentText, lang === "mg" && styles.segmentTextActive]}>
                                        MG
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                    <Text style={styles.sectionLabel}>Scan</Text>

                    <View style={styles.card}>
                        <View style={styles.row}>
                            <View style={styles.rowIcon}>
                                <Ionicons name="layers-outline" size={20} color={COLORS.text} />
                            </View>

                            <View style={{ flex: 1 }}>
                                <Text style={styles.rowTitle}>{t("settings_multiscan_title")}</Text>
                                <Text style={styles.rowDescription}>{t("settings_multiscan_description")}</Text>
                            </View>

                            <Switch
                                value={multiscan}
                                onValueChange={toggleMultiscan}
                                trackColor={{ false: COLORS.border, true: "#FFBF00" }}
                                thumbColor="#FFFFFF"
                            />
                        </View>
                        {multiscan && (
                            <View style={styles.subRow}>
                                <Text style={styles.subRowLabel}>{t("settings_multiscan_count")}</Text>
                                <View style={styles.segmentedControl}>
                                    {[2, 3].map((n) => (
                                        <TouchableOpacity
                                            key={n}
                                            style={[styles.segment, maxCount === n && styles.segmentActive]}
                                            onPress={() => changeMaxCount(n)}
                                        >
                                            <Text style={[styles.segmentText, maxCount === n && styles.segmentTextActive]}>
                                                {n}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </View>
                        )}
                    </View>
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
    subRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 14,
        paddingBottom: 14,
    },
    subRowLabel: {
        fontSize: 13,
        color: COLORS.muted,
        flex: 1,
    },
    segmentedControl: {
        flexDirection: "row",
        backgroundColor: COLORS.inputBg,
        borderRadius: 10,
        padding: 2,
    },
    segment: {
        paddingVertical: 6,
        paddingHorizontal: 16,
        borderRadius: 8,
    },
    segmentActive: {
        backgroundColor: "#FFBF00",
    },
    segmentText: {
        fontSize: 14,
        fontWeight: "700",
        color: COLORS.muted,
    },
    segmentTextActive: {
        color: "#FFFFFF",
    },
    headerTitle: { fontSize: 17, fontWeight: "700", color: COLORS.text },
    container: { paddingHorizontal: 20, paddingBottom: 40 },
    sectionLabel: {
        fontSize: 14,
        fontWeight: "700",
        color: COLORS.muted,
        textTransform: "uppercase",
        letterSpacing: 0.5,
        marginTop: 16,
        marginBottom: 10,
    },
    card: {
        backgroundColor: "#FFFFFF",
        borderRadius: 16,
        borderWidth: 1,
        borderColor: COLORS.border,
        overflow: "hidden",
    },
    row: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        padding: 14,
    },
    rowIcon: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: COLORS.inputBg,
        alignItems: "center",
        justifyContent: "center",
    },
    rowTitle: { fontSize: 15, fontWeight: "700", color: COLORS.text },
    rowDescription: {
        fontSize: 13,
        color: COLORS.muted,
        lineHeight: 18,
        marginTop: 2,
    },
});