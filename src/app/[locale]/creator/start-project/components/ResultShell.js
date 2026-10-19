"use client";

import { useTheme } from "@/context/ThemeContext";
import { CircleCheck, AlertTriangle, ShieldAlert } from "lucide-react";
import ProgressSteps from "./ProgressSteps";
import VideoPreview from "./VideoPreview";
import DeadlineTimer from "./DeadlineTimer";

const toneStyles = {
  success: {
    icon: CircleCheck,
     box: "bg-[#94D3C1]/10 border-[#94D3C1]/30 text-[#94D3C1]",
  },
  danger: {
    icon: AlertTriangle,
    box: "bg-red-500/10 border-red-500/30 text-red-400",
  },
  warning: {
    icon: ShieldAlert,
    box: "bg-[#E9C349]/10 border-[#E9C349]/30 text-[#E9C349]",
  },
};

export default function ResultShell({
  tone = "success",
  title,
  description,
  headerEnd = null,
  steps,
  link,
  image,
  platformLabel,
  sideExtra = null,
  children,
}) {
  const { isDark } = useTheme();
  const { icon: Icon, box } = toneStyles[tone];

  const surface = isDark ? "bg-[#121617] border-[#1e2425]" : "bg-white border-[#e1e7e4]";
  const primary = isDark ? "text-white" : "text-[#191c1d]";
  const secondary = isDark ? "text-gray-400" : "text-[#5f6a66]";

  return (
    <>
      {/* الهيدر */}
      <div
        className={`${surface} border rounded-2xl p-5 mb-5 flex items-center justify-between gap-4`}
      >
        <div className="flex items-center gap-4 min-w-0">
          <span
            className={`w-12 h-12 rounded-xl border flex items-center justify-center shrink-0 ${box}`}
          >
            <Icon size={24} />
          </span>
          <div className="min-w-0">
            <h1 className={`text-xl md:text-2xl font-black mb-1 ${primary}`}>{title}</h1>
            <p className={`text-xs leading-relaxed ${secondary}`}>{description}</p>
          </div>
        </div>
        {headerEnd}
      </div>

      {/* الخطوات الثلاث */}
      <ProgressSteps statuses={steps} />

      {/* المحتوى */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-5 items-start">
        <div className="space-y-5">{children}</div>

        <div className="space-y-4">
          <VideoPreview link={link} image={image} platformLabel={platformLabel} />
          <DeadlineTimer hours={23} minutes={14} />
          {sideExtra}
        </div>
      </div>
    </>
  );
}