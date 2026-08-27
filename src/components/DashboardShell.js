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
    ? isRtl
      ? "lg:ml-[380px]"
      : "lg:mr-[380px]"
    : "";

const notificationsMargin =
  isNotificationsOpen
    ? isRtl
      ? "lg:ml-[500px]"
      : "lg:mr-[500px]"
    : "";

const mainMargin = isRtl
  ? `lg:mr-[260px] ${
      isAssistantOpen ? "lg:ml-[380px]" : ""
    } ${messagesMargin} ${notificationsMargin}`
  : `lg:ml-[260px] ${
      isAssistantOpen ? "lg:mr-[380px]" : ""
    } ${messagesMargin} ${notificationsMargin}`;

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