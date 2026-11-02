export const locales = ["en", "pt-br"] as const;

export type Locale = (typeof locales)[number];

export interface Messages {
  siteTitle: string;
  description: string;
  homeLabel: string;
  languageSelector: string;
  englishOption: string;
  portugueseOption: string;
  labName: string;
  heroEyebrow: string;
  headingLine1: string;
  headingLine2: string;
  heroDescription: string;
  exploreLab: string;
  labStatus: string;
}

export const messages: Record<Locale, Messages> = {
  en: {
    siteTitle: "RICK — Experimental Systems Lab",
    description: "Systems, software and experiments by Rick.",
    homeLabel: "Rick Lab home",
    languageSelector: "Language",
    englishOption: "English",
    portugueseOption: "Portuguese (Brazil)",
    labName: "EXPERIMENTAL SYSTEMS LAB",
    heroEyebrow: "SYSTEMS / SOFTWARE / EXPERIMENTS",
    headingLine1: "Building systems,",
    headingLine2: "games and strange ideas.",
    heroDescription:
      "An evolving archive of projects, research and controlled experimentation.",
    exploreLab: "Explore the lab",
    labStatus: "LAB STATUS / INITIALIZING",
  },
  "pt-br": {
    siteTitle: "RICK — Laboratório Experimental de Sistemas",
    description:
      "Um arquivo em evolução de projetos, pesquisas e experimentação controlada.",
    homeLabel: "Início do laboratório Rick",
    languageSelector: "Idioma",
    englishOption: "Inglês",
    portugueseOption: "Português (Brasil)",
    labName: "LABORATÓRIO EXPERIMENTAL DE SISTEMAS",
    heroEyebrow: "SISTEMAS / SOFTWARE / EXPERIMENTOS",
    headingLine1: "Construindo sistemas,",
    headingLine2: "jogos e ideias estranhas.",
    heroDescription:
      "Um arquivo em evolução de projetos, pesquisas e experimentação controlada.",
    exploreLab: "Explorar o laboratório",
    labStatus: "STATUS DO LAB / INICIALIZANDO",
  },
};

export const documentLanguages: Record<Locale, string> = {
  en: "en",
  "pt-br": "pt-BR",
};

export function getMessages(locale: Locale): Messages {
  return messages[locale];
}
