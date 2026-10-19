"use client";

import { useAssistant } from "@/context/AssistantContext";
import { useMessages } from "@/context/MessagesContext";
import { useNotifications } from "@/context/NotificationsContext";
import AIAssistantPanel from "@/components/AIAssistantPanel";
import NotificationsPanel from "@/components/NotificationsPanel";
import MessagesPanel from "@/components/MessagesPanel";

export default function DashboardShell({ children, locale }) {
  const { isAssistantOpen } = useAssistant();
  const { isMessagesOpen, isMaximized } = useMessages();
  const { isNotificationsOpen } = useNotifications();

  const isRtl = locale === "ar";
  const sidePanelsOpen = [
    isAssistantOpen,
    isNotificationsOpen,
    isMessagesOpen && !isMaximized,
  ].filter(Boolean).length;

  const mainMargin = isRtl
    ? `xl:mr-[260px] ${sidePanelsOpen ? "xl:ml-[380px]" : ""}`
    : `xl:ml-[260px] ${sidePanelsOpen ? "xl:mr-[380px]" : ""}`;

  const stackedPanels = sidePanelsOpen > 1;

  return (
    <>
      {/* بانل المساعد */}
      <AIAssistantPanel side={isRtl ? "left" : "right"} stacked={stackedPanels} topOffset={0} />

      {/* بانل الإشعارات */}
      <NotificationsPanel side={isRtl ? "left" : "right"} stacked={stackedPanels} topOffset={88} />

      {/* بانل الرسائل */}
      <MessagesPanel side={isRtl ? "left" : "right"} stacked={stackedPanels} topOffset={176} />

      <main className={`min-w-0 transition-all duration-300 ${mainMargin}`}>
        {children}
      </main>
    </>
  );
}