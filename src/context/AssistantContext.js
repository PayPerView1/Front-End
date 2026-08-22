"use client";

import { createContext, useContext, useState } from "react";

const AssistantContext = createContext(null);

export function AssistantProvider({ children }) {
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);

  const toggleAssistant = () => setIsAssistantOpen((prev) => !prev);
  const closeAssistant = () => setIsAssistantOpen(false);

  return (
    <AssistantContext.Provider
      value={{ isAssistantOpen, toggleAssistant, closeAssistant }}
    >
      {children}
    </AssistantContext.Provider>
  );
}

export function useAssistant() {
  const context = useContext(AssistantContext);
  if (!context) {
    throw new Error("useAssistant لازم يستخدم جوا AssistantProvider");
  }
  return context;
}