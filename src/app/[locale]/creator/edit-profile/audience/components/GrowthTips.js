"use client";

import { useTranslations } from "next-intl";
import { useTheme } from "@/context/ThemeContext";
import { LuLightbulb, LuSparkles, LuClock, LuTrendingUp } from "react-icons/lu";

export default function GrowthTips({ tips }) {
  const { isDark } = useTheme();
  const translate = useTranslations("Audience");

  const t = {
    text: isDark ? "text-white" : "text-[#171717]",
    subText: isDark ? "text-[#B0B0B0]" : "text-[#555555]",
    card: isDark ? "bg-[#181818] border-[#2D2D2D]" : "bg-white border-[#D6D6D6]",
    item: isDark ? "bg-[#111] border-[#2D2D2D]" : "bg-[#F7F8F8] border-[#E3E3E3]",
    accent: isDark ? "#94D3C1" : "#0B625A",
    mintText: isDark ? "text-[#94D3C1]" : "text-[#0B625A]",
    yellowText: isDark ? "text-[#FACC15]" : "text-[#B45309]",
  };

  // تمييز الأرقام داخل النص: أبيض/أسود عريض، أصفر، أخضر
  const rich = {
    b: (chunks) => <b className={t.text}>{chunks}</b>,
    hl: (chunks) => <b className={t.yellowText}>{chunks}</b>,
    mint: (chunks) => <b className={t.mintText}>{chunks}</b>,
  };

  const time = tips.bestTime;
  const growth = tips.growth;
  const timeCountry = translate(`countriesShort.${time.country}`);
  const growthCountry = translate(`countriesShort.${growth.country}`);

  const items = [
    {
      key: "time",
      icon: LuClock,
      title: translate("tipTimeTitle", { country: timeCountry }),
      body: translate.rich("tipTimeBody", {
        ...rich,
        percent: time.percent,
        country: timeCountry,
        from: time.from,
        to: time.to,
        zone: time.zone,
      }),
    },
    {
      key: "growth",
      icon: LuTrendingUp,
      title: translate("tipGrowthTitle", { country: growthCountry }),
      body: translate.rich("tipGrowthBody", {
        ...rich,
        country: growthCountry,
        rate: growth.rate,
      }),
    },
  ];

  return (
    <section className={`rounded-2xl border p-4 ${t.card}`}>
      <div className="mb-3 flex items-start gap-3">
        {/* مصباح مع لمعات */}
        <span className="relative mt-1 shrink-0">
          <LuLightbulb size={22} color={t.accent} />
          <LuSparkles
            size={9}
            color={t.accent}
            className="absolute -right-1 -top-1"
          />
        </span>
        <div>
          <h2 className={`m-0 text-base font-bold sm:text-lg ${t.text}`}>
            {translate("tipsTitle")}
          </h2>
          <p className={`m-0 mt-0.5 text-xs ${t.subText}`}>
            {translate("tipsSubtitle")}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 @2xl:grid-cols-2">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.key}
              className={`flex flex-col gap-2 rounded-xl border p-3.5 ${t.item}`}
            >
              <div className="flex items-center gap-2">
                <Icon size={18} color={t.accent} />
                <h3 className={`m-0 text-base font-bold ${t.text}`}>{item.title}</h3>
              </div>
              <p className={`m-0 text-xs leading-6 ${t.subText}`}>{item.body}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
