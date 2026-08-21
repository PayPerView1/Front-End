import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;
  if (!locale || !routing.locales.includes(locale as any)) {
    locale = routing.defaultLocale;
  }
  const defaultMessages = (await import("../../messages/en.json")).default;
  const localizedMessages = (await import(`../../messages/${locale}.json`)).default;

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
