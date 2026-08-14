import { Ionicons } from "@expo/vector-icons";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { COLORS } from "@/constants/colors";
import type { Operator } from "@/constants/operators";

type Props = {
  operator: Operator;
  selected: boolean;
  onPress: () => void;
};

export function OperatorButton({ operator, selected, onPress }: Props) {
  return (
    <TouchableOpacity
      style={[styles.button, selected && styles.buttonSelected]}
      onPress={onPress}
      activeOpacity={0.8}
      accessibilityRole="button"
      accessibilityState={{ selected }}
      accessibilityLabel={`Opérateur ${operator.label}`}
    >
      {selected && (
        <View style={styles.checkBadge}>
          <Ionicons name="checkmark" size={12} color="#FFFFFF" />
        </View>
      )}
      <Image source={operator.logo} style={styles.logo} resizeMode="contain" />
      <Text style={styles.label}>{operator.label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flex: 1,
    alignItems: "center",
    gap: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 16,
    paddingVertical: 16,
  },
  buttonSelected: {
    borderColor: COLORS.danger,
    borderWidth: 2,
  },
  checkBadge: {
    position: "absolute",
    top: -6,
    right: -6,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: COLORS.danger,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1,
  },
  logo: {
    width: 62,
    height: 62,
    borderRadius: 7,
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: COLORS.text,
  },
});