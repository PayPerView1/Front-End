"use client";

import { useTranslations } from "next-intl";
import { useTheme } from "@/context/ThemeContext";
import {
  FiDownload,
  FiExternalLink,
  FiEye,
  FiCreditCard,
  FiClock,
  FiThumbsUp,
  FiHeart,
  FiCheckCircle,
  FiAlertCircle,
  FiTrendingUp,
  FiTrendingDown,
} from "react-icons/fi";
import { FaTiktok, FaYoutube, FaInstagram } from "react-icons/fa";

const platformIcons = {
  tiktok: FaTiktok,
  shorts: FaYoutube,
  reels: FaInstagram,
};

const darkTheme = {
  card: "border-black bg-[#191C1D]",
  danger: "border-[#F87171]/30 bg-[#F87171]/5",
  dangerIcon: "bg-[#F87171]/10 text-[#F87171]",
  sub: "bg-[#232729]",
  title: "text-white",
  label: "text-gray-300",
  muted: "text-gray-400",
  mint: "text-[#94D3C1]",
  gold: "text-[#E9C349]",
  red: "text-[#F87171]",
  line: "border-white/5",
  badge: "border-white/10 bg-[#232729] text-[#94D3C1]",
  verified: "bg-[#94D3C1]/10 text-[#94D3C1]",
  btn: "bg-[#232729] text-gray-200 ",
  thumb: "bg-black",
};

const lightTheme = {
  card: "border-[#E5E7E7] bg-white shadow-sm",
  danger: "border-[#F87171]/40 bg-[#F87171]/5",
  dangerIcon: "bg-[#F87171]/10 text-[#F87171]",
  sub: "bg-[#EEF3F2]",
  title: "text-[#1A1A1A]",
  label: "text-[#333333]",
  muted: "text-[#666666]",
  mint: "text-[#2F9E83]",
  gold: "text-[#B7860B]",
  red: "text-[#F87171]",
  line: "border-[#E5E7E7]",
  badge: "border-[#E5E7E7] bg-[#EEF3F2] text-[#2B7A66]",
  verified: "bg-[#94D3C1]/25 text-[#2B7A66]",
  btn: "bg-[#EEF3F2] text-[#333333] hover:bg-[#E3EAE9]",
  thumb: "bg-[#E5E7E7]",
};

