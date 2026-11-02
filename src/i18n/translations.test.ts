import { describe, expect, it } from "vitest";
import {
  documentLanguages,
  getMessages,
  locales,
  messages,
  type Locale,
} from "./translations";

describe("homepage internationalization", () => {
  it("supports English and Brazilian Portuguese", () => {
    expect(locales).toEqual(["en", "pt-br"]);
  });

  it("provides complete, non-empty messages for each locale", () => {
    for (const locale of locales) {
      const localeMessages = messages[locale];
      expect(Object.keys(localeMessages)).toHaveLength(
        Object.keys(messages.en).length,
      );

      for (const value of Object.values(localeMessages)) {
        expect(value.trim()).not.toBe("");
      }
    }
  });

  it("uses the correct document language tags", () => {
    const expected: Record<Locale, string> = {
      en: "en",
      "pt-br": "pt-BR",
    };

    expect(documentLanguages).toEqual(expected);
  });

  it("returns the selected locale messages", () => {
    expect(getMessages("pt-br").exploreLab).toBe("Explorar o laboratório");
    expect(getMessages("en").exploreLab).toBe("Explore the lab");
  });
});
