"use client";

import { useEffect } from "react";

const translations = {
  en: {
    tagline: "Curiosity Answered.",
    description:
      "Ask better questions. Follow ideas further. Curiosity answered.",
  },

  hi: {
    tagline: "जिज्ञासा का उत्तर।",
    description:
      "बेहतर सवाल पूछें। विचारों को आगे बढ़ाएँ। जिज्ञासा का उत्तर पाएँ।",
  },

  es: {
    tagline: "Curiosidad respondida.",
    description:
      "Haz mejores preguntas. Sigue las ideas más lejos. Curiosidad respondida.",
  },

  fr: {
    tagline: "La curiosité, éclairée.",
    description:
      "Posez de meilleures questions. Allez plus loin dans vos idées.",
  },

  de: {
    tagline: "Neugier beantwortet.",
    description:
      "Stelle bessere Fragen. Verfolge Ideen weiter. Neugier beantwortet.",
  },

  ja: {
    tagline: "好奇心に答える。",
    description:
      "より良い質問を。アイデアをさらに深く。好奇心に答える。",
  },

  zh: {
    tagline: "解答好奇心。",
    description:
      "提出更好的问题。深入探索想法。解答你的好奇心。",
  },
} as const;

export type Language = keyof typeof translations;

export function getLanguage(): Language {
  const language = navigator.language.toLowerCase();

  if (language.startsWith("hi")) return "hi";
  if (language.startsWith("es")) return "es";
  if (language.startsWith("fr")) return "fr";
  if (language.startsWith("de")) return "de";
  if (language.startsWith("ja")) return "ja";
  if (language.startsWith("zh")) return "zh";

  return "en";
}

export function getTranslation() {
  return translations[getLanguage()];
}

export default function LanguageProvider() {
  useEffect(() => {
    const language = getLanguage();

    document.documentElement.lang = language;

    const translation = translations[language];

    document.title = `Quero. | ${translation.tagline}`;

    const description = document.querySelector(
      'meta[name="description"]'
    );

    description?.setAttribute(
      "content",
      translation.description
    );
  }, []);

  return null;
}