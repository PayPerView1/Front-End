// المنصات المدعومة وروابطها المقبولة
export const PLATFORM_HOSTS = {
  tiktok: ["tiktok.com", "vm.tiktok.com"],
  instagram: ["instagram.com"],
  youtube: ["youtube.com", "youtu.be"],
};

// منصات شائعة غير مدعومة للتعرف التلقائي عليها وعرض اسمها للمستخدم
const KNOWN_UNSUPPORTED = [
  {
    key: "telegram",
    names: { ar: "تليجرام", en: "Telegram" },
    matches: ["telegram.org", "telegram.me", "t.me", "telegram", "تليجرام", "تيليجرام", "تلغرام"],
  },
  {
    key: "snapchat",
    names: { ar: "سناب شات", en: "Snapchat" },
    matches: ["snapchat.com", "snap.com", "snapchat", "سناب شات", "سناب"],
  },
  {
    key: "facebook",
    names: { ar: "فيسبوك", en: "Facebook" },
    matches: ["facebook.com", "fb.watch", "fb.com", "facebook", "فيسبوك", "فيس بوك"],
  },
  {
    key: "twitter",
    names: { ar: "إكس (تويتر)", en: "X (Twitter)" },
    matches: ["twitter.com", "x.com", "t.co", "twitter", "تويتر", "منصة إكس"],
  },
  {
    key: "threads",
    names: { ar: "ثريدز", en: "Threads" },
    matches: ["threads.net", "threads", "ثريدز"],
  },
  {
    key: "linkedin",
    names: { ar: "لينكد إن", en: "LinkedIn" },
    matches: ["linkedin.com", "linkedin", "لينكد ان", "لينكد إن"],
  },
  {
    key: "pinterest",
    names: { ar: "بينترست", en: "Pinterest" },
    matches: ["pinterest.com", "pin.it", "pinterest", "بينترست"],
  },
  {
    key: "reddit",
    names: { ar: "ريديت", en: "Reddit" },
    matches: ["reddit.com", "redd.it", "reddit", "ريديت"],
  },
  {
    key: "vimeo",
    names: { ar: "فيميو", en: "Vimeo" },
    matches: ["vimeo.com", "vimeo", "فيميو"],
  },
  {
    key: "twitch",
    names: { ar: "تويتش", en: "Twitch" },
    matches: ["twitch.tv", "twitch", "تويتش"],
  },
  {
    key: "whatsapp",
    names: { ar: "واتساب", en: "WhatsApp" },
    matches: ["whatsapp.com", "wa.me", "whatsapp", "واتساب"],
  },
  {
    key: "kwai",
    names: { ar: "كواي", en: "Kwai" },
    matches: ["kwai.com", "kuaishou.com", "kwai", "كواي"],
  },
  {
    key: "dailymotion",
    names: { ar: "ديلي موشن", en: "Dailymotion" },
    matches: ["dailymotion.com", "dailymotion", "ديلي موشن"],
  },
];

const matchesHost = (hostname, hosts) =>
  hosts.some((h) => hostname === h || hostname.endsWith(`.${h}`));

/**
 * دالة لاستخراج اسم المنصة من الرابط أو النص المدخل
 */
export function detectPlatform(text, locale = "ar") {
  if (!text) return null;
  const lower = text.toLowerCase().trim();

  // فحص المنصات المعروفة أولاً
  for (const item of KNOWN_UNSUPPORTED) {
    if (item.matches.some((m) => lower.includes(m.toLowerCase()))) {
      return item.names[locale] || item.names.ar;
    }
  }

  // محاولة استخراج اسم النطاق إذا كان رابط صالح
  try {
    const withProto = /^https?:\/\//i.test(text.trim()) ? text.trim() : `https://${text.trim()}`;
    const url = new URL(withProto);
    if (url.hostname && url.hostname.includes(".")) {
      const parts = url.hostname.replace(/^www\./, "").split(".");
      if (parts.length >= 2) {
        const domain = parts[0];
        return domain.charAt(0).toUpperCase() + domain.slice(1);
      }
    }
  } catch {
    // ليس رابط صالح
  }

  return null;
}

// returns { valid: true } or { valid: false, reason, platformName }
// reason: "empty" | "invalidUrl" | "unsupportedPlatform" | "platformMismatch"
export function validateLink(value, platform, locale = "ar") {
  const raw = value.trim();
  if (!raw) return { valid: false, reason: "empty" };

  const detected = detectPlatform(raw, locale);

  let url;
  try {
    const withProto = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
    url = new URL(withProto);
    if (!url.hostname || !url.hostname.includes(".")) {
      if (detected) {
        return { valid: false, reason: "unsupportedPlatform", platformName: detected };
      }
      return { valid: false, reason: "invalidUrl" };
    }
  } catch {
    if (detected) {
      return { valid: false, reason: "unsupportedPlatform", platformName: detected };
    }
    return { valid: false, reason: "invalidUrl" };
  }

  const host = url.hostname.replace(/^www\./, "").toLowerCase();

  // التحقق هل الرابط يتبع لأي منصة مدعومة ضمن الخيارات المتاحة
  const isSupportedPlatform = Object.values(PLATFORM_HOSTS).some((hosts) =>
    matchesHost(host, hosts)
  );

  // إذا كانت المنصة غير مدعومة
  if (!isSupportedPlatform) {
    return {
      valid: false,
      reason: "unsupportedPlatform",
      platformName: detected || null,
    };
  }

  // إذا كانت المنصة مدعومة ولكن لا تطابق المنصة التي اختارها المستخدم
  if (platform && !matchesHost(host, PLATFORM_HOSTS[platform])) {
    return { valid: false, reason: "platformMismatch" };
  }

  return { valid: true };
}