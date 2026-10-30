"use client";
import { useRouter } from "next/navigation";
import { useTheme } from "@/context/ThemeContext";
import { useLocale, useTranslations } from "next-intl";
import { FiBookOpen } from "react-icons/fi";
import {
  LuCompass,
  LuFileUp,
  LuRocket,
  LuCircleDollarSign,
  LuScissors,
  LuBadgeCheck,
  LuShare2,
} from "react-icons/lu";
import { RiMegaphoneLine } from "react-icons/ri";
import { PiMoney } from "react-icons/pi";

const STEPS = [
  { id: 1, icon: RiMegaphoneLine, tone: "green", footIcon: LuBadgeCheck },
  { id: 2, icon: LuScissors, tone: "yellow", footIcon: LuShare2 },
  { id: 3, icon: PiMoney, tone: "green", footIcon: LuBadgeCheck },
];

export default function EmptyState({ onSubmitLink }) {
  const { isDark } = useTheme();
  const locale = useLocale();
  const t = useTranslations("Earnings.empty");
  const router = useRouter();

  const card = isDark
    ? "bg-[#191C1D] border-[#191C1D]"
    : "bg-white border-[#E5E5E5]";
  const sub = isDark ? "text-[#9A9A9A]" : "text-[#666666]";

  // لايت: أخضر وأصفر أغمق عشان يبينوا على الأبيض
  const tones = {
    green: {
      box: "bg-[#10B981]/15",
      icon: isDark ? "#94D3C1" : "#0F9D75",
      foot: isDark ? "text-[#94D3C1]" : "text-[#0B7A5A]",
    },
    yellow: {
      box: isDark ? "bg-[#F5C84C]/15" : "bg-[#F5C84C]/25",
      icon: isDark ? "#F5C84C" : "#9A6700",
      foot: isDark ? "text-[#F5C84C]" : "text-[#8A5A00]",
    },
  };

  return (
    <div className="flex flex-col gap-4">
      {/* الحالة الفارغة */}
      <div
        className={`rounded-2xl border p-6 sm:p-10 flex flex-col items-center text-center ${card}`}
      >
        <div className="relative mb-6">
          <div
            className={`w-[104px] h-[104px] rounded-[28px] flex items-center justify-center border ${
              isDark
                ? "bg-[#14171A] border-[#2A2E2F]"
                : "bg-[#F5F5F5] border-[#E5E5E5]"
            }`}
          >
            <div className="w-[76px] h-[76px] rounded-2xl flex items-center justify-center bg-gradient-to-br from-[#FB8B04] to-[#F96303]">
              <FiBookOpen size={34} color="#ffffff" />
            </div>
          </div>

          <span className="absolute -top-2 -left-2 w-8 h-8 rounded-[12px] flex items-center justify-center bg-[#94D3C1]">
            <LuCircleDollarSign size={18} strokeWidth={2.5} color="#0B3B33" />
          </span>

          <span className="absolute -bottom-2 -right-2 w-8 h-8 rounded-lg flex items-center justify-center bg-[#F5C84C]">
            <LuRocket size={16} color="#4A3200" />
          </span>
        </div>

        <h2 className="text-xl sm:text-2xl font-bold">{t("title")}</h2>

        <p className={`text-sm mt-3 max-w-md leading-loose ${sub}`}>
          {t("desc")}
        </p>

        <div className="flex flex-col sm:flex-row gap-3 mt-7">
          <button
            type="button"
            onClick={() => router.push(`/${locale}/creator/discover`)}
            className="
              flex items-center justify-center gap-2.5
              px-6 py-3 rounded-xl
              bg-gradient-to-r from-[#FB8B04] to-[#F96303]
              text-white text-sm font-bold
              border-none cursor-pointer
              shadow-[0_6px_20px_rgba(249,99,3,0.35)]
              hover:opacity-90 transition-opacity
            "
          >
            <LuCompass size={18} color="#ffffff" />
            {t("explore")}
          </button>

          <button
            type="button"
            onClick={onSubmitLink}
            className={`
              flex items-center justify-center gap-2.5
              px-6 py-3 rounded-xl text-sm font-bold
              border-none cursor-pointer transition-colors
              ${
                isDark
                  ? "bg-[#2A2E2F] text-white hover:bg-[#33383A]"
                  : "bg-[#EAEAEA] text-[#333] hover:bg-[#DDDDDD]"
              }
            `}
          >
            <LuFileUp size={18} color={isDark ? "#94D3C1" : "#0B7A5A"} />
            {t("submit")}
          </button>
        </div>
      </div>

      {/* كيف تبدأ */}
      <div>
        <div className="flex items-center justify-between gap-1 mb-3">
          <div className="flex items-center gap-2">
            <span
              className={`w-1.5 h-6 rounded-full ${
                isDark ? "bg-[#F5C84C]" : "bg-[#E0A800]"
              }`}
            />
            <h3 className="text-lg font-bold">{t("howTitle")}</h3>
          </div>
          <span className={`text-[11px] hidden sm:block ${sub}`}>
            {t("howSub")}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {STEPS.map((s) => {
            const Icon = s.icon;
            const FootIcon = s.footIcon;
            const tone = tones[s.tone];

            return (
              <div
                key={s.id}
                className={`rounded-2xl border p-5 flex flex-col ${card}`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div
                    className={`w-11 h-11 rounded-xl flex items-center justify-center ${tone.box}`}
                  >
                    <Icon size={20} color={tone.icon} />
                  </div>

                  <span
                    dir="ltr"
                    className={`text-3xl font-bold font-mono ${
                      isDark ? "text-white/15" : "text-black/15"
                    }`}
                  >
                    {String(s.id).padStart(2, "0")}
                  </span>
                </div>

                <p className="text-sm font-bold">{t(`steps.${s.id}.title`)}</p>
                <p className={`text-xs mt-2 leading-relaxed ${sub}`}>
                  {t(`steps.${s.id}.desc`)}
                </p>

                <div className="mt-auto pt-4">
                  <div
                    className={`pt-3 border-t ${
                      isDark ? "border-white/10" : "border-black/10"
                    }`}
                  >
                    <span
                      className={`flex items-center gap-1.5 text-[11px] font-bold ${tone.foot}`}
                    >
                      <FootIcon size={13} />
                      {t(`steps.${s.id}.foot`)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}