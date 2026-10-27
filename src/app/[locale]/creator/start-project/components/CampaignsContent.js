"use client";

import { useState, useEffect } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import {
  Search,
  ShieldCheck,
  Clock3,
  Hash,
  AtSign,
  FileText,
  Upload,
  Headset,
  MessageSquare,
  BadgeCheck,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { getEligibleCampaigns } from "./submissionsApi";

// Tab key → API tab value
const TAB_MAP = {
  all: "ALL",
  ready: "READY",
  endingSoon: "ENDING_SOON",
};

export default function CampaignsContent() {
  const t = useTranslations("startProject");
  const locale = useLocale();
  const { isDark } = useTheme();

  const [activeFilter, setActiveFilter] = useState("all");
  const [query, setQuery] = useState("");
  const [campaigns, setCampaigns] = useState([]);
  const [counts, setCounts] = useState({ all: 0, ready: 0, endingSoon: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const theme = {
    page: isDark ? "bg-[#050505] text-gray-100" : "bg-[#f4f6f5] text-[#191c1d]",
    surface: isDark ? "bg-[#121617] border-[#1e2425]" : "bg-white border-[#e1e7e4]",
    inset: isDark ? "bg-[#181d1e] border-[#252c2d]" : "bg-[#f3f6f5] border-[#e1e7e4]",
    input: isDark
      ? "bg-[#1D2021] border-[#252c3d] text-white placeholder-gray-500"
      : "bg-white border-[#d8dfdc] text-[#191c1d] placeholder-[#74817b]",
    primaryText: isDark ? "text-white" : "text-[#191c1d]",
    secondaryText: isDark ? "text-gray-400" : "text-[#5f6a66]",
  };

  const gradient = { background: "linear-gradient(90deg, #FB8F00 0%, #FB6103 100%)" };

  // Fetch on filter / search change
  useEffect(() => {
    let cancelled = false;
    const fetchCampaigns = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await getEligibleCampaigns({
          tab: TAB_MAP[activeFilter],
          search: query || undefined,
        });
        if (!cancelled) {
          setCampaigns(res?.data || []);
          if (res?.meta?.counts) {
            setCounts({
              all: res.meta.counts.all ?? 0,
              ready: res.meta.counts.ready ?? 0,
              endingSoon: res.meta.counts.endingSoon ?? 0,
            });
          }
        }
      } catch (err) {
        if (!cancelled) setError(err?.response?.data?.message || "حدث خطأ في تحميل الحملات");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetchCampaigns();
    return () => { cancelled = true; };
  }, [activeFilter, query]);

  const filters = [
    { key: "all", label: t("filters.all") },
    { key: "ready", label: t("filters.ready") },
    { key: "endingSoon", label: t("filters.endingSoon") },
  ];

  // Format hoursLeft from API into display string
  const formatRemaining = (hoursLeft) => {
    if (hoursLeft == null) return "";
    if (hoursLeft < 48) return t("card.remainingHours", { count: hoursLeft });
    return t("card.remainingDays", { count: Math.ceil(hoursLeft / 24) });
  };

  return (
    <div
      className={`creator-responsive-page min-h-screen w-full font-tajawal p-3 sm:p-4 md:p-6 ${theme.page}`}
      dir={locale === "ar" ? "rtl" : "ltr"}
    >
      {/* Title */}
      <div className="mb-6">
        <h1 className={`text-2xl md:text-3xl font-black mb-1 ${theme.primaryText}`}>
          {t("title")}
        </h1>
        <p className={`text-xs leading-relaxed max-w-2xl ${theme.secondaryText}`}>
          {t("description")}
        </p>
      </div>

      {/* Filters + Search */}
      <div
        className={`${theme.surface} border p-2.5 rounded-2xl flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 mb-5`}
      >
        <div className="flex min-w-0 items-center gap-1 overflow-x-auto w-full md:w-auto">
          {filters.map((f) => {
            const active = activeFilter === f.key;
            return (
              <button
                key={f.key}
                type="button"
                onClick={() => setActiveFilter(f.key)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  active
                    ? "text-white shadow-md shadow-[#FC9102]/20"
                    : isDark
                      ? "text-gray-400 hover:text-white"
                      : "bg-[#f3f6f5] text-[#53605b] hover:text-[#191c1d]"
                }`}
                style={active ? gradient : {}}
              >
                {f.label} <span className="mx-1">({counts[f.key]})</span>
              </button>
            );
          })}
        </div>

        <div className="relative w-full md:w-72">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("searchPlaceholder")}
            className={`w-full border rounded-full py-2 ps-9 pe-4 text-xs focus:outline-none focus:border-[#94D3C1] ${theme.input}`}
          />
          <Search
            size={15}
            className={`absolute start-3 top-2.5 ${theme.secondaryText}`}
          />
        </div>
      </div>

      {/* Campaigns */}
      <div className="space-y-4">
        {/* Loading state */}
        {loading && (
          <div className="flex items-center justify-center py-16">
            <Loader2 size={28} className="animate-spin text-[#FB8F00]" />
          </div>
        )}

        {/* Error state */}
        {!loading && error && (
          <div className={`flex items-center gap-3 rounded-2xl border p-4 ${theme.surface}`}>
            <AlertCircle size={20} className="text-red-400 shrink-0" />
            <p className="text-sm text-red-400">{error}</p>
          </div>
        )}

        {/* Campaign cards */}
        {!loading && !error && campaigns.map((c) => {
          const req = c.requirements || {};
          const hashtag = req.requiredHashtags?.[0] || "";
          const mention = req.requiredMentions?.[0] || "";
          const sharia = req.shariaNote || t("card.noMusic");
          const isUnavailable = c.availability === "UNAVAILABLE";

          return (
            <div
              key={c.campaignId}
              className={`${theme.surface} rounded-2xl p-4 sm:p-5 space-y-4 ${
                isUnavailable ? "opacity-60" : ""
              }`}
            >
              {/* Top row */}
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[10px] font-bold ${
                      isDark
                        ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
                        : "border-emerald-200 bg-emerald-50 text-emerald-800"
                    }`}
                  >
                    <BadgeCheck size={12} />
                    {c.isHalalVerified ? t("status.instant") : t("status.production")}
                  </span>
                  {c.hoursLeft != null && (
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[10px] font-bold ${
                        isDark
                          ? "border-amber-500/30 bg-amber-500/10 text-amber-300"
                          : "border-amber-200 bg-amber-50 text-amber-800"
                      }`}
                    >
                      <Clock3 size={12} />
                      {formatRemaining(c.hoursLeft)}
                    </span>
                  )}
                  {isUnavailable && (
                    <span className="inline-flex items-center gap-1 rounded-full border border-red-500/30 bg-red-500/10 text-red-300 px-3 py-1 text-[10px] font-bold">
                      {t(`unavailable.${c.unavailableReason}`) || c.unavailableReason}
                    </span>
                  )}
                </div>
                <span className={`max-w-full break-all text-[10px] font-mono ${theme.secondaryText}`}>
                  {t("card.campaignNumber")}: {c.code}
                </span>
              </div>

              {/* Body */}
              <div className="campaign-card-body flex flex-col justify-between gap-4 lg:flex-row lg:items-start">
                {/* Thumbnail */}
                <div
                  className={`campaign-card-image relative h-[170px] w-full shrink-0 overflow-hidden rounded-xl border lg:w-[310px] ${
                    isDark ? "border-[#233532]" : "border-[#d3e6de]"
                  }`}
                >
                  <img
                    src={c.coverImage || "/images/parthiom.webp"}
                    alt={c.name}
                    className="w-full h-full object-cover"
                  />
                  {req.durationRange && (
                    <span className="absolute bottom-2 start-2 text-[10px] font-bold text-white bg-black/60 rounded px-2 py-0.5">
                      {req.durationRange.min} - {req.durationRange.max} {t("card.seconds")}
                    </span>
                  )}
                </div>

                <div className="campaign-card-details flex-1 min-w-0 space-y-3">
                  <div>
                    <h3 className={`break-words text-base sm:text-lg font-bold ${theme.primaryText}`}>
                      {c.name}
                    </h3>
                    <p className={`text-[11px] mt-1 ${theme.secondaryText}`}>
                      {c.brand?.name} · {t("card.verifiedCompany")}
                    </p>
                  </div>

                  <div className="campaign-info-grid grid min-w-0 grid-cols-1 gap-2 sm:grid-cols-3">
                    {/* 1. الهاشتاق */}
                    <InfoBox
                      theme={theme}
                      icon={<Hash size={18} className="text-[#94D3C1]" />}
                      label={t("card.requiredHashtag")}
                      value={hashtag || "-"}
                    />

                    {/* 2. المنشن */}
                    <InfoBox
                      theme={theme}
                      icon={<AtSign size={18} className="text-[#94D3C1]" />}
                      label={t("card.requiredMention")}
                      value={mention || "-"}
                    />

                    {/* 3. الضابط الشرعي */}
                    <InfoBox
                      theme={theme}
                      icon={<ShieldCheck size={18} className="text-[#94D3C1]" />}
                      label={t("card.shariaRule")}
                      value={sharia}
                    />
                  </div>

                  <div className="campaign-actions flex flex-col gap-2 sm:flex-row">
                    <Link
                      href={`/creator/start-project/${c.campaignId}`}
                      className={`flex-1 flex min-w-0 items-center justify-center gap-2 px-3 sm:px-4 py-3 rounded-xl text-center text-xs font-bold text-white shadow-[0_4px_20px_rgba(251,96,1,0.5)] ${
                        isUnavailable ? "pointer-events-none" : ""
                      }`}
                      style={gradient}
                    >
                      <Upload size={15} />
                      {t("card.submitNow")}
                    </Link>
                    <button
                      type="button"
                      className={`px-4 sm:px-7 py-2 border text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 ${
                        isDark
                          ? "bg-[#22282a] border-[#2d3436] text-gray-200"
                          : "bg-[#f3f6f5] border-[#d8dfdc] text-[#404945]"
                      }`}
                    >
                      <FileText size={14} />
                      {t("card.terms")}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {/* Empty state */}
        {!loading && !error && campaigns.length === 0 && (
          <p className={`text-center text-sm py-10 ${theme.secondaryText}`}>
            {t("empty")}
          </p>
        )}
      </div>

      {/* Escrow + support */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        <div
          className={`md:col-span-2 ${theme.surface} border rounded-2xl p-4 flex items-start gap-3 `}
        >
          <ShieldCheck size={20} className="text-[#E9C349] shrink-0 mt-0.5" />
          <div>
            <h4 className={`text-sm font-bold mb-1 text-[#E9C349] `}>
              {t("escrow.title")}
            </h4>
            <p className={`text-xs leading-relaxed ${theme.secondaryText}`}>
              {t("escrow.description")}
            </p>
          </div>
        </div>

        <div className={`${theme.surface} border rounded-2xl p-4 space-y-3`}>
          <div className="flex items-center gap-3">
            <span
              className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                isDark ? "bg-[#212f2c] text-[#94D3C1]" : "bg-emerald-50 text-emerald-700"
              }`}
            >
              <Headset size={18} />
            </span>
            <div>
              <p className={`text-xs font-bold ${theme.primaryText}`}>
                {t("support.title")}
              </p>
              <p className={`text-[10px] ${theme.secondaryText}`}>
                {t("support.subtitle")}
              </p>
            </div>
          </div>
          <button
            type="button"
            className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 border text-xs font-bold rounded-xl ${
              isDark
                ? "bg-[#22282a] border-[#2d3436] text-gray-200"
                : "bg-[#f3f6f5] border-[#d8dfdc] text-[#404945]"
            }`}
          >
            <MessageSquare size={14}  className={'text-[#E9C349]'}/>
            {t("support.chat")}
          </button>
        </div>
      </div>
    </div>
  );
}

function InfoBox({ theme, icon, label, value }) {
  return (
    <div className={`min-w-0 rounded-xl border p-3 flex items-center justify-center gap-3 ${theme.inset}`}>
     {/* الأيقونة التركوازية الجانبية */}
      {icon && (
        <div className="text-[#94D3C1] shrink-0">
          {icon}
        </div>
      )}
      {/* النصين المترتبين فوق بعض */}
      <div className="flex min-w-0 flex-col items-center text-center">
        <span className={`text-[10px] mb-0.5 ${theme.secondaryText}`}>
          {label}
        </span>
        <strong className={`max-w-full break-words text-xs ${theme.primaryText}`}>
          {value}
        </strong>
      </div>

     
    </div>
  );
}