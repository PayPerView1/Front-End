"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useTheme } from "@/context/ThemeContext";
import {
  MdArrowBack,
  MdArrowForward,
  MdVerified,
  MdOutlineBookmarkBorder,
  MdBookmark,
  MdOutlineFlag,
  MdOutlineDescription,
  MdOutlineSummarize,
  MdOutlineCategory,
  MdOutlineFolderZip,
  MdOutlineVisibility,
  MdOutlineFileDownload,
  MdOutlinePictureAsPdf,
  MdOutlineAccountBalance,
  MdOutlineDateRange,
  MdOutlineBolt,
  MdOutlinePayments,
  MdOutlineSavings,
  MdOutlineVideoLibrary,
  MdMic,
  MdOutlineSmartphone,
  MdOutlineAutoAwesome,
  MdOutlinePhoneIphone,
  MdOutlineDevices,
} from "react-icons/md";
import { FaInstagram, FaTiktok, FaYoutube } from "react-icons/fa";
import Reportviolationmodal from "./Reportviolationmodal";
import ReportAlreadyModal from "./ReportAlreadyModal";
import ApplyConfirmModal from "./ApplyConfirmModal";
import ApplyAlreadyModal from "./ApplyAlreadyModal";
import CampaignOnHoldModal from "./CampaignOnHoldModal";

const UNAVAILABLE_STATUSES = new Set([
  "unavailable",
  "inactive",
  "paused",
  "suspended",
  "on_hold",
  "on-hold",
  "ended",
  "expired",
  "closed",
  "blocked",
]);
const PLATFORM_META = {
  tiktok: { icon: FaTiktok, name: { ar: "تيك توك (TikTok)", en: "TikTok" } },
  instagram: {
    icon: FaInstagram,
    name: { ar: "إنستغرام ريلز (Reels)", en: "Instagram Reels" },
  },
  youtube: {
    icon: FaYoutube,
    name: { ar: "يوتيوب شورتس (Shorts)", en: "YouTube Shorts" },
  },
};

const CONTENT_ICONS = {
  clips: MdMic,
  vertical: MdOutlineSmartphone,
  motion: MdOutlineAutoAwesome,
};

const ORANGE = "linear-gradient(90deg, #FFA600, #FF4B04)";
const money = (n) => `$${Number(n).toLocaleString("en-US")}`;

// ── بيانات تجريبية: استبدلها بنتيجة الـ API (GET /campaigns/:id) ───────────
const MOCK_DETAILS = {
  c1: {
    id: "c1",
    cover: null,
    gradient: "linear-gradient(135deg,#0f2b3d,#0b1620)",
    filesCount: 14,
    packSize: "3.8 GB",
    // status: "paused",
    title: {
      ar: "قص ونشر مقاطع توعوية عن الاستثمار الحلال والادخار بالسبائك الذهبية",
      en: "Clip and publish awareness videos on halal investing and gold-bar saving",
    },
    brand: { ar: "الزمرد للتمويل والاستثمار", en: "Emerald Wealth & FinTech" },
    brandLegal: "Emerald Wealth & FinTech LTD",
    category: {
      ar: "مالية وتقنية واستثمار",
      en: "Finance, fintech & investing",
    },
    description: {
      ar: [
        "تسعى شركة الزمرد لإدارة الثروات والادخار الذهبي إلى تمكين الشباب والمستثمرين في منطقة الخليج العربي من حماية مدخراتهم عبر التصدع عبر حلول الادخار الآمن بالسبائك الذهبية المتوافقة 100% مع الشريعة الإسلامية بدون رسوم تبييت (Rollover) أو فوائد ربوية.",
        "المهمة المطلوبة من صناع ومقصي المحتوى (Clippers) هي استخلاص اللحظات الأكثر إلهاماً وتأثيراً من سلسلة بودكاست «أمانة الثروة» وإعادة تحريرها في مقاطع عمودية احترافية بهدف تثقيف الجيل الجديد بالاستثمار الأخلاقي وتشجيعهم على تنزيل التطبيق والبدء بادخار أول جرام ذهب لهم.",
      ],
      en: [
        "Emerald Wealth & Gold Savings helps young people and investors across the Gulf protect their savings through safe gold-bar saving solutions that are 100% Shariah-compliant, with no rollover fees or interest.",
        "Clippers are asked to pull the most inspiring moments from the 'Amanat Al-Tharwa' podcast series and re-edit them into professional vertical clips that educate a new generation about ethical investing and encourage them to download the app and save their first gram of gold.",
      ],
    },
    platforms: [
      { key: "tiktok", ratio: "9:16" },
      { key: "instagram", ratio: "9:16" },
      { key: "youtube", ratio: "9:16" },
    ],
    contentTypes: [
      { key: "clips", ar: "قص مقاطع بودكاست", en: "Podcast clipping" },
      {
        key: "vertical",
        ar: "مونتاج فيديو عمودي (9:16)",
        en: "Vertical video editing (9:16)",
      },
      {
        key: "motion",
        ar: "موشن جرافيكس توضيحي",
        en: "Explanatory motion graphics",
      },
    ],
    cpm: 12,
    remaining: 54800,
    total: 100000,
    startsAt: { ar: "15 أكتوبر 2025", en: "Oct 15, 2025" },
    endsAt: { ar: "05 نوفمبر 2025", en: "Nov 5, 2025" },
    acceptance: 94,
  },
};

