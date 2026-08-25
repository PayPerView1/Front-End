"use client";

import { useAssistant } from "@/context/AssistantContext";
import { useNotifications } from "@/context/NotificationsContext";
import AIAssistantPanel from "@/components/AIAssistantPanel";
import NotificationsPanel from "@/components/NotificationsPanel";

export default function DashboardShell({ children, locale }) {
  const { isAssistantOpen } = useAssistant();
  const { isNotificationsOpen } = useNotifications();
  const isRtl = locale === "ar";
  
  let extraMargin = "";
  if (isAssistantOpen) {
    extraMargin = isRtl ? "lg:ml-[380px]" : "lg:mr-[380px]";
  } else if (isNotificationsOpen) {
    extraMargin = isRtl ? "lg:ml-[500px]" : "lg:mr-[500px]";
  }
  
  const mainMargin = isRtl
    ? `lg:mr-[260px] ${extraMargin}`
    : `lg:ml-[260px] ${extraMargin}`;

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