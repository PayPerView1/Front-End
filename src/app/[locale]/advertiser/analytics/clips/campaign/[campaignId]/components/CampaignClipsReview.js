"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useTheme } from "@/context/ThemeContext";
import { toast } from "@/components/ui/Toast";
import { useNotifications } from "@/context/NotificationsContext";
import {
  MdSearch,
  MdOutlineExpandMore,
  MdOutlineFileDownload,
  MdOutlineSelectAll,
  MdOutlineVisibility,
  MdOutlineAccountBalanceWallet,
  MdOutlineVerified,
  MdOutlineTrendingUp,
  MdOutlineSwapVert,
  MdPlayArrow,
  MdStar,
  MdOutlineInfo,
  MdOutlineWarningAmber,
  MdOutlineArrowBack,
  MdOutlineArrowForward,
  MdChevronLeft,
  MdChevronRight,
  MdClose,
  MdCheck,
  MdOutlineTaskAlt,
  MdCheckBox,
  MdOutlineCheckBoxOutlineBlank,
  MdOutlineNotificationsActive,
  MdOutlineForum,
  MdOutlineDescription,
  MdOutlineSchedule,
  MdOutlineMenuBook,
  MdOutlineUploadFile,
  MdOutlinePsychology,
  MdOutlinePayments,
  MdOutlineVerifiedUser,
} from "react-icons/md";

const PAGE_SIZE = 6;
const MINT = "#94D3C1";
const GOLD = "#E9C349";
const RED = "#DC2626";
const ORANGE = "linear-gradient(90deg, #FFA600, #FF4B04)";

/* ───────────── بيانات تجريبية (استبدلها بالـ API) ───────────── */
// status: pending (قيد التدقيق) | approved (مقبولة ونشطة) | needsEdit (بانتظار التعديل) | rejected (مرفوضة)
// platform: tiktok | reels | shorts
const MOCK_CAMPAIGN = {
  name: { ar: "عطر مسك الأصيل 2025", en: "Original Musk Perfume 2025" },
  budgetTotal: 15000,
  budgetSpent: 6500,
};

const MOCK_STATS = {
  verifiedViews: 184320,
  viewsGrowth: 18.4,
  engagement: 6.8,
  compliance: 99.2,
};

const c = (
  id,
  name,
  user,
  rating,
  platform,
  status,
  res,
  dur,
  label,
  at,
  views,
  earnings,
  extra = {},
) => ({
  id: `VID-${id}`,
  creator: { name, username: user, rating, avatar: "" },
  platform,
  status,
  resolution: res,
  duration: dur,
  deliveredLabel: label,
  deliveredAt: at,
  views,
  earnings,
  thumb: "",
  videoUrl: "",
  ...extra,
});

const MOCK_CLIPS = [
  c(
    "98214",
    "سارة أحمد",
    "sara_creates",
    4.9,
    "tiktok",
    "pending",
    "1080p",
    "0:48",
    { ar: "اليوم (11:45 ص)", en: "Today (11:45 AM)" },
    "2026-10-23T11:45:00",
    14280,
    456.12,
  ),
  c(
    "98190",
    "عمر الخالدي",
    "omar_clips",
    5.0,
    "reels",
    "approved",
    "4K",
    "0:58",
    { ar: "أمس (04:30 م)", en: "Yesterday (04:30 PM)" },
    "2026-10-22T16:30:00",
    45612,
    456.12,
  ),
  c(
    "98175",
    "أحمد التميمي",
    "ahmed_creations",
    4.7,
    "shorts",
    "needsEdit",
    "1080p",
    "0:32",
    { ar: "منذ يومين (18 أغسطس)", en: "2 days ago (Aug 18)" },
    "2026-10-21T10:00:00",
    0,
    0,
    {
      note: {
        ar: "خفض المؤثر الصوتي بالثانية 12",
        en: "Lower the sound effect at second 12",
      },
    },
  ),
  c(
    "98162",
    "نورة الدوسري",
    "noura_reviews",
    4.8,
    "tiktok",
    "pending",
    "1080p",
    "0:40",
    { ar: "اليوم (منذ 5 ساعات)", en: "Today (5 hours ago)" },
    "2026-10-23T07:00:00",
    19400,
    456.12,
  ),
  c(
    "98140",
    "فيصل القحطاني",
    "faisal_vids",
    4.9,
    "tiktok",
    "approved",
    "1080p",
    "0:52",
    { ar: "منذ 3 أيام", en: "3 days ago" },
    "2026-10-20T14:00:00",
    62300,
    623.0,
  ),
  c(
    "98112",
    "ريم العتيبي",
    "reem_content",
    4.6,
    "reels",
    "rejected",
    "720p",
    "0:35",
    { ar: "منذ 4 أيام", en: "4 days ago" },
    "2026-10-19T09:00:00",
    0,
    0,
    {
      rejectReason: {
        title: {
          ar: "عدم مطابقة وثيقة التوجيه",
          en: "Doesn't match the brief",
        },
        body: {
          ar: "تم استخدام موسيقى وتجاوز الشروط الشرعية المحددة.",
          en: "Music was used and the set Shariah conditions were exceeded.",
        },
      },
    },
  ),
  c(
    "98101",
    "خالد الشمري",
    "khalid_s",
    4.5,
    "tiktok",
    "approved",
    "1080p",
    "0:44",
    { ar: "منذ 4 أيام", en: "4 days ago" },
    "2026-10-19T12:00:00",
    38900,
    389.0,
  ),
  c(
    "98098",
    "لينا الحربي",
    "lina_h",
    4.8,
    "reels",
    "pending",
    "1080p",
    "0:51",
    { ar: "منذ 5 أيام", en: "5 days ago" },
    "2026-10-18T12:00:00",
    22150,
    221.5,
  ),
  c(
    "98087",
    "ماجد العنزي",
    "majed_a",
    4.4,
    "shorts",
    "approved",
    "1080p",
    "0:29",
    { ar: "منذ 5 أيام", en: "5 days ago" },
    "2026-10-18T09:00:00",
    27800,
    278.0,
  ),
  c(
    "98071",
    "هند القاسم",
    "hind_q",
    4.9,
    "tiktok",
    "pending",
    "4K",
    "0:57",
    { ar: "منذ 6 أيام", en: "6 days ago" },
    "2026-10-17T12:00:00",
    16750,
    167.5,
  ),
  c(
    "98064",
    "يوسف الزهراني",
    "yousef_z",
    4.7,
    "reels",
    "approved",
    "1080p",
    "0:46",
    { ar: "منذ 6 أيام", en: "6 days ago" },
    "2026-10-17T08:00:00",
    51200,
    512.0,
  ),
  c(
    "98052",
    "دانة المطيري",
    "dana_m",
    4.6,
    "shorts",
    "needsEdit",
    "1080p",
    "0:38",
    { ar: "منذ أسبوع", en: "1 week ago" },
    "2026-10-16T12:00:00",
    0,
    0,
    {
      note: {
        ar: "أضف شعار العلامة التجارية في الثواني الأخيرة",
        en: "Add the brand logo in the final seconds",
      },
    },
  ),
  c(
    "98040",
    "بدر السبيعي",
    "badr_s",
    4.3,
    "tiktok",
    "pending",
    "1080p",
    "0:42",
    { ar: "منذ أسبوع", en: "1 week ago" },
    "2026-10-16T09:00:00",
    11300,
    113.0,
  ),
  c(
    "98033",
    "ريما الغامدي",
    "rima_g",
    4.9,
    "reels",
    "approved",
    "1080p",
    "0:55",
    { ar: "منذ أسبوع", en: "1 week ago" },
    "2026-10-15T12:00:00",
    33400,
    334.0,
  ),
];

