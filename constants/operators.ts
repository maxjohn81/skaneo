import type { ImageSourcePropType } from "react-native";

export type OperatorId = "yas" | "orange" | "airtel";

export type Operator = {
  id: OperatorId;
  label: string;
  logo: ImageSourcePropType;
  bg: string;
};

export const OPERATORS: Operator[] = [
  { id: "yas", label: "Yas", logo: require("@/assets/images/yas.png"), bg: "#FFF4CC" },
  { id: "orange", label: "Orange", logo: require("@/assets/images/orange.png"), bg: "#FFE0D6" },
  { id: "airtel", label: "Airtel", logo: require("@/assets/images/airtel.png"), bg: "#FFE0E0" },
];