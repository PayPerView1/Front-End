"use client";
import { useState } from "react";
import { useTheme } from "@/context/ThemeContext";
import { useLocale, useTranslations } from "next-intl";
import { FiCheck } from "react-icons/fi";

// [دارك, لايت]
const PLATFORM_TEXT = {
  TikTok: ["text-[#2DD4BF]", "text-[#0F766E]"],
  Reels: ["text-[#F472B6]", "text-[#BE185D]"],
  Shorts: ["text-[#EF4444]", "text-[#B91C1C]"],
};

export default function VideosTable({ videos = [], onWithdraw }) {
  const { isDark } = useTheme();
  const isAr = useLocale() === "ar";
  const t = useTranslations("Earnings.videos");
  const [filter, setFilter] = useState("all");

  const card = isDark
    ? "bg-[#191C1D] border-[#191C1D]"
    : "bg-white border-[#E5E5E5]";
  const sub = isDark ? "text-[#9A9A9A]" : "text-[#666666]";
  const rowBorder = isDark ? "border-white/[0.06]" : "border-[#E5E5E5]";
  const soft = isDark ? "bg-white/[0.05]" : "bg-black/5";

  const filters = [
    { key: "all", label: t("filters.all"), count: videos.length },
    { key: "ready", label: t("filters.ready") },
    { key: "review", label: t("filters.review") },
  ];

  const statusMap = {
    ready: {
      label: t("status.ready"),
      cls: isDark
        ? "bg-[#10B9811A] text-[#94D3C1]"
        : "bg-[#10B981]/10 text-[#0B7A5A]",
      icon: (
        <span
          className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
            isDark ? "bg-[#94D3C1]" : "bg-[#0F9D75]"
          }`}
        />
      ),
      earningCls: isDark ? "text-[#94D3C1]" : "text-[#0B7A5A]",
    },
    review: {
      label: t("status.review", { days: 0 }),
      cls: isDark
        ? "bg-[#E9C349]/15 text-[#E9C349]"
        : "bg-[#E9C349]/25 text-[#8A5A00]",
      icon: (
        <span
          className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
            isDark ? "bg-[#E9C349]" : "bg-[#C99700]"
          }`}
        />
      ),
      earningCls: isDark ? "text-[#E9C349]" : "text-[#9A6700]",
    },
    paid: {
      label: t("status.paid"),
      cls: isDark
        ? "bg-white/[0.06] text-[#D1D5DB]"
        : "bg-[#EAEAEA] text-[#555555]",
      icon: (
        <FiCheck
          size={10}
          color={isDark ? "#94D3C1" : "#0F9D75"}
          className="flex-shrink-0"
        />
      ),
      earningCls: "",
    },
  };

  const rows = videos.filter((v) => filter === "all" || v.status === filter);

  const headers = [
    t("headers.video"),
    t("headers.platform"),
    t("headers.views"),
    t("headers.cpm"),
    t("headers.earnings"),
    t("headers.status"),
    t("headers.action"),
  ];

  return (
    <div className={`rounded-2xl border p-4 sm:p-6 ${card}`}>
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
        <div>
          <h2 className="text-lg sm:text-xl font-bold">{t("title")}</h2>
          <p className={`text-xs mt-1 ${sub}`}>{t("subtitle")}</p>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {filters.map((f) => {
            const active = filter === f.key;
            return (
              <button
                key={f.key}
                type="button"
                onClick={() => setFilter(f.key)}
                className={`text-[11px] font-bold px-3.5 py-1.5 rounded-full border-none cursor-pointer transition-colors ${
                  active
                    ? "bg-[#94D3C1] text-[#0F1112]"
                    : isDark
                      ? "bg-transparent text-[#D1D5DB] hover:bg-white/10"
                      : "bg-transparent text-[#555] hover:bg-black/5"
                }`}
              >
                {f.label}
                {f.count ? ` (${f.count})` : ""}
              </button>
            );
          })}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[820px] text-sm">
          <thead>
            <tr>
              {headers.map((h, i) => (
                <th
                  key={h}
                  className={`py-3 px-2 text-[11px] font-medium ${sub} ${
                    i === 0 ? "text-start" : "text-center"
                  }`}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {rows.map((v) => {
              const st = statusMap[v.status] || statusMap.review;
              const statusLabel =
                v.status === "review" ? t("status.review", { days: 7 })
                  : v.status === "ready" ? t("status.ready")
                    : v.status === "paid" ? t("status.paid")
                      : v.status === "reserved" ? (isAr ? "السحب قيد المعالجة" : "Withdrawal pending")
                        : v.status === "rejected" ? (isAr ? "مرفوض" : "Rejected")
                          : st.label;
              const platformCls =
                (PLATFORM_TEXT[v.platform] || ["", ""])[isDark ? 0 : 1];

              return (
                <tr key={v.id} className={`border-b last:border-b-0 ${rowBorder}`}>
                  <td className="py-5 px-2">
                    <div className="flex items-center gap-3">
                      {v.thumb ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={v.thumb}
                          alt=""
                          className={`w-9 h-9 rounded-lg flex-shrink-0 object-cover border ${rowBorder}`}
                        />
                      ) : (
                        <div
                          className={`w-9 h-9 rounded-lg flex-shrink-0 ${soft}`}
                        />
                      )}
                      <div className="max-w-[190px]">
                        <p className="font-bold text-[13px] leading-snug">
                          {v.title}
                        </p>
                        <p className={`text-[10px] mt-0.5 leading-snug ${sub}`}>
                          {t("campaignLine", {
                            campaign: v.campaign,
                            date: v.publishedAt,
                          })}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="py-5 px-2 text-center">
                    <span
                      className={`inline-block text-[10px] px-2 py-1 rounded-md font-bold ${soft} ${platformCls}`}
                    >
                      {v.platform}
                    </span>
                  </td>

                  <td className="py-5 px-2 text-center font-bold leading-tight">
                    <span className="block text-sm">
                      {Number.isFinite(v.views) ? v.views.toLocaleString("en-US") : "—"}
                    </span>
                    <span className={`block text-[10px] font-medium ${sub}`}>
                      {t("viewsWord")}
                    </span>
                  </td>

                  <td className="py-5 px-2 text-center text-xs">
                    {Number.isFinite(v.cpm) ? `$${v.cpm.toFixed(2)}` : "—"}
                  </td>

                  <td
                    className={`py-5 px-2 text-center font-bold text-sm ${st.earningCls}`}
                  >
                    {`$${Number(v.earning || 0).toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                    })}`}
                  </td>

                  <td className="py-5 px-2 text-center">
                    <span
                      className={`inline-flex items-center justify-center gap-1.5 text-[10px] px-3 py-1.5 rounded-2xl font-bold max-w-[140px] leading-tight text-center ${st.cls}`}
                    >
                      {st.icon}
                      {statusLabel}
                    </span>
                  </td>

                  <td className="py-5 px-2 text-center">
                    {v.status === "ready" ? (
                      <button
                        type="button"
                        onClick={onWithdraw}
                        className={`text-[11px] font-bold px-4 py-1.5 rounded-lg border-none cursor-pointer transition-colors ${
                          isDark
                            ? "bg-white/[0.06] text-[#94D3C1] hover:bg-white/10"
                            : "bg-[#10B981]/10 text-[#0B7A5A] hover:bg-[#10B981]/20"
                        }`}
                      >
                        {t("actions.withdrawNow")}
                      </button>
                    ) : v.status === "review" ? (
                      <span className={`text-[11px] ${sub}`}>
                        {t("actions.autoAvailable")}
                      </span>
                    ) : null}
                  </td>
                </tr>
              );
            })}

            {rows.length === 0 && (
              <tr>
                <td colSpan={7} className={`py-8 text-center text-sm ${sub}`}>
                  {t("empty")}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
