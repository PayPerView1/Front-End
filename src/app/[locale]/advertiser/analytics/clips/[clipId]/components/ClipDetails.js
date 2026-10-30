"use client";
import { useEffect, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useTheme } from "@/context/ThemeContext";
import { toast } from "@/components/ui/Toast";
import { useNotifications } from "@/context/NotificationsContext";
import { KINDS } from "@/components/notificationKinds";
import {
  MdOutlineArrowBack,
  MdOutlineArrowForward,
  MdOutlineVerified,
  MdOutlineFullscreen,
  MdOutlineClose,
  MdPlayArrow,
  MdPause,
  MdOutlineCheckCircleOutline,
  MdOutlineLink,
  MdOutlineContentCopy,
  MdOutlineShare,
  MdOutlineOpenInNew,
  MdOutlineFavoriteBorder,
  MdOutlineVisibility,
  MdOutlineChatBubbleOutline,
  MdOutlineBookmarkBorder,
  MdOutlineAutoAwesome,
  MdOutlinePublic,
  MdOutlinePayments,
  MdOutlineCancel,
  MdOutlineTrendingUp,
  MdOutlineTaskAlt,
  MdOutlineQueryStats,
  MdOutlineVerifiedUser,
} from "react-icons/md";
import { FaTiktok } from "react-icons/fa";
import ApproveConfirmModal from "./ApproveConfirmModal";
import RejectConfirmModal from "./RejectConfirmModal";

const MINT = "#94D3C1";
const GOLD = "#E9C349";
const RED = "#DC2626";
const ORANGE = "linear-gradient(90deg, #FFA600, #FF4B04)";

/*بيانات تجريبية (استبدلها بالـ API)  */
const MOCK_CAMPAIGN = {
  code: "CAM-2026-88",
  name: { ar: "عطر مسك الأصيل 2025", en: "Original Musk Perfume 2025" },
};

const MOCK_CLIP = {
  id: "VID-98214",
  code: "SUB-8812",
  status: "pending",
  platform: "tiktok",
  resolution: "1080p 60fps",
  duration: 45,
  caption: {
    ar: "مراجعة تفاصيل المقطع بالكامل",
    en: "Full clip details review",
  },
  scenario: "Scenario 5: US-REVIEW-01",
  thumb: "",
  videoUrl: "",
  postUrl: "https://tiktok.com/@saud_clips/video/73928194821",
  creator: {
    name: "سعود بن ناصر",
    username: "saud_clips",
    avatar: "",
    platforms: "TikTok & Instagram",
    rating: 5.0,
    completedCampaigns: 18,
    commitment: 100,
    followers: 245000,
    audienceNote: {
      ar: "نشاط عالٍ واستهداف خليجي دقيق",
      en: "High activity and precise Gulf targeting",
    },
    geo: [
      { name: { ar: "السعودية", en: "Saudi Arabia" }, percent: 74 },
      { name: { ar: "الإمارات", en: "UAE" }, percent: 14 },
      {
        name: { ar: "الكويت وباقي الخليج", en: "Kuwait & rest of Gulf" },
        percent: 12,
      },
    ],
  },
  ai: {
    match: 98,
    checks: [
      { key: "product", percent: 100 },
      { key: "hashtags", percent: 100 },
      { key: "halal", percent: 100 },
      { key: "copyright", percent: 96 },
    ],
  },
  finance: {
    cpm: 5.5,
    approvedViews: 14200,
    escrowRemaining: 6200,
    reserved: 750, // المبلغ المحجوز للمقطع، يُعاد عند الرفض
  },
  live: {
    views: 14200,
    viewsGrowth: 18,
    likes: 1840,
    engagement: 12.9,
    comments: 320,
    positive: 94,
    shares: 540,
  },
};

/* مساعدات  */
const num = (n) => Number(n).toLocaleString("en-US");
const money = (n) =>
  Number(n).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
const pick = (v, locale) =>
  v && typeof v === "object" ? (v[locale] ?? v.ar ?? v.en ?? "") : (v ?? "");
