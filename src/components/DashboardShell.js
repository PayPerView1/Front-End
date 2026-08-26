"use client";

import { useAssistant } from "@/context/AssistantContext";
import { useMessages } from "@/context/MessagesContext";
import AIAssistantPanel from "@/components/AIAssistantPanel";

export default function DashboardShell({ children, locale }) {
  const { isAssistantOpen } = useAssistant();
  const { isMessagesOpen, isMaximized, selectedConversation } = useMessages();
  const isRtl = locale === "ar";
  const messagesMargin = isMessagesOpen && !isMaximized
    ? isRtl
      ? "lg:ml-[380px]"
      : "lg:mr-[380px]"
    : "";
  const mainMargin = isRtl
    ? `lg:mr-[260px] ${isAssistantOpen ? "lg:ml-[380px]" : ""} ${messagesMargin}`
    : `lg:ml-[260px] ${isAssistantOpen ? "lg:mr-[380px]" : ""} ${messagesMargin}`;

  return (
    <>
      {/* بانل المساعد - بيظهر بس لما يكون مفتوح */}
      <AIAssistantPanel side={isRtl ? "left" : "right"} />

      <main className={`transition-all duration-300 ${mainMargin}`}>
        {children}
      </main>
    </>
  );
}