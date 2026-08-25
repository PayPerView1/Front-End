"use client";

import { useAssistant } from "@/context/AssistantContext";
import AIAssistantPanel from "@/components/AIAssistantPanel";

export default function DashboardShell({ children, locale }) {
  const { isAssistantOpen } = useAssistant();
  const isRtl = locale === "ar";
  const mainMargin = isRtl
    ? `lg:mr-[260px] ${isAssistantOpen ? "lg:ml-[380px]" : ""}`
    : `lg:ml-[260px] ${isAssistantOpen ? "lg:mr-[380px]" : ""}`;

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