/* ───────────── مساعدات ───────────── */
const num = (n) => Number(n).toLocaleString("en-US");
const money = (n) =>
  Number(n).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
const pick = (v, locale) =>
  v && typeof v === "object" ? (v[locale] ?? v.ar ?? v.en ?? "") : (v ?? "");

function pageList(current, totalPages) {
  if (totalPages <= 5)
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  const list = [1];
  if (current > 3) list.push("…");
  for (
    let p = Math.max(2, current - 1);
    p <= Math.min(totalPages - 1, current + 1);
    p++
  )
    list.push(p);
  if (current < totalPages - 2) list.push("…");
  list.push(totalPages);
  return list;
}

/* ───────────── قائمة الترتيب ───────────── */
function SortDropdown({
  t,
  isDark,
  label,
  options,
  value,
  onChange,
  isRtl,
  width = "16rem",
}) {
  const [open, setOpen] = useState(false);
  const btnRef = useRef(null);
  const panelRef = useRef(null);
  const [pos, setPos] = useState({ top: 0, left: 0, width: 0 });

  useEffect(() => {
    if (!open) return;
    const onMove = (e) => {
      if (e?.target && panelRef.current?.contains(e.target)) return;
      setOpen(false);
    };
    window.addEventListener("scroll", onMove, true);
    window.addEventListener("resize", onMove);
    return () => {
      window.removeEventListener("scroll", onMove, true);
      window.removeEventListener("resize", onMove);
    };
  }, [open]);

  const toggle = () => {
    if (open) return setOpen(false);
    const rect = btnRef.current?.getBoundingClientRect();
    if (!rect) return setOpen(true);
    const vw = window.innerWidth;
    const w = Math.min(parseFloat(width) * 16, vw - 16);
    const preferred = isRtl ? rect.right - w : rect.left;
    setPos({
      top: rect.bottom + 6,
      left: Math.max(8, Math.min(preferred, vw - w - 8)),
      width: w,
    });
    setOpen(true);
  };

  return (
    <div className="relative min-w-0">
      <button
        ref={btnRef}
        type="button"
        onClick={toggle}
        className={`flex h-11 w-full items-center gap-2 rounded-xl border px-3 text-xs transition-all hover:border-[#94D3C1] sm:w-auto ${t.field} ${t.subText}`}
      >
        <MdOutlineSwapVert size={16} className="shrink-0" />
        {label}
        <MdOutlineExpandMore
          size={18}
          className={`shrink-0 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div
            ref={panelRef}
            className={`fixed z-50 flex flex-col rounded-2xl border p-2 shadow-2xl ${t.card} ${t.border}`}
            style={{ top: pos.top, left: pos.left, width: pos.width }}
          >
            {options.map((o, idx) => {
              const on = value === o.value;
              const last = idx === options.length - 1;
              return (
                <button
                  key={o.value}
                  type="button"
                  onClick={() => {
                    onChange(o.value);
                    setOpen(false);
                  }}
                  className={`flex w-full items-center px-4 py-3 text-start text-[13px] transition-colors ${
                    on
                      ? `rounded-xl border font-bold ${t.text} ${t.border} ${isDark ? "bg-white/[0.06]" : "bg-black/[0.04]"}`
                      : `${t.subText} ${isDark ? "hover:bg-white/[0.04]" : "hover:bg-black/[0.03]"} ${
                          last ? "" : `border-b ${t.border}`
                        }`
                  }`}
                >
                  {o.label}
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

/* ───────────── كارد إحصائية مع شريط تقدم ───────────── */
function ProgressStat({
  t,
  icon: Icon,
  label,
  value,
  suffix,
  badge,
  percent,
  startIcon: StartIcon,
  start,
  startMint,
  end,
  endStrong,
}) {
  return (
    <div
      className={`flex flex-col gap-3 rounded-xl border p-4 ${t.card} ${t.border}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className={`truncate text-[11px] ${t.subText}`}>{label}</p>
          <p className="mt-2 flex flex-wrap items-baseline gap-2">
            <span
              className="text-2xl font-extrabold leading-none"
              style={{ color: MINT }}
            >
              {value}
            </span>
            {suffix && (
              <span className={`text-[11px] ${t.subText}`}>{suffix}</span>
            )}
            {badge && (
              <span
                className="inline-flex items-center gap-0.5 text-[11px] font-bold"
                style={{ color: MINT }}
              >
                <MdOutlineTrendingUp size={13} />
                {badge}
              </span>
            )}
          </p>
        </div>
        <span
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${t.field}`}
        >
          <Icon size={20} color={MINT} />
        </span>
      </div>

      <div className={`h-1.5 w-full overflow-hidden rounded-full ${t.track}`}>
        <div
          className="h-full rounded-full"
          style={{
            width: `${Math.min(100, Math.max(0, percent))}%`,
            background: MINT,
          }}
        />
      </div>

      <div className="flex items-center justify-between gap-2 text-[11px]">
        <span
          className={`inline-flex items-center gap-1.5 ${startMint ? "" : t.subText}`}
          style={startMint ? { color: MINT } : undefined}
        >
          {StartIcon && <StartIcon size={14} />}
          {start}
        </span>
        <span className={endStrong ? `font-bold ${t.text}` : t.subText}>
          {end}
        </span>
      </div>
    </div>
  );
}

/* ───────────── كارد المقطع ───────────── */
function ClipCard({
  t,
  s,
  clip,
  locale,
  isDark,
  isRtl,
  selectMode,
  selected,
  onToggleSelect,
  onApprove,
  onReject,
  onWatch,
  href,
}) {
  const Arrow = isRtl ? MdOutlineArrowBack : MdOutlineArrowForward;
  const rejected = clip.status === "rejected";
  const approved = clip.status === "approved";
  const platformLabel = s.platforms[clip.platform];

  return (
    <article
      className={`flex flex-col overflow-hidden rounded-2xl border ${t.card} ${selected ? "border-[#94D3C1]" : t.border}`}
    >
      {/* المصغّرة */}
      <div
        className="relative h-40 shrink-0 overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg,#12332B 0%,#0B1F19 60%,#1A1A1A 100%)",
          filter: rejected ? "grayscale(0.4)" : undefined,
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={clip.thumb || "/images/img-clipManagement.png"}
          alt=""
          className="absolute inset-0 h-full w-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

        <button
          type="button"
          aria-label={s.watch}
          onClick={() => onWatch(clip)}
          className="absolute inset-0 m-auto flex h-12 w-12 items-center justify-center rounded-full bg-black/55 text-white backdrop-blur transition-transform hover:scale-105"
        >
          <MdPlayArrow size={26} />
        </button>

        <span
          dir="ltr"
          className="absolute left-2.5 top-2.5 rounded-md bg-black/60 px-2 py-0.5 text-[10px] font-bold text-white"
        >
          {clip.duration} • {clip.resolution}
        </span>

        {selectMode && (
          <button
            type="button"
            aria-label="select"
            aria-pressed={selected}
            onClick={() => onToggleSelect(clip.id)}
            className="absolute right-2.5 top-2.5 flex h-7 w-7 items-center justify-center rounded-md bg-black/60 text-white"
          >
            {selected ? (
              <MdCheckBox size={20} color={MINT} />
            ) : (
              <MdOutlineCheckBoxOutlineBlank size={20} />
            )}
          </button>
        )}

        <span
          dir="ltr"
          className="absolute bottom-2.5 right-2.5 rounded-md bg-black/70 px-2 py-0.5 text-[10px] font-bold text-white"
        >
          #{clip.id}
        </span>
        <span className="absolute bottom-2.5 left-2.5 text-[10px] text-white/85">
          {pick(clip.deliveredLabel, locale)}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        {/* المنشئ */}
        <div className="flex items-center gap-3">
          <span
            className={`flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full border text-xs font-bold ${t.field} ${t.text}`}
          >
            {clip.creator.avatar ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={clip.creator.avatar}
                alt=""
                className="h-full w-full object-cover"
              />
            ) : (
              clip.creator.name.trim().charAt(0)
            )}
          </span>
          <div className="min-w-0 flex-1">
            <p
              className={`flex items-center gap-1.5 text-sm font-bold ${t.text}`}
            >
              <span className="truncate">{clip.creator.name}</span>
              <span
                className="inline-flex shrink-0 items-center gap-0.5 text-[11px]"
                style={{ color: GOLD }}
              >
                <MdStar size={13} />
                {clip.creator.rating.toFixed(1)}
              </span>
            </p>
            <p
              dir="ltr"
              className={`truncate text-[11px] ${t.subText}`}
              style={{ textAlign: isRtl ? "right" : "left" }}
            >
              @{clip.creator.username}
            </p>
          </div>
          <span
            className={`shrink-0 rounded-lg border px-2.5 py-1 text-[11px] ${t.field} ${t.subText}`}
          >
            {platformLabel}
          </span>
        </div>

        {/* الحالة: ملاحظة / رفض / أرقام */}
        {rejected ? (
          <div
            className="flex items-start gap-2 rounded-lg border p-3 text-[11px]"
            style={{
              background: "rgba(220,38,38,0.1)",
              borderColor: "rgba(220,38,38,0.35)",
            }}
          >
            <MdOutlineWarningAmber
              size={16}
              className="mt-0.5 shrink-0"
              color="#F2554D"
            />
            <div className="min-w-0">
              <p className="font-bold" style={{ color: "#F2554D" }}>
                {s.rejectReasonLabel(pick(clip.rejectReason?.title, locale))}
              </p>
              <p className={`mt-0.5 leading-5 ${t.subText}`}>
                {pick(clip.rejectReason?.body, locale)}
              </p>
            </div>
          </div>
        ) : clip.status === "needsEdit" ? (
          <div
            className="flex items-center gap-2 rounded-lg border p-3 text-[11px]"
            style={{
              background: "rgba(233,195,73,0.1)",
              borderColor: "rgba(233,195,73,0.35)",
            }}
          >
            <MdOutlineInfo size={16} className="shrink-0" color={GOLD} />
            <p className="min-w-0 font-bold" style={{ color: GOLD }}>
              {s.note(pick(clip.note, locale))}
            </p>
          </div>
        ) : (
          <div
            className={`grid grid-cols-2 gap-3 rounded-lg border p-3 text-[11px] ${t.border} ${isDark ? "bg-white/[0.03]" : "bg-black/[0.02]"}`}
          >
            <div>
              <p className={t.subText}>
                {approved ? s.approvedViews : s.initialViews}
              </p>
              <p className={`mt-0.5 font-bold ${t.text}`}>{num(clip.views)}</p>
            </div>
            <div>
              <p className={t.subText}>{s.earnings}</p>
              <p className="mt-0.5 font-bold" style={{ color: MINT }}>
                {money(clip.earnings)}{" "}
                <span className="text-[10px] font-medium">{s.currency}</span>
              </p>
            </div>
          </div>
        )}

        {/* الأزرار */}
        {rejected ? (
          <>
            <Link
              href={href}
              className={`flex h-10 items-center justify-center gap-2 rounded-xl border text-xs font-bold transition-all hover:border-[#94D3C1] ${t.field} ${t.text}`}
            >
              <MdOutlineVisibility size={16} />
              {s.viewReport}
            </Link>
            <p className={`text-center text-[10px] ${t.subText}`}>
              {s.refunded}
            </p>
          </>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                disabled={approved}
                onClick={() => onApprove(clip)}
                className="flex h-10 items-center justify-center gap-1.5 rounded-xl text-xs font-bold text-white transition-opacity hover:opacity-90 disabled:cursor-default disabled:opacity-70"
                style={{
                  background: approved ? "rgba(148,211,193,0.18)" : ORANGE,
                  color: approved ? MINT : "#FFFFFF",
                }}
              >
                {approved ? (
                  <MdOutlineTaskAlt size={15} />
                ) : (
                  <MdCheck size={15} />
                )}
                {approved ? s.approved : s.approve}
              </button>
              <button
                type="button"
                onClick={() => onReject(clip)}
                className="flex h-10 items-center justify-center rounded-xl text-xs font-bold text-white transition-opacity hover:opacity-90"
                style={{ background: RED }}
              >
                {s.reject}
              </button>
            </div>

            <div
              className={`flex items-center justify-between gap-2 text-[11px] ${t.subText}`}
            >
              <button
                type="button"
                onClick={() => onWatch(clip)}
                className="inline-flex items-center gap-1 transition-colors hover:text-[#94D3C1]"
              >
                {s.watch}
                <Arrow size={13} />
              </button>
              <Link
                href={href}
                className="inline-flex items-center gap-1 transition-colors hover:text-[#94D3C1]"
              >
                {s.details}
                <Arrow size={13} />
              </Link>
            </div>
          </>
        )}
      </div>
    </article>
  );
}

