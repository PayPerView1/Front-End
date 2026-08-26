"use client";

import { useEffect } from "react";
import { useLocale } from "next-intl";
import { useMessages } from "@/context/MessagesContext";
import ConversationList from "@/components/ConversationList";
import ChatWindow from "@/components/ChatWindow";
import EmptyState from "@/components/EmptyState";
import { useTheme } from "@/context/ThemeContext";

export default function MessagesPanel({ onConversationChange, side }) {
  const locale = useLocale();
  const { isDark } = useTheme();
  const {
    isMessagesOpen,
    closeMessages,
    isMaximized,
    selectedConversation,
    setSelectedConversation,
  } = useMessages();

  // إبلاغ الـ Shell بتغيير حالة المحادثة
  useEffect(() => {
    onConversationChange?.(!!selectedConversation);
  }, [selectedConversation, onConversationChange]);

  // تصفير عند الإغلاق
  useEffect(() => {
    if (!isMessagesOpen) setSelectedConversation(null);
  }, [isMessagesOpen]);

  if (!isMessagesOpen) return null;

  const isFullWidth = isMaximized;

  const handleSelect = (conv) => {
    setSelectedConversation(conv);
  };

  const panelSide = side || (locale === "ar" ? "left" : "right");
  const sideClass = isFullWidth
    ? (locale === "ar"
        ? "left-0 right-0 lg:right-[260px] border-b"
        : "right-0 left-0 lg:left-[260px] border-b")
    : (panelSide === "left"
        ? "left-0 border-r"
        : "right-0 border-l");

  return (
    <aside
      className={`messages-panel fixed top-[64px] h-[calc(100vh-64px)] z-40 flex ${isDark ? "border-white/10" : "border-[#E5E5E5]"} ${sideClass}`}
      data-side={panelSide}
      dir={locale === "ar" ? "rtl" : "ltr"}
      style={{
        width: isFullWidth ? "auto" : "min(380px, 100vw)",
        backgroundColor: isDark ? "rgba(12, 15, 16, 1)" : "#ffffff",
      }}
    >
      {isFullWidth ? (
        <>
          <div className={`w-full lg:w-[380px] shrink-0 h-full flex flex-col ${selectedConversation ? "hidden lg:flex" : "flex"}`}>
            <ConversationList
              onSelectConversation={handleSelect}
              selectedId={selectedConversation?.id}
              onClose={closeMessages}
            />
          </div>
          <div className={`flex-1 min-w-0 h-full flex flex-col ${isDark ? "border-white/10" : "border-[#E5E5E5]"} lg:border-l ${selectedConversation ? "flex" : "hidden lg:flex"}`}>
            {selectedConversation ? (
              <ChatWindow
                conversation={selectedConversation}
                onClose={() => setSelectedConversation(null)}
              />
            ) : (
              <EmptyState />
            )}
          </div>
        </>
      ) : (
        <div className="w-full h-full flex flex-col">
          {selectedConversation ? (
            <ChatWindow
              conversation={selectedConversation}
              onClose={() => setSelectedConversation(null)}
            />
          ) : (
            <ConversationList
              onSelectConversation={handleSelect}
              selectedId={selectedConversation?.id}
              onClose={closeMessages}
            />
          )}
        </div>
      )}
    </aside>
  );
}