"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useTheme } from "@/context/ThemeContext";
import { useNotifications } from "@/context/NotificationsContext";
import { toast } from "@/components/ui/Toast";
import {
  applyToCampaign,
  getCampaignDetails,
} from "@/lib/creatorCampaignApi";
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

function mapCampaignDetails(data, id) {
  const campaign = data?.campaign ?? data;
  const localized = (value, fallback = "") =>
    typeof value === "object" && value !== null
      ? { ar: value.ar ?? value.en ?? fallback, en: value.en ?? value.ar ?? fallback }
      : { ar: value ?? fallback, en: value ?? fallback };
  const description =
    campaign.brief?.mainIdea ??
    campaign.brief?.description ??
    campaign.description ??
    "";
  const descriptions = Array.isArray(description) ? description : [description];

  return {
    ...campaign,
    id: campaign.id ?? campaign._id ?? id,
    title: localized(campaign.title ?? campaign.name),
    brand: localized(campaign.brand?.name ?? campaign.brand),
    brandLegal: campaign.brandLegal ?? campaign.brand?.legalName ?? "",
    category: localized(campaign.category ?? campaign.contentType),
    description: {
      ar: descriptions.filter(Boolean),
      en: descriptions.filter(Boolean),
    },
    platforms: Array.isArray(campaign.platforms)
      ? campaign.platforms.map((platform) =>
          typeof platform === "string"
            ? { key: platform.toLowerCase(), ratio: "9:16" }
            : { ...platform, key: platform.key ?? platform.name?.toLowerCase() },
        )
      : [],
    contentTypes: Array.isArray(campaign.contentTypes)
      ? campaign.contentTypes
      : [],
    remaining: Number(campaign.remainingBudget ?? campaign.remaining ?? 0),
    total: Number(campaign.totalBudget ?? campaign.total ?? 0),
    startsAt: localized(campaign.startDate ?? campaign.startsAt),
    endsAt: localized(campaign.endDate ?? campaign.endsAt),
    cpm: Number(campaign.cpm ?? 0),
    acceptance: Number(campaign.acceptanceRate ?? campaign.acceptance ?? 0),
    filesCount: Number(campaign.filesCount ?? 0),
    packSize: campaign.packSize ?? "0 GB",
  };
}

function getExistingApplication(campaign) {
  const application =
    campaign.application ??
    campaign.creatorApplication ??
    campaign.myApplication ??
    (typeof campaign.applicationStatus === "object"
      ? campaign.applicationStatus
      : null);
  const status =
    application?.status ??
    (typeof campaign.applicationStatus === "string"
      ? campaign.applicationStatus
      : null);
  const appliedStatuses = new Set([
    "PENDING",
    "SUBMITTED",
    "UNDER_REVIEW",
    "APPROVED",
    "ACCEPTED",
    "REJECTED",
    "COMPLETED",
  ]);
  const hasApplication =
    Boolean(application) ||
    campaign.applicationStatus === true ||
    appliedStatuses.has(String(status ?? "").toUpperCase());

  if (!hasApplication) return null;

  return {
    ref: application?.id ?? application?._id ?? application?.applicationId,
    campaignName:
      campaign.title?.ar ?? campaign.name ?? campaign.title?.en ?? "",
    campaignCode: campaign.code ?? campaign.id,
    submittedAt:
      application?.appliedAt ??
      application?.submittedAt ??
      application?.createdAt,
    cpm: campaign.cpm,
    status: status ?? "PENDING",
  };
}

function isAlreadyAppliedError(error) {
  return (
    error?.code === "ALREADY_APPLIED" ||
    /already applied|سبق.{0,20}التقديم|قدمت.{0,20}(?:مسبق|سابق)/i.test(
      error?.message ?? "",
    )
  );
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => {
    const entities = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };
    return entities[character];
  });
}

function formatBriefValue(value, isRtl = false) {
  if (value === null || value === undefined || value === "") return "";
  if (Array.isArray(value)) {
    return value.map((item) => formatBriefValue(item, isRtl)).filter(Boolean).join("<br />");
  }
  if (typeof value === "object") {
    return Object.entries(value)
      .filter(([, nestedValue]) => nestedValue !== null && nestedValue !== undefined && nestedValue !== "")
      .map(
        ([key, nestedValue]) =>
          `<strong>${escapeHtml(getBriefFieldLabel(key, isRtl))}:</strong> ${formatBriefValue(nestedValue, isRtl)}`,
      )
      .join("<br />");
  }
  if (typeof value === "boolean") return value ? "✓" : "";
  return escapeHtml(value).replace(/\n/g, "<br />");
}

