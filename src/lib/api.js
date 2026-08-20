const BASE_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/v1`;

function getToken() {
  if (typeof window !== "undefined") return localStorage.getItem("authToken");
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

function handleError(error) {
  const message =
    error.message || error.errors?.[0]?.message || "حدث خطأ في الطلب";
  throw new Error(message);
}

export const api = {
  // ===== Auth =====
  register: async (data) => {
    try {
      const isFormData = data instanceof FormData;
      const response = await fetch(`${BASE_URL}/auth/register`, {
        method: "POST",
        ...(isFormData
          ? { body: data }
          : {
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(data),
            }),
      });
      const result = await response.json();
      if (!response.ok) handleError(result);
      if (result.token && result.user) saveAuthData(result.token, result.user);
      return result;
    } catch (error) {
      console.error("Register Error:", error);
      throw error;
    }
  },

  verifyEmail: async (token) => {
    try {
      const response = await fetch(`${BASE_URL}/auth/verify-email/${token}`);
      const result = await response.json();
      if (!response.ok) handleError(result);
      return result;
    } catch (error) {
      console.error("Verify Email Error:", error);
      throw error;
    }
  },

  logout: async () => {
    try {
      const token = getToken();
      if (token) {
        await fetch(`${BASE_URL}/auth/logout`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        });
      }
    } catch (error) {
      console.error("Logout Error:", error);
    } finally {
      clearAuthData();
    }
  },

  // ===== Profile =====
  getProfile: async () => {
    try {
      const token = getToken();
      if (!token) throw new Error("لا يوجد توكن");
      const response = await fetch(`${BASE_URL}/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await response.json();
      if (!result.success) handleError(result);
      return result;
    } catch (error) {
      console.error("Get Profile Error:", error);
      throw error;
    }
  },

  updateProfile: async (data) => {
    try {
      const token = getToken();
      if (!token) throw new Error("لا يوجد توكن");
      const isFormData = data instanceof FormData;
      const response = await fetch(`${BASE_URL}/profile`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          ...(!isFormData && { "Content-Type": "application/json" }),
        },
        body: isFormData ? data : JSON.stringify(data),
      });
      const result = await response.json();
      if (!result.success) handleError(result);
      return result;
    } catch (error) {
      console.error("Update Profile Error:", error);
      throw error;
    }
  },

  // ===== Helpers =====
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
