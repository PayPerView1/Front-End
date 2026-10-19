const PLATFORM_HOSTS = {
  tiktok: ["tiktok.com", "vm.tiktok.com"],
  instagram: ["instagram.com"],
  youtube: ["youtube.com", "youtu.be"],
};

const UNSUPPORTED_HOSTS = ["facebook.com", "fb.watch", "fb.com"];

const matchesHost = (hostname, hosts) =>
  hosts.some((h) => hostname === h || hostname.endsWith(`.${h}`));

// returns { valid: true } or { valid: false, reason }
// reason: "empty" | "invalidUrl" | "unsupportedPlatform" | "platformMismatch"
export function validateLink(value, platform) {
  const raw = value.trim();
  if (!raw) return { valid: false, reason: "empty" };

  let url;
  try {
    url = new URL(raw);
  } catch {
    return { valid: false, reason: "invalidUrl" };
  }

  const host = url.hostname.replace(/^www\./, "").toLowerCase();

  if (matchesHost(host, UNSUPPORTED_HOSTS)) {
    return { valid: false, reason: "unsupportedPlatform" };
  }

  const isKnown = Object.values(PLATFORM_HOSTS).some((h) => matchesHost(host, h));
  if (!isKnown) return { valid: false, reason: "invalidUrl" };

  if (!matchesHost(host, PLATFORM_HOSTS[platform])) {
    return { valid: false, reason: "platformMismatch" };
  }

  return { valid: true };
}