"use client";

import { useTranslations } from "next-intl";
import { useTheme } from "@/context/ThemeContext";
import {
  FiClock,
  FiCheck,
  FiCheckCircle,
  FiSlash,
  FiLock,
} from "react-icons/fi";
import { MdOutlineVerifiedUser } from "react-icons/md";

const darkTheme = {
  card: "border-black bg-[#191C1D]",
  sub: "bg-[#232729]",
  track: "bg-[#232729]",
  title: "text-white",
  label: "text-gray-300",
  muted: "text-gray-400",
  mint: "text-[#8FE3C8]",
  gold: "text-[#E9C349]",
  fillMint: "bg-[#8FE3C8]",
  fillGold: "bg-[#E9C349]",
  line: "border-white/5",
  iconBox: "border-[#8FE3C8]/30 bg-[#8FE3C8]/10 text-[#8FE3C8]",
  clockBox: "bg-[#232729] text-[#8FE3C8]",
  badgeMint: "border-[#8FE3C8]/30 bg-[#8FE3C8]/10 text-[#8FE3C8]",
  badgeGold: "border-[#E9C349]/30 bg-[#E9C349]/10 text-[#E9C349]",
  excellent: "bg-[#2849434D] text-[#AACEC6]",
};

const lightTheme = {
  card: "border-[#E5E7E7] bg-white shadow-sm",
  sub: "bg-[#EEF3F2]",
  track: "bg-black/5",
  title: "text-[#1A1A1A]",
  label: "text-[#333333]",
  muted: "text-[#666666]",
  mint: "text-[#2F9E83]",
  gold: "text-[#B7860B]",
  fillMint: "bg-[#2F9E83]",
  fillGold: "bg-[#D9A400]",
  line: "border-[#E5E7E7]",
  iconBox: "border-[#2F9E83]/30 bg-[#2F9E83]/10 text-[#2F9E83]",
  clockBox: "bg-[#EEF3F2] text-[#2F9E83]",
  badgeMint: "border-[#2F9E83]/30 bg-[#2F9E83]/10 text-[#2F9E83]",
  badgeGold: "border-[#D9A400]/40 bg-[#D9A400]/10 text-[#B7860B]",
  excellent: "bg-[#94D3C1]/25 text-[#2B7A66]",
};

export default function InsightsRow({ clip }) {
  const tr = useTranslations("contentPerformance.details.insights");
  const { isDark } = useTheme();
  const t = isDark ? darkTheme : lightTheme;

  if (!clip?.retention) return null;

  const retention = [
    { key: "start", value: clip.retention.start, fill: t.fillMint, text: t.mint },
    { key: "middle", value: clip.retention.middle, fill: t.fillGold, text: t.gold },
    { key: "end", value: clip.retention.end, fill: t.fillMint, text: t.mint },
  ];

  const integrity = [
    { key: "human", Icon: FiCheck, iconColor: t.mint, badge: t.badgeMint },
    { key: "bots", Icon: FiSlash, iconColor: t.gold, badge: t.badgeGold },
    { key: "sharia", Icon: FiCheckCircle, iconColor: t.mint, badge: t.badgeMint },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      {/* أين وصل المشاهدون */}
      <div className={`space-y-5 rounded-2xl border p-5 ${t.card}`}>
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <span
              className={`flex h-10 w-10 items-center justify-center rounded-xl border ${t.iconBox}`}
            >
              <FiClock size={18} />
            </span>
            <div>
              <h3 className={`text-base font-extrabold ${t.title}`}>
                {tr("retention.title")}
              </h3>
              <p className={`text-[11px] ${t.muted}`}>
                {tr("retention.subtitle")}
              </p>
            </div>
          </div>

          <span className={`rounded-md px-2 py-1 text-[11px] ${t.excellent}`}>
            <span dir="ltr">+{Math.abs(clip.vsPlatform ?? 0)}%</span>{" "}
            {tr("retention.excellent")}
          </span>
        </div>

        <div className="space-y-4">
          {retention.map((r) => (
            <div key={r.key} className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className={t.label}>
                  {tr(`retention.rows.${r.key}.label`)}
                </span>
                <span className={`font-bold ${r.text}`}>
                  <span dir="ltr">{r.value}%</span>{" "}
                  {tr(`retention.rows.${r.key}.suffix`)}
                </span>
              </div>
              <div className={`h-2 overflow-hidden rounded-full ${t.track}`}>
                <div
                  className={`h-full rounded-full ${r.fill}`}
                  style={{ width: `${r.value}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        <div
          className={`flex items-center justify-between border-t pt-3 text-xs ${t.line} ${t.muted}`}
        >
          <span>
            {tr("retention.completion")}{" "}
            <b className={t.mint}>
              <span dir="ltr">{clip.retention.end}%</span>
            </b>
          </span>
          <span>
            {tr("retention.average")}{" "}
            <b className={t.mint}>
              <span dir="ltr">{clip.avgViewers}%</span>
            </b>
          </span>
        </div>
      </div>

      {/* فحص النزاهة */}
      <div className={`space-y-5 rounded-2xl border p-5 ${t.card}`}>
        <div className="flex items-center gap-3">
          <span
            className={`flex h-10 w-10 items-center justify-center rounded-xl border ${t.iconBox}`}
          >
            <MdOutlineVerifiedUser size={18} />
          </span>
          <div>
            <h3 className={`text-base font-extrabold ${t.title}`}>
              {tr("integrity.title")}
            </h3>
            <p className={`text-[11px] ${t.muted}`}>
              {tr("integrity.subtitle")}
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {integrity.map(({ key, Icon, iconColor, badge }) => (
            <div
              key={key}
              className={`flex items-center justify-between gap-3 rounded-xl px-4 py-3 ${t.sub}`}
            >
              <span className={`flex items-center gap-2 text-sm ${t.label}`}>
                <Icon size={14} className={iconColor} />
                {tr(`integrity.rows.${key}.label`)}
              </span>
              <span
                className={`shrink-0 rounded-md border px-2 py-1 text-[11px] ${badge}`}
              >
                {key === "bots" && clip.blockedBots > 0
                  ? tr("integrity.rows.bots.badgeFound", {
                      count: clip.blockedBots.toLocaleString("en-US"),
                    })
                  : tr(`integrity.rows.${key}.badge`)}
              </span>
            </div>
          ))}
        </div>

        <p
          className={`flex items-center gap-2 border-t pt-3 text-xs ${t.line} ${t.muted}`}
        >
          <FiLock size={16} color={isDark ? "#94D3C1" : "#2F9E83"}/>
          {tr("integrity.ledger", { id: clip.ledgerId })}
        </p>
      </div>
    </div>
  );
}