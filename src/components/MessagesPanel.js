"use client";

import { useState, useEffect } from "react";
import { useMessages } from "@/context/MessagesContext";
import ConversationList from "@/components/ConversationList";
import ChatWindow from "@/components/ChatWindow";

export default function MessagesPanel({ onConversationChange }) {
  const { isMessagesOpen, closeMessages } = useMessages();
  const [selectedConversation, setSelectedConversation] = useState(null);

  // إبلاغ الـ Shell بتغيير حالة المحادثة
  useEffect(() => {
    onConversationChange?.(!!selectedConversation);
  }, [selectedConversation, onConversationChange]);

  // تصفير عند الإغلاق
  useEffect(() => {
    if (!isMessagesOpen) setSelectedConversation(null);
  }, [isMessagesOpen]);

  if (!isMessagesOpen) return null;

  const handleSelect = (conv) => {
    setSelectedConversation(conv);
  };

  return (
    <aside
      className="fixed left-0 top-[64px] h-[calc(100vh-64px)] z-40 flex border-r border-white/10"
      style={{
        width: selectedConversation ? "760px" : "380px",
        transition: "width 0.3s ease",
        backgroundColor: "#0A0812",
      }}
    >
      {/* قائمة المحادثات */}
      <div className="w-[380px] shrink-0 h-full flex flex-col">
        <ConversationList
          onSelectConversation={handleSelect}
          selectedId={selectedConversation?.id}
          onClose={closeMessages}
        />
      </div>

      {/* نافذة المحادثة */}
      {selectedConversation && (
        <div className="flex-1 h-full border-l border-white/10 flex flex-col">
          <ChatWindow
            conversation={selectedConversation}
            onClose={() => setSelectedConversation(null)}
          />
        </div>
      )}
    </aside>
  );
}