function getBriefFieldLabel(key, isRtl) {
  const labels = {
    noGambling: ["خلو المحتوى من المقامرة", "No gambling content"],
    noSexualContent: ["خلو المحتوى من المواد الجنسية", "No sexual content"],
    noExplicitMusic: ["خلو المحتوى من الموسيقى الصريحة", "No explicit music"],
    noAlcohol: ["خلو المحتوى من الكحول", "No alcohol"],
    noSuspiciousCurrencies: ["تجنب العملات المشبوهة", "Avoid suspicious currencies"],
    noUnrealisticProfit: ["تجنب وعود الأرباح غير الواقعية", "No unrealistic profit claims"],
  };
  if (labels[key]) return labels[key][isRtl ? 0 : 1];
  return key.replace(/([A-Z])/g, " $1").replace(/^./, (letter) => letter.toUpperCase());
}

function getBriefPdfUrl(campaign) {
  const url =
    campaign.briefPdfUrl ??
    campaign.briefPdf?.url ??
    campaign.campaignBriefUrl ??
    campaign.campaignBrief?.pdfUrl ??
    campaign.pdfUrl ??
    campaign.pdf_url ??
    campaign.pdf?.url;
  return typeof url === "string" && /^https?:\/\//i.test(url.trim())
    ? url.trim()
    : null;
}

function getCampaignAssetLinks(campaign) {
  const links = [];
  const addFile = (file) => {
    if (typeof file === "string") {
      if (/^(https?:\/\/|\/(?!\/))/i.test(file)) {
        links.push({ url: file, name: file.split("/").pop() || file });
      }
      return;
    }
    if (!file || typeof file !== "object") return;

    const url =
      file.downloadUrl ??
      file.download_url ??
      file.fileUrl ??
      file.file_url ??
      file.url ??
      file.path;
    if (
      typeof url !== "string" ||
      !/^(https?:\/\/|\/(?!\/))/i.test(url.trim())
    ) {
      return;
    }
    links.push({
      url,
      name: file.name ?? file.originalName ?? file.filename ?? file.title ?? url.split("/").pop(),
    });
  };

  for (const key of ["rawFiles", "sourceFiles", "files", "assets", "materials", "attachments", "media", "resources"]) {
    const value = campaign[key];
    if (Array.isArray(value)) value.forEach(addFile);
    else if (value) addFile(value);
  }

  return links.filter(
    (link, index, all) =>
      all.findIndex((candidate) => candidate.url === link.url) === index,
  );
}

