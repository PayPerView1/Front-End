
"use client";
import { createContext, useContext, useState, useEffect } from "react";
const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [isDark, setIsDark] = useState(true);
  const [isSystem, setIsSystem] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved === "system" || !saved) {
      // اتبع الجهاز
      const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      setIsDark(systemDark);
      setIsSystem(true);
      document.documentElement.classList.toggle("dark", systemDark);
    } else {
      const shouldBeDark = saved === "dark";
      setIsDark(shouldBeDark);
      setIsSystem(false);
      document.documentElement.classList.toggle("dark", shouldBeDark);
    }
  }, []);

  function toggleTheme() {
    setIsSystem(false);
    setIsDark((prev) => {
      const next = !prev;
      localStorage.setItem("theme", next ? "dark" : "light");
      document.documentElement.classList.toggle("dark", next);
      return next;
    });
  }

  function setSystemTheme() {
    const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    setIsDark(systemDark);
    setIsSystem(true);
    localStorage.setItem("theme", "system");
    document.documentElement.classList.toggle("dark", systemDark);
  }

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme, setSystemTheme, isSystem }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
