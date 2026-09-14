"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "@/context/ThemeContext";
import { useLocale, useTranslations } from "next-intl";
import { MdOutlineFileDownload, MdOutlineChevronRight } from "react-icons/md";
import { HiOutlineDocumentDuplicate } from "react-icons/hi";
import { MdTrendingUp, MdTrendingDown } from "react-icons/md";
import { exportCampaign } from "@/services/campaign";

// ===== helpers =====
function formatDate(dateStr, locale) {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString(
    locale === "ar" ? "ar-SA" : "en-US",
    { year: "numeric", month: "long", day: "2-digit" }
  );
}

function buildTimeline(campaign, locale) {
  const actionMap = {
    CREATED: "created",
    SUBMITTED: "underReview",
    AI_APPROVED: "approved",
    ACTIVATED: "activeStatus",
  };

  const base = [
    { key: "created", date: "", done: false, active: false },
    { key: "underReview", date: "", done: false, active: false },
    { key: "approved", date: "", done: false, active: false },
    { key: "activeStatus", date: "", done: false, active: false },
    { key: "completedStatus", date: "", done: false, active: false, last: true },
  ];

  campaign.statusHistory?.forEach((h) => {
    const key = actionMap[h.action];
    const item = base.find((b) => b.key === key);
    if (item) {
      item.done = true;
      item.date = formatDate(h.createdAt, locale);
    }
  });

  if (campaign.status === "ACTIVE") {
    const item = base.find((b) => b.key === "activeStatus");
    if (item) { item.active = true; item.done = false; }
  }

  if (["COMPLETED", "CANCELLED", "ARCHIVED", "EXPIRED"].includes(campaign.status)) {
    base.forEach((b) => { b.done = true; b.active = false; });
    const last = base.find((b) => b.key === "completedStatus");
    if (last) last.date = formatDate(campaign.completedAt, locale);
  }

  return base;
}

function formatBudget(num) {
  if (!num && num !== 0) return "-";
  return `$${Number(num).toLocaleString()}`;
}