function buildCampaignBriefHtml(campaign, isRtl) {
  const lang = isRtl ? "ar" : "en";
  const localize = (value) =>
    value &&
    typeof value === "object" &&
    !Array.isArray(value) &&
    ("ar" in value || "en" in value)
      ? value[lang] ?? value.en ?? value.ar
      : value;
  const brief = campaign.brief ?? {};
  const sectionLabels = isRtl
    ? {
        overview: "نصوص المقاربة",
        mainIdea: "الفكرة الرئيسية",
        audience: "الجمهور المستهدف",
        tone: "نبرة الصوت",
        keyMessages: "الرسائل الرئيسية",
        keywords: "الكلمات المفتاحية",
        visualReferences: "المراجع البصرية",
        technicalGuidelines: "التوجيهات الفنية",
        guidelines: "التوجيهات",
        instructions: "تعليمات الإنتاج",
        deliverables: "المخرجات المطلوبة",
        acceptanceCriteria: "معايير القبول",
        halalDeclaration: "الضوابط الشرعية",
        shariahRules: "الضوابط الشرعية",
        assets: "الملفات المصدرية",
        rawFiles: "الملفات المصدرية الخام",
        noAssets: "لا توجد روابط تنزيل مرفقة بهذه الحملة.",
        print: "طباعة / حفظ كـ PDF",
        campaign: "موجز الحملة",
      }
    : {
        overview: "Campaign brief",
        mainIdea: "Main idea",
        audience: "Target audience",
        tone: "Tone of voice",
        keyMessages: "Key messages",
        keywords: "Keywords",
        visualReferences: "Visual references",
        technicalGuidelines: "Technical guidelines",
        guidelines: "Guidelines",
        instructions: "Production instructions",
        deliverables: "Deliverables",
        acceptanceCriteria: "Acceptance criteria",
        halalDeclaration: "Shariah compliance",
        shariahRules: "Shariah rules",
        assets: "Source files",
        rawFiles: "Raw source files",
        noAssets: "No downloadable files are attached to this campaign.",
        print: "Print / Save as PDF",
        campaign: "Campaign brief",
      };
  const knownFields = new Set([
    "mainIdea",
    "description",
    "audience",
    "tone",
    "keyMessages",
    "keywords",
    "visualReferences",
  ]);
  const sections = [
    [sectionLabels.mainIdea, localize(brief.mainIdea ?? brief.description ?? campaign.description)],
    [sectionLabels.audience, localize(brief.audience ?? campaign.audience)],
    [sectionLabels.tone, localize(brief.tone ?? campaign.tone)],
    [sectionLabels.keyMessages, localize(brief.keyMessages ?? campaign.keyMessages)],
    [sectionLabels.keywords, localize(brief.keywords ?? campaign.keywords)],
    [sectionLabels.visualReferences, localize(brief.visualReferences ?? campaign.visualReferences)],
    [
      sectionLabels.technicalGuidelines,
      campaign.technicalGuidelines ??
        brief.technicalGuidelines ??
        campaign.technicalRequirements ??
        brief.technicalRequirements,
    ],
    [sectionLabels.guidelines, campaign.guidelines ?? brief.guidelines],
    [sectionLabels.instructions, campaign.instructions ?? brief.instructions],
    [sectionLabels.deliverables, campaign.deliverables ?? brief.deliverables],
    [
      sectionLabels.technicalGuidelines,
      campaign.productionGuidelines ??
        brief.productionGuidelines ??
        campaign.contentRequirements ??
        brief.contentRequirements ??
        campaign.postingRequirements,
    ],
    [
      sectionLabels.acceptanceCriteria,
      campaign.acceptanceCriteria ??
        campaign.acceptanceCriteriaText ??
        brief.acceptanceCriteria ??
        campaign.reviewCriteria ??
        brief.reviewCriteria ??
        campaign.criteria,
    ],
    [
      sectionLabels.halalDeclaration,
      campaign.halalDeclaration ?? campaign.shariahRules ?? campaign.compliance,
    ],
    ...Object.entries(brief)
      .filter(([key, value]) => !knownFields.has(key) && formatBriefValue(value, isRtl))
      .map(([key, value]) => [getBriefFieldLabel(key, isRtl), localize(value)]),
  ].filter(([, value]) => formatBriefValue(localize(value), isRtl));

  const title =
    (typeof campaign.title === "object"
      ? campaign.title[lang] ?? campaign.title.en ?? campaign.title.ar
      : campaign.title) ??
    campaign.name ??
    sectionLabels.campaign;
  const assets = getCampaignAssetLinks(campaign);
  const sectionsHtml = sections
    .map(
      ([label, value]) =>
        `<section><h2>${escapeHtml(label)}</h2><p>${formatBriefValue(localize(value), isRtl)}</p></section>`,
    )
    .join("");
  const assetsHtml = assets.length
    ? `<section><h2>${escapeHtml(sectionLabels.assets)}</h2><ul>${assets
        .map(
          (asset) =>
            `<li><a href="${escapeHtml(asset.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(asset.name)}</a></li>`,
        )
        .join("")}</ul></section>`
    : `<section><h2>${escapeHtml(sectionLabels.assets)}</h2><p>${escapeHtml(sectionLabels.noAssets)}</p></section>`;

  return `<!doctype html>
