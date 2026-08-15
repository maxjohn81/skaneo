export type ShortcutOperator = "yas" | "airtel";

export type Shortcut = {
  id: string;
  operator: ShortcutOperator;
  label: string;
  ussd: string;
};

export const SHORTCUTS: Shortcut[] = [
  { id: "yas-mora-one", operator: "yas", label: "Mora One", ussd: "#322*21#" },
  { id: "yas-mora-500", operator: "yas", label: "Mora 500", ussd: "#322*20#" },
  { id: "yas-yellow-one", operator: "yas", label: "Yellow One", ussd: "#322*64#" },
  { id: "yas-yellow-500", operator: "yas", label: "Yellow 500", ussd: "#322*65#" },
  { id: "airtel-mlay-1000", operator: "airtel", label: "Mlay 1000", ussd: "*114*01000#" },
  { id: "airtel-mlay-500", operator: "airtel", label: "Mlay 500", ussd: "*114*0500#" },
];