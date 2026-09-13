"use client";

import { useAssistant } from "@/context/AssistantContext";
import { useMessages } from "@/context/MessagesContext";
import AIAssistantPanel from "@/components/AIAssistantPanel";
import MessagesPanel from "@/components/MessagesPanel";
import { useState } from "react";

export default function DashboardShell({ children, locale }) {
  const { isAssistantOpen } = useAssistant();
  const { isMessagesOpen } = useMessages();
  const isRtl = locale === "ar";

  // hasConversation يتم تمريره من MessagesPanel عبر callback
  const [hasConversation, setHasConversation] = useState(false);

  const panelWidth = isMessagesOpen ? "lg:ml-[380px]" : "";

  const mainMargin = isRtl
    ? `lg:mr-[260px] ${isAssistantOpen ? "lg:ml-[380px]" : ""} ${panelWidth}`
    : `lg:ml-[260px] ${isAssistantOpen ? "lg:mr-[380px]" : ""} ${isMessagesOpen ? "lg:mr-[380px]" : ""}`;

  return (
    <>
      <AIAssistantPanel side={isRtl ? "left" : "right"} />
      <MessagesPanel onConversationChange={setHasConversation} />

      <main className={`transition-all duration-300 ${mainMargin}`}>
        {children}
      </main>
    </>
  );
}