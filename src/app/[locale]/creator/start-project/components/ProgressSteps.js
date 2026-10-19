"use client";

import { useTranslations } from "next-intl";
import { CheckCircle2, RefreshCw, Wallet, AlertTriangle } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

const stepIcons = [CheckCircle2, RefreshCw, Wallet];

export default function ProgressSteps({ statuses = ["done", "pending", "pending"] }) {
  const t = useTranslations("startProject.steps");
  const { isDark } = useTheme();

  // card = الإطار والخلفية، iconBox = مربع الأيقونة، sub = السطر الصغير
  const tones = isDark
    ? {
        done: {
          card: "border-[#94D3C1]/25 bg-[#121617]",
          iconBox: "bg-[#212f2c] text-[#94D3C1]",
          sub: "text-[#94D3C1]",
          title: "text-white",
        },
        active: {
          card: "border-[#E9C349]/25 bg-[#161712]",
          iconBox: "bg-[#332b17] text-[#E9C349]",
          sub: "text-[#E9C349]",
          title: "text-white",
        },
        error: {
          card: "border-red-500/40 bg-red-500/10",
          iconBox: "bg-red-500/15 text-red-400",
          sub: "text-red-400",
          title: "text-white",
        },
        pending: {
          card: "border-transparent bg-[#0f1213]",
          iconBox: "bg-[#1c2223] text-gray-400",
          sub: "text-gray-500",
          title: "text-gray-300",
        },
      }
    : {
        done: {
          card: "border-emerald-200 bg-white",
          iconBox: "bg-emerald-50 text-emerald-700",
          sub: "text-emerald-700",
          title: "text-[#191c1d]",
        },
        active: {
          card: "border-amber-200 bg-white",
          iconBox: "bg-amber-50 text-amber-700",
          sub: "text-amber-700",
          title: "text-[#191c1d]",
        },
        error: {
          card: "border-red-200 bg-red-50",
          iconBox: "bg-red-100 text-red-600",
          sub: "text-red-600",
          title: "text-[#191c1d]",
        },
        pending: {
          card: "border-[#e1e7e4] bg-[#f3f6f5]",
          iconBox: "bg-[#e6ecea] text-[#7a8581]",
          sub: "text-[#7a8581]",
          title: "text-[#5f6a66]",
        },
      };
  tones.passed = tones.active;
  tones.review = tones.active;
  const keys = ["submitted", "aiCheck", "reward"];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
      {keys.map((key, i) => {
        const status = statuses[i] || "pending";
        const tone = tones[status];
        const Icon = status === "error" ? AlertTriangle : stepIcons[i];

        return (
          <div
            key={key}
            className={`flex items-center gap-3 rounded-xl border p-3 ${tone.card}`}
          >
            <span
              className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${tone.iconBox}`}
            >
              <Icon size={18} />
            </span>
            <div className="min-w-0">
              <p className={`text-xs font-bold ${tone.title}`}>
                {i + 1}. {t(`${key}.title`)}
              </p>
              <p className={`text-[10px] truncate ${tone.sub}`}>
                {t(`${key}.${status}`)}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}