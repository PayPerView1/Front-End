"use client";

import { useTranslations } from "next-intl";
import { useTheme } from "@/context/ThemeContext";
import { Link } from "@/i18n/navigation";
import { FaTiktok, FaYoutube, FaInstagram } from "react-icons/fa";
import { FiExternalLink } from "react-icons/fi";
import { MdBarChart, MdOutlineCampaign } from "react-icons/md";

// ─── ألوان الثيمين ───────────────────────────────────────────
const darkTheme = {
  card: "border-black bg-[#191C1D]",
  title: "text-white",
  muted: "text-gray-400",
  mint: "text-[#8FE3C8]",
  gold: "text-[#E9C349]",
  earn: "text-[#FFA600]",
  campaignIcon: "text-[#F5B83D]",
  divider: "bg-white/15",
  pill: "bg-white/5 text-white",
  thumb: "bg-black",
};

const lightTheme = {
  card: "border-[#E5E7E7] bg-white shadow-sm",
  title: "text-[#1A1A1A]",
  muted: "text-[#666666]",
  mint: "text-[#2F9E83]",
  gold: "text-[#FFA600]",
  earn: "text-[#D98200]",
  campaignIcon: "text-[#D98200]",
  divider: "bg-black/10",
  pill: "bg-black/5 text-[#1A1A1A]",
  thumb: "bg-[#E5E7E7]",
};

const platforms = {
  tiktok: { Icon: FaTiktok, color: "#00F2FE" },
  shorts: { Icon: FaYoutube, color: "#FF0000" },
  reels: { Icon: FaInstagram, color: "#E1306C" },
};

export default function ClipCard({ clip }) {
  const tr = useTranslations("contentPerformance.card");
  const { isDark } = useTheme();
  const t = isDark ? darkTheme : lightTheme;
  const { Icon, color } = platforms[clip.platform] || platforms.tiktok;

  return (
    <div
      className={`flex flex-col gap-4 rounded-2xl border p-3 transition md:flex-row md:items-center md:justify-between ${t.card}`}
    >
      {/* الصورة + المعلومات */}
      <div className="flex items-center gap-5">
        <div
          className={`relative h-[100px] w-[130px] shrink-0 overflow-hidden rounded-xl ${t.thumb}`}
        >
          {clip.thumbnail && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={clip.thumbnail}
              alt={clip.title}
              className="h-full w-full object-cover"
            />
          )}

          {/* شارة المنصة */}
          <span className="absolute right-0.5 top-0.5 flex items-center gap-1 rounded-bl-lg bg-black/80 px-2 py-1 text-[10px] font-medium text-white">
            <Icon size={12} style={{ color }} />
            {tr(`platform.${clip.platform}`)}
          </span>

          {/* المدة */}
          <span className="absolute bottom-1.5 left-1.5 rounded bg-black/60 px-1.5 py-0.5 text-[10px] text-white">
            {clip.duration}
          </span>
        </div>

        <div className="space-y-1.5">
          <h3 className={`text-sm font-bold md:text-base ${t.title}`}>
            {clip.title}
          </h3>

          <p
            className={`flex flex-wrap items-center gap-x-2 gap-y-1 text-xs ${t.muted}`}
          >
            <MdOutlineCampaign className={t.campaignIcon} size={15} />
            <span>{tr("campaign", { name: clip.campaign })}</span>
            <span>{tr("published", { time: clip.publishedAgo })}</span>
          </p>

          <div
            className={`flex flex-wrap items-center gap-3 text-xs ${t.muted}`}
          >
            <span>
              {tr("completion")} <b className={t.mint}>{clip.completion}%</b>
            </span>
            <span className={`h-3 w-px ${t.divider}`} />
            <span>
              {tr("earnings")}{" "}
              <b className={t.earn}>
                {clip.earnings} {tr("currency")}
              </b>
            </span>
          </div>
        </div>
      </div>

      {/* المشاهدات + الأزرار */}
      <div className="flex flex-col gap-3 md:items-start">
        <div>
          <p className={`text-[11px] ${t.muted}`}>{tr("verifiedViews")}</p>
          <p className="mt-0.5 flex items-end gap-1.5">
            <span
              className={`text-2xl font-extrabold leading-none md:text-3xl ${t.mint}`}
            >
              {clip.views.toLocaleString("en-US")}
            </span>
            <span className={`pb-0.5 text-xs font-bold ${t.gold}`}>
              {tr("views")}
            </span>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href={`/creator/content-performance/${clip.id}`}
            className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-medium transition ${t.pill}`}
          >
            <MdBarChart size={15} />
            {tr("details")}
          </Link>

          <a
            href={clip.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-medium transition ${t.pill}`}
          >
            <FiExternalLink size={14} />
            {tr("openClip")}
          </a>
        </div>
      </div>
    </div>
  );
}