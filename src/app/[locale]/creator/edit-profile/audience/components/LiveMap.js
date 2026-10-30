"use client";

import { useTranslations } from "next-intl";
import { useTheme } from "@/context/ThemeContext";
import { FiGlobe, FiCheck } from "react-icons/fi";

// مواقع تقريبية للنقاط على الخريطة (نسبة مئوية) — استبدليها بخريطة حقيقية لاحقاً
const NODES = {
  sa: { x: 50, y: 60 },
  eg: { x: 26, y: 42 },
  ae: { x: 70, y: 52 },
  kw: { x: 58, y: 30 },
  other: { x: 84, y: 24 },
};

// bar = خلفية القطعة في الشريط التراكمي، dot = لون النقطة (الخريطة + الدليل)
const SEGMENTS = {
  sa: { bar: "linear-gradient(90deg, #E9C349 0%, #FE6B02 100%)", dot: "#FE6B02" },
  eg: { bar: "#94D3C1", dot: "#94D3C1" },
  ae: { bar: "#AACEC6", dot: "#AACEC6" },
  kw: { bar: "#004D40", dot: "#004D40" },
  other: { bar: "#323536", dot: "#323536" },
};

export default function LiveMap({ countries, coverage = 100 }) {
  const { isDark } = useTheme();
  const translate = useTranslations("Audience");

  const t = {
    text: isDark ? "text-white" : "text-[#171717]",
    subText: isDark ? "text-[#B0B0B0]" : "text-[#555555]",
    mutedText: isDark ? "text-[#8A8A8A]" : "text-[#707070]",
    card: isDark ? "bg-[#181818] border-[#2D2D2D]" : "bg-white border-[#D6D6D6]",
    chip: isDark ? "bg-white/5 text-[#B0B0B0]" : "bg-black/5 text-[#555555]",
    mapBg: isDark ? "bg-[#0B0B0B] border-[#2D2D2D]" : "bg-[#EEF2F2] border-[#D6D6D6]",
    dots: isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.08)",
    label: isDark ? "bg-black/70 text-white" : "bg-white/90 text-[#171717]",
    divider: isDark ? "border-[#2D2D2D]" : "border-[#D6D6D6]",
    track: isDark ? "bg-[#323536]" : "bg-[#E5E5E5]",
    globe: isDark ? "#5B9BD5" : "#2F6DB5",
    legendText: isDark
      ? { sa: "#E9C349", eg: "#94D3C1", ae: "#FFFFFF", kw: "#D4D4D4", other: "#8A8A8A" }
      : { sa: "#B45309", eg: "#0B625A", ae: "#171717", kw: "#555555", other: "#707070" },
    dotRing: isDark ? "rgba(255,255,255,0.25)" : "rgba(0,0,0,0.2)",
    positive: isDark ? "text-[#94D3C1]" : "text-[#0B625A]",
    accent: isDark ? "#94D3C1" : "#0B625A",
  };

  const top = countries[0];

  return (
    <section className={`rounded-2xl border p-5 ${t.card}`}>
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <FiGlobe size={20} color={t.accent} className="mt-1 shrink-0" />
          <div>
            <h2 className={`m-0 text-base font-bold sm:text-lg ${t.text}`}>
              {translate("mapTitle")}
            </h2>
            <p className={`m-0 mt-0.5 text-xs ${t.subText}`}>{translate("mapSubtitle")}</p>
          </div>
        </div>

        <span
          className={`flex shrink-0 items-center gap-2 rounded-lg px-3 py-1.5 text-[11px] ${t.chip}`}
        >
          <span className="h-2 w-2 rounded-full bg-[#FFB020]" />
          {translate("mapFocus", {
            country: translate(`countriesShort.${top.code}`),
            percent: top.percent,
          })}
        </span>
      </div>

      {/* الخريطة */}
      <div
        className={`relative h-[240px] w-full overflow-hidden rounded-xl border sm:h-[300px] ${t.mapBg}`}
        style={{
          backgroundImage: `radial-gradient(circle, ${t.dots} 1px, transparent 1px)`,
          backgroundSize: "18px 18px",
        }}
      >
        {countries.map((c) => {
          const pos = NODES[c.code];
          if (!pos) return null;
          const size = Math.max(8, Math.round(c.percent * 0.45));
          return (
            <div
              key={c.code}
              className="absolute flex items-center gap-2"
              style={{ left: `${pos.x}%`, top: `${pos.y}%`, transform: "translate(-50%, -50%)" }}
            >
              <span
                className="block rounded-full"
                style={{
                  width: size,
                  height: size,
                  background: SEGMENTS[c.code].dot,
                  border: `1px solid ${t.dotRing}`,
                  boxShadow: `0 0 ${size}px ${size / 2}px ${SEGMENTS[c.code].dot}55`,
                }}
              />
              <span className={`rounded px-1.5 py-0.5 text-[10px] font-bold ${t.label}`}>
                {translate(`countriesShort.${c.code}`)} {c.percent}%
              </span>
            </div>
          );
        })}
      </div>

      {/* الشريط التراكمي */}
      <div className={`mt-4 border-t pt-4 ${t.divider}`}>
        <div className="mb-3 flex items-center justify-between gap-3">
          <h3 className={`m-0 text-sm font-bold ${t.text}`}>{translate("cumulativeTitle")}</h3>
          <span className={`flex items-center gap-1 text-[11px] ${t.positive}`}>
            <FiCheck size={13} />
            {translate("coverage", { percent: coverage })}
          </span>
        </div>

        <div className={`flex h-2 w-full overflow-hidden rounded-full ${t.track}`}>
          {countries.map((c) => (
            <div
              key={c.code}
              style={{ width: `${c.percent}%`, background: SEGMENTS[c.code].bar }}
            />
          ))}
        </div>

        <div className="mt-3 flex items-center justify-between gap-2">
          {countries.map((c) => (
            <span
              key={c.code}
              className="flex items-center gap-1.5 text-xs font-bold"
              style={{ color: t.legendText[c.code] }}
            >
              {c.percent}%
              {c.code === "other" ? (
                <FiGlobe size={15} color={t.globe} />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={`https://flagcdn.com/w40/${c.code}.png`}
                  alt=""
                  className="h-3.5 w-5 shrink-0 rounded-[2px] object-cover"
                />
              )}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
