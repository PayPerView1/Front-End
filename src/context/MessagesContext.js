"use client";

import { createContext, useContext, useState } from "react";

const MessagesContext = createContext(null);

export function MessagesProvider({ children }) {
  const [isMessagesOpen, setIsMessagesOpen] = useState(false);
  // إضافة حالة للمحادثة المحددة
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [isMaximized, setIsMaximized] = useState(false);

  const toggleMessages = () => setIsMessagesOpen((prev) => !prev);
  const toggleMaximize = () => setIsMaximized((prev) => !prev);
  const closeMessages = () => {
    setIsMessagesOpen(false);
    setSelectedConversation(null); // تصفير التحديد عند الإغلاق
    setIsMaximized(false);
  };

  return (
    <MessagesContext.Provider
      value={{ 
        isMessagesOpen, 
        toggleMessages, 
        closeMessages,
        selectedConversation,
        setSelectedConversation,
        isMaximized,
        setIsMaximized,
        toggleMaximize
      }}
    >
      {children}
    </MessagesContext.Provider>
  );
}

export function useMessages() {
  const context = useContext(MessagesContext);
  if (!context) {
    throw new Error("useMessages لازم يستخدم جوا MessagesProvider");
  }
  return context;
}