export type ShortcutOperator = "orange" | "airtel" | "yas";

export type Shortcut = {
  id: string;
  operator: ShortcutOperator;
  label: string;
  ussd: string;
};

export const SHORTCUTS_STORAGE_KEY = "skaneo_custom_shortcuts";