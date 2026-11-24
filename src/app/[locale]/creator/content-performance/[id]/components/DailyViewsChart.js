"use client";

import { useTranslations } from "next-intl";
import { useTheme } from "@/context/ThemeContext";
import { FiZap, FiRefreshCw } from "react-icons/fi";

const darkTheme = {
  card: "border-black bg-[#191C1D]",
  sub: "bg-[#232729]",
  title: "text-white",
  muted: "text-gray-400",
  mint: "text-[#8FE3C8]",
  gold: "text-[#E9C349]",
  mintBg: "bg-[#8FE3C8]",
  goldBg: "bg-[#E9C349]",
  tabActive: "bg-[#8FE3C8] font-bold text-black",
  tabIdle: "text-gray-400",
  badge: "border-[#E9C349]/40 bg-[#E9C349]/10 text-[#E9C349]",
  panel: "bg-gradient-to-b from-[#0F1314] to-[#0A0D0D]",
  svg: {
    views: "#8FE3C8",
    earn: "#E9C349",
    peak: "#E9C349",
    danger: "#F87171",
    marker: "#0A0D0D",
    muted: "#9CA3AF",
    grid: "rgba(255,255,255,0.05)",
  },
};

const lightTheme = {
  card: "border-[#E5E7E7] bg-white shadow-sm",
  sub: "bg-[#EEF3F2]",
  title: "text-[#1A1A1A]",
  muted: "text-[#666666]",
  mint: "text-[#2F9E83]",
  gold: "text-[#B7860B]",
  mintBg: "bg-[#2F9E83]",
  goldBg: "bg-[#D9A400]",
  tabActive: "bg-[#2F9E83] font-bold text-white",
  tabIdle: "text-[#666666]",
  badge: "border-[#D9A400]/40 bg-[#D9A400]/10 text-[#B7860B]",
  panel: "bg-[#F1F5F4]",
  svg: {
    views: "#2F9E83",
    earn: "#D9A400",
    peak: "#D9A400",
    danger: "#DC2626",
    marker: "#FFFFFF",
    muted: "#8A8A8A",
    grid: "rgba(0,0,0,0.06)",
  },
};

const dayKeys = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];

const W = 800;
const H = 170;
const PX = 20;
const PT = 20;
const PB = 12;

const smooth = (pts) =>
  pts.reduce((d, p, i, a) => {
    if (i === 0) return `M${p.x},${p.y}`;
    const prev = a[i - 1];
    const cx = (prev.x + p.x) / 2;
    return `${d} C${cx},${prev.y} ${cx},${p.y} ${p.x},${p.y}`;
  }, "");

export default function DailyViewsChart({ daily = [] }) {
  const tr = useTranslations("contentPerformance.details.chart");
  const { isDark } = useTheme();
  const t = isDark ? darkTheme : lightTheme;

  if (!daily.length) return null;

  const data = daily.map(({ date, views }) => ({
    views,
    key: dayKeys[new Date(date).getDay()],
    date,
  }));
  const max = Math.max(...data.map(({ views }) => views));
  const lo = max * 0.15;
  const scale = Math.max(max - lo, 1);
  const peakValue = max;
  const peakIndex = data.findIndex(({ views }) => views === peakValue);
  const avg = Math.round(data.reduce((s, d) => s + d.views, 0) / data.length);

  const x = (i) => PX + (i * (W - 2 * PX)) / Math.max(data.length - 1, 1);
  const y = (v, k = 1) => {
    const ratio = Math.max(0, Math.min(1, (v * k - lo) / scale));
    return H - PB - ratio * (H - PT - PB);
  };

  const viewsPts = data.map((d, i) => ({ x: x(i), y: y(d.views) }));
  const viewsLine = smooth(viewsPts);
  const area = `${viewsLine} L${viewsPts[viewsPts.length - 1].x},${H - PB} L${viewsPts[0].x},${H - PB} Z`;

  return (
    <div className={`space-y-5 rounded-2xl border p-5 ${t.card}`}>
      <div>
        <div>
          <h2
            className={`flex items-center gap-2 text-lg font-extrabold ${t.title}`}
          >
            <span
              className={`flex h-4 w-4 items-center justify-center rounded-full ${t.sub}`}
            >
              <span className={`h-2 w-2 rounded-full ${t.mintBg}`} />
            </span>
            {tr("title")}
          </h2>
          <p className={`mt-1 text-xs ${t.muted}`}>{tr("subtitle")}</p>
        </div>

      </div>

      {/* مفتاح الألوان + أعلى يوم */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className={`flex items-center gap-4 ${t.muted}`}>
          <span className="flex items-center gap-1.5">
            <i className={`h-2 w-2 rounded-full ${t.mintBg}`} />
            {tr("legend.views")}
          </span>
        </div>

        <span
          className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 ${t.badge}`}
        >
          {tr("peakBadge", {
            day: tr(`days.${data[peakIndex].key}`),
            views: peakValue.toLocaleString("en-US"),
          })}
          <FiZap size={12} />
        </span>
      </div>

      {/* الرسم */}
      <div className={`overflow-hidden rounded-xl p-2 ${t.panel}`}>
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img">
          <defs>
            <linearGradient id="viewsFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={t.svg.views} stopOpacity="0.28" />
              <stop offset="100%" stopColor={t.svg.views} stopOpacity="0" />
            </linearGradient>
          </defs>

          {[0.25, 0.5, 0.75].map((g) => (
            <line
              key={g}
              x1={PX}
              x2={W - PX}
              y1={PT + g * (H - PT - PB)}
              y2={PT + g * (H - PT - PB)}
              stroke={t.svg.grid}
            />
          ))}

          <path d={area} fill="url(#viewsFill)" />

          <path
            d={viewsLine}
            fill="none"
            stroke={t.svg.views}
            strokeWidth="2.5"
          />
          {/* نقطة الذروة */}
          <circle
            cx={viewsPts[peakIndex].x}
            cy={viewsPts[peakIndex].y}
            r="6"
            fill={t.svg.marker}
            stroke={t.svg.peak}
            strokeWidth="2.5"
          />
        </svg>

        {/* أسماء الأيام (dir=ltr لأن الرسم من اليسار لليمين) */}
        <div
          dir="ltr"
          className={`mt-2 flex justify-between px-1 text-[11px] ${t.muted}`}
        >
          {data.map((d, i) => (
            <span
              key={i}
              className={
                i === 0
                  ? `font-bold ${t.mint}`
                  : i === peakIndex
                  ? `font-bold ${t.gold}`
                  : ""
              }
            >
              {tr(`days.${d.key}`)}
              {i === peakIndex && ` ${tr("peakTag")}`}
            </span>
          ))}
        </div>
      </div>

      {/* التذييل */}
      <div
        className={`flex flex-wrap items-center justify-between gap-2 text-xs ${t.mint}`}
      >
        <span className="flex items-center gap-1.5">
          <FiRefreshCw size={12} />
          {tr("snapshotCount", { count: data.length })}
        </span>
        <span>{tr("average", { value: avg.toLocaleString("en-US") })}</span>
      </div>
    </div>
  );
}