/* ───────────── نافذة تأكيد الرفض ───────────── */
function ConfirmModal({
  t,
  title,
  body,
  confirmLabel,
  cancelLabel,
  onConfirm,
  onCancel,
}) {
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onCancel();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onCancel]);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4"
      onMouseDown={(e) => e.target === e.currentTarget && onCancel()}
    >
      <div
        role="dialog"
        aria-modal="true"
        className={`w-full max-w-sm rounded-2xl border p-5 shadow-2xl ${t.card} ${t.border}`}
      >
        <h3 className={`text-base font-extrabold ${t.text}`}>{title}</h3>
        <p className={`mt-2 text-xs leading-6 ${t.subText}`}>{body}</p>
        <div className="mt-5 grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={onConfirm}
            className="h-10 rounded-xl text-xs font-bold text-white transition-opacity hover:opacity-90"
            style={{ background: RED }}
          >
            {confirmLabel}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className={`h-10 rounded-xl border text-xs font-bold ${t.field} ${t.text}`}
          >
            {cancelLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ───────────── نافذة مشغّل الفيديو ───────────── */
function VideoModal({ t, clip, noFile, closeLabel, onClose }) {
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        role="dialog"
        aria-modal="true"
        className={`relative w-full max-w-md overflow-hidden rounded-2xl border ${t.card} ${t.border}`}
      >
        <button
          type="button"
          aria-label={closeLabel}
          onClick={onClose}
          className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white"
        >
          <MdClose size={18} />
        </button>
        {clip.videoUrl ? (
          <video
            src={clip.videoUrl}
            controls
            autoPlay
            className="aspect-[9/16] max-h-[80vh] w-full bg-black"
          />
        ) : (
          <div
            className={`flex aspect-video items-center justify-center p-8 text-center text-xs ${t.subText}`}
          >
            {noFile}
          </div>
        )}
      </div>
    </div>
  );
}

