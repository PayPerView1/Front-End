import axios from "axios";
import api from "@/lib/axios";

/**
 * Login the user with email and password.
 * Returns the full response data on success.
 * Throws an Axios error on failure (to be handled by the caller).
 */
export const login = async (email, password) => {
  const response = await api.post("/api/v1/auth/login", { email, password });
  return response.data; // { success, message, data: { token, user } }
};

/**
 * Logout the current user.
 * Token is automatically attached by the Axios request interceptor.
 */
export const logout = async () => {
  const response = await api.post("/api/v1/auth/logout");
  return response.data;
};

/**
 * Helper to check if an error is an Axios error.
 */
export { axios };