const mmss = (sec) => {
  const s = Math.max(0, Math.floor(sec || 0));
  return `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
};

/*  مكوّنات صغيرة  */
function Card({ t, className = "", children }) {
  return (
    <section
      className={`rounded-2xl border p-4 sm:p-5 ${t.card} ${t.border} ${className}`}
    >
      {children}
    </section>
  );
}

function CardTitle({ t, icon: Icon, title, subtitle, end }) {
  return (
    <div className="mb-3 flex items-start justify-between gap-3">
      <div className="flex min-w-0 items-center gap-3">
        {Icon && (
          <span
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border ${t.field}`}
          >
            <Icon size={18} color={MINT} />
          </span>
        )}
        <div className="min-w-0">
          <h2 className={`text-sm font-extrabold ${t.text}`}>{title}</h2>
          {subtitle && (
            <p className={`mt-0.5 text-[11px] ${t.subText}`}>{subtitle}</p>
          )}
        </div>
      </div>
      {end}
    </div>
  );
}

function Pill({ children, color = MINT, className = "" }) {
  return (
    <span
      className={`inline-flex shrink-0 items-center rounded-md px-2.5 py-1 text-[10px] font-bold ${className}`}
      style={{ background: `${color}26`, color }}
    >
      {children}
    </span>
  );
}

function LiveStat({ t, icon: Icon, iconColor = MINT, label, value, note, noteMint }) {
  return (
    <div className={`rounded-lg border px-2.5 py-2 ${t.field}`}>
      <div className="flex items-center justify-between gap-2">
        <p className={`text-[10px] ${t.subText}`}>{label}</p>
        <Icon size={14} color={iconColor} />
      </div>
      <p className={`mt-1 text-lg font-extrabold leading-none ${t.text}`}>
        {value}
      </p>
      <p
        className={`mt-1 flex items-center gap-1 text-[9px] ${noteMint ? "" : t.subText}`}
        style={noteMint ? { color: MINT } : undefined}
      >
        {noteMint && <MdOutlineTrendingUp size={11} />}
        {note}
      </p>
    </div>
  );
}