<html lang="${isRtl ? "ar" : "en"}" dir="${isRtl ? "rtl" : "ltr"}">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escapeHtml(title)} — ${escapeHtml(sectionLabels.overview)}</title>
  <style>
    * { box-sizing: border-box; }
    body { margin: 0; padding: 32px; color: #17211f; background: #f3f6f5; font: 16px/1.7 Arial, sans-serif; }
    main { max-width: 900px; margin: auto; padding: 40px; background: white; border-radius: 16px; }
    header { border-bottom: 2px solid #94d3c1; margin-bottom: 28px; padding-bottom: 18px; }
    h1 { margin: 0; font-size: 28px; }
    h2 { margin: 0 0 8px; color: #1c6b58; font-size: 18px; }
    section { margin: 24px 0; break-inside: avoid; }
    p { margin: 0; white-space: normal; }
    a { color: #176b58; overflow-wrap: anywhere; }
    li { margin: 8px 0; }
    .actions { max-width: 900px; margin: 0 auto 16px; text-align: end; }
    button { border: 0; border-radius: 8px; padding: 10px 16px; color: white; background: #1c6b58; font-size: 14px; cursor: pointer; }
    @media print {
      body { padding: 0; background: white; }
      main { max-width: none; padding: 0; }
      .actions { display: none; }
      a { color: inherit; text-decoration: underline; }
    }
  </style>
</head>
<body>
  <div class="actions"><button onclick="window.print()">${escapeHtml(sectionLabels.print)}</button></div>
  <main><header><h1>${escapeHtml(title)}</h1></header>${sectionsHtml}${assetsHtml}</main>
</body>
</html>`;
}

function openCampaignBrief(campaign, isRtl, autoPrint = false) {
  const briefWindow = window.open("", "_blank");
  if (!briefWindow) return false;
  if (autoPrint) {
    briefWindow.addEventListener(
      "load",
      () => briefWindow.print(),
      { once: true },
    );
  }
  briefWindow.document.open();
  briefWindow.document.write(buildCampaignBriefHtml(campaign, isRtl));
  briefWindow.document.close();
  return true;
}

// ── بيانات تجريبية (بدون ربط API) ───────────────────────────────────────────
const MOCK_DETAILS = {
  c1: {
    id: "c1",
    code: "ACAM-2026-038",
    cover: null,
    gradient: "linear-gradient(135deg,#0f2b3d,#0b1620)",
    filesCount: 14,
    packSize: "3.8 GB",
    status: "active",
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
  const { addNotification } = useNotifications();
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
  const [previewNotified, setPreviewNotified] = useState(false);
  const [campaignRequest, setCampaignRequest] = useState(null);
  const isMockCampaign = !campaign && Boolean(MOCK_DETAILS[id]);
  const currentRequest =
    campaignRequest?.id === id ? campaignRequest : null;
  const campaignLoading =
    !campaign && !isMockCampaign && (!currentRequest || currentRequest.status === "loading");
  const campaignError =
    currentRequest?.status === "error" ? currentRequest.error : "";
  const c =
    campaign ??
    MOCK_DETAILS[id] ??
    (currentRequest?.status === "success" ? currentRequest.campaign : null);
  const existingApplication = c ? getExistingApplication(c) : null;
  const currentApplication =
    application ??
    (existingApplication
      ? {
          ...existingApplication,
          campaignName: c.title?.[lang] ?? existingApplication.campaignName,
        }
      : null);
  const hasApplied = Boolean(currentApplication || applied);

  useEffect(() => {
    if (campaign || MOCK_DETAILS[id]) return;

    let active = true;
    getCampaignDetails(id)
      .then((data) => {
        if (active) {
          setCampaignRequest({
            id,
            status: "success",
            campaign: mapCampaignDetails(data, id),
          });
        }
      })
      .catch((error) => {
        if (active) setCampaignRequest({ id, status: "error", error: error.message });
      });

    return () => {
      active = false;
    };
  }, [campaign, id]);

  const isUnavailable =
    c &&
    UNAVAILABLE_STATUSES.has(
      String(c.status ?? "")
        .trim()
        .toLowerCase()
        .replace(/\s+/g, "-"),
    );

  const t = {
    bg: isDark ? "bg-[#0D0D0D]" : "bg-[#F0F2F5]",
    border: isDark ? "border-[#2A2E30]" : "border-[#E2E8F0]",
    field: isDark
      ? "bg-[#26292B] border-[#33383A]"
      : "bg-white border-[#E2E8F0]",
    text: isDark ? "text-white" : "text-[#0F172A]",
    subText: isDark ? "text-[#9A9A9A]" : "text-[#64748B]",
  };

  if (!c && campaignLoading) {
    return (
      <div className={`flex min-h-screen items-center justify-center ${t.bg} ${t.text}`}>
        {isRtl ? "جارٍ تحميل الحملة..." : "Loading campaign..."}
      </div>
    );
  }

  if (!c) {
    return (
      <div
        className={`flex min-h-screen items-center justify-center ${t.bg} ${t.text}`}
      >
        {campaignError || s("notFound")}
      </div>
    );
  }

  const BackIcon = isRtl ? MdArrowForward : MdArrowBack;
  const pct = c.total > 0 ? Math.round((c.remaining / c.total) * 100) : 0;

  const handleApply = () => {
    if (isMockCampaign) {
      toast.info("", {
        title: isRtl ? "التقديم التجريبي غير متاح" : "Demo application unavailable",
        description: isRtl
          ? "هذه حملة تجريبية ولا يمكن إرسالها إلى الخادم."
          : "This is a demo campaign and cannot be submitted to the server.",
      });
      return;
    }
    if (currentApplication) {
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

  const handleExportPdf = () => {
    const pdfUrl = getBriefPdfUrl(c);
    if (pdfUrl) {
      window.open(pdfUrl, "_blank", "noopener,noreferrer");
      toast.success("", {
        title: isRtl ? "بدأ تحميل ملف PDF" : "PDF download started",
        description: isRtl
          ? "تم فتح موجز الحملة المرفق من الخادم."
          : "The campaign brief provided by the server was opened.",
        duration: 6000,
      });
      return;
    }

    if (!openCampaignBrief(c, isRtl, true)) {
      toast.error(isRtl ? "تعذر فتح موجز الحملة. اسمحي بالنوافذ المنبثقة ثم أعيدي المحاولة." : "Could not open the campaign brief. Allow pop-ups and try again.");
    }
  };

  const handlePreview = () => {
    const pdfUrl = getBriefPdfUrl(c);
    if (pdfUrl) {
      window.open(pdfUrl, "_blank", "noopener,noreferrer");
      return;
    }

    // لا يوجد PDF ولا ملفات ولا موجز => المعاينة غير متاحة: إشعار في لوحة الإشعارات
    const hasBrief = c.brief && Object.keys(c.brief).length > 0;
    if (!hasBrief && getCampaignAssetLinks(c).length === 0) {
      if (!previewNotified) {
        addNotification("PREVIEW_UNAVAILABLE", { campaign: c.title[lang] });
        setPreviewNotified(true);
      }
      return;
    }

    if (!openCampaignBrief(c, isRtl)) {
      toast.error(isRtl ? "تعذر فتح موجز الحملة. اسمحي بالنوافذ المنبثقة ثم أعيدي المحاولة." : "Could not open the campaign brief. Allow pop-ups and try again.");
    }
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
            disabled={isMockCampaign}
            className="inline-flex h-11 flex-1 items-center justify-center rounded-xl text-sm font-bold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            style={{ background: ORANGE }}
          >
            {hasApplied ? s("applied") : s("apply")}
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
          <button
            type="button"
            onClick={handlePreview}
            className={`inline-flex h-10 items-center justify-center gap-2 rounded-xl border px-4 text-xs font-bold transition-all hover:border-[#94D3C1] ${t.field} ${t.text}`}
          >
            <MdOutlineVisibility size={16} />
            {s("preview")}
          </button>
          <button
            type="button"
            onClick={handleExportPdf}
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
          try {
            const submittedApplication = await applyToCampaign(c.id);
            const savedApplication = {
              ref: submittedApplication.id,
              campaignName: c.title[lang],
              campaignCode: c.code ?? c.id,
              submittedAt: submittedApplication.appliedAt,
              cpm: c.cpm,
              status: submittedApplication.status,
            };
            addNotification("APPLICATION_SUBMITTED", {
              campaign: c.title[lang],
            });
            window.localStorage.setItem(
              `ppv:applied-campaign:${c.id}`,
              JSON.stringify(savedApplication),
            );
            setApplication(savedApplication);
            setApplied(true);
          } catch (error) {
            if (!isAlreadyAppliedError(error)) throw error;

            const existing =
              getExistingApplication(c) ?? {
                campaignName: c.title[lang],
                campaignCode: c.code ?? c.id,
                cpm: c.cpm,
                status: "PENDING",
              };
            setApplication(existing);
            setApplied(true);
            setApplyOpen(false);
            setApplyAlreadyOpen(true);
          }
        }}
      />
      <ApplyAlreadyModal
        open={!isUnavailable && applyAlreadyOpen}
        application={currentApplication}
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