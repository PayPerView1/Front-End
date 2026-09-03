"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { getSavedUser } from "@/lib/axiosInstance";

const UserContext = createContext(null);

/**
 * Provides current user data (including role) to all child components.
 * role: "CLIPPER" = صانع المحتوى | "BRAND" = صاحب الحملة
 */
export function UserProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const saved = getSavedUser();
    if (saved) setUser(saved);
  }, []);

  return <UserContext.Provider value={{ user, setUser }}>{children}</UserContext.Provider>;
}

export function useUser() {
  return useContext(UserContext);
}