export default function ClipHeader({ clip, status }) {
  const tr = useTranslations("contentPerformance.details.header");
  const { isDark } = useTheme();
  const t = isDark ? darkTheme : lightTheme;
  const trExport = useTranslations("contentPerformance.export");

const handleDownload = async () => {
  const XLSX = await import("xlsx");
  const c = trExport.raw("columns");

  // الورقة الأولى: ملخص المقطع
  const summary = [
    {
      [c.clip]: clip.title,
      [c.platform]: tr(`platform.${clip.platform}`),
      [c.campaign]: clip.campaign,
      [c.published]: clip.publishedLabel,
      [c.completion]: clip.retention?.end ?? 0,
      [c.earnings]: clip.earnings,
      [c.views]: clip.views,
      [c.url]: clip.url,
    },
  ];

  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(summary);
  ws["!cols"] = Object.keys(summary[0]).map(() => ({ wch: 24 }));
  XLSX.utils.book_append_sheet(wb, ws, trExport("sheetName"));

  XLSX.writeFile(wb, `${trExport("fileName")}-${clip.id ?? "clip"}.xlsx`);
};
  const PlatformIcon = platformIcons[clip.platform] || FaTiktok;
  const empty = status === "waiting" || status === "error";
  const error = status === "error";
  const anomaly = status === "anomaly";
  const dash = "—";

  const stats = [
    {
      key: "views",
      label: tr(empty ? "stats.views.labelEmpty" : "stats.views.label"),
      value: error ? dash : empty ? "0" : clip.views.toLocaleString("en-US"),
      unit: error ? tr("updating") : tr("stats.views.unit"),
      Icon: FiEye,
      valueColor: t.title,
      footer: {
        Icon: empty ? FiAlertCircle : FiCheckCircle,
        text: tr(empty ? "stats.views.noteEmpty" : "stats.views.note"),
        color: empty ? t.gold : t.mint,
      },
    },
    {
      key: "earnings",
      label: tr("stats.earnings.label"),
      value: error ? dash : empty ? "0.00" : clip.earnings,
      unit: tr("stats.earnings.unit"),
      Icon: FiCreditCard,
      valueColor: empty ? t.title : t.mint,
      footer: {
        Icon: FiClock,
        text: empty
          ? tr("stats.earnings.noteEmpty", { rate: clip.rate })
          : tr("stats.earnings.note"),
        color: empty ? t.gold : t.mint,
      },
    },
    {
      key: "watch",
      label: tr("stats.watch.label"),
      value: empty ? dash : String(clip.watch),
      unit: empty
        ? tr("stats.watch.unitEmpty")
        : tr("stats.watch.unit", { total: clip.seconds }),
      Icon: FiClock,
      valueColor: t.title,
      danger: anomaly,
      footer: {
        Icon: empty ? FiClock : anomaly ? FiTrendingDown : FiTrendingUp,
        text: empty
          ? tr("stats.watch.noteEmpty")
          : anomaly
          ? tr("stats.watch.noteDown", { percent: Math.abs(clip.vsPlatform) })
          : tr("stats.watch.noteUp", { percent: Math.abs(clip.vsPlatform) }),
        color: anomaly ? t.red : t.mint,
      },
    },
    {
      key: "engagement",
      label: tr("stats.engagement.label"),
      value: error ? dash : empty ? "0%" : clip.engagement,
      unit: empty
        ? ""
        : tr("stats.engagement.unit", { count: clip.engagementCount }),
      Icon: FiThumbsUp,
      valueColor: empty ? t.title : t.mint,
      footer: {
        Icon: FiHeart,
        text: tr(
          empty ? "stats.engagement.noteEmpty" : "stats.engagement.note"
        ),
        color: t.mint,
      },
    },
  ];

  return (
    <div className="space-y-4">
      {/* بطاقة المقطع */}
      <div
        className={`flex flex-col gap-5 rounded-2xl border p-5 md:flex-row md:items-center md:justify-between ${t.card}`}
      >
        <div className="flex items-center gap-4">
          <div
            className={`relative h-[84px] w-[140px] shrink-0 overflow-hidden rounded-xl ${t.thumb}`}
          >
            {clip.thumbnail && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={clip.thumbnail}
                alt={clip.title}
                className="h-full w-full object-cover"
              />
            )}
            {empty ? (
              <span className="absolute bottom-1.5 left-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-black/70 text-white">
                <PlatformIcon size={11} />
              </span>
            ) : (
              <span className="absolute bottom-1 left-1 rounded bg-black/60 px-1.5 py-0.5 text-[10px] text-white">
                {clip.duration}
              </span>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`flex items-center gap-1.5 rounded-md border px-2 py-1 text-[11px] ${t.badge}`}
              >
                <PlatformIcon size={11} />
                {tr(`platform.${clip.platform}`)}
              </span>
              {empty && (
                <span
                  className={`flex items-center gap-1.5 rounded-md px-2 py-1 text-[11px] ${t.verified}`}
                >
                  <FiCheckCircle size={11} />
                  {tr("verifiedLink")}
                </span>
              )}
            </div>

            <h1
              className={`text-lg font-extrabold leading-8 md:text-2xl ${t.title}`}
            >
              {clip.title}
            </h1>

            <p
              className={`flex flex-wrap items-center gap-x-3 gap-y-1 text-xs ${t.muted}`}
            >
              <span className="flex items-center gap-1.5">
                <FiCheckCircle className={t.gold} size={13} />
                {tr("campaign")} <b className={t.label}>{clip.campaign}</b>
              </span>
              {empty && clip.publisher && (
                <span>
                  {tr("publisher")} <b className={t.label}>{clip.publisher}</b>
                </span>
              )}
            </p>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-3">
          <a
            href={clip.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex items-center gap-2 rounded-xl px-3 py-2 text-sm transition ${t.btn}`}
          >
            <FiExternalLink size={16} />
            {tr("openOriginal")}
          </a>
          <button
              onClick={handleDownload}
              className="flex items-center gap-2 rounded-xl bg-[linear-gradient(90deg,#FB8B03_0%,#FA6203_100%)] px-3 py-2 text-sm font-bold text-white transition"
            >
            <FiDownload size={16} />
            {tr("downloadReport")}
          </button>
        </div>
      </div>

      {/* الإحصائيات الأربعة */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map(
          ({ key, label, value, unit, Icon, valueColor, danger, footer }) => {
            const FooterIcon = footer.Icon;
            return (
              <div
                key={key}
                className={`flex flex-col gap-3 rounded-2xl border p-4 ${
                  danger ? t.danger : t.card
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`text-sm ${danger ? t.red : t.label}`}>
                    {label}
                  </span>
                  <span
                    className={`flex h-8 w-8 items-center justify-center rounded-xl ${
                      danger ? t.dangerIcon : `${t.sub} ${t.mint}`
                    }`}
                  >
                    <Icon size={16} />
                  </span>
                </div>

                <div className="flex items-end gap-2">
                  <span
                    dir="ltr"
                    className={`text-3xl font-extrabold leading-none ${valueColor}`}
                  >
                    {value}
                  </span>
                  <span className={`pb-0.5 text-xs ${t.muted}`}>{unit}</span>
                </div>

                <div
                  className={`flex items-center gap-1.5 border-t pt-3 text-[11px] ${t.line} ${footer.color}`}
                >
                  <FooterIcon size={12} />
                  {footer.text}
                </div>
              </div>
            );
          }
        )}
      </div>
    </div>
  );
}