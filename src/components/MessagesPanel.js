"use client";

import { useEffect, useState } from "react";
import { useLocale } from "next-intl";
import { useMessages } from "@/context/MessagesContext";
import ConversationList from "@/components/ConversationList";
import ChatWindow from "@/components/ChatWindow";
import EmptyState from "@/components/EmptyState";
import { useTheme } from "@/context/ThemeContext";

export default function MessagesPanel({
  onConversationChange,
  side,
  currentUser,
}) {
  const locale = useLocale();
  const { isDark } = useTheme();

  const {
    isMessagesOpen,
    closeMessages,
    isMaximized,
    selectedConversation,
    setSelectedConversation,
  } = useMessages();

  const [readIds, setReadIds] = useState([]);

  useEffect(() => {
    onConversationChange?.(!!selectedConversation);
  }, [selectedConversation, onConversationChange]);

  useEffect(() => {
    if (!isMessagesOpen) {
      setSelectedConversation(null);
    }
  }, [isMessagesOpen, setSelectedConversation]);

  if (!isMessagesOpen) return null;

  const handleSelect = (conv) => {
    setReadIds((prev) =>
      prev.includes(conv.id) ? prev : [...prev, conv.id]
    );

    setSelectedConversation(conv);
  };

  const isRtl = locale === "ar";
  const panelSide = side || (isRtl ? "left" : "right");

  /*
    في اللغة العربية (RTL): السايدبار الرئيسي على اليمين، فالجهة اليسرى تبدأ من left-0.
    في اللغة الإنجليزية (LTR): السايدبار الرئيسي على اليسار، فنحتاج إزاحة left-[260px].
  */
  const sideClass = isMaximized
    ? isRtl
      ? "left-0 right-0 min-[1280px]:right-[260px] border-b"
      : "left-0 right-0 min-[1280px]:left-[260px] border-b"
    : panelSide === "right"
    ? isRtl
      ? "left-0 right-0 min-[1280px]:left-auto min-[1280px]:right-[260px] border-l w-full min-[1280px]:w-[380px]"
      : "left-0 right-0 min-[1280px]:left-auto min-[1280px]:right-0 border-l w-full min-[1280px]:w-[380px]"
    : isRtl
    ? "left-0 right-0 min-[1280px]:left-0 min-[1280px]:right-auto border-r w-full min-[1280px]:w-[380px]"
    : "left-0 right-0 min-[1280px]:left-[260px] min-[1280px]:right-auto border-r w-full min-[1280px]:w-[380px]";

  return (
    <aside
      className={`
        messages-panel 
        fixed 
        top-14 
        h-[calc(100vh-56px)] 
        z-40 
        flex 
        transition-all 
        duration-300 
        ${
          isDark
            ? "border-white/10"
            : "border-[#E5E5E5]"
        } 
        ${sideClass} 
      `}
      data-side={panelSide}
      dir={isRtl ? "rtl" : "ltr"}
      style={{
        backgroundColor: isDark
          ? "rgba(12, 15, 16, 1)"
          : "#ffffff",

        boxShadow:
          "0px 25px 50px -12px rgba(0, 0, 0, 0.25)",
      }}
    >
      {isMaximized ? (
        <>
          {/* قائمة المحادثات */}
          <div
            className={`
              w-full 
              min-[1280px]:w-[380px] 
              shrink-0 
              h-full 
              flex 
              flex-col 
              ${
                selectedConversation
                  ? "hidden min-[1280px]:flex"
                  : "flex"
              } 
            `}
          >
            <ConversationList
              onSelectConversation={handleSelect}
              selectedId={selectedConversation?.id}
              onClose={closeMessages}
              readIds={readIds}
            />
          </div>

          {/* نافذة المحادثة */}
          <div
            className={`
              flex-1 
              min-w-0 
              h-full 
              flex 
              flex-col 
              ${
                isDark
                  ? "border-white/10"
                  : "border-[#E5E5E5]"
              } 
              min-[1280px]:border-l 
              ${
                selectedConversation
                  ? "flex"
                  : "hidden min-[1280px]:flex"
              } 
            `}
          >
            {selectedConversation ? (
              <ChatWindow
                conversation={selectedConversation}
                onClose={() =>
                  setSelectedConversation(null)
                }
                currentUser={currentUser} 
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
              onClose={() =>
                setSelectedConversation(null)
              }
              currentUser={currentUser}
            />
          ) : (
            <ConversationList
              onSelectConversation={handleSelect}
              selectedId={selectedConversation?.id}
              onClose={closeMessages}
              readIds={readIds}
            />
          )}
        </div>
      )}
    </aside>
  );
}