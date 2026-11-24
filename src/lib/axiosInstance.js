import axios from "axios";

const configuredApiUrl = process.env.NEXT_PUBLIC_API_URL?.trim();
const developmentDefault =
  process.env.NODE_ENV === "development" ? "http://localhost:5000" : "";

function normalizeApiBaseUrl(value) {
  if (!value) return "";

  let url;
  try {
    url = new URL(value);
  } catch {
    throw new Error("NEXT_PUBLIC_API_URL must be an absolute HTTP(S) origin.");
  }

  if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password) {
    throw new Error("NEXT_PUBLIC_API_URL must be an HTTP(S) origin without credentials.");
  }
  if (url.pathname !== "/" || url.search || url.hash) {
    throw new Error("NEXT_PUBLIC_API_URL must contain only the Main Backend origin, without an API path.");
  }

  return url.origin.replace(/\/$/, "");
}

export const API_BASE_URL = normalizeApiBaseUrl(configuredApiUrl || developmentDefault);
export const API_BASE_URL_CONFIGURED = Boolean(API_BASE_URL);
export const AI_REQUEST_TIMEOUT_MS = 100_000;

const axiosInstance = axios.create({
  baseURL: API_BASE_URL || undefined,
  timeout: 30_000,
  headers: { Accept: "application/json" },
});

// ─── Auth Helpers ─────────────────────────────────────────────────────────────

function getJwtExpiration(token) {
  try {
    const payloadPart = token.split(".")[1];
    if (!payloadPart || typeof atob !== "function") return null;

    const base64 = payloadPart.replace(/-/g, "+").replace(/_/g, "/");
    const binary = atob(base64.padEnd(Math.ceil(base64.length / 4) * 4, "="));
    const bytes = Uint8Array.from(binary, (character) => character.charCodeAt(0));
    const payload = JSON.parse(new TextDecoder().decode(bytes));
    return Number.isFinite(payload?.exp) ? payload.exp * 1000 : null;
  } catch {
    return null;
  }
}

export function getToken() {
  if (typeof window === "undefined") return null;

  const token =
    getCookie("authToken") ||
    localStorage.getItem("authToken") ||
    localStorage.getItem("token");

  if (!token) return null;

  const expiresAt = getJwtExpiration(token);
  if (expiresAt !== null && expiresAt <= Date.now()) {
    clearAuthData();
    return null;
  }

  return token;
}

export function saveAuthData(token, user) {
  if (typeof window === "undefined" || !token) return;

  const expiresAt = getJwtExpiration(token);
  const maxAge = expiresAt
    ? Math.max(0, Math.floor((expiresAt - Date.now()) / 1000))
    : 7 * 24 * 60 * 60;

  setCookie("authToken", token, maxAge);
  // The cookie is kept for the page gate. Remove the legacy duplicate JWT
  // entries from localStorage while retaining a fallback for old sessions.
  deleteCookie("user");
  localStorage.removeItem("token");
  localStorage.removeItem("authToken");
  localStorage.setItem("user", JSON.stringify(user || {}));
}

export function getSavedUser() {
  if (typeof window === "undefined") return null;

  for (const raw of [localStorage.getItem("user"), getCookie("user")]) {
    if (!raw || raw === "undefined" || raw === "null") continue;
    try {
      const parsed = JSON.parse(raw);
      const user = typeof parsed === "string" ? JSON.parse(parsed) : parsed;
      if (user && typeof user === "object") return user;
    } catch {
      // A malformed cached profile is ignored; the next protected layout can refetch it.
    }
  }
  return null;
}

export function clearAuthData() {
  if (typeof window === "undefined") return;

  deleteCookie("authToken");
  deleteCookie("user");
  localStorage.removeItem("token");
  localStorage.removeItem("authToken");
  localStorage.removeItem("user");
}

function getCookie(name) {
  if (typeof document === "undefined") return null;
  const cookie = document.cookie
    .split("; ")
    .find((item) => item.startsWith(`${name}=`));
  if (!cookie) return null;

  const value = cookie.slice(name.length + 1);
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

function setCookie(name, value, maxAge) {
  if (typeof document === "undefined") return;
  const secure = window.location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${name}=${encodeURIComponent(value)}; Path=/; Max-Age=${maxAge}; SameSite=Lax${secure}`;
}

function deleteCookie(name) {
  if (typeof document === "undefined") return;
  const secure = window.location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${name}=; Path=/; Max-Age=0; SameSite=Lax${secure}`;
}

export function isAuthenticated() {
  return Boolean(getToken());
}

function configurationError() {
  const error = new Error(
    "The Main Backend URL is not configured. Set NEXT_PUBLIC_API_URL to the backend origin before building the app."
  );
  error.code = "API_CONFIGURATION_ERROR";
  return error;
}

// Attach the current JWT to all authenticated requests.
axiosInstance.interceptors.request.use(
  (config) => {
    if (!API_BASE_URL_CONFIGURED) throw configurationError();

    const token = getToken();
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Clear expired/invalid sessions and return the user to the localized login page.
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const isLoginRequest = error.config?.url?.includes("/api/v1/auth/login");
    if (
      error.response?.status === 401 &&
      !error.config?._skipAuthRedirect &&
      !isLoginRequest &&
      typeof window !== "undefined"
    ) {
      clearAuthData();
      const locale = document.documentElement.lang || "ar";
      window.location.assign(`/${locale}/login`);
    }
    return Promise.reject(error);
  }
);

function parseErrorResponseData(data) {
  if (data && typeof data === "object") return data;
  if (typeof data !== "string") return {};
  if (/^\s*(?:<!doctype html|<html)/i.test(data)) return {};

  try {
    const parsed = JSON.parse(data);
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return { message: data };
  }
}

export function handleError(error) {
  const responseData = parseErrorResponseData(error?.response?.data);
  const validationMessages = Array.isArray(responseData.errors)
    ? responseData.errors.map((item) => item?.message).filter(Boolean)
    : [];

  const status = error?.response?.status;
  let message =
    validationMessages.join("\n") ||
    (typeof responseData.message === "string" ? responseData.message : "");

  if (!message && error?.code === "API_CONFIGURATION_ERROR") {
    message = error.message;
  } else if (!message && ["ECONNABORTED", "ETIMEDOUT"].includes(error?.code)) {
    message = "The request timed out. Please try again.";
  } else if (!message && !error?.response) {
    message = "Could not reach the Main Backend. Check your connection and try again.";
  } else if (!message && status === 401) {
    message = "Your session has expired. Please sign in again.";
  } else if (!message && status === 403) {
    message = "This account is not allowed to perform this action.";
  } else if (!message && status === 404) {
    message = "The requested service is not available.";
  } else if (!message && status >= 500) {
    message = "The Main Backend could not complete the request. Please try again.";
  } else if (!message) {
    message = error?.message || "The request failed.";
  }

  const normalized = new Error(message);
  normalized.code =
    responseData.code ||
    (status === 401 ? "UNAUTHORIZED" : undefined) ||
    (status === 403 ? "FORBIDDEN" : undefined) ||
    (error?.code === "ECONNABORTED" || error?.code === "ETIMEDOUT"
      ? "TIMEOUT"
      : undefined) ||
    (!error?.response ? "NETWORK_ERROR" : undefined);
  normalized.status = status;
  normalized.response = error?.response;
  normalized.details = responseData.details;
  normalized.data = responseData;
  throw normalized;
}

export default axiosInstance;
