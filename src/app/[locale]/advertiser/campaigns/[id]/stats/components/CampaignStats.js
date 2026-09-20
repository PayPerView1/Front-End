"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "@/context/ThemeContext";
import { useLocale, useTranslations } from "next-intl";
import { MdOutlineChevronRight, MdOutlineFileDownload } from "react-icons/md";
import {
  MdOutlineVideoLibrary,
  MdOutlinePeopleAlt,
  MdOutlineSlideshow,
  MdOutlineAudiotrack,
  MdOutlineBadge,
  MdOutlineGridView,
} from "react-icons/md";
import { getCampaignById, getCampaignStatisticsById, getCampaignStatistics, exportCampaign } from "@/services/campaign";

const donutColors = ["#94D3C1", "#E9C349", "#284943", "#3F4945"];

function DonutChart({ segments, total, isDark, totalLabel }) {
  const size = 160;
  const cx = size / 2;
  const cy = size / 2;
  const r = 55;
  const strokeWidth = 22;
  const circumference = 2 * Math.PI * r;

  const segmentsWithOffset = segments.reduce((acc, seg, i) => {
    const prevOffset = i === 0 ? 0 : acc[i - 1].offset + acc[i - 1].dash;
    const dash = (seg.pct / 100) * circumference;
    acc.push({ ...seg, dash, offset: prevOffset });
    return acc;
  }, []);

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle
        cx={cx}
        cy={cy}
        r={r}
        fill="none"
        stroke={isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}
        strokeWidth={strokeWidth}
      />
      {segmentsWithOffset.map((seg, i) => (
        <circle
          key={i}
          cx={cx}
          cy={cy}
          r={r}
          fill="none"
          stroke={donutColors[i % donutColors.length]}
          strokeWidth={strokeWidth}
          strokeDasharray={`${seg.dash} ${circumference - seg.dash}`}
          strokeDashoffset={-seg.offset}
          style={{ transform: "rotate(-90deg)", transformOrigin: "center" }}
        />
      ))}
      <text
        x={cx}
        y={cy - 6}
        textAnchor="middle"
        fill="#94D3C1"
        fontSize="22"
        fontWeight="bold"
      >
        {total}
      </text>
      <text x={cx} y={cy + 14} textAnchor="middle" fill="#89938F" fontSize="10">
        {totalLabel}
      </text>
    </svg>
  );
}

