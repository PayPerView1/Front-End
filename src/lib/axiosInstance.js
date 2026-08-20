import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://payperview-platform.onrender.com";

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// ─── Auth Helpers ─────────────────────────────────────────────────────────────

export function getToken() {
  if (typeof window !== "undefined") {
    return localStorage.getItem("token") || localStorage.getItem("authToken");
  }
  return null;
}

export function saveAuthData(token, user) {
  if (typeof window !== "undefined") {
    localStorage.setItem("token", token);
    localStorage.setItem("authToken", token);
    localStorage.setItem("user", JSON.stringify(user));
  }
}

export function getSavedUser() {
  if (typeof window !== "undefined") {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  }
  return null;
}

export function clearAuthData() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("token");
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
  }
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
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

// ─── Error Handler ────────────────────────────────────────────────────────────

export function handleError(error) {
  const message =
    error.response?.data?.message ||
    error.response?.data?.errors?.[0]?.message ||
    error.message ||
    "حدث خطأ في الطلب";
  throw new Error(message);
}

export default axiosInstance;
