import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://payperview-platform.onrender.com";

const axiosInstance = axios.create({
  baseURL: BASE_URL,
});

// ─── Auth Helpers ─────────────────────────────────────────────────────────────

export function getToken() {
  if (typeof window !== "undefined") {
    return getCookie("authToken") || localStorage.getItem("token") || localStorage.getItem("authToken");
  }
  return null;
}

export function saveAuthData(token, user) {
  if (typeof window !== "undefined") {
    setCookie("authToken", token);
    setCookie("user", user);
    localStorage.setItem("token", token);
    localStorage.setItem("authToken", token);
    localStorage.setItem("user", JSON.stringify(user));
  }
}

export function getSavedUser() {
  if (typeof window !== "undefined") {
    const user = getCookie("user") || localStorage.getItem("user");
    try {
      return user ? JSON.parse(user) : null;
    } catch {
      return null;
    }
  }
  return null;
}

export function clearAuthData() {
  if (typeof window !== "undefined") {
    deleteCookie("authToken");
    deleteCookie("user");
    localStorage.removeItem("token");
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
  }
}

function getCookie(name) {
  const value = document.cookie
    .split("; ")
    .find((cookie) => cookie.startsWith(`${name}=`))
    ?.split("=")
    .slice(1)
    .join("=");
  return value ? decodeURIComponent(value) : null;
}

function setCookie(name, value) {
  document.cookie = `${name}=${encodeURIComponent(
    typeof value === "string" ? value : JSON.stringify(value),
  )}; Path=/; Max-Age=604800; SameSite=Lax`;
}

function deleteCookie(name) {
  document.cookie = `${name}=; Path=/; Max-Age=0; SameSite=Lax`;
}

export function isAuthenticated() {
  return getToken() !== null;
}

// ─── Request Interceptor (Attach Token) ───────────────────────────────────────

axiosInstance.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// ─── Response Interceptor (Redirect on Unauth) ───────────────────────────────

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // طباعة تفاصيل الخطأ للتشخيص في الكونسول
    if (error.response?.data) {
      console.error("[Axios Response Error]:", error.config.url, error.response.status, error.response.data);
    }

    const isLoginRequest =
      error.config &&
      error.config.url &&
      error.config.url.includes("/api/v1/auth/login");
    if (
      !isLoginRequest &&
      error.response &&
      (error.response.status === 401 || error.response.status === 403)
    ) {
      if (typeof window !== "undefined") {
        clearAuthData();
        const locale = document.documentElement.lang || "ar";
        window.location.href = `/${locale}/login`;
      }
    }
    return Promise.reject(error);
  }
);

// ─── Error Handler ────────────────────────────────────────────────────────────

export function handleError(error) {
  if (error.response?.data) {
    console.error("API Error Response Data:", JSON.stringify(error.response.data, null, 2));
  }
  const message =
    error.response?.data?.message ||
    error.response?.data?.errors?.[0]?.message ||
    error.message ||
    "حدث خطأ في الطلب";
  throw new Error(message);
}

export default axiosInstance;