/* ───────────── الصفحة ───────────── */
export default function ClipDetails({
  campaignId,
  clipId,
  campaign = MOCK_CAMPAIGN,
  clip: clipProp = MOCK_CLIP,
  // TODO: عدّل المسار حسب الراوتر عندكم
  backHref = `/advertiser/analytics/clips/campaign/${campaignId}`,
}) {
  const { isDark } = useTheme();
  const locale = useLocale();
  const tr = useTranslations("clipDetail");
  const { addNotification } = useNotifications();
  const isRtl = locale === "ar";
  const Back = isRtl ? MdOutlineArrowForward : MdOutlineArrowBack;

  const [clip, setClip] = useState(clipProp);
  const [confirmReject, setConfirmReject] = useState(false);
  const [confirmApprove, setConfirmApprove] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [copied, setCopied] = useState(false);
  const videoRef = useRef(null);
  const frameRef = useRef(null);
  const copyTimer = useRef(null);

  useEffect(
    () => () => {
      clearTimeout(copyTimer.current);
    },
    [],
  );

  const t = {
    card: isDark ? "bg-[#111111]" : "bg-white",
    border: isDark ? "border-[#1E2D3D]" : "border-[#E2E8F0]",
    field: isDark
      ? "bg-[#1A1A1A] border-[#2D2D2D]"
      : "bg-[#F8FAFC] border-[#E2E8F0]",
    text: isDark ? "text-white" : "text-[#0F172A]",
    subText: isDark ? "text-[#9A9A9A]" : "text-[#64748B]",
    track: isDark ? "bg-white/10" : "bg-black/10",
  };

  const approved = clip.status === "approved";
  const rejected = clip.status === "rejected";
  const { cpm, approvedViews, escrowRemaining } = clip.finance;
  const due = (approvedViews / 1000) * cpm;
  const remaining = approved ? escrowRemaining - due : escrowRemaining;
  const platformName = tr(`platforms.${clip.platform}`);
  const amountLabel = money(due);
  const campaignCode = campaign.code ?? campaignId ?? "";
  const clipCode = clip.code ?? clipId ?? clip.id;

  /* تشغيل المقطع داخل نفس الصفحة (TikTok embed) إذا ما في videoUrl مباشر */
  const tiktokId = clip.postUrl?.match(/video\/(\d+)/)?.[1];
  const canEmbed = !clip.videoUrl && clip.platform === "tiktok" && !!tiktokId;
  const embedded = canEmbed && playing;

  /* مشغّل الفيديو */
  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) {
      if (canEmbed) {
        setPlaying((p) => !p);
        return;
      }
      if (clip.postUrl)
        window.open(clip.postUrl, "_blank", "noopener,noreferrer");
      return;
    }
    if (v.paused) v.play();
    else v.pause();
  };
  const goFullscreen = () => frameRef.current?.requestFullscreen?.();
  const progress = clip.videoUrl
    ? Math.min(1, time / (clip.duration || 1))
    : 0;

  /* الإجراءات (TODO: اربطها بالـ API) */
  const handleApprove = () => {
    if (approved) return;
    setClip((c) => ({ ...c, status: "approved" }));
    addNotification(KINDS.CLIP_APPROVED, {
      creator: clip.creator.name,
      campaign: pick(campaign.name, locale),
    });
  };

  const doApprove = () => {
    handleApprove();
    setConfirmApprove(false);
  };

  const doReject = ({ reason, note }) => {
    setClip((c) => ({
      ...c,
      status: "rejected",
      rejectReason: reason,
      rejectNote: note,
    }));
    setConfirmReject(false);
    // TODO: ابعت { reason, note } للـ API
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(clip.postUrl);
      setCopied(true);
      clearTimeout(copyTimer.current);
      copyTimer.current = setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("", { title: tr("toast.copyFailed") });
    }
  };

  const shareLink = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          url: clip.postUrl,
          title: pick(clip.caption, locale),
        });
        return;
      } catch {
        /* المستخدم أغلق نافذة المشاركة */
      }
    }
    copyLink();
  };

  const [mainGeo, ...restGeo] = clip.creator.geo;

  return (
    <div
      dir={isRtl ? "rtl" : "ltr"}
      className="mx-auto flex w-full max-w-7xl flex-col gap-3 p-3 sm:p-4"
      style={{ fontFamily: "var(--font-tajawal), sans-serif" }}
    >
      {/* رجوع */}
      <div className={`flex ${isRtl ? "justify-start" : "justify-end"}`}>
        <Link
          href={backHref}
          className={`inline-flex h-10 items-center gap-2 rounded-xl border px-4 text-xs font-bold transition-all hover:border-[#94D3C1] ${t.field} ${t.text}`}
        >
          <Back size={16} />
          {tr("back")}
        </Link>
      </div>

      {/* العنوان */}
      <header className={`rounded-2xl border p-4 sm:p-5 ${t.card} ${t.border}`}>
        <h1 className={`text-xl font-extrabold sm:text-2xl ${t.text}`}>
          {tr("title")}
        </h1>
        <p className={`mt-2 max-w-3xl text-xs leading-relaxed ${t.subText}`}>
          {tr("subtitle")}
        </p>
      </header>

      <div className="grid grid-cols-1 gap-3 lg:grid-cols-[minmax(0,5fr)_minmax(0,8fr)]">
        {/* ═════ العمود الأول: المعاينة + الرابط + الإحصائيات ═════ */}
        <div className="flex min-w-0 flex-col gap-3">
          {/* معاينة المقطع */}
          <Card t={t} className="!p-2">
            <div className="mb-3 flex items-center justify-between gap-3">
              <h2
                className={`flex items-center gap-2 text-sm font-extrabold ${t.text}`}
              >
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ background: MINT }}
                />
                {tr("preview.title")}
              </h2>
              <span
                dir="ltr"
                className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-[11px] ${t.field} ${t.subText}`}
              >
                {isRtl ? `TikTok • ${platformName}` : platformName}
                <FaTiktok
                  aria-hidden="true"
                  size={14}
                  className={`shrink-0 ${isDark ? "text-white" : "text-[#111111]"} [filter:drop-shadow(-1px_0_0_#25F4EE)_drop-shadow(1px_0_0_#FE2C55)]`}
                />
              </span>
            </div>

            {/* وقت التشغيل (embed) الإطار بيصير عمودي لأن مشغّل TikTok عمودي */}
            <div
              ref={frameRef}
              className={`relative overflow-hidden rounded-[2rem] border-[6px] ${
                embedded
                  ? "mx-auto h-[575px] w-full max-w-[340px]"
                  : "aspect-[1/0.70] w-full"
              } ${isDark ? "border-[#2A2A2A] bg-black" : "border-[#CBD5E1] bg-white"}`}
            >
              {clip.videoUrl ? (
                <video
                  ref={videoRef}
                  src={clip.videoUrl}
                  playsInline
                  onPlay={() => setPlaying(true)}
                  onPause={() => setPlaying(false)}
                  onTimeUpdate={(e) => setTime(e.currentTarget.currentTime)}
                  className="absolute inset-0 h-full w-full object-cover"
                />
              ) : embedded ? (
                <iframe
                  src={`https://www.tiktok.com/embed/v2/${tiktokId}`}
                  title={pick(clip.caption, locale)}
                  allow="autoplay; fullscreen; encrypted-media"
                  allowFullScreen
                  className="absolute inset-0 h-full w-full border-0"
                />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={clip.thumb || "/images/img-clipManagement.png"}
                  alt=""
                  className="absolute inset-0 h-full w-full object-cover"
                />
              )}

              {!embedded && (
                <div
                  className={`pointer-events-none absolute inset-0 bg-gradient-to-t ${
                    isDark
                      ? "from-black/70 via-transparent to-black/30"
                      : "from-black/65 via-transparent to-transparent"
                  }`}
                />
              )}

              <button
                type="button"
                aria-label={tr("preview.fullscreen")}
                onClick={goFullscreen}
                className="absolute left-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-lg bg-black/55 text-white backdrop-blur"
              >
                <MdOutlineFullscreen size={18} />
              </button>

              {embedded ? (
                <button
                  type="button"
                  aria-label={tr("preview.pause")}
                  onClick={() => setPlaying(false)}
                  className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-lg bg-black/60 text-white backdrop-blur"
                >
                  <MdOutlineClose size={18} />
                </button>
              ) : (
                <>
                  <div className="absolute right-3 top-3 flex flex-col items-end gap-1.5">
                    <span
                      dir="ltr"
                      className="rounded-md bg-black/60 px-2 py-0.5 text-[10px] font-bold text-white"
                    >
                      {clip.resolution}
                    </span>
                    <span
                      className="rounded-md px-2 py-0.5 text-[10px] font-bold"
                      style={{
                        background: isDark
                          ? "rgba(148,211,193,0.2)"
                          : "#0F766E",
                        color: isDark ? MINT : "#FFFFFF",
                      }}
                    >
                      {tr("preview.verified")}
                    </span>
                  </div>

                  <button
                    type="button"
                    aria-label={
                      playing ? tr("preview.pause") : tr("preview.play")
                    }
                    onClick={togglePlay}
                    className="absolute inset-0 m-auto flex h-12 w-12 items-center justify-center rounded-full text-[#0B1F19] shadow-lg transition-transform hover:scale-105"
                    style={{ background: MINT }}
                  >
                    {playing ? (
                      <MdPause size={26} />
                    ) : (
                      <MdPlayArrow size={28} />
                    )}
                  </button>

                  <div className="absolute inset-x-3 bottom-3 text-white">
                    <p className="text-sm font-extrabold leading-snug">
                      {pick(clip.caption, locale)}
                    </p>
                    <p dir="ltr" className="mt-0.5 text-[10px] text-white/70">
                      {clip.scenario} • @{clip.creator.username}
                    </p>
                  </div>
                </>
              )}
            </div>

            <div
              className={`mt-2 flex items-center justify-center gap-1.5 rounded-xl border px-3 py-1.5 text-[11px] ${t.field} ${t.subText}`}
            >
              <MdOutlineVerifiedUser size={14} color={GOLD} />
              {tr("preview.audio")}
            </div>

            <div className="mt-2">
              <div
                dir="ltr"
                className={`h-1.5 w-full overflow-hidden rounded-full ${t.track}`}
              >
                <div
                  className="h-full rounded-full"
                  style={{ width: `${progress * 100}%`, background: MINT }}
                />
              </div>
              <div
                dir="ltr"
                className={`mt-1.5 flex justify-between text-[10px] ${t.subText}`}
              >
                <span>{mmss(time)}</span>
                <span>{mmss(clip.duration)}</span>
              </div>
            </div>

            <p className={`mt-1 text-center text-[11px] ${t.subText}`}>
              {tr("preview.note")}
            </p>
          </Card>

          {/* الرابط المباشر */}
          <Card t={t} className="!p-3">
            <CardTitle
              t={t}
              icon={MdOutlineLink}
              title={tr("link.title")}
              end={
                <span className={`text-[10px] ${t.subText}`}>
                  {tr("link.updated")}
                </span>
              }
            />
            <div
              dir="ltr"
              className={`flex h-11 items-center gap-2 rounded-xl border px-2 ${t.field}`}
            >
              <button
                type="button"
                aria-label={tr("link.copy")}
                onClick={copyLink}
                className={`flex h-8 shrink-0 items-center justify-center gap-1.5 rounded-lg border transition-all hover:border-[#94D3C1] ${
                  copied ? "px-2.5" : "w-8"
                } ${t.border} ${t.subText}`}
                style={
                  copied
                    ? { color: MINT, borderColor: "rgba(148,211,193,0.4)" }
                    : undefined
                }
              >
                {copied && (
                  <span className="text-[11px] font-bold">
                    {tr("link.copied")}
                  </span>
                )}
                <MdOutlineContentCopy size={16} />
              </button>
              <span
                dir="ltr"
                className={`min-w-0 flex-1 truncate text-[11px] ${isRtl ? "text-right" : "text-left"} ${t.subText}`}
              >
                {clip.postUrl}
              </span>
            </div>
            <div className="mt-3 grid grid-cols-[1.6fr_1fr] gap-2">
              <a
                href={clip.postUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-11 items-center justify-center gap-2 rounded-xl text-xs font-bold text-white transition-opacity hover:opacity-90"
                style={{ background: ORANGE }}
              >
                {clip.platform === "tiktok" ? (
                  <FaTiktok
                    size={16}
                    className="[filter:drop-shadow(-1px_0_0_#25F4EE)_drop-shadow(1px_0_0_#FE2C55)]"
                  />
                ) : (
                  <MdOutlineOpenInNew size={16} />
                )}
                {tr("link.open", { platform: platformName })}
              </a>
              <button
                type="button"
                onClick={shareLink}
                className={`flex h-11 items-center justify-center gap-2 rounded-xl border text-xs font-bold transition-all hover:border-[#94D3C1] ${t.field} ${t.text}`}
              >
                <MdOutlineShare size={16} />
                {tr("link.share")}
              </button>
            </div>
          </Card>

          {/* الإحصائيات الفورية */}
          <Card t={t} className="!p-2.5">
            <CardTitle
              t={t}
              icon={MdOutlineQueryStats}
              title={tr("live.title")}
              end={<Pill color={GOLD}>{tr("live.badge")}</Pill>}
            />
            <div className="grid grid-cols-2 gap-2.5">
              <LiveStat
                t={t}
                icon={MdOutlineVisibility}
                label={tr("live.views")}
                value={num(clip.live.views)}
                note={tr("live.growth", { percent: clip.live.viewsGrowth })}
                noteMint
              />
              <LiveStat
                t={t}
                icon={MdOutlineFavoriteBorder}
                iconColor={GOLD}
                label={tr("live.likes")}
                value={num(clip.live.likes)}
                note={tr("live.engagement", { percent: clip.live.engagement })}
              />
              <LiveStat
                t={t}
                icon={MdOutlineChatBubbleOutline}
                label={tr("live.comments")}
                value={num(clip.live.comments)}
                note={tr("live.positive", { percent: clip.live.positive })}
              />
              <LiveStat
                t={t}
                icon={MdOutlineBookmarkBorder}
                label={tr("live.shares")}
                value={num(clip.live.shares)}
                note={tr("live.fast")}
              />
            </div>
          </Card>
        </div>

        {/* ═════ العمود الثاني: الصانع + الفحص + المالية ═════ */}
        <div className="flex min-w-0 flex-col gap-3">
          {/* الصانع */}
          <Card t={t} className="!p-3">
            <div className="flex items-center gap-3">
              <div className="relative shrink-0">
                <span
                  className={`flex h-14 w-14 items-center justify-center overflow-hidden rounded-xl border text-lg font-bold ${t.field} ${t.text}`}
                >
                  {clip.creator.avatar ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={clip.creator.avatar}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src="/images/img.jpg"
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  )}
                </span>
                <span
                  className="absolute -bottom-1 -end-1 flex h-5 w-5 items-center justify-center rounded-full border-2 text-[#0B1F19]"
                  style={{
                    background: MINT,
                    borderColor: isDark ? "#111111" : "#FFFFFF",
                  }}
                >
                  <MdOutlineVerified size={12} />
                </span>
              </div>
              <div className="min-w-0">
                <h2 className={`truncate text-base font-extrabold ${t.text}`}>
                  {clip.creator.name}
                </h2>
                <p
                  dir="ltr"
                  className={`text-[11px] ${t.subText}`}
                  style={{ textAlign: isRtl ? "right" : "left" }}
                >
                  @{clip.creator.username} · {clip.creator.platforms}
                </p>
                <p className={`mt-0.5 text-[11px] ${t.subText}`}>
                  {tr("creator.rating", {
                    rating: clip.creator.rating.toFixed(1),
                    campaigns: clip.creator.completedCampaigns,
                    commitment: clip.creator.commitment,
                  })}
                </p>
              </div>
            </div>

            <div
              className={`mt-4 grid gap-4 rounded-xl border p-4 sm:grid-cols-2 ${t.field}`}
            >
              <div>
                <p className={`text-[11px] ${t.subText}`}>
                  {tr("creator.followers")}
                </p>
                <p className="mt-1 flex items-baseline gap-1.5">
                  <span className={`text-2xl font-extrabold ${t.text}`}>
                    {num(clip.creator.followers)}
                  </span>
                  <span className={`text-[11px] ${t.subText}`}>
                    {tr("creator.followersUnit")}
                  </span>
                </p>
                <p className="mt-1 text-[11px]" style={{ color: MINT }}>
                  {pick(clip.creator.audienceNote, locale)}
                </p>
              </div>
              <div>
                <p className={`text-[11px] font-bold ${t.text}`}>
                  {tr("creator.geo")}
                </p>
                <div className="mt-2 flex items-center justify-between text-[11px]">
                  <span className={t.subText}>
                    {pick(mainGeo.name, locale)}
                  </span>
                  <span className={`font-bold ${t.text}`}>
                    {mainGeo.percent}%
                  </span>
                </div>
                <div
                  className={`mt-1 h-1.5 w-full overflow-hidden rounded-full ${t.track}`}
                >
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${mainGeo.percent}%`, background: MINT }}
                  />
                </div>
                <p className={`mt-1.5 text-[10px] ${t.subText}`}>
                  {restGeo
                    .map((g) => `${pick(g.name, locale)} (${g.percent}%)`)
                    .join(" - ")}
                </p>
              </div>
            </div>
          </Card>

          {/* فحص الذكاء الاصطناعي */}
          <Card t={t} className="!p-3">
            <CardTitle
              t={t}
              icon={MdOutlinePublic}
              title={tr("ai.title")}
              end={<Pill>{tr("ai.match", { percent: clip.ai.match })}</Pill>}
            />
            <div className="grid gap-3 sm:grid-cols-2">
              {clip.ai.checks.map((c) => (
                <div key={c.key} className={`rounded-xl border p-3 ${t.field}`}>
                  <div className="flex items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-1.5">
                      <MdOutlineCheckCircleOutline size={18} color={MINT} />
                      <span className={`text-xs font-bold ${t.text}`}>
                        {tr(`ai.checks.${c.key}.title`)}
                      </span>
                    </span>
                    <span
                      className="text-[11px] font-bold"
                      style={{ color: MINT }}
                    >
                      {c.percent}%
                    </span>
                  </div>
                  <p className={`mt-1.5 text-[11px] leading-5 ${t.subText}`}>
                    {tr(`ai.checks.${c.key}.desc`)}
                  </p>
                </div>
              ))}
            </div>
            <div
              className="mt-3 flex items-start gap-2 rounded-xl border p-2.5 text-[11px] leading-5"
              style={{
                background: "rgba(148,211,193,0.08)",
                borderColor: "rgba(148,211,193,0.35)",
              }}
            >
              <MdOutlineAutoAwesome
                size={16}
                color={MINT}
                className="mt-0.5 shrink-0"
              />
              <p className={t.subText}>
                <b style={{ color: MINT }}>{tr("ai.recommendation")}</b>{" "}
                {tr("ai.recommendationBody")}
              </p>
            </div>
          </Card>

          {/* الحسبة المالية */}
          <Card t={t} className="!p-3">
            <CardTitle
              t={t}
              icon={MdOutlinePayments}
              title={tr("finance.title")}
              subtitle={tr("finance.subtitle")}
              end={<Pill color={GOLD}>{tr("finance.escrow")}</Pill>}
            />

            <div
              className={`grid grid-cols-3 gap-2 rounded-xl border p-2.5 ${t.field}`}
            >
              <div>
                <p className={`text-[10px] ${t.subText}`}>
                  {tr("finance.cpm")}
                </p>
                <p className={`mt-1 text-sm font-bold ${t.text}`}>
                  {money(cpm)} {tr("finance.sar")}
                </p>
              </div>
              <div>
                <p className={`text-[10px] ${t.subText}`}>
                  {tr("finance.views")}
                </p>
                <p className={`mt-1 text-sm font-bold ${t.text}`}>
                  {num(approvedViews)}
                </p>
              </div>
              <div>
                <p className={`text-[10px] ${t.subText}`}>
                  {tr("finance.remaining")}
                </p>
                <p className={`mt-1 text-sm font-bold ${t.text}`}>
                  {money(remaining)} {tr("finance.sar")}
                </p>
              </div>
            </div>

            <div
              className="mt-3 flex flex-wrap items-center justify-between gap-3 rounded-xl border p-3"
              style={{ borderColor: "rgba(148,211,193,0.35)" }}
            >
              <div className="min-w-0">
                <p className={`text-xs font-bold ${t.text}`}>
                  {tr("finance.dueTitle")}
                </p>
                <p className={`mt-0.5 text-[11px] ${t.subText}`}>
                  {tr("finance.dueDesc")}
                </p>
              </div>
              <p className="flex items-baseline gap-1.5">
                <span
                  className="text-3xl font-extrabold"
                  style={{ color: MINT }}
                >
                  {amountLabel}
                </span>
                <span className={`text-[11px] ${t.subText}`}>
                  {tr("finance.currency")}
                </span>
              </p>
            </div>

            {approved ? (
              <div
                className="mt-3 flex items-center gap-3 rounded-xl border p-3"
                style={{
                  background: "rgba(148,211,193,0.1)",
                  borderColor: "rgba(148,211,193,0.35)",
                }}
              >
                <MdOutlineTaskAlt size={22} color={MINT} />
                <div>
                  <p className="text-sm font-bold" style={{ color: MINT }}>
                    {tr("finance.approvedState")}
                  </p>
                  <p className={`text-[11px] ${t.subText}`}>
                    {tr("finance.approvedStateDesc", { amount: amountLabel })}
                  </p>
                </div>
              </div>
            ) : rejected ? (
              <div
                className="mt-3 flex items-center gap-3 rounded-xl border p-3"
                style={{
                  background: "rgba(220,38,38,0.1)",
                  borderColor: "rgba(220,38,38,0.35)",
                }}
              >
                <MdOutlineCancel size={22} color="#F2554D" />
                <div>
                  <p className="text-sm font-bold" style={{ color: "#F2554D" }}>
                    {tr("finance.rejectedState")}
                  </p>
                  <p className={`text-[11px] ${t.subText}`}>
                    {tr("finance.rejectedStateDesc")}
                  </p>
                </div>
              </div>
            ) : (
              <>
                <div
                  className={`mt-3 flex items-center justify-between gap-3 rounded-xl border p-3 ${t.field}`}
                >
                  <div className="flex items-center gap-3">
                    <MdOutlineCheckCircleOutline size={22} color={MINT} />
                    <div>
                      <p className="text-sm font-bold" style={{ color: MINT }}>
                        {tr("finance.approveBtn", { amount: amountLabel })}
                      </p>
                      <p className={`text-[11px] ${t.subText}`}>
                        {tr("finance.approveRowDesc")}
                      </p>
                    </div>
                  </div>
                  <MdOutlineArrowBack size={18} className={t.subText} />
                </div>

                {/* dir=ltr عشان المواقع تثبت: رفض يسار، اعتماد يمين */}
                <div dir="ltr" className="mt-3 grid gap-3 sm:grid-cols-2">
                  <button
                    type="button"
                    dir={isRtl ? "rtl" : "ltr"}
                    onClick={() => setConfirmReject(true)}
                    className="flex h-11 items-center justify-center gap-2 rounded-xl border text-xs font-bold transition-colors hover:bg-[#DC2626]/10"
                    style={{ borderColor: RED, color: "#F2554D" }}
                  >
                    <MdOutlineCancel size={17} />
                    {tr("finance.rejectBtn")}
                  </button>
                  <button
                    type="button"
                    dir={isRtl ? "rtl" : "ltr"}
                    onClick={() => setConfirmApprove(true)}
                    className="flex h-11 items-center justify-center gap-2 rounded-xl text-xs font-bold text-white transition-opacity hover:opacity-90"
                    style={{ background: ORANGE }}
                  >
                    <MdOutlineTaskAlt size={17} />
                    {tr("finance.approveBtn", { amount: amountLabel })}
                  </button>
                </div>
              </>
            )}

            <p
              className={`mt-4 text-center text-[11px] leading-5 ${t.subText}`}
            >
              <b style={{ color: MINT }}>{tr("finance.safety")}</b>{" "}
              {tr("finance.safetyBody")}
            </p>
          </Card>
        </div>
      </div>

      {confirmApprove && (
        <ApproveConfirmModal
          t={t}
          tr={tr}
          amount={amountLabel}
          campaignName={pick(campaign.name, locale)}
          campaignCode={campaignCode}
          clipCode={clipCode}
          onConfirm={doApprove}
          onCancel={() => setConfirmApprove(false)}
        />
      )}

      {confirmReject && (
        <RejectConfirmModal
          t={t}
          tr={tr}
          clipCode={clipCode}
          creatorName={clip.creator.name}
          refundAmount={num(clip.finance.reserved ?? 0)}
          onConfirm={doReject}
          onCancel={() => setConfirmReject(false)}
        />
      )}
    </div>
  );
}