"use client";

import { useMemo, useState } from "react";
import { clips } from "../data";
import { useLocale,useTranslations } from "next-intl";
import { useTheme } from "@/context/ThemeContext";
import {
  FiDownload,
  FiPlayCircle,
  FiSearch,
  FiTrendingUp,
  FiCheckCircle,
} from "react-icons/fi";
import {
  MdOutlineVideoLibrary,
  MdOutlineVerifiedUser,
  MdOutlineSpeed,
} from "react-icons/md";
import ClipCard from "./ClipCard";

// ─── ألوان الثيمين ───────────────────────────────────────────
const darkTheme = {
  page: "bg-[#000000F2]",
  card: "border-black bg-[#191C1D]",
  sub: "bg-[#232729]",
  title: "text-white",
  label: "text-gray-300",
  muted: "text-gray-400",
  faint: "text-gray-500",
  mint: "text-[#8FE3C8]",
  mintBadge: "bg-[#2849434D] text-[#AACEC6]",
  live: "bg-[#8FE3C8]/10 text-[#8FE3C8]",
  gold: "text-[#E9C349]",
  dot: "bg-[#E9C349]",
  tabIdle: "text-gray-400",
  tabCount: "bg-white/5",
  search: "border-white/5 bg-[#232729]",
  placeholder: "placeholder:text-gray-400",
};

const lightTheme = {
  page: "bg-[#F4F6F6]",
  card: "border-[#E5E7E7] bg-white shadow-sm",
  sub: "bg-[#EEF3F2]",
  title: "text-[#1A1A1A]",
  label: "text-[#333333]",
  muted: "text-[#666666]",
  faint: "text-[#8A8A8A]",
  mint: "text-[#2F9E83]",
  mintBadge: "bg-[#94D3C1]/25 text-[#2B7A66]",
  live: "bg-[#94D3C1]/25 text-[#2B7A66]",
  gold: "text-[#B7860B]",
  dot: "bg-[#D9A400]",
  tabIdle: "text-[#666666]",
  tabCount: "bg-black/5",
  search: "border-[#E5E7E7] bg-[#EEF3F2]",
  placeholder: "placeholder:text-[#8A8A8A]",
};


const tabKeys = ["all", "tiktok", "shorts", "reels"];

