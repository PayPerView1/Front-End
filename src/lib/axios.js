import axios from "axios";

const BASE_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/v1`;

const axiosInstance = axios.create({
  baseURL: BASE_URL,
});

//  Auth Helpers  

function getToken() {
  if (typeof window !== "undefined") {
    return localStorage.getItem("authToken");
  }

  return null;
}

function saveAuthData(token, user) {
  if (typeof window !== "undefined") {
    localStorage.setItem("authToken", token);
    localStorage.setItem("user", JSON.stringify(user));
  }
}

function getSavedUser() {
  if (typeof window !== "undefined") {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  }

  return null;
}

function clearAuthData() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
  }
}

//   Axios Interceptor  

axiosInstance.interceptors.request.use(
  (config) => {
    const token = getToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

//  Error Handler  

function handleError(error) {
  const message =
    error.response?.data?.message ||
    error.response?.data?.errors?.[0]?.message ||
    error.message ||
    "حدث خطأ في الطلب";

  throw new Error(message);
}

// API

export const api = {
  // Auth 

  register: async (data) => {
    try {
      const response = await axiosInstance.post("/auth/register", data);

      const result = response.data;

      if (result.token && result.user) {
        saveAuthData(result.token, result.user);
      }

      return result;
    } catch (error) {
      console.error("Register Error:", error);
      handleError(error);
    }
  },

  verifyEmail: async (token) => {
    try {
      const response = await axiosInstance.get(`/auth/verify-email/${token}`);

      return response.data;
    } catch (error) {
      console.error("Verify Email Error:", error);
      handleError(error);
    }
  },

  logout: async () => {
    try {
      const token = getToken();

      if (token) {
        await axiosInstance.post("/auth/logout");
      }
    } catch (error) {
      console.error("Logout Error:", error);
    } finally {
      clearAuthData();
    }
  },

  // Profile 

  getProfile: async () => {
    try {
      const response = await axiosInstance.get("/profile");

      return response.data;
    } catch (error) {
      console.error("Get Profile Error:", error);
      handleError(error);
    }
  },

  updateProfile: async (data) => {
    try {
      const response = await axiosInstance.put("/profile", data);

      return response.data;
    } catch (error) {
      console.error("Update Profile Error:", error);
      handleError(error);
    }
  },

  //Helpers
  getToken,

  getSavedUser,

  saveAuthData,

  clearAuthData,

  isAuthenticated: () => getToken() !== null,

  createFormData: (data) => {
    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        formData.append(key, value);
      }
    });

    return formData;
  },
};

export default api;
