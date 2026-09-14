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
    setCookie("user", JSON.stringify(user));
    localStorage.setItem("token", token);
    localStorage.setItem("authToken", token);
    localStorage.setItem("user", JSON.stringify(user));
  }
}

export function getSavedUser() {
  if (typeof window !== "undefined") {
    try {
      const cookieRaw = getCookie("user");
      if (cookieRaw && cookieRaw !== "undefined" && cookieRaw !== "null") {
        let parsed = JSON.parse(cookieRaw);
        if (typeof parsed === "string") {
          parsed = JSON.parse(parsed);
        }
        if (parsed && typeof parsed === "object") return parsed;
      }
      const localRaw = localStorage.getItem("user");
      if (localRaw && localRaw !== "undefined" && localRaw !== "null") {
        let parsed = JSON.parse(localRaw);
        if (typeof parsed === "string") {
          parsed = JSON.parse(parsed);
        }
        if (parsed && typeof parsed === "object") return parsed;
      }
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
    const isHtmlResponse =
      typeof error.response?.data === "string" &&
      error.response.data.includes("<html");

    if (error.response?.data && !isHtmlResponse) {
      console.error("[Axios Response Error]:", error.config?.url, error.response.status, error.response.data);
    } else if (isHtmlResponse) {
      console.warn(`[Axios Response Warning]: ${error.config?.url} returned ${error.response.status} HTML response`);
    }

    const skipRedirect = error.config?._skipAuthRedirect;
    const isLoginRequest =
      error.config &&
      error.config.url &&
      error.config.url.includes("/api/v1/auth/login");

    if (
      !skipRedirect &&
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
  const isHtml =
    typeof error.response?.data === "string" &&
    error.response.data.includes("<html");

  if (error.response?.data && !isHtml) {
    console.error(
      "API Error Response Data:",
      typeof error.response.data === "string"
        ? error.response.data
        : JSON.stringify(error.response.data, null, 2)
    );
  }
  const validationMessages = Array.isArray(error.response?.data?.errors)
    ? error.response.data.errors.map((item) => item?.message).filter(Boolean)
    : [];

  let message =
    validationMessages.join("\n") ||
    (typeof error.response?.data?.message === "string" ? error.response.data.message : null);

  if (!message) {
    if (error.response?.status === 404) {
      message = "الخدمة المطلوبة غير متوفرة حالياً على الخادم (404 Not Found)";
    } else if (typeof error.response?.data === "string" && error.response.data.includes("<html")) {
      message = "حدث خطأ غير متوقع في الخادم";
    } else {
      message = error.message || "حدث خطأ في الطلب";
    }
  }

  throw new Error(message);
}

export default axiosInstance;
