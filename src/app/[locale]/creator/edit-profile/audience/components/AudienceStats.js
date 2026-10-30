"use client";

import { useTranslations } from "next-intl";
import { useTheme } from "@/context/ThemeContext";
import {
  FiBarChart2,
  FiTarget,
  FiTrendingUp,
  FiCheckCircle,
} from "react-icons/fi";
import { MdOutlineLocationCity } from "react-icons/md";

const nf = new Intl.NumberFormat("en-US");

const DEFAULT_MIN_VIEWS = 500;

export default function AudienceStats({ stats, minViews = DEFAULT_MIN_VIEWS }) {
  const { isDark } = useTheme();
  const translate = useTranslations("Audience");

  const t = {
    text: isDark ? "text-white" : "text-[#171717]",
    subText: isDark ? "text-[#B0B0B0]" : "text-[#555555]",
    mutedText: isDark ? "text-[#8A8A8A]" : "text-[#707070]",
    card: isDark ? "bg-[#181818] border-[#2D2D2D]" : "bg-white border-[#D6D6D6]",
    iconBox: isDark ? "bg-white/5" : "bg-black/5",
    iconColor: isDark ? "#94D3C1" : "#0B625A",
    positive: isDark ? "text-[#94D3C1]" : "text-[#0B625A]",
  };

  const raw = stats || {};
  const totalVerifiedViews = raw.totalVerifiedViews ?? 0;

  const isEmpty = totalVerifiedViews < minViews;

  const verifiedRate = isEmpty ? 0 : raw.verifiedRate ?? 0;
  const arabAudienceRate = isEmpty ? 0 : raw.arabAudienceRate ?? 0;
  const topCities = isEmpty ? [] : raw.topCities ?? [];
  const weeklyGrowth = isEmpty ? 0 : raw.weeklyGrowth ?? 0;

  const cards = [
    {
      key: "totalViews",
      icon: FiBarChart2,
      label: translate("totalViews"),
      value: nf.format(isEmpty ? 0 : totalVerifiedViews),
      ltr: true,
      foot: (
        <>
          <FiCheckCircle size={12} />
          {translate("verifiedBadge", { percent: verifiedRate })}
        </>
      ),
    },
    {
      key: "arabRate",
      icon: FiTarget,
      label: translate("arabRate"),
      value: `${arabAudienceRate}%`,
      ltr: true,
      foot: translate("arabRateNote"),
    },
    {
      key: "topCities",
      icon: MdOutlineLocationCity,
      label: translate("topCities"),
      value: topCities.length ? topCities.join("، ") : "———",
      small: true,
      foot: translate("topCitiesNote"),
      muted: true,
    },
    {
      key: "weeklyGrowth",
      icon: FiTrendingUp,
      label: translate("weeklyGrowth"),
      value: `${weeklyGrowth > 0 ? "+" : ""}${weeklyGrowth}%`,
      ltr: true,
      foot: (
        <>
          <FiTrendingUp size={12} />
          {translate("weeklyGrowthNote")}
        </>
      ),
    },
  ];

return (
  <div className="grid grid-cols-1 items-stretch gap-3 @md:grid-cols-2 @5xl:grid-cols-4">
    {cards.map((c) => {
      const Icon = c.icon;
      return (
        <div
          key={c.key}
          className={`flex h-full items-center justify-between gap-3 rounded-2xl border p-4 ${t.card}`}
        >
          {/* justify-start + self-stretch: المحتوى يبدأ من فوق دايمًا */}
          <div className="flex min-w-0 flex-col justify-start gap-1 self-stretch">
            {/* حجز سطرين للـ label (2 × leading-4 = 32px) */}
            <span className={`min-h-8 text-xs leading-4 ${t.subText}`}>
              {c.label}
            </span>

            <span
              className={`flex min-h-[32px] items-center font-bold leading-tight sm:min-h-[36px] ${t.text} ${
                c.small ? "text-sm sm:text-base" : "text-xl sm:text-2xl"
              }`}
            >
              {c.ltr ? <bdi dir="ltr">{c.value}</bdi> : c.value}
            </span>

            <span
              className={`flex items-center gap-1 text-[11px] ${
                c.muted ? t.mutedText : t.positive
              }`}
            >
              {c.foot}
            </span>
          </div>
          <div
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${t.iconBox}`}
          >
            <Icon size={18} color={t.iconColor} />
          </div>
        </div>
      );
    })}
  </div>
);
}
