"use client";

import { useAssistant } from "@/context/AssistantContext";
import { useMessages } from "@/context/MessagesContext";
import { useNotifications } from "@/context/NotificationsContext";
import AIAssistantPanel from "@/components/AIAssistantPanel";
import NotificationsPanel from "@/components/NotificationsPanel";

export default function DashboardShell({ children, locale }) {
  const { isAssistantOpen } = useAssistant();
const { isMessagesOpen, isMaximized, selectedConversation } = useMessages();
const { isNotificationsOpen } = useNotifications();

const isRtl = locale === "ar";
const messagesMargin =
  isMessagesOpen && !isMaximized
    ? isRtl ? "sm:ml-[380px]" : "sm:mr-[380px]"   
    : "";

const notificationsMargin =
  isNotificationsOpen
    ? isRtl ? "sm:ml-[380px]" : "sm:mr-[380px]"   
    : "";

const mainMargin = isRtl
  ? `xl:mr-[260px] ${isAssistantOpen ? "xl:ml-[380px]" : ""} ${messagesMargin} ${notificationsMargin}`
  : `xl:ml-[260px] ${isAssistantOpen ? "xl:mr-[380px]" : ""} ${messagesMargin} ${notificationsMargin}`;
  return (
    <>
      {/* بانل المساعد */}
      <AIAssistantPanel side={isRtl ? "left" : "right"} />

      {/* بانل الإشعارات */}
      <NotificationsPanel side={isRtl ? "left" : "right"} />

      <main className={`transition-all duration-300 ${mainMargin}`}>
        {children}
      </main>
    </>
  );
}