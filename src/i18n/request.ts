import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";
import ar from "../../messages/ar.json";
import de from "../../messages/de.json";
import en from "../../messages/en.json";
import es from "../../messages/es.json";
import fr from "../../messages/fr.json";
import it from "../../messages/it.json";
import ja from "../../messages/ja.json";
import nl from "../../messages/nl.json";
import pl from "../../messages/pl.json";
import pt from "../../messages/pt.json";
import tr from "../../messages/tr.json";
import zh from "../../messages/zh.json";

const messagesByLocale = { ar, de, en, es, fr, it, ja, nl, pl, pt, tr, zh };

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;
  if (!locale || !routing.locales.includes(locale as any)) {
    locale = routing.defaultLocale;
  }
  const defaultMessages = messagesByLocale.en;
  const localizedMessages = messagesByLocale[locale as keyof typeof messagesByLocale];

  return {
    locale,
    messages: mergeMessages(defaultMessages, localizedMessages),
  };
});

function mergeMessages(defaultMessages: Record<string, any>, localizedMessages: Record<string, any>) {
  const merged = { ...defaultMessages };

  for (const [key, value] of Object.entries(localizedMessages)) {
    merged[key] =
      value && typeof value === "object" && !Array.isArray(value)
        ? mergeMessages(defaultMessages[key] || {}, value as Record<string, any>)
        : value;
  }

  return merged;
}