// ── بطاقة عامة ──────────────────────────────────────────────────────────────
function Card({ t, isDark, className = "", children }) {
  return (
    <section
      className={`rounded-xl border p-3 sm:p-4 ${t.border} ${className}`}
      style={{ background: isDark ? "#191C1D" : "#FFFFFF" }}
    >
      {children}
    </section>
  );
}

function CardHeader({ t, icon: Icon, title, sub, isDark }) {
  return (
    <div className="mb-4 flex items-start justify-between gap-3">
      <div className="min-w-0">
        <h2 className={`text-base font-bold sm:text-lg ${t.text}`}>{title}</h2>
        {sub && <p className={`mt-0.5 text-[11px] ${t.subText}`}>{sub}</p>}
      </div>
      <span
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
        style={{
          background: isDark
            ? "rgba(148,211,193,0.08)"
            : "rgba(28,107,88,0.12)",
        }}
      >
        <Icon size={18} color={isDark ? "#94D3C1" : "#1C6B58"} />
      </span>
    </div>
  );
}

// ── الصفحة ──────────────────────────────────────────────────────────────────
export default function CampaignDetails({ id, campaign }) {
  const { isDark } = useTheme();
  const locale = useLocale();
  const s = useTranslations("campaignDetails");
  const router = useRouter();
  const isRtl = locale === "ar";
  const lang = isRtl ? "ar" : "en";
  const [saved, setSaved] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);
  const [reportSent, setReportSent] = useState(false);
  const [reportAlreadyOpen, setReportAlreadyOpen] = useState(false);
  const [applyOpen, setApplyOpen] = useState(false);
  const [applyAlreadyOpen, setApplyAlreadyOpen] = useState(false);
  const [application, setApplication] = useState(null);
  const [applied, setApplied] = useState(false);

  const c = campaign ?? MOCK_DETAILS[id];
  const isUnavailable =
    c &&
    (c.available === false ||
      c.isAvailable === false ||
      c.isActive === false ||
      c.acceptingApplications === false ||
      UNAVAILABLE_STATUSES.has(
        String(c.status ?? "")
          .trim()
          .toLowerCase()
          .replace(/\s+/g, "-"),
      ));

  useEffect(() => {
    if (!c?.id) return;

    try {
      setReportSent(
        window.localStorage.getItem(`ppv:reported-campaign:${c.id}`) === "true",
      );
    } catch (error) {
      console.error("Could not read reported campaign status:", error);
    }
  }, [c?.id]);

  useEffect(() => {
    if (!c?.id) return;

    try {
      const savedApplication = window.localStorage.getItem(
        `ppv:applied-campaign:${c.id}`,
      );
      if (savedApplication) {
        const parsedApplication = JSON.parse(savedApplication);
        setApplication(parsedApplication);
        setApplied(true);
      }
    } catch (error) {
      console.error("Could not read campaign application status:", error);
    }
  }, [c?.id]);

  const t = {
    bg: isDark ? "bg-[#0D0D0D]" : "bg-[#F0F2F5]",
    border: isDark ? "border-[#2A2E30]" : "border-[#E2E8F0]",
    field: isDark
      ? "bg-[#26292B] border-[#33383A]"
      : "bg-white border-[#E2E8F0]",
    text: isDark ? "text-white" : "text-[#0F172A]",
    subText: isDark ? "text-[#9A9A9A]" : "text-[#64748B]",
  };

  if (!c) {
    return (
      <div
        className={`flex min-h-screen items-center justify-center ${t.bg} ${t.text}`}
      >
        {s("notFound")}
      </div>
    );
  }

  const BackIcon = isRtl ? MdArrowForward : MdArrowBack;
  const pct = c.total > 0 ? Math.round((c.remaining / c.total) * 100) : 0;

  const handleApply = () => {
    if (application) {
      setApplyAlreadyOpen(true);
      return;
    }
    setApplyOpen(true);
  };
  const handleReport = () => {
    if (reportSent) {
      setReportAlreadyOpen(true);
      return;
    }
    setReportOpen(true);
  };

  const summaryRows = [
    {
      icon: MdOutlineAccountBalance,
      label: s("advertiser"),
      value: c.brand[lang],
      valueClass: "font-bold text-[#94D3C1]",
    },
  ];

  return (
    <div
      dir={isRtl ? "rtl" : "ltr"}
      className={`flex min-h-screen w-full min-w-0 flex-1 flex-col gap-4 p-4 sm:p-6 ${t.bg}`}
    >
      {/* العودة للقائمة */}
      <div>
        <button
          type="button"
          onClick={() => router.push(`/${locale}/creator/discover`)}
          className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-all hover:border-[#94D3C1] ${t.field} ${t.text}`}
        >
          <BackIcon size={14} />
          {s("back")}
        </button>
      </div>

      {/* الغلاف */}
      <Card t={t} isDark={isDark} className="flex flex-col gap-3">
        <div className="h-28 w-full overflow-hidden rounded-xl sm:h-36 lg:h-48">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/img-details.png"
            alt=""
            className="h-full w-full object-cover object-center"
          />
        </div>

        <div
          className="flex items-center justify-between gap-3 rounded-xl px-4 py-2.5 text-xs"
          style={{
            background: isDark ? "rgba(0,0,0,0.3)" : "rgba(0,0,0,0.04)",
          }}
        >
          <span className={`inline-flex items-center gap-2 ${t.text}`}>
            <MdOutlineFolderZip size={16} className="text-[#94D3C1]" />
            {s("filesAvailable", { n: c.filesCount })}
          </span>
          <span className="inline-flex items-center gap-1.5 font-bold text-[#E9C349]">
            {s("packSize")}
            <span dir="ltr">{c.packSize}</span>
          </span>
        </div>
      </Card>

      {/* العنوان والأزرار */}
      <Card t={t} isDark={isDark} className="flex flex-col gap-4">
        <h1 className={`text-xl font-bold leading-snug sm:text-2xl ${t.text}`}>
          {c.title[lang]}
        </h1>

        <div className="flex flex-wrap items-center gap-4">
          {/* الأيقونة + الجهة */}
          <div className="flex items-center gap-3">
            <span
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
              style={{
                background: isDark
                  ? "rgba(148,211,193,0.08)"
                  : "rgba(28,107,88,0.12)",
              }}
            >
              <MdOutlineAccountBalance
                size={22}
                color={isDark ? "#94D3C1" : "#1C6B58"}
              />
            </span>

            <div className="flex flex-col gap-0.5">
              <span className={`text-sm font-bold ${t.text}`}>
                {c.brand[lang]}
              </span>
              <span className={`text-[11px] ${t.subText}`} dir="ltr">
                {c.brandLegal}
              </span>
            </div>
          </div>

          {/* الفاصل */}
          <span
            className="hidden h-9 w-px sm:block"
            style={{
              background: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)",
            }}
          />

          {/* التصنيف */}
          <span
            className={`inline-flex items-center rounded-lg border px-3 py-1.5 text-xs ${t.field} ${t.subText}`}
          >
            {c.category[lang]}
          </span>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row">
          <button
            type="button"
            onClick={handleApply}
            className="inline-flex h-11 flex-1 items-center justify-center rounded-xl text-sm font-bold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            style={{ background: ORANGE }}
          >
            {applied ? s("applied") : s("apply")}
          </button>

          <button
            type="button"
            onClick={() => setSaved((v) => !v)}
            aria-pressed={saved}
            className={`inline-flex h-11 items-center justify-center gap-2 rounded-xl border px-5 text-xs font-bold transition-all hover:border-[#94D3C1] ${t.field} ${t.text}`}
          >
            {saved ? (
              <MdBookmark size={16} className="text-[#94D3C1]" />
            ) : (
              <MdOutlineBookmarkBorder size={16} />
            )}
            {saved ? s("saved") : s("save")}
          </button>

          <button
            type="button"
            onClick={handleReport}
            aria-label={reportSent ? s("reported") : s("report")}
            className={`inline-flex h-11 items-center justify-center gap-2 rounded-xl border px-5 text-xs font-bold transition-all hover:border-[#94D3C1] ${t.field} ${t.text}`}
          >
            <MdOutlineFlag size={16} />
            {reportSent ? s("reported") : s("report")}
          </button>
        </div>
      </Card>

      {/* المحتوى: الوصف + الملخص */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="flex flex-col gap-4 lg:col-span-2">
          {/* الوصف */}
          <Card t={t} isDark={isDark}>
            <CardHeader
              t={t}
              isDark={isDark}
              icon={MdOutlineDescription}
              title={s("descTitle")}
              sub={s("descSub")}
            />
            <div
              className={`flex flex-col gap-3 text-xs leading-6 ${t.subText}`}
            >
              {c.description[lang].map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </Card>

          {/* المنصات وأنواع المحتوى */}
          <Card t={t} isDark={isDark}>
            <CardHeader
              t={t}
              isDark={isDark}
              icon={MdOutlineCategory}
              title={s("platformsTitle")}
              sub={s("platformsSub")}
            />

            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              {/* المنصات */}
              <div
                className={`rounded-xl border p-3 ${t.border}`}
                style={{
                  background: isDark ? "rgba(0,0,0,0.2)" : "rgba(0,0,0,0.02)",
                }}
              >
                <h3 className="mb-3 inline-flex items-center gap-1.5 text-xs font-bold text-[#E9C349]">
                  <MdOutlineDevices size={15} />
                  {s("supported")}
                </h3>
                <div className="flex flex-col gap-2">
                  {c.platforms.map((p) => {
                    const meta = PLATFORM_META[p.key];
                    if (!meta) return null;
                    const PIcon = meta.icon;
                    return (
                      <div
                        key={p.key}
                        className={`flex items-center justify-between gap-2 rounded-lg border px-3 py-2.5 text-xs ${t.field} ${t.text}`}
                      >
                        <span className="inline-flex items-center gap-2">
                          <PIcon size={14} />
                          {meta.name[lang]}
                        </span>
                        <span
                          dir="ltr"
                          className="rounded bg-[#E9C349]/15 px-1.5 py-0.5 text-[10px] font-bold text-[#E9C349]"
                        >
                          {p.ratio}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* أنواع المحتوى */}
              <div
                className={`rounded-xl border p-3 ${t.border}`}
                style={{
                  background: isDark ? "rgba(0,0,0,0.2)" : "rgba(0,0,0,0.02)",
                }}
              >
                <h3 className="mb-3 inline-flex items-center gap-1.5 text-xs font-bold text-[#94D3C1]">
                  <MdOutlineVideoLibrary size={15} />
                  {s("contentTypes")}
                </h3>
                <div className="flex flex-col gap-2">
                  {c.contentTypes.map((ct) => {
                    const CIcon = CONTENT_ICONS[ct.key] ?? MdOutlinePhoneIphone;
                    return (
                      <div
                        key={ct.key}
                        className={`flex items-center gap-2 rounded-lg border px-3 py-2.5 text-xs ${t.field} ${t.text}`}
                      >
                        <CIcon size={14} className="shrink-0 text-[#E9C349]" />
                        {ct[lang]}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* الملخص */}
        <Card t={t} isDark={isDark} className="h-fit">
          <CardHeader
            t={t}
            isDark={isDark}
            icon={MdOutlineSummarize}
            title={s("summaryTitle")}
            sub={s("summarySub")}
          />

          <div className="flex flex-col gap-4 text-xs">
            {summaryRows.map((r) => (
              <div
                key={r.label}
                className="flex items-center justify-between gap-2"
              >
                <span
                  className={`inline-flex items-center gap-1.5 ${t.subText}`}
                >
                  <r.icon size={14} />
                  {r.label}
                </span>
                <span className={r.valueClass}>{r.value}</span>
              </div>
            ))}

            <div
              className="flex items-center justify-between gap-2 rounded-lg px-3 py-2.5"
              style={{
                background: isDark ? "rgba(0,0,0,0.25)" : "rgba(0,0,0,0.04)",
              }}
            >
              <span className={`inline-flex items-center gap-1.5 ${t.subText}`}>
                <MdOutlinePayments size={14} />
                {s("earnings")}
              </span>
              <span className="font-extrabold text-[#E9C349]" dir="ltr">
                ${Number(c.cpm).toFixed(2)} CPM
              </span>
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between gap-2">
                <span
                  className={`inline-flex items-center gap-1.5 ${t.subText}`}
                >
                  <MdOutlineSavings size={14} />
                  {s("budget")}
                </span>
                <span className="font-bold text-[#94D3C1]">{pct}%</span>
              </div>
              <div
                className="h-1.5 w-full overflow-hidden rounded-full"
                style={{
                  background: isDark
                    ? "rgba(255,255,255,0.08)"
                    : "rgba(0,0,0,0.08)",
                }}
              >
                <div
                  className="h-full rounded-full"
                  style={{ width: `${pct}%`, background: "#E9C349" }}
                />
              </div>
              <div className="flex items-center justify-between gap-2">
                <b className={t.text} dir="ltr">
                  {Number(c.remaining).toLocaleString("en-US")}{" "}
                  <span className={`font-normal ${t.subText}`}>
                    {s("remainingWord")}
                  </span>
                </b>
                <span className={`text-[10px] ${t.subText}`}>
                  {s("ofTotal", { total: money(c.total) })}
                </span>
              </div>
            </div>

            <div className={`border-t pt-4 ${t.border}`}>
              <div className="flex items-center justify-between gap-2">
                <span
                  className={`inline-flex items-center gap-1.5 ${t.subText}`}
                >
                  <MdOutlineDateRange size={14} />
                  {s("period")}
                </span>
              </div>
              <p className={`mt-2 text-[11px] ${t.text}`}>
                {c.startsAt[lang]} {s("to")} {c.endsAt[lang]}
              </p>
            </div>

            <div className="flex items-center justify-between gap-2">
              <span className={`inline-flex items-center gap-1.5 ${t.subText}`}>
                <MdOutlineBolt size={14} />
                {s("acceptance")}
              </span>
              <span className="font-bold text-[#94D3C1]">
                {s("acceptanceValue", { n: c.acceptance })}
              </span>
            </div>
          </div>
        </Card>
      </div>

      {/* ملفات الحملة */}
      <Card
        t={t}
        isDark={isDark}
        className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between"
      >
        <div className="flex min-w-0 items-start gap-3 lg:flex-1">
          <span
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
            style={{
              background: isDark
                ? "rgba(148,211,193,0.08)"
                : "rgba(28,107,88,0.12)",
            }}
          >
            <MdOutlinePictureAsPdf
              size={22}
              color={isDark ? "#94D3C1" : "#1C6B58"}
            />
          </span>
          <div className="min-w-0">
            <h2 className={`text-base font-bold sm:text-lg ${t.text}`}>
              {s("filesTitle")}
            </h2>
            <p className={`mt-1 max-w-2xl text-[11px] leading-5 ${t.subText}`}>
              {s("filesDesc")}
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row">
          {/* TODO: اربط الأزرار برابط ملف الـ PDF */}
          <button
            type="button"
            className={`inline-flex h-10 items-center justify-center gap-2 rounded-xl border px-4 text-xs font-bold transition-all hover:border-[#94D3C1] ${t.field} ${t.text}`}
          >
            <MdOutlineVisibility size={16} />
            {s("preview")}
          </button>
          <button
            type="button"
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl px-4 text-xs font-bold text-white transition-opacity hover:opacity-90"
            style={{ background: ORANGE }}
          >
            <MdOutlineFileDownload size={16} />
            {s("download")}
          </button>
        </div>
      </Card>
      <Reportviolationmodal
        open={!isUnavailable && reportOpen}
        campaign={{ id: c.id, name: c.title[lang] }}
        onClose={() => setReportOpen(false)}
        onSubmit={async (payload) => {
          // TODO: ابعت payload للـ API (campaignId, reason, details)
          window.localStorage.setItem(
            `ppv:reported-campaign:${payload.campaignId}`,
            "true",
          );
          setReportSent(true);
        }}
      />
      <ReportAlreadyModal
        open={!isUnavailable && reportAlreadyOpen}
        onClose={() => setReportAlreadyOpen(false)}
        onContinue={() => {
          setReportAlreadyOpen(false);
          router.push(`/${locale}/creator/discover`);
        }}
      />
      <ApplyConfirmModal
        open={!isUnavailable && applyOpen}
        campaign={{
          id: c.id,
          name: c.title[lang],
          brand: c.brand[lang],
          cpm: c.cpm,
          platforms: c.platforms.map((p) => p.key),
        }}
        onClose={() => setApplyOpen(false)}
        onConfirm={async () => {
          // TODO: ابعت طلب التقديم للـ API
          const savedApplication = {
            ref: `APP-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
            campaignName: c.title[lang],
            campaignCode: c.code ?? c.id,
            submittedAt: new Date().toISOString(),
            cpm: c.cpm,
          };
          window.localStorage.setItem(
            `ppv:applied-campaign:${c.id}`,
            JSON.stringify(savedApplication),
          );
          setApplication(savedApplication);
          setApplied(true);
        }}
      />
      <ApplyAlreadyModal
        open={!isUnavailable && applyAlreadyOpen}
        application={application}
        onClose={() => setApplyAlreadyOpen(false)}
        onExplore={() => {
          setApplyAlreadyOpen(false);
          router.push(`/${locale}/creator/discover`);
        }}
        onViewOrders={() => {
          setApplyAlreadyOpen(false);
          router.push(`/${locale}/creator/dashboard`);
        }}
      />
      <CampaignOnHoldModal
        open={!!isUnavailable}
        campaign={{
          name: c.title[lang],
          code: c.code,
        }}
        onClose={() => router.push(`/${locale}/creator/discover`)}
        onExplore={() => router.push(`/${locale}/creator/discover`)}
      />
    </div>
  );
}