/* ───────────── حالة: لا توجد مقاطع مسلّمة بعد ───────────── */
function EmptyDelivery({
  t,
  tr,
  isDark,
  notifyOn,
  onNotify,
  messagesHref,
  detailsHref,
}) {
  const steps = [
    { key: "publish", Icon: MdOutlineUploadFile },
    { key: "scan", Icon: MdOutlinePsychology },
    { key: "approve", Icon: MdOutlinePayments },
  ];

  const secondaryBtn = `inline-flex h-11 items-center justify-center gap-2 rounded-xl border px-5 text-xs font-bold transition-all hover:border-[#94D3C1] ${t.field} ${t.text}`;

  return (
    <>
      {/* البطاقة الرئيسية */}
      <section
        className={`flex flex-col items-center rounded-3xl border px-4 py-10 text-center sm:px-8 sm:py-12 ${t.card} ${t.border}`}
      >
        <div className="relative">
          <div
            className="overflow-hidden rounded-2xl p-1.5"
            style={{
              background: "rgba(148,211,193,0.08)",
              boxShadow: "0 0 40px rgba(148,211,193,0.12)",
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/img-clipManagement.png"
              alt=""
              className="h-40 w-40 rounded-xl object-cover object-center sm:h-44 sm:w-44"
            />
          </div>
          <span
            className="absolute -bottom-3 left-1/2 inline-flex -translate-x-1/2 items-center gap-1.5 whitespace-nowrap rounded-full border px-3 py-1 text-[10px] font-bold backdrop-blur"
            style={{
              background: "rgba(30,45,40,0.95)",
              borderColor: "rgba(148,211,193,0.3)",
              color: GOLD,
            }}
          >
            <MdOutlineSchedule size={13} />
            {tr("emptyDelivery.badge")}
          </span>
        </div>

        <h2 className={`mt-8 text-2xl font-extrabold sm:text-3xl ${t.text}`}>
          {tr("emptyDelivery.title")}
        </h2>
        <p
          className={`mt-3 max-w-xl text-xs leading-6 sm:text-[13px] ${t.subText}`}
        >
          {tr("emptyDelivery.desc")}
        </p>

        <div className="mt-7 flex w-full max-w-3xl flex-col gap-3 sm:flex-row sm:justify-center">
          <button
            type="button"
            onClick={onNotify}
            aria-pressed={notifyOn}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl px-5 text-xs font-bold text-white transition-opacity hover:opacity-90"
            style={{
              background: notifyOn ? "rgba(148,211,193,0.18)" : ORANGE,
              color: notifyOn ? MINT : "#FFFFFF",
            }}
          >
            {notifyOn ? (
              <MdOutlineTaskAlt size={17} />
            ) : (
              <MdOutlineNotificationsActive size={17} />
            )}
            {notifyOn
              ? tr("emptyDelivery.notifyOn")
              : tr("emptyDelivery.notify")}
          </button>

          <Link href={messagesHref} className={secondaryBtn}>
            <MdOutlineForum size={17} color={MINT} />
            {tr("emptyDelivery.contact")}
          </Link>

          <Link href={detailsHref} className={secondaryBtn}>
            <MdOutlineDescription size={17} color={MINT} />
            {tr("emptyDelivery.details")}
          </Link>
        </div>
      </section>

      {/* كيف تسير مرحلة التسليم */}
      <section
        className={`rounded-3xl border p-4 sm:p-6 ${t.card} ${t.border}`}
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-center gap-3">
            <span
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
              style={{ background: "rgba(148,211,193,0.12)" }}
            >
              <MdOutlineMenuBook size={20} color={MINT} />
            </span>
            <div className="min-w-0">
              <h3 className={`text-base font-extrabold ${t.text}`}>
                {tr("emptyDelivery.howTitle")}
              </h3>
              <p className={`mt-0.5 text-[11px] ${t.subText}`}>
                {tr("emptyDelivery.howSubtitle")}
              </p>
            </div>
          </div>

          <span
            className="inline-flex shrink-0 items-center gap-1.5 self-start rounded-full border px-3 py-1.5 text-[10px] font-bold"
            style={{
              background: "rgba(233,195,73,0.1)",
              borderColor: "rgba(233,195,73,0.25)",
              color: MINT,
            }}
          >
            <MdOutlineVerifiedUser size={13} />
            {tr("emptyDelivery.howBadge")}
          </span>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-3">
          {steps.map(({ key, Icon }, i) => (
            <div
              key={key}
              className={`rounded-2xl border p-4 ${t.border} ${isDark ? "bg-white/[0.03]" : "bg-black/[0.02]"}`}
            >
              <div className="flex items-center justify-between gap-3">
                <span
                  className={`flex h-8 w-8 items-center justify-center rounded-lg border text-xs font-bold ${t.field} ${t.text}`}
                >
                  {i + 1}
                </span>
                <Icon size={20} color={MINT} />
              </div>
              <h4 className={`mt-3 text-sm font-extrabold ${t.text}`}>
                {tr(`emptyDelivery.steps.${key}.title`)}
              </h4>
              <p className={`mt-2 text-[11px] leading-6 ${t.subText}`}>
                {tr(`emptyDelivery.steps.${key}.desc`)}
              </p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

/* ───────────── الصفحة ───────────── */
export default function CampaignClipsReview({
  campaignId,
  campaign = MOCK_CAMPAIGN,
  stats = MOCK_STATS,
  clips = MOCK_CLIPS,
  // TODO: عدّل المسارات حسب الراوتر عندكم
  backHref = "/advertiser/clips",
  messagesHref = "/advertiser/messages",
  detailsHref = `/advertiser/campaigns/${campaignId}`,
  // صفحة التفاصيل: app/[locale]/advertiser/analytics/clips/[clipId]/page.js
  getClipHref = (clip) =>
    `/advertiser/analytics/clips/${clip.id}?campaignId=${campaignId ?? ""}`,
}) {
  const { isDark } = useTheme();
  const locale = useLocale();
  const tr = useTranslations("clipReview");
  const { addNotification } = useNotifications();
  const isRtl = locale === "ar";

  const [items, setItems] = useState(clips);
  const [tab, setTab] = useState("all");
  const [platform, setPlatform] = useState("all");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("newest");
  const [page, setPage] = useState(1);
  const [selectMode, setSelectMode] = useState(false);
  const [selected, setSelected] = useState(() => new Set());
  const [confirm, setConfirm] = useState(null);
  const [watching, setWatching] = useState(null);
  const [notifyOn, setNotifyOn] = useState(false);

  const noClips = items.length === 0;

  const t = {
    card: isDark ? "bg-[#111111]" : "bg-white",
    border: isDark ? "border-[#1E2D3D]" : "border-[#E2E8F0]",
    field: isDark
      ? "bg-[#1A1A1A] border-[#2D2D2D]"
      : "bg-white border-[#E2E8F0]",
    text: isDark ? "text-white" : "text-[#0F172A]",
    subText: isDark ? "text-[#9A9A9A]" : "text-[#64748B]",
    track: isDark ? "bg-white/10" : "bg-black/10",
  };

  const s = {
    currency: tr("currency"),
    platforms: {
      tiktok: tr("platforms.tiktok"),
      reels: tr("platforms.reelsFull"),
      shorts: tr("platforms.shorts"),
    },
    initialViews: tr("card.initialViews"),
    approvedViews: tr("card.approvedViews"),
    earnings: tr("card.earnings"),
    note: (note) => tr("card.note", { note }),
    rejectReasonLabel: (title) => tr("card.rejectReason", { title }),
    approve: tr("card.approve"),
    approved: tr("card.approved"),
    reject: tr("card.reject"),
    watch: tr("card.watch"),
    details: tr("card.details"),
    viewReport: tr("card.viewReport"),
    refunded: tr("card.refunded"),
  };

  /* العدّادات */
  const counts = useMemo(() => {
    const base = {
      all: items.length,
      pending: 0,
      approved: 0,
      needsEdit: 0,
      rejected: 0,
    };
    items.forEach((i) => (base[i.status] += 1));
    return base;
  }, [items]);

  const tabs = [
    { key: "all", badge: "bg-[#94D3C1]/30 text-[#94D3C1]" },
    { key: "pending", badge: "bg-[#E9C349]/20 text-[#E9C349]" },
    {
      key: "approved",
      badge: isDark
        ? "bg-white/10 text-[#9A9A9A]"
        : "bg-black/10 text-[#64748B]",
    },
    { key: "needsEdit", badge: "bg-[#E9C349]/20 text-[#E9C349]" },
    { key: "rejected", badge: "bg-[#DC2626]/25 text-[#F2554D]" },
  ];

  const platformTabs = [
    { key: "all", label: tr("platforms.all") },
    { key: "tiktok", label: tr("platforms.tiktok") },
    { key: "reels", label: tr("platforms.reels") },
    { key: "shorts", label: tr("platforms.shorts") },
  ];

  const sortOptions = [
    { value: "newest", label: tr("sort.newest") },
    { value: "approved", label: tr("sort.approved") },
    { value: "rejected", label: tr("sort.rejected") },
    { value: "manual", label: tr("sort.manual") },
    { value: "all", label: tr("sort.all") },
    { value: "reviewing", label: tr("sort.reviewing") },
  ];

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = items.filter((i) => {
      if (tab !== "all" && i.status !== tab) return false;
      if (platform !== "all" && i.platform !== platform) return false;
      if (!q) return true;
      return [i.id, i.creator.name, i.creator.username]
        .join(" ")
        .toLowerCase()
        .includes(q);
    });
    const newest = (a, b) => new Date(b.deliveredAt) - new Date(a.deliveredAt);
    const first = (status) => (a, b) =>
      (b.status === status) - (a.status === status) || newest(a, b);
    const by = {
      newest,
      approved: first("approved"),
      rejected: first("rejected"),
      manual: first("needsEdit"),
      reviewing: first("pending"),
      all: (a, b) => new Date(a.deliveredAt) - new Date(b.deliveredAt),
    }[sort];
    return [...list].sort(by);
  }, [items, tab, platform, query, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const visible = filtered.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE,
  );
  const [PrevIcon, NextIcon] = isRtl
    ? [MdChevronRight, MdChevronLeft]
    : [MdChevronLeft, MdChevronRight];

  /* الإجراءات (TODO: اربطها بالـ API) */
  const setStatus = (ids, status) =>
    setItems((prev) =>
      prev.map((i) => (ids.includes(i.id) ? { ...i, status } : i)),
    );

  const notifyApproved = (clip) =>
    addNotification(
      "CLIP_APPROVED",
      { creator: clip.creator.name, campaign: pick(campaign.name, locale) },
      { href: `/advertiser/analytics/clips/campaign/${campaignId}` },
    );

  const handleApprove = (clip) => {
    if (clip.status === "approved") return;
    setStatus([clip.id], "approved");
    notifyApproved(clip);
  };

  const askReject = (ids) => setConfirm({ ids });

  const doReject = () => {
    const ids = confirm.ids;
    setStatus(ids, "rejected");
    setSelected(new Set());
    setConfirm(null);
  };

  const bulkApprove = () => {
    const ids = [...selected];
    setStatus(ids, "approved");
    items.filter((i) => ids.includes(i.id)).forEach(notifyApproved);
    setSelected(new Set());
    toast.success("", {
      title: tr("toast.bulkApproved", { count: ids.length }),
    });
  };

  const toggleSelect = (id) =>
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const toggleSelectMode = () => {
    if (selectMode) {
      setSelectMode(false);
      setSelected(new Set());
      return;
    }

    setSelectMode(true);
    setSelected(new Set(filtered.map((clip) => clip.id)));
  };

  // TODO: اربطها بالـ API
  const toggleNotify = () => {
    setNotifyOn((v) => !v);
    toast.success("", {
      title: notifyOn ? tr("toast.notifyOffTitle") : tr("toast.notifyOnTitle"),
    });
  };

  /* تصدير CSV (يفتح في Excel) */
  const exportExcel = () => {
    const header = [
      "ID",
      "Creator",
      "Username",
      "Platform",
      "Status",
      "Views",
      "Earnings",
    ];
    const rows = filtered.map((i) => [
      i.id,
      i.creator.name,
      i.creator.username,
      i.platform,
      i.status,
      i.views,
      i.earnings,
    ]);
    const csv = [header, ...rows]
      .map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const blob = new Blob(["\uFEFF" + csv], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `clips-${campaignId ?? "campaign"}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    toast.success("", { title: tr("toast.exported") });
  };

  const budgetPercent =
    campaign.budgetTotal > 0
      ? ((campaign.budgetTotal - campaign.budgetSpent) / campaign.budgetTotal) *
        100
      : 0;
  const budgetLeft = campaign.budgetTotal - campaign.budgetSpent;

  return (
    <div
      dir={isRtl ? "rtl" : "ltr"}
      className="mx-auto flex w-full max-w-7xl flex-col gap-5 p-4 sm:p-6"
      style={{ fontFamily: "var(--font-tajawal), sans-serif" }}
    >
      {/* العنوان + مسار التنقل */}
      <header>
        <nav
          aria-label="breadcrumb"
          className={`flex items-center gap-2 text-[11px] ${t.subText}`}
        >
          <Link
            href={backHref}
            className="transition-colors hover:text-[#94D3C1]"
          >
            {pick(campaign.name, locale)}
          </Link>
          <span>/</span>
          <span style={{ color: MINT }}>{tr("crumb")}</span>
        </nav>
        <h1 className={`mt-3 text-2xl font-extrabold sm:text-3xl ${t.text}`}>
          {tr("title")}
        </h1>
        <p className={`mt-1 max-w-3xl text-xs leading-relaxed ${t.subText}`}>
          {tr("subtitle")}
        </p>
      </header>

      {noClips ? (
        <EmptyDelivery
          t={t}
          tr={tr}
          isDark={isDark}
          notifyOn={notifyOn}
          onNotify={toggleNotify}
          messagesHref={messagesHref}
          detailsHref={detailsHref}
        />
      ) : (
        <>
          {/* الإحصائيات */}
          <section className="grid grid-cols-1 gap-3 md:grid-cols-3">
            <ProgressStat
              t={t}
              icon={MdOutlineVisibility}
              label={tr("stats.views")}
              value={num(stats.verifiedViews)}
              badge={`+${stats.viewsGrowth}%`}
              percent={100}
              start={tr("stats.autoRefresh")}
              end={tr("stats.engagement", { percent: stats.engagement })}
              endStrong
            />
            <ProgressStat
              t={t}
              icon={MdOutlineAccountBalanceWallet}
              label={tr("stats.budget")}
              value={num(budgetLeft)}
              suffix={tr("stats.budgetSuffix")}
              percent={budgetPercent}
              start={tr("stats.spent", { amount: num(campaign.budgetSpent) })}
              end={tr("stats.total", { amount: num(campaign.budgetTotal) })}
              endStrong
            />
            <ProgressStat
              t={t}
              icon={MdOutlineVerified}
              label={tr("stats.compliance")}
              value={`${stats.compliance}%`}
              suffix={tr("stats.complianceSuffix")}
              percent={stats.compliance}
              startIcon={MdOutlineTaskAlt}
              start={tr("stats.clean")}
              startMint
              end={tr("stats.smartScan")}
            />
          </section>

          {/* الأدوات */}
          <section
            className={`flex flex-col gap-3 rounded-2xl border p-3 sm:p-4 ${t.card} ${t.border}`}
          >
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 lg:pb-0">
                {tabs.map(({ key, badge }) => {
                  const on = tab === key;
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => {
                        setTab(key);
                        setPage(1);
                      }}
                      aria-pressed={on}
                      className={`inline-flex h-10 shrink-0 items-center gap-2 rounded-xl border px-3.5 text-xs font-bold transition-all ${
                        on
                          ? "border-transparent text-[#0B1F19]"
                          : `${t.field} ${t.subText} hover:border-[#94D3C1]`
                      }`}
                      style={on ? { background: MINT } : undefined}
                    >
                      {tr(`tabs.${key}`)}
                      <span
                        className={`min-w-5 rounded-md px-1.5 py-0.5 text-center text-[10px] font-bold ${
                          on ? "bg-black/15 text-[#0B1F19]" : badge
                        }`}
                      >
                        {counts[key]}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="flex shrink-0 gap-2">
                <button
                  type="button"
                  onClick={exportExcel}
                  className={`inline-flex h-10 items-center gap-2 rounded-xl border px-3.5 text-xs font-bold transition-all hover:border-[#94D3C1] ${t.field} ${t.text}`}
                >
                  <MdOutlineFileDownload size={16} />
                  {tr("exportExcel")}
                </button>
                <button
                  type="button"
                  onClick={toggleSelectMode}
                  aria-pressed={selectMode}
                  className={`inline-flex h-10 items-center gap-2 rounded-xl border px-3.5 text-xs font-bold transition-all hover:border-[#94D3C1] ${
                    selectMode ? "border-[#94D3C1] text-[#94D3C1]" : t.text
                  } ${t.field}`}
                >
                  <MdOutlineSelectAll size={16} />
                  {selectMode ? tr("bulkCancel") : tr("bulkSelect")}
                </button>
              </div>
            </div>

            <div className={`border-t ${t.border}`} />

            <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
              <label
                className={`flex h-11 min-w-0 flex-1 items-center gap-2 rounded-xl border px-3 focus-within:border-[#94D3C1] ${t.field}`}
              >
                <MdSearch size={18} color="#9A9A9A" className="shrink-0" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setPage(1);
                  }}
                  placeholder={tr("searchPlaceholder")}
                  className={`min-w-0 flex-1 bg-transparent text-xs outline-none placeholder-[#9A9A9A] ${t.text}`}
                />
              </label>

              <div
                className={`flex h-11 shrink-0 items-center gap-1 self-start rounded-xl border p-1 ${t.field}`}
              >
                {platformTabs.map(({ key, label }) => {
                  const on = platform === key;
                  return (
                    <button
                      key={key}
                      type="button"
                      aria-pressed={on}
                      onClick={() => {
                        setPlatform(key);
                        setPage(1);
                      }}
                      className={`h-8 rounded-lg px-3 text-xs transition-colors ${
                        on
                          ? `font-bold ${t.text} ${isDark ? "bg-white/10" : "bg-black/10"}`
                          : t.subText
                      }`}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>

              <SortDropdown
                t={t}
                isDark={isDark}
                isRtl={isRtl}
                label={
                  <>
                    {tr("sortBy")}{" "}
                    <b className={t.text}>
                      {sortOptions.find((o) => o.value === sort)?.label}
                    </b>
                  </>
                }
                options={sortOptions}
                value={sort}
                onChange={(v) => {
                  setSort(v);
                  setPage(1);
                }}
              />
            </div>
          </section>

          {/* شريط التحديد الجماعي */}
          {selectMode && selected.size > 0 && (
            <div
              className={`flex flex-wrap items-center justify-between gap-3 rounded-2xl border px-4 py-3 ${t.card} border-[#94D3C1]`}
            >
              <span className={`text-xs font-bold ${t.text}`}>
                {tr("selectedCount", { count: selected.size })}
              </span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={bulkApprove}
                  className="h-9 rounded-xl px-4 text-xs font-bold text-white transition-opacity hover:opacity-90"
                  style={{ background: ORANGE }}
                >
                  {tr("approveSelected")}
                </button>
                <button
                  type="button"
                  onClick={() => askReject([...selected])}
                  className="h-9 rounded-xl px-4 text-xs font-bold text-white transition-opacity hover:opacity-90"
                  style={{ background: RED }}
                >
                  {tr("rejectSelected")}
                </button>
              </div>
            </div>
          )}

          {/* الكاردات */}
          {visible.length === 0 ? (
            <div
              className={`rounded-2xl border p-10 text-center text-sm ${t.card} ${t.border} ${t.subText}`}
            >
              {tr("empty")}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
              {visible.map((clip) => (
                <ClipCard
                  key={clip.id}
                  t={t}
                  s={s}
                  clip={clip}
                  locale={locale}
                  isDark={isDark}
                  isRtl={isRtl}
                  selectMode={selectMode}
                  selected={selected.has(clip.id)}
                  onToggleSelect={toggleSelect}
                  onApprove={handleApprove}
                  onReject={(c2) => askReject([c2.id])}
                  onWatch={setWatching}
                  href={getClipHref(clip)}
                />
              ))}
            </div>
          )}

          {/* الترقيم: يظهر فقط لما يكون في مقاطع */}
          {filtered.length > 0 && (
            <nav
              aria-label="pagination"
              className={`flex flex-col gap-3 rounded-2xl border px-4 py-3 sm:flex-row sm:items-center sm:justify-between ${t.card} ${t.border}`}
            >
              <p className={`text-xs ${t.subText}`}>
                {tr.rich("showing", {
                  shown: visible.length,
                  total: filtered.length,
                  b: (chunks) => <b className={t.text}>{chunks}</b>,
                  m: (chunks) => <b style={{ color: MINT }}>{chunks}</b>,
                })}
              </p>

              <div
                aria-disabled={totalPages <= 1}
                className={`flex items-center gap-1.5 transition-opacity ${totalPages <= 1 ? "pointer-events-none opacity-50" : ""}`}
              >
                <button
                  type="button"
                  aria-label={tr("prev")}
                  disabled={safePage <= 1}
                  onClick={() => setPage(safePage - 1)}
                  className={`flex h-8 w-8 items-center justify-center rounded-lg border transition-all hover:border-[#94D3C1] disabled:cursor-not-allowed disabled:opacity-40 ${t.field} ${t.text}`}
                >
                  <PrevIcon size={18} />
                </button>

                {pageList(safePage, totalPages).map((p, i) =>
                  p === "…" ? (
                    <span
                      key={`dots-${i}`}
                      className={`px-1 text-xs ${t.subText}`}
                    >
                      …
                    </span>
                  ) : (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setPage(p)}
                      aria-current={p === safePage ? "page" : undefined}
                      className={`h-8 min-w-8 rounded-lg border px-2 text-xs font-bold transition-all ${
                        p === safePage
                          ? "border-[#94D3C1] bg-[#94D3C1] text-[#0B1F19]"
                          : `${t.field} ${t.subText} hover:border-[#94D3C1]`
                      }`}
                    >
                      {p}
                    </button>
                  ),
                )}

                <button
                  type="button"
                  aria-label={tr("next")}
                  disabled={safePage >= totalPages}
                  onClick={() => setPage(safePage + 1)}
                  className={`flex h-8 w-8 items-center justify-center rounded-lg border transition-all hover:border-[#94D3C1] disabled:cursor-not-allowed disabled:opacity-40 ${t.field} ${t.text}`}
                >
                  <NextIcon size={18} />
                </button>
              </div>
            </nav>
          )}
        </>
      )}

      {confirm && (
        <ConfirmModal
          t={t}
          title={
            confirm.ids.length > 1
              ? tr("confirm.bulkTitle", { count: confirm.ids.length })
              : tr("confirm.title")
          }
          body={tr("confirm.body")}
          confirmLabel={tr("confirm.confirm")}
          cancelLabel={tr("confirm.cancel")}
          onConfirm={doReject}
          onCancel={() => setConfirm(null)}
        />
      )}

      {watching && (
        <VideoModal
          t={t}
          clip={watching}
          noFile={tr("video.noFile")}
          closeLabel={tr("video.close")}
          onClose={() => setWatching(null)}
        />
      )}
    </div>
  );
}