// ← بيستقبل campaign object مش campaignId
export default function CampaignDetails({ campaign }) {
  const { isDark } = useTheme();
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations("campaigns");
  const isRTL = locale === "ar";
  const [exporting, setExporting] = useState(false);

  const th = {
    bg: isDark ? "bg-[#0D0D0D]" : "bg-[#F0F2F5]",
    text: isDark ? "text-white" : "text-[#111827]",
    subText: isDark ? "text-[#9A9A9A]" : "text-[#6B7280]",
    divider: isDark ? "border-[#1E2D3D]" : "border-[#E5E7EB]",
    cardBorder: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)",
    cardBg: isDark ? "rgba(255,255,255,0.01)" : "rgba(255,255,255,1)",
    timelineEmpty: isDark ? "bg-[#2D2D2D] border-[#3D3D3D]" : "bg-[#E5E7EB] border-[#D1D5DB]",
    btnBorder: isDark ? "#3F4945" : "#D1D5DB",
    btnText: isDark ? "#94D3C1" : "#4B7A6E",
    copyBorder: isDark ? "#E9C349" : "#D97706",
    copyText: isDark ? "#E9C349" : "#D97706",
    gradientLine: isDark
      ? "linear-gradient(to right, #94D3C180, #94D3C100)"
      : "linear-gradient(to right, #94D3C160, #94D3C100)",
    gradientRight: isDark
      ? "linear-gradient(to bottom, #E9C349, #E9C34900)"
      : "linear-gradient(to bottom, #E9C34980, #E9C34900)",
  };

  const timeline = buildTimeline(campaign, locale);

  const kpis = [
    {
      label: t("budgetUsed"),
      value: formatBudget(campaign.stats?.totalSpent),
      sub: `${t("from")} ${formatBudget(campaign.totalBudget)}`,
      color: isDark ? "#94D3C1" : "#111827",
      positive: null,
    },
    {
      label: t("impressions"),
      value: Number(campaign.stats?.totalViews || 0).toLocaleString(),
      sub: null,
      color: isDark ? "#E1E3E4" : "#111827",
      positive: null,
    },
    {
      label: t("clicks"),
      value: Number(campaign.stats?.totalApprovedVideos || 0).toLocaleString(),
      sub: null,
      color: isDark ? "#E1E3E4" : "#111827",
      positive: null,
    },
    {
      label: t("conversionRate"),
      value: String(campaign.stats?.totalCreators || 0),
      sub: null,
      color: isDark ? "#E1E3E4" : "#111827",
      positive: null,
    },
  ];

  const details = [
    { label: t("startDateLabel"), value: formatDate(campaign.createdAt, locale) },
    { label: t("endDate"), value: formatDate(campaign.completedAt, locale) || "-" },
    { label: t("targetType"), value: campaign.contentType || "-" },
    {
      label: t("platforms"),
      value: (
        <div className="flex items-center gap-2">
          {campaign.targetCountries?.slice(0, 3).map((c, i) => (
            <span key={i} className={`text-xs px-1.5 py-0.5 rounded ${isDark ? "bg-white/10 text-white" : "bg-gray-100 text-gray-700"}`}>
              {c}
            </span>
          ))}
        </div>
      ),
    },
  ];

  const handleExport = async () => {
    setExporting(true);
    try {
      await exportCampaign(campaign._id);
    } catch (err) {
      console.error(err);
    } finally {
      setExporting(false);
    }
  };

  return (
    <div dir={isRTL ? "rtl" : "ltr"} className={`flex flex-col flex-1 min-h-screen px-3 sm:px-5 py-4 gap-5 ${th.bg}`}>
      {/* زر الرجوع */}
      <div className="flex items-center mt-3 px-1">
        <button type="button" onClick={() => router.back()}
          className={`flex items-center gap-1 text-sm cursor-pointer bg-transparent border-none ${th.subText} hover:text-[#94D3C1] transition-colors`}>
          <MdOutlineChevronRight size={20} style={{ transform: isRTL ? "rotate(0deg)" : "rotate(180deg)" }} />
          {t("back")}
        </button>
      </div>

      {/* الهيدر */}
      <div className="flex flex-col gap-4 px-1">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className={isRTL ? "text-right" : "text-left"}>
            <h1 className={`text-xl sm:text-2xl font-bold ${th.text}`}>{campaign.name}</h1>
            <p className={`text-xs mt-1 ${th.subText}`}>
              {t("campaignNumber")}: #{campaign._id?.slice(-8).toUpperCase()} | {t("client")}: {campaign.brief?.mainIdea?.slice(0, 30) || "-"}
            </p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <button type="button"
              onClick={() => router.push(`/${locale}/advertiser/campaigns/${campaign._id}/copy`)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-bold cursor-pointer bg-transparent transition-all hover:opacity-80"
              style={{ borderColor: th.copyBorder, color: th.copyText }}>
              <HiOutlineDocumentDuplicate size={14} color={th.copyText} />
              {t("copy")}
            </button>
            <button type="button" onClick={handleExport} disabled={exporting}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-bold cursor-pointer bg-transparent transition-all hover:opacity-80 disabled:opacity-50"
              style={{ borderColor: th.btnBorder, color: th.btnText }}>
              <MdOutlineFileDownload size={14} color={th.btnText} />
              {exporting ? "..." : t("export")}
            </button>
          </div>
        </div>

        {/* الكاردات */}
        <div className="flex flex-col lg:flex-row gap-4 mt-2">
          {/* مؤشرات الأداء */}
          <div className="flex-[7] p-4 flex flex-col gap-3 relative overflow-hidden rounded-xl"
            style={{ border: `1px solid ${th.cardBorder}`, background: th.cardBg, backdropFilter: "blur(20px)" }}>
            <div className="absolute top-0 left-0 w-full h-[3px]" style={{ background: th.gradientLine }} />
            <h2 className={`text-base font-bold pt-1 ${isRTL ? "text-right" : "text-left"} ${th.text}`}>{t("kpi")}</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
              {kpis.map((kpi, i) => (
                <div key={kpi.label} className={`flex flex-col gap-1 ${isRTL ? "text-right" : "text-left"} ${
                  i > 0 ? `lg:border-${isRTL ? "r" : "l"} ${th.divider} lg:${isRTL ? "pr" : "pl"}-4` : ""}`}>
                  <p className={`text-xs ${th.subText}`}>{kpi.label}</p>
                  <p className="text-xl sm:text-2xl font-bold" style={{ color: kpi.color }}>{kpi.value}</p>
                  {kpi.sub && (
                    <p className={`text-[10px] flex items-center gap-0.5 ${
                      kpi.positive === true ? "text-green-400" : kpi.positive === false ? "text-red-400" : th.subText}`}>
                      {kpi.positive === true && <MdTrendingUp size={12} />}
                      {kpi.positive === false && <MdTrendingDown size={12} />}
                      {kpi.sub}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* تفاصيل العرض */}
          <div className="flex-[3] p-4 flex flex-col gap-3 relative overflow-hidden rounded-xl"
            style={{ border: `1px solid ${th.cardBorder}`, background: th.cardBg, backdropFilter: "blur(20px)" }}>
            <div className={`absolute top-0 ${isRTL ? "right-0" : "left-0"} h-full w-[3px]`} style={{ background: th.gradientRight }} />
            <h2 className={`text-base font-bold ${isRTL ? "text-right" : "text-left"} ${th.text}`}>{t("viewDetails")}</h2>
            <div className="flex flex-col gap-0">
              {details.map((item, i, arr) => (
                <div key={item.label} className={`flex items-center justify-between py-3 ${i < arr.length - 1 ? `border-b ${th.divider}` : ""}`}>
                  <span className={`text-sm ${th.subText}`}>{item.label}</span>
                  <span className={`text-sm ${th.text}`}>{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="px-4 py-4 mx-1 flex flex-col gap-4 relative overflow-hidden rounded-xl"
        style={{ border: `1px solid ${th.cardBorder}`, background: th.cardBg, backdropFilter: "blur(20px)" }}>
        <div className="absolute top-0 left-0 w-full h-[3px]" style={{ background: th.gradientLine }} />
        <h2 className={`text-lg font-semibold pt-1 ${isRTL ? "text-right" : "text-left"} ${th.text}`}>{t("campaignStatus")}</h2>

        {/* Desktop */}
        <div className="hidden sm:block relative w-full h-[80px]" dir={isRTL ? "rtl" : "ltr"}>
          <div className="absolute inset-x-4 top-0 h-full">
            <div className="absolute z-0" style={{
              top: "16px", right: isRTL ? "0" : "auto", left: isRTL ? "auto" : "0",
              width: "100%", height: "1.5px", background: isDark ? "#3F4945" : "#d1d5db",
            }} />
            {(() => {
              const activeIndex = timeline.findIndex((s) => s.active);
              const total = timeline.length;
              const pct = total > 1 && activeIndex >= 0 ? ((activeIndex - 0.5) / (total - 1)) * 100 : 0;
              return (
                <div className="absolute z-0" style={{
                  top: "16px", right: isRTL ? "0" : "auto", left: isRTL ? "auto" : "0",
                  width: `${pct}%`, height: "1.5px", background: isDark ? "#94D3C1" : "#4B7A6E",
                }} />
              );
            })()}
            {timeline.map((step, i) => {
              const position = timeline.length > 1 ? (i / (timeline.length - 1)) * 100 : 50;
              const posStyle = isRTL ? { right: `${position}%`, transform: "translateX(50%)" } : { left: `${position}%`, transform: "translateX(-50%)" };
              return (
                <div key={i} className="absolute z-10 flex flex-col items-center" style={{ ...posStyle, top: "0" }}>
                  {step.active ? (
                    <div className="w-8 h-8 rounded-full border-2 flex items-center justify-center" style={{
                      borderColor: isDark ? "#94D3C1" : "#4B7A6E",
                      backgroundColor: isDark ? "rgba(40,42,43,1)" : "white",
                      boxShadow: `0 0 16px ${isDark ? "rgba(148,211,193,0.5)" : "rgba(75,122,110,0.2)"}`,
                    }}>
                      <div className="w-2.5 h-2.5 rounded-full" style={{ background: isDark ? "#94D3C1" : "#4B7A6E" }} />
                    </div>
                  ) : step.done ? (
                    <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: isDark ? "#94D3C1" : "#4B7A6E" }}>
                      <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                        <path d="M2.5 6.5L5.5 9.5L10.5 3.5" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                  ) : (
                    <div className={`w-8 h-8 rounded-full border ${th.timelineEmpty}`} />
                  )}
                  <div className="flex flex-col items-center gap-0.5 text-center mt-1">
                    <span className={`text-xs font-bold whitespace-nowrap ${step.active || step.done ? (isDark ? "text-[#94D3C1]" : "text-[#4B7A6E]") : th.subText}`}>
                      {t(step.key)}
                    </span>
                    {step.date && <span className={`text-[10px] whitespace-nowrap ${th.subText}`}>{step.date}</span>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Mobile */}
        <div className="flex sm:hidden flex-col gap-0 pr-2">
          {timeline.map((step, i) => (
            <div key={i} className="flex items-start gap-3">
              <div className="flex flex-col items-center">
                {step.active ? (
                  <div className="w-7 h-7 rounded-full border-2 flex items-center justify-center flex-shrink-0"
                    style={{ borderColor: isDark ? "#94D3C1" : "#4B7A6E", backgroundColor: isDark ? "rgba(40,42,43,1)" : "white" }}>
                    <div className="w-2 h-2 rounded-full" style={{ background: isDark ? "#94D3C1" : "#4B7A6E" }} />
                  </div>
                ) : step.done ? (
                  <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: isDark ? "#94D3C1" : "#4B7A6E" }}>
                    <svg width="11" height="11" viewBox="0 0 13 13" fill="none">
                      <path d="M2.5 6.5L5.5 9.5L10.5 3.5" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                ) : (
                  <div className={`w-7 h-7 rounded-full border ${th.timelineEmpty}`} />
                )}
                {i < timeline.length - 1 && (
                  <div className="w-[1.5px] h-6 mt-1" style={{ background: step.done ? (isDark ? "#94D3C1" : "#4B7A6E") : (isDark ? "#3F4945" : "#d1d5db") }} />
                )}
              </div>
              <div className="pb-4">
                <p className={`text-sm font-bold ${step.active || step.done ? (isDark ? "text-[#94D3C1]" : "text-[#4B7A6E]") : th.subText}`}>
                  {t(step.key)}
                </p>
                {step.date && <p className={`text-xs ${th.subText}`}>{step.date}</p>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}