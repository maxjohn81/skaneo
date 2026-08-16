import { useCallback, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Localization from "expo-localization";
import {
  Language,
  LANGUAGE_STORAGE_KEY,
  DEFAULT_LANGUAGE,
  translations,
} from "@/constants/translations";

let currentLanguage: Language = DEFAULT_LANGUAGE;
const listeners = new Set<(lang: Language) => void>();

async function initLanguage() {
  try {
    const stored = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (stored === "fr" || stored === "mg") {
      currentLanguage = stored;
    } else {
      const deviceLocale = Localization.getLocales()[0]?.languageCode;
      currentLanguage = deviceLocale === "mg" ? "mg" : "fr";
    }
    listeners.forEach((cb) => cb(currentLanguage));
  } catch {
    currentLanguage = DEFAULT_LANGUAGE;
  }
}

initLanguage();

export async function setLanguage(lang: Language) {
  currentLanguage = lang;
  await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
  listeners.forEach((cb) => cb(lang));
}

export function useTranslation() {
  const [lang, setLang] = useState<Language>(currentLanguage);

  useEffect(() => {
    listeners.add(setLang);
    return () => {
      listeners.delete(setLang);
    };
  }, []);

  const t = useCallback(
    (key: keyof typeof translations["fr"]) => {
      return translations[lang][key] ?? translations.fr[key] ?? key;
    },
    [lang]
  );

  return { t, lang, setLanguage };
}