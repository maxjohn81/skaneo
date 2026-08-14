import { Ionicons } from "@expo/vector-icons";
import { Tabs, useRouter } from "expo-router";
import { Image, Linking, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AboutScreen() {
    const APP_VERSION = "1.0.0";

    const router = useRouter();

    const features = [
        {
            icon: "flash-outline",
            title: "Scan instantané",
            description: "Détecte automatiquement ta carte à gratter en quelques secondes",
        },
        {
            icon: "cash-outline",
            title: "Retrait Mobile Money",
            description: "Effectue un retrait sans mémoriser ni composer de code USSD",
        },
        {
            icon: "shield-checkmark-outline",
            title: "100% sécurisé",
            description: "Ton code secret n'est jamais demandé, stocké ou transmis par Skaneo",
        },
        {
            icon: "phone-portrait-outline",
            title: "Multi-opérateurs",
            description: "Compatible avec Yas, Orange et Airtel",
        },
    ];

    const links = [
        {
            icon: "mail-outline",
            label: "Nous contacter",
            onPress: () => Linking.openURL("mailto:rivoandriharisoa@gmail.com"),
        }
    ];

    return (
        <>

        <Tabs.Screen options={{headerShown:false}} />

            <SafeAreaView style={styles.safeArea}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                        <Ionicons name="chevron-back" size={24} color="#1E293B" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>À propos</Text>
                    <View style={styles.backButton} />
                </View>

                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    <View style={styles.logoSection}>
                        <View style={styles.logoWrapper}>
                            <Image
                                source={require('@/assets/images/icon.png')}
                                style={styles.logoImage}
                                resizeMode="contain"
                            />
                        </View>
                        <Text style={styles.appName}>Skaneo</Text>
                        <Text style={styles.version}>Version {APP_VERSION}</Text>
                    </View>

                    <Text style={styles.description}>
                        Skaneo simplifie tes opérations mobiles du quotidien : recharge de
                        crédit par scan de carte, et retrait Mobile Money sans code USSD à
                        mémoriser. Fini les erreurs de saisie et la perte de temps.
                    </Text>

                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Fonctionnalités</Text>
                        {features.map((feature, index) => (
                            <View key={index} style={styles.featureRow}>
                                <View style={styles.featureIcon}>
                                    <Ionicons name={feature.icon as any} size={22} color="#B8860B" />
                                </View>
                                <View style={styles.featureText}>
                                    <Text style={styles.featureTitle}>{feature.title}</Text>
                                    <Text style={styles.featureDescription}>{feature.description}</Text>
                                </View>
                            </View>
                        ))}
                    </View>

                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Opérateurs pris en charge</Text>
                        <View style={styles.badgeRow}>
                            <View style={[styles.badge, { backgroundColor: "#FFF7E0" }]}>
                                <Text style={[styles.badgeText, { color: "#B8860B" }]}>Yas</Text>
                            </View>
                            <View style={[styles.badge, { backgroundColor: "#FFE9E0" }]}>
                                <Text style={[styles.badgeText, { color: "#FF4400" }]}>Orange</Text>
                            </View>
                            <View style={[styles.badge, { backgroundColor: "#FFE0E0" }]}>
                                <Text style={[styles.badgeText, { color: "#E00000" }]}>Airtel</Text>
                            </View>
                        </View>
                    </View>

                    {/* <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Permission d'appel</Text>
                        <View style={styles.permissionNote}>
                            <Ionicons name="call-outline" size={20} color="#475569" style={{ marginTop: 1 }} />
                            <Text style={styles.permissionNoteText}>
                                Skaneo demande l'autorisation d'appel uniquement pour exécuter
                                directement les codes USSD nécessaires à tes opérations (recharge,
                                retrait). Aucun appel n'est passé en dehors de ces opérations, et
                                ton code secret reste géré exclusivement par ton opérateur.
                            </Text>
                        </View>
                    </View> */}

                    <View style={styles.section}>
                        <View style={styles.linksCard}>
                            {links.map((link, index) => (
                                <TouchableOpacity
                                    key={index}
                                    style={[
                                        styles.linkRow,
                                        index !== links.length - 1 && styles.linkRowBorder,
                                    ]}
                                    onPress={link.onPress}
                                    activeOpacity={0.6}
                                >
                                    <View style={styles.linkLeft}>
                                        <Ionicons name={link.icon as any} size={20} color="#475569" />
                                        <Text style={styles.linkLabel}>{link.label}</Text>
                                    </View>
                                    <Ionicons name="chevron-forward" size={18} color="#CBD5E1" />
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    <Text style={styles.footerText}>
                        © 2026 Skaneo. Tous droits réservés.
                    </Text>
                </ScrollView>
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

    backButton: {
        width: 40,
        height: 40,
        justifyContent: "center",
        alignItems: "center",
    },

    headerTitle: {
        fontSize: 17,
        fontWeight: "700",
        color: "#1E293B",
    },

    scrollContent: {
        paddingHorizontal: 24,
        paddingBottom: 40,
    },

    logoSection: {
        alignItems: "center",
        marginTop: 16,
        marginBottom: 24,
    },

    logoWrapper: {
        width: 100,
        height: 100,
        borderRadius: 24,
        backgroundColor: "#FFF9E6",
        justifyContent: "center",
        alignItems: "center",
        shadowColor: "#FFBF00",
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.2,
        shadowRadius: 12,
        elevation: 4,
    },

    logoImage: {
        width: 76,
        height: 76,
        borderRadius: 16,
    },

    appName: {
        fontSize: 24,
        fontWeight: "800",
        color: "#1E293B",
        marginTop: 12,
    },

    version: {
        fontSize: 13,
        color: "#94A3B8",
        marginTop: 2,
    },

    description: {
        fontSize: 15,
        color: "#475569",
        textAlign: "center",
        lineHeight: 22,
        marginBottom: 28,
    },

    section: {
        marginBottom: 24,
    },

    sectionTitle: {
        fontSize: 14,
        fontWeight: "700",
        color: "#94A3B8",
        textTransform: "uppercase",
        letterSpacing: 0.5,
        marginBottom: 12,
    },

    featureRow: {
        flexDirection: "row",
        alignItems: "flex-start",
        gap: 14,
        marginBottom: 16,
    },

    featureIcon: {
        width: 44,
        height: 44,
        borderRadius: 14,
        backgroundColor: "#FFF9E6",
        justifyContent: "center",
        alignItems: "center",
    },

    featureText: {
        flex: 1,
    },

    featureTitle: {
        fontSize: 15,
        fontWeight: "700",
        color: "#1E293B",
        marginBottom: 2,
    },

    featureDescription: {
        fontSize: 13,
        color: "#64748B",
        lineHeight: 18,
    },

    badgeRow: {
        flexDirection: "row",
        gap: 8,
    },

    badge: {
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 20,
    },

    badgeText: {
        fontSize: 13,
        fontWeight: "700",
    },

    permissionNote: {
        flexDirection: "row",
        gap: 10,
        backgroundColor: "#F8FAFC",
        borderRadius: 16,
        padding: 14,
    },

    permissionNoteText: {
        flex: 1,
        fontSize: 13,
        color: "#475569",
        lineHeight: 19,
    },

    linksCard: {
        backgroundColor: "#F8FAFC",
        borderRadius: 16,
        overflow: "hidden",
    },

    linkRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingVertical: 14,
        paddingHorizontal: 16,
    },

    linkRowBorder: {
        borderBottomWidth: 1,
        borderBottomColor: "#EEF2F6",
    },

    linkLeft: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
    },

    linkLabel: {
        fontSize: 15,
        color: "#1E293B",
        fontWeight: "600",
    },

    footerText: {
        textAlign: "center",
        fontSize: 12,
        color: "#94A3B8",
        lineHeight: 18,
        marginTop: 8,
    },
});