export default function CampaignStats({ campaignId }) {
  const { isDark } = useTheme();
  const router = useRouter();
  const locale = useLocale();
  const isRTL = locale === "ar";
  const t = useTranslations("campaigns");

  // categoryConfig داخل الكومبوننت لأنها بتستخدم t()
  const categoryConfig = {
    UGC: {
      label: t("categoryUGC"),
      icon: MdOutlinePeopleAlt,
      color: "#94D3C1",
      lightColor: "#0E7C65",
      barColor: isDark ? "#94D3C1" : "#0DA88C",
    },
    CLIPPING: {
      label: t("categoryClipping"),
      icon: MdOutlineVideoLibrary,
      color: "#E9C349",
      lightColor: "#9A7A00",
      barColor: isDark ? "#E9C349" : "#C49E00",
    },
    SLIDESHOW: {
      label: t("categorySlideshow"),
      icon: MdOutlineSlideshow,
      color: "#A78BFA",
      lightColor: "#6D28D9",
      barColor: isDark ? "#A78BFA" : "#7C3AED",
    },
    AUDIO: {
      label: t("categoryAudio"),
      icon: MdOutlineAudiotrack,
      color: "#F97316",
      lightColor: "#C2410C",
      barColor: isDark ? "#F97316" : "#EA580C",
    },
    LOGO: {
      label: t("categoryLogo"),
      icon: MdOutlineBadge,
      color: "#38BDF8",
      lightColor: "#0369A1",
      barColor: isDark ? "#38BDF8" : "#0284C7",
    },
    MIXED: {
      label: t("categoryMixed"),
      icon: MdOutlineGridView,
      color: "#94D3C1",
      lightColor: "#0E7C65",
      barColor: isDark ? "#94D3C1" : "#0DA88C",
    },
  };

  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(!!campaignId);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!campaignId) return;
    setLoading(true);

    Promise.allSettled([
      getCampaignById(campaignId),
      getCampaignStatisticsById(campaignId),
    ])
      .then(([campaignRes, statsRes]) => {
        const campaignData = campaignRes.status === "fulfilled"
          ? (campaignRes.value?.data?.campaign || campaignRes.value?.campaign || (campaignRes.value?.data && typeof campaignRes.value.data === "object" ? campaignRes.value.data : null))
          : null;
        
        const statistics = statsRes.status === "fulfilled"
          ? (statsRes.value?.data || statsRes.value)
          : null;

        const categoriesStats = statistics?.categoriesStats || [];
        const categoryDistribution = statistics?.categoryDistribution || [];

        if (campaignData) {
          let categoryBreakdown = [];
          if (categoriesStats.length > 0) {
            categoryBreakdown = categoriesStats.map((cs) => ({
              type: cs.category,
              spent: cs.totalSpent ?? 0,
              reach: cs.reach ?? 0,
              ctr: cs.ctr ?? 0,
              roi: cs.roi ?? 0,
              progress: cs.budgetUtilizationPercentage ?? 0,
              activeCampaignsCount: cs.activeCampaignsCount ?? 0,
              growthRate: cs.growthRate ?? 0,
            }));
          } else if (categoryDistribution.length > 0) {
            categoryBreakdown = categoryDistribution.map((cd) => ({
              type: cd.category,
              spent: Math.round((cd.percentage / 100) * (campaignData?.stats?.totalSpent || campaignData?.totalBudget || 0)),
              reach: Math.round((cd.percentage / 100) * (campaignData?.stats?.totalViews || 0)),
              ctr: 0,
              roi: 0,
              progress: cd.percentage,
            }));
          } else {
            categoryBreakdown = [
              {
                type: campaignData.contentType || campaignData.category || "CLIPPING",
                spent: Number(campaignData.stats?.totalSpent || campaignData.spent || 0),
                reach: Number(campaignData.stats?.totalViews || campaignData.views || 0),
                ctr: 0,
                roi: 0,
                progress: Number(campaignData.totalBudget) > 0 ? Math.min(100, Math.round(((campaignData.stats?.totalSpent || 0) / Number(campaignData.totalBudget)) * 100)) : 0,
              },
            ];
          }

          setCampaign({
            ...campaignData,
            statistics,
            categoryBreakdown,
          });
        } else {
          setError("لم يتم العثور على بيانات هذه الحملة في قاعدة البيانات");
        }
      })
      .catch((err) => {
        console.error("Failed to load campaign stats:", err);
        // Fallback try loading campaign directly
        getCampaignById(campaignId)
          .then((res) => {
            const cData = res?.data?.campaign || res?.campaign || (res?.data && typeof res.data === "object" ? res.data : null);
            if (cData) {
              setCampaign(cData);
            } else {
              setError("تعذر جلب إحصائيات الحملة");
            }
          })
          .catch(() => setError("حدث خطأ أثناء الاتصال بالسيرفر"));
      })
      .finally(() => setLoading(false));
  }, [campaignId]);

  const handleExport = async () => {
    try {
      const res = await exportCampaign(campaignId);
      const url  = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href  = url;
      link.setAttribute("download", `campaign-${campaignId}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error("Export failed", err);
    }
  };

  const th = {
    bg: isDark ? "bg-[#0D0D0D]" : "bg-[#F0F2F5]",
    text: isDark ? "text-white" : "text-[#111827]",
    subText: isDark ? "text-[#9A9A9A]" : "text-[#5B6470]",
    cardBorder: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.09)",
    cardBg: isDark ? "rgba(255,255,255,0.02)" : "#FFFFFF",
    divider: isDark ? "#1E2D3D" : "#E2E6EA",
  };

  if (loading)
    return (
      <div className={`flex items-center justify-center min-h-screen ${th.bg}`}>
        <div className="w-8 h-8 border-2 border-[#94D3C1] border-t-transparent rounded-full animate-spin" />
      </div>
    );

  if (error || !campaign)
    return (
      <div className={`flex flex-col items-center justify-center min-h-screen p-4 ${th.bg}`}>
        <p className="text-red-400 text-sm font-semibold mb-4">{error || "لم يتم العثور على إحصائيات هذه الحملة"}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 text-xs rounded-lg bg-[#94D3C1] text-black font-bold cursor-pointer"
        >
          إعادة المحاولة
        </button>
      </div>
    );

  const breakdown = campaign.categoryBreakdown?.length
    ? campaign.categoryBreakdown
    : [
        {
          type: campaign.contentType || campaign.category || "CLIPPING",
          spent: Number(campaign.stats?.totalSpent || campaign.spent || 0),
          reach: Number(campaign.stats?.totalViews || campaign.views || 0),
          ctr: 0,
          roi: 0,
          progress: Number(campaign.totalBudget) > 0 ? Math.min(100, Math.round(((campaign.stats?.totalSpent || 0) / Number(campaign.totalBudget)) * 100)) : 0,
        },
      ];

  const total = Number(campaign.stats?.totalCreators || campaign.creatorsCount || 0);

  const legendItems = breakdown.map((item) => ({
    label: categoryConfig[item.type]?.label || item.type,
    pct: item.progress || (breakdown.length === 1 ? 100 : Math.round(100 / breakdown.length)),
  }));

  return (
    <div
      dir={isRTL ? "rtl" : "ltr"}
      className={`flex flex-col flex-1 min-h-screen px-4 sm:px-6 py-4 gap-5 ${th.bg}`}
    >
      {/* زر الرجوع */}
      <div className="flex items-center mt-3">
        <button
          type="button"
          onClick={() => router.back()}
          className={`flex items-center gap-1 text-sm cursor-pointer bg-transparent border-none ${th.subText} hover:text-[#94D3C1] transition-colors`}
        >
          <MdOutlineChevronRight
            size={20}
            style={{ transform: isRTL ? "rotate(0deg)" : "rotate(180deg)" }}
          />
          {t("back")}
        </button>
      </div>

      {/* الهيدر */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className={isRTL ? "text-right" : "text-left"}>
          <p className="text-xs mb-1" style={{ color: "#E9C349" }}>
            {t("overviewLabel")}
          </p>
          <h1 className={`text-xl sm:text-2xl font-bold ${th.text}`}>
            {t("statsTitle")}
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <button
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium cursor-pointer bg-transparent transition-all hover:opacity-80 ${th.subText}`}
            style={{ borderColor: th.divider }}
          >
            {t("last30days")}
          </button>
          <button
          onClick={handleExport}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-bold cursor-pointer bg-transparent transition-all hover:opacity-80"
            style={{ borderColor: "#E9C34950", color: "#E9C349" }}
          >
            <MdOutlineFileDownload size={14} color="#E9C349" />
            {t("export")}
          </button>
        </div>
      </div>

      {/* المحتوى الرئيسي */}
      <div className="flex flex-col lg:flex-row gap-4">
        {/* الدونات */}
        <div
          className="flex-[3] p-4 rounded-xl flex flex-col gap-4"
          style={{
            background: th.cardBg,
            border: `1px solid ${th.cardBorder}`,
          }}
        >
          <p
            className={`text-sm font-bold ${isRTL ? "text-right" : "text-left"} ${th.text}`}
          >
            {t("distribution")}
          </p>
          <div className="flex justify-center">
            <DonutChart
              segments={legendItems.map((l) => ({ pct: l.pct }))}
              total={total}
              isDark={isDark}
              totalLabel={t("totalCampaignsLabel")}
            />
          </div>
          <div className="flex flex-col gap-2 mt-2">
            {legendItems.map((item, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ background: donutColors[i % donutColors.length] }}
                  />
                  <span className={`text-xs ${th.subText}`}>{item.label}</span>
                </div>
                <span className={`text-xs font-bold ${th.text}`}>
                  {item.pct}%
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* كاردات الفئات */}
        <div className="flex-[7] flex flex-col gap-4">
          {breakdown.map((item, idx) => {
            const config = categoryConfig[item.type] || {
              label: item.type,
              icon: MdOutlineGridView,
              color: "#94D3C1",
              barColor: "#94D3C1",
            };
            const Icon = config.icon;
            return (
              <div
                key={idx}
                className="p-4 rounded-xl flex flex-col gap-4 relative"
                style={{
                  background: th.cardBg,
                  border: `1px solid ${th.cardBorder}`,
                }}
              >
                {/* الهيدر */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center"
                      style={{
                        background: isDark
                          ? config.color + "20"
                          : config.color + "18",
                        border: `1px solid ${isDark ? config.color + "33" : config.color + "55"}`,
                      }}
                    >
                      <Icon
                        size={16}
                        color={isDark ? config.color : config.lightColor}
                      />
                    </div>
                    <div className={isRTL ? "text-right" : "text-left"}>
                      <p className={`text-sm font-bold ${th.text}`}>
                        {config.label}
                      </p>
                      <p className={`text-xs ${th.subText}`}>
                        {item.type === "UGC"
                          ? t("ugcSubtitle")
                          : t("clippingSubtitle", {
                              progress: item.progress || 0,
                            })}
                      </p>
                    </div>
                  </div>
                  {item.badge && (
                    <span
                      className="text-xs font-bold px-2 py-0.5 rounded-full"
                      style={{
                        background: isDark ? "#94D3C120" : "#D1FAF0",
                        color: isDark ? "#94D3C1" : "#0E7C65",
                      }}
                    >
                      {item.badge}
                    </span>
                  )}
                </div>

                {/* الأرقام */}
                <div className="grid grid-cols-4 gap-3">
                  {[
                    {
                      label: t("reach"),
                      value: `${(item.reach / 1000000).toFixed(1)}M`,
                    },
                    {
                      label: t("roi"),
                      value: `${item.roi}%`,
                      color: isDark ? config.color : config.lightColor,
                    }, // ← هون
                    { label: t("ctr"), value: `${item.ctr}%` },
                    {
                      label: t("spentLabel"),
                      value: `$${(item.spent / 1000).toFixed(0)}k`,
                    },
                  ].map((kpi, i) => (
                    <div key={i} className={isRTL ? "text-right" : "text-left"}>
                      <p className={`text-xs mb-1 ${th.subText}`}>
                        {kpi.label}
                      </p>
                      <p
                        className="text-lg font-bold"
                        style={{
                          color: kpi.color || (isDark ? "white" : "#111827"),
                        }}
                      >
                        {kpi.value}
                      </p>
                    </div>
                  ))}
                </div>

                {/* بار التقدم + النسبة على نفس المستوى */}
                <div className="flex items-center gap-2">
                  <div
                    className="flex-1 h-1.5 rounded-full"
                    style={{
                      background: isDark
                        ? "rgba(255,255,255,0.06)"
                        : "rgba(0,0,0,0.06)",
                    }}
                  >
                    <div
                      className="h-1.5 rounded-full transition-all"
                      style={{
                        width: `${item.progress || 0}%`,
                        background: config.barColor,
                      }}
                    />
                  </div>
                  <span
                    className="text-xs font-bold shrink-0"
                    style={{
                      color: config.barColor,
                      minWidth: 34,
                      textAlign: isRTL ? "right" : "left",
                    }}
                  >
                    {item.progress}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
