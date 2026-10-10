"use client";

import { createContext, useCallback, useContext, useState } from "react";
import { mockConversations } from "@/components/ConversationList";

const MessagesContext = createContext(null);

export function MessagesProvider({ children }) {
  const [isMessagesOpen, setIsMessagesOpen] = useState(false);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [isMaximized, setIsMaximized] = useState(false);
  const [readIds, setReadIds] = useState([]);
  const [conversations, setConversations] = useState(mockConversations);

  const addSystemNotification = useCallback(
    ({ title, text, orderId, status }) => {
      const notificationKey = orderId
        ? `${orderId}-${status || "update"}`
        : Date.now();
      const id = `system-${notificationKey}`;
      const message = {
        id: `${id}-message`,
        sender: title,
        text,
        isMe: false,
        time: new Date().toLocaleTimeString("ar-EG", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      setConversations((prev) => {
        if (
          orderId &&
          prev.some(
            (conversation) =>
              conversation.systemNotificationId === notificationKey
          )
        ) {
          return prev;
        }

        return [
          {
            id,
            name: title,
            lastMessage: text,
            unread: true,
            isOrder: true,
            color: "#ef4444",
            systemNotificationId: notificationKey,
            messages: [message],
          },
          ...prev,
        ];
      });
    },
    []
  );

  const toggleMessages = () => setIsMessagesOpen((prev) => !prev);
  const toggleMaximize = () => setIsMaximized((prev) => !prev);
  const closeMessages = () => {
    setIsMessagesOpen(false);
    setSelectedConversation(null);
    setIsMaximized(false);
  };

  const markAsRead = (id) => {
    setReadIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
  };

  const unreadCount = conversations.filter(
    (c) => c.unread && !readIds.includes(c.id)
  ).length;

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
        toggleMaximize,
        conversations,
        setConversations,
        addSystemNotification,
        readIds,
        markAsRead,
        unreadCount,
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