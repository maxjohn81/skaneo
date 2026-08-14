import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";
import { COLORS } from "@/constants/colors";

type Props = {
  title: string;
  description: string;
};

export function SecurityBanner({ title, description }: Props) {
  return (
    <View style={styles.banner}>
      <View style={styles.iconWrap}>
        <Ionicons name="shield-checkmark" size={22} color={COLORS.danger} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    flexDirection: "row",
    gap: 12,
    backgroundColor: COLORS.dangerLight,
    borderRadius: 16,
    padding: 14,
    marginBottom: 20,
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#FBD9D2",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.text,
  },
  description: {
    fontSize: 13,
    color: COLORS.muted,
    marginTop: 2,
  },
});