export default function ContentPerformanceView() {
  const tr = useTranslations("contentPerformance");
  const locale = useLocale();
  const { isDark } = useTheme();
  const t = isDark ? darkTheme : lightTheme;

  const [tab, setTab] = useState("all");
  const [query, setQuery] = useState("");

  const counts = useMemo(() => {
    const c = { all: clips.length };
    clips.forEach((x) => (c[x.platform] = (c[x.platform] || 0) + 1));
    return c;
  }, []);

  const filtered = useMemo(
    () =>
      clips.filter(
        (c) =>
          (tab === "all" || c.platform === tab) &&
          (c.title.includes(query) || c.campaign.includes(query))
      ),
    [tab, query]
  );
  const [exporting, setExporting] = useState(false);

const handleExport = async () => {
  if (exporting || !filtered.length) return;
  setExporting(true);

  try {
    // تحميل المكتبة عند الحاجة فقط (ما بتثقّل الصفحة)
    const XLSX = await import("xlsx");
    const col = (key) => tr(`export.columns.${key}`);
    const toNumber = (v) => parseFloat(String(v).replace(/,/g, "")) || 0;

    const rows = filtered.map((c) => ({
      [col("clip")]: c.title,
      [col("platform")]: tr(`tabs.${c.platform}`),
      [col("campaign")]: c.campaign,
      [col("published")]: c.publishedAgo,
      [col("completion")]: c.completion,
      [col("earnings")]: toNumber(c.earnings),
      [col("views")]: c.views,
      [col("url")]: c.url,
    }));

    // صف الإجمالي
    rows.push({
      [col("clip")]: tr("export.total"),
      [col("earnings")]: filtered.reduce((s, c) => s + toNumber(c.earnings), 0),
      [col("views")]: filtered.reduce((s, c) => s + c.views, 0),
    });

    const ws = XLSX.utils.json_to_sheet(rows);
    ws["!cols"] = [
      { wch: 48 },
      { wch: 16 },
      { wch: 26 },
      { wch: 14 },
      { wch: 14 },
      { wch: 22 },
      { wch: 18 },
      { wch: 32 },
    ];

    const wb = XLSX.utils.book_new();
    wb.Workbook = { Views: [{ RTL: locale === "ar" }] }; // اتجاه الورقة
    XLSX.utils.book_append_sheet(wb, ws, tr("export.sheetName"));

    const date = new Date().toISOString().slice(0, 10);
    XLSX.writeFile(wb, `${tr("export.fileName")}-${date}.xlsx`);
  } finally {
    setExporting(false);
  }
};
  const stats = [
    {
      key: "liveViews",
      value: "1,842,500",
      Icon: FiPlayCircle,
      valueColor: t.title,
      unitColor: t.muted,
      footer: (
        <div className="flex items-center gap-2 text-xs">
          <span
            className={`flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] ${t.mintBadge}`}
          >
            <FiTrendingUp size={11} />
            <span dir="ltr">+18.4%</span>
          </span>
          <span className={t.muted}>{tr("stats.liveViews.note")}</span>
        </div>
      ),
    },
    {
      key: "activeClips",
      value: "4",
      Icon: MdOutlineVideoLibrary,
      valueColor: t.title,
      unitColor: `font-bold ${t.gold}`,
      footer: (
        <div className={`flex items-center gap-2 text-xs ${t.muted}`}>
          <span className={`h-2 w-2 rounded-full ${t.dot}`} />
          {tr("stats.activeClips.note")}
        </div>
      ),
    },
    {
      key: "verifiedViews",
      value: "1,620,000",
      Icon: MdOutlineVerifiedUser,
      valueColor: t.title,
      unitColor: t.muted,
      footer: (
        <div className={`flex items-center gap-1.5 text-xs ${t.mint}`}>
          <FiCheckCircle size={13} />
          {tr("stats.verifiedViews.note")}
        </div>
      ),
    },
    {
      key: "flowSpeed",
      value: "~48",
      Icon: MdOutlineSpeed,
      valueColor: t.gold,
      unitColor: t.muted,
      footer: (
        <div className="flex w-full items-center justify-between text-xs">
          <span className={t.muted}>{tr("stats.flowSpeed.note")}</span>
          <span
            className={`rounded-md px-2 py-0.5 text-[10px] ${t.mintBadge}`}
          >
            {tr("stats.flowSpeed.badge")}
          </span>
        </div>
      ),
    },
  ];

  return (
    <div
      className={`font-tajawal space-y-6 p-4 md:p-8 ${t.page}`}
      style={{ fontFamily: "var(--font-tajawal)" }}
    >
      {/* العنوان */}
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <h1 className={`text-2xl font-extrabold md:text-3xl ${t.title}`}>
            {tr("title")}
          </h1>
          <p className={`mt-1 text-sm ${t.muted}`}>{tr("subtitle")}</p>
        </div>
        <button
          onClick={handleExport}
          disabled={exporting || !filtered.length}
          className="flex w-fit items-center gap-2 rounded-xl bg-[linear-gradient(90deg,#FB8B03_0%,#FA6203_100%)] px-4 py-2.5 text-sm font-bold text-white transition disabled:cursor-not-allowed disabled:opacity-60"
        >
          <FiDownload size={16} />
          {tr("downloadReport")}
        </button>
      </div>

      {/* كروت الإحصائيات */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map(({ key, value, Icon, valueColor, unitColor, footer }) => (
          <div
            key={key}
            className={`flex flex-col justify-between gap-3 rounded-2xl border p-4 ${t.card}`}
          >
            <div className="flex items-center justify-between">
              <span className={`text-sm ${t.label}`}>
                {tr(`stats.${key}.label`)}
              </span>
              <span
                className={`flex h-8 w-8 items-center justify-center rounded-xl ${t.sub} ${t.mint}`}
              >
                <Icon size={18} />
              </span>
            </div>

            <div className="flex items-end gap-2">
              <span
                dir="ltr"
                className={`text-2xl font-extrabold leading-none ${valueColor}`}
              >
                {value}
              </span>
              <span className={`pb-0.5 text-xs ${unitColor}`}>
                {tr(`stats.${key}.unit`)}
              </span>
            </div>

            {footer}
          </div>
        ))}
      </div>

      {/* التبويبات + البحث */}
      <div
        className={`flex flex-col gap-3 rounded-2xl border p-2 lg:flex-row lg:items-center ${t.card}`}
      >
        <div className="flex flex-wrap gap-1">
          {tabKeys.map((key) => {
            const active = tab === key;
            return (
              <button
                key={key}
                onClick={() => setTab(key)}
                className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition ${
                  active
                    ? "bg-[linear-gradient(90deg,#FB8B03_0%,#FA6203_100%)] text-white"
                    : t.tabIdle
                }`}
              >
                {tr(`tabs.${key}`)}
                <span
                  className={`rounded-md px-1.5 text-xs ${
                    active ? "bg-white/20" : t.tabCount
                  }`}
                >
                  {counts[key] || 0}
                </span>
              </button>
            );
          })}
        </div>

        {/* صندوق البحث */}
        <div className="relative flex-1">
          <div
            className={`relative flex items-center rounded-2xl border px-4 py-0.5 ${t.search}`}
          >
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={tr("searchPlaceholder")}
              className={`w-full bg-transparent py-1 text-start text-sm focus:outline-none ${t.title} ${t.placeholder}`}
            />
            <FiSearch className={`ms-2 shrink-0 ${t.muted}`} size={14} />
          </div>
        </div>
      </div>

      {/* عنوان القائمة */}
      <div className="flex items-center justify-between">
        <h2 className={`flex items-center gap-2 text-sm font-bold ${t.title}`}>
          {tr("listTitle")}
          <span
            className={`rounded-md px-2 py-0.5 text-[10px] font-medium ${t.live}`}
          >
            {tr("liveNow")}
          </span>
        </h2>
        <p className={`text-xs ${t.faint}`}>
          {tr("showing", { count: filtered.length })}
        </p>
      </div>

      {/* القائمة */}
      <div className="space-y-4">
        {filtered.length ? (
                filtered.map((clip) => <ClipCard key={clip.id} clip={clip} />)
              ) : (
                <p className={`rounded-2xl border p-8 text-center text-sm ${t.card} ${t.muted}`}>
                  {tr("noResults")}
                </p>
              )}
      </div>

      {/* صندوق التوضيح */}
      <div
        className={`flex items-start gap-4 rounded-2xl border px-6 py-5 ${t.card}`}
      >
        <span
          className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${t.sub} ${t.mint}`}
        >
          <MdOutlineVerifiedUser size={15} />
        </span>

        <div className="flex-1">
          <h3 className={`text-base font-bold leading-7 ${t.title}`}>
            {tr("info.title")}
          </h3>
          <p className={`mt-1 text-sm leading-8 ${t.muted}`}>
            {tr("info.text")}
          </p>
        </div>
      </div>
    </div>
  );
}