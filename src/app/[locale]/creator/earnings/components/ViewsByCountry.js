"use client";
import { useTheme } from "@/context/ThemeContext";
import { useLocale, useTranslations } from "next-intl";
import { FiGlobe } from "react-icons/fi";

// لون نسبة "من المشاهدات" لكل دولة: [دارك, لايت]
const PERCENT_COLORS = {
  SA: ["#94D3C1", "#0B7A5A"],
  AE: ["#94D3C1", "#0B7A5A"],
  EG: ["#E9C349", "#9A6700"],
};
const DEFAULT_PERCENT_COLOR = ["#9A9A9A", "#666666"];

// النسب = المبلغ ÷ الإجمالي (1670): 60 / 20 / 10 / 10
const DEFAULT_DATA = [
  { code: "SA", percent: 60, amount: 1002 },
  { code: "EG", percent: 20, amount: 334 },
  { code: "AE", percent: 10, amount: 167 },
  { code: "OT", percent: 10, amount: 167 },
];

export default function ViewsByCountry({ countries }) {
  const { isDark } = useTheme();
  const isAr = useLocale() === "ar";
  const t = useTranslations("Earnings.countries");

  const card = isDark
    ? "bg-[#191C1D] border-[#191C1D]"
    : "bg-white border-[#E5E5E5]";
  const sub = isDark ? "text-[#9A9A9A]" : "text-[#666666]";

  const data = countries || DEFAULT_DATA;

  return (
    <div className={`rounded-2xl border p-4 sm:p-6 ${card}`}>
      <h2 className="text-lg sm:text-xl font-bold">{t("title")}</h2>
      <p className={`text-xs mt-1 mb-5 ${sub}`}>{t("subtitle")}</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {data.map((c, index) => {
          const isTop = index === 0;
          const [pDark, pLight] =
            PERCENT_COLORS[c.code] || DEFAULT_PERCENT_COLOR;
          const percentColor = isDark ? pDark : pLight;
          const name = c.name || t(`names.${c.code}`);

          return (
            <div
              key={c.code}
              className={`
                rounded-xl border p-3.5 sm:p-4 flex flex-col justify-between gap-3
                transition-all duration-200
                ${
                  isDark
                    ? `bg-[#0F1112] ${isTop ? "border-white/15" : "border-transparent"}`
                    : `bg-[#FAFAFA] ${isTop ? "border-[#BDBDBD]" : "border-[#E5E5E5]"}`
                }
              `}
            >
              {/* الصف العلوي: العلم واسم الدولة على جانب، والمبلغ على الجانب الآخر بدون أي تداخل */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="flex-shrink-0 flex items-center">
                    {c.code !== "OT" ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={`https://flagcdn.com/w40/${c.code.toLowerCase()}.png`}
                        alt={name}
                        width={24}
                        height={16}
                        className={`rounded-[3px] object-cover border flex-shrink-0 ${
                          isDark ? "border-white/10" : "border-black/10"
                        }`}
                      />
                    ) : (
                      <FiGlobe size={20} color={isDark ? "#D1D5DB" : "#555555"} className="flex-shrink-0" />
                    )}
                  </div>
                  <p className="text-[13px] sm:text-sm font-bold truncate">{name}</p>
                </div>

                <p dir="ltr" className="text-xs sm:text-sm font-extrabold flex-shrink-0">
                  ${c.amount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                </p>
              </div>

              {/* الصف السفلي: النسبة من المشاهدات وشريط بياني أنيق */}
              <div>
                <div className="flex items-center justify-between text-[11px] font-bold mb-1.5">
                  <span style={{ color: percentColor }}>
                    {t("percentOf", { percent: c.percent })} {t("views")}
                  </span>
                  <span className={`text-[10px] ${sub}`}>{c.percent}%</span>
                </div>
                <div
                  className={`h-1.5 w-full rounded-full overflow-hidden ${
                    isDark ? "bg-white/10" : "bg-black/5"
                  }`}
                >
                  <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{
                      width: `${c.percent}%`,
                      backgroundColor: percentColor,
                    }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
