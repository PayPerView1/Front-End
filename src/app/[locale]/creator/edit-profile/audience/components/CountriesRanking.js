"use client";

import { useTranslations } from "next-intl";
import { useTheme } from "@/context/ThemeContext";
import { FiFlag, FiGlobe, FiArrowUp } from "react-icons/fi";

const nf = new Intl.NumberFormat("en-US");

function Flag({ code, color }) {
  if (code === "other") return <FiGlobe size={22} color={color} />;
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`https://flagcdn.com/w40/${code}.png`}
      alt=""
      className="h-4 w-6 shrink-0 rounded-[3px] object-cover"
    />
  );
}

export default function CountriesRanking({ countries, onSelect }) {
  const { isDark } = useTheme();
  const translate = useTranslations("Audience");

  const t = {
    text: isDark ? "text-white" : "text-[#171717]",
    subText: isDark ? "text-[#B0B0B0]" : "text-[#555555]",
    mutedText: isDark ? "text-[#8A8A8A]" : "text-[#707070]",
    card: isDark ? "bg-[#181818] border-[#2D2D2D]" : "bg-white border-[#D6D6D6]",
    item: isDark
      ? "bg-[#111] border-[#2D2D2D] hover:border-[#94D3C14D]"
      : "bg-[#F7F8F8] border-[#E3E3E3] hover:border-[#94D3C14D]",
    chip: isDark ? "bg-white/5 text-[#B0B0B0]" : "bg-black/5 text-[#555555]",
    track: isDark ? "bg-[#2D2D2D]" : "bg-[#E5E5E5]",
    positive: isDark ? "text-[#94D3C1]" : "text-[#0B625A]",
    accent: isDark ? "#94D3C1" : "#0B625A",
    iconMuted: isDark ? "#9A9A9A" : "#707070",
  };

  return (
    <section className={`rounded-2xl border p-5 ${t.card}`}>
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <FiFlag size={18} color={t.accent} />
          <h2 className={`m-0 text-base font-bold sm:text-lg ${t.text}`}>
            {translate("rankingTitle")}
          </h2>
        </div>
        <span className={`rounded-full px-3 py-1 text-[11px] ${t.chip}`}>
          {translate("destinations", { count: countries.length })}
        </span>
      </div>

      <div className="flex flex-col gap-3">
        {countries.map((c, index) => {
          const isTop = index === 0;
          const isOther = c.code === "other";
          const citiesLine = isOther
            ? c.names.join("، ")
            : translate("topCitiesLine", {
                cities: c.topCities.map((x) => `${x.name} (${x.percent}%)`).join("، "),
              });

          return (
            <button
              key={c.code}
              type="button"
              onClick={() => onSelect(c.code)}
              className={`flex w-full cursor-pointer flex-col gap-2.5 rounded-xl border p-3.5 text-start transition-colors ${t.item}`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex min-w-0 items-center gap-3">
                  <Flag code={c.code} color={t.iconMuted} />
                  <div className="min-w-0">
                    <p className={`m-0 truncate text-sm font-bold ${t.text}`}>
                      {translate(`countries.${c.code}`)}
                    </p>
                    <p className={`m-0 text-xs ${t.subText}`}>
                      {translate("viewsCount", { count: nf.format(c.views) })}
                    </p>
                  </div>
                </div>

                <div className="flex shrink-0 flex-col items-end gap-0.5">
                  <span
                    className={`text-lg font-bold ${
                      isOther ? t.mutedText : isTop ? t.positive : t.text
                    }`}
                  >
                    {c.percent}%
                  </span>
                  {c.growth != null && (
                    <span
                      className={`flex items-center gap-0.5 text-[11px] ${
                        c.growth >= 10 ? t.positive : t.mutedText
                      }`}
                    >
                      {c.growth >= 10 && <FiArrowUp size={11} />}+{c.growth}%
                    </span>
                  )}
                </div>
              </div>

              <div className={`h-1.5 w-full overflow-hidden rounded-full ${t.track}`}>
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#FDA301] to-[#F96604]"
                  style={{ width: `${c.percent}%` }}
                />
              </div>

              <div className="flex items-center justify-between gap-3 text-[11px]">
                <span className={`min-w-0 truncate ${t.subText}`}>{citiesLine}</span>
                <span className={`shrink-0 font-bold ${isTop ? t.text : t.mutedText}`}>
                  {translate(`tags.${c.tag}`)}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}
