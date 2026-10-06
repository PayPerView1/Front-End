"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useWallet } from "@/features/wallet/WalletProvider";
import { Tajawal } from "next/font/google";
import { useTheme } from "@/context/ThemeContext";
import {
  MdOutlineVerifiedUser,
  MdOutlinePublic,
  MdOutlineTune,
  MdOutlineTrendingUp,
  MdOutlineRefresh,
  MdOutlineGpsFixed,
  MdOutlineExpandMore,
  MdOutlineNotificationsActive,
  MdOutlineArrowBack,
  MdOutlineLightbulb,
  MdOutlineRemove,
  MdOutlineAdd,
  MdOutlineAutoAwesome,
  MdOutlineCheckCircle,
  MdOutlineCheck,
  MdOutlineTimelapse,
  MdOutlineSchedule,
  MdOutlineCreditCard,
  MdOutlineAddCard,
  MdOutlineWarningAmber,
  MdOutlineVisibility,
  MdOutlineAutorenew,
  MdOutlineInfo,
  MdOutlineBolt,
  MdOutlineFingerprint,
  MdOutlineSave,
  MdOutlineClose,
  MdOutlineMoreVert,
  MdOutlineVideoLibrary,
  MdOutlineWeb,
  MdOutlineCampaign,
  MdOutlineSaveAlt,
  MdOutlineRequestQuote,
  MdOutlinePause,
  MdOutlineNotifications,
  MdOutlineMail,
  MdOutlinePlayArrow,
  MdOutlineCalendarMonth,
  MdOutlineEventRepeat,
} from "react-icons/md";
import { HiOutlinePresentationChartBar } from "react-icons/hi2";
import DailyLimitDetails from "./DailyLimitDetails";
import BulkRecharge from "./Bulkrecharge";
import {
  getWallet,
  rechargeCampaign,
  setDailyBudget,
  pauseCampaign,
  resumeCampaign,
} from "@/features/wallet/services/budget";
import { fetchBudgetCampaigns } from "@/features/wallet/services/budgetCampaigns";
const tajawal = Tajawal({
  subsets: ["arabic"],
  weight: ["400", "500", "700", "800"],
});

// ── Mock Data ──────────────────────────────────────────────────────────────
const MOCK = {
  simulateFault: true,
  notifications: { time: "14:32", email: "advertiser@brand.com" },
  wallet: { balance: 1500, sarRate: 3.75 },
  paused: { frozenAt: "03:15 م", startDate: "12 أكتوبر 2025" },
  campaigns: [
    {
      id: "#CMP-8942",
      name: "إطلاق منتج جديد",
      type: "ترويج منتجات فاخرة",
      status: "ACTIVE",
      budget: { total: 1000, spent: 400 },
      daily: { limit: 75, todaySpent: 48, enabled: true },
      ads: [
        {
          id: 1,
          name: "إعلان الفيديو التعريفي - جودة فائقة",
          sub: "Instagram & X Reels",
          icon: MdOutlineVideoLibrary,
          tone: "mint",
          clicks: 14820,
          ctr: "4.8%",
          cost: 520,
          status: "ACTIVE",
        },
        {
          id: 2,
          name: "بانر التخفيض الحصري لرواد الأعمال",
          sub: "شبكة المواقع الاقتصادية الإسلامية",
          icon: MdOutlineWeb,
          tone: "gold",
          clicks: 8340,
          ctr: "3.2%",
          cost: 310,
          status: "ACTIVE",
        },
      ],
    },
    {
      id: "#CMP-7310",
      name: "حملة الوعي بالتمويل الإسلامي",
      type: "توعية وتعليم",
      status: "ACTIVE",
      budget: { total: 2000, spent: 1990 },
      daily: { limit: 50, todaySpent: 50, enabled: true },
      ads: [
        {
          id: 3,
          name: "رسائل إعلانية عبر البودكاست التقني",
          sub: "بودكاست صوتي راقٍ",
          icon: MdOutlineCampaign,
          tone: "gray",
          clicks: 3210,
          ctr: "6.1%",
          cost: 130,
          status: "ACTIVE",
        },
      ],
    },
    {
      id: "#CMP-6021",
      name: "تطبيق زاد المسلم",
      type: "تحميل تطبيقات",
      status: "PAUSED",
      budget: { total: 500, spent: 120 },
      daily: { limit: 40, todaySpent: 0, enabled: false },
      ads: [
        {
          id: 4,
          name: "قصاصات تيك توك",
          sub: "TikTok",
          icon: MdOutlineVideoLibrary,
          tone: "mint",
          clicks: 5200,
          ctr: "5.4%",
          cost: 120,
          status: "PAUSED",
        },
      ],
    },
  ],
};

const RECHARGE_PRESETS = [250, 500, 1000];
const DAILY_PRESETS = [250, 300, 350];

const fmt = (n) =>
  Number(n).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

// ── Theme tokens (palette: #94D3C1 #FFFFFF #BFC9C4 #E1E3E4 #89938F #E9C349) ─
function getTokens(isDark) {
  return {
    page: isDark ? "#0A0B0B" : "#F1F4F3",
    card: isDark ? "#141616" : "#FFFFFF",
    inner: isDark ? "#1B1E1E" : "#F3F6F5",
    innerStrong: isDark ? "#252929" : "#E6ECEA",
    iconBg: isDark ? "#1B1E1E" : "#F3F6F5",
    border: isDark ? "rgba(255,255,255,0.06)" : "rgba(25,28,29,0.09)",
    heading: isDark ? "#FFFFFF" : "#0F1213",
    text: isDark ? "#E1E3E4" : "#191C1D",
    soft: isDark ? "#BFC9C4" : "#404945",
    sub: isDark ? "#89938F" : "#5F6A66",
    mint: "#94D3C1",
    accent: isDark ? "#94D3C1" : "#1C6B58",
    accentBg: isDark ? "rgba(148,211,193,0.12)" : "rgba(148,211,193,0.30)",
    accentBorder: isDark ? "rgba(148,211,193,0.22)" : "rgba(28,107,88,0.25)",
    gold: "#E9C349",
    goldText: isDark ? "#E9C349" : "#8A6A00",
    goldBg: isDark ? "rgba(233,195,73,0.12)" : "rgba(233,195,73,0.22)",
    danger: isDark ? "#EF4444" : "#DC2626",
    dangerBg: isDark ? "rgba(239,68,68,0.14)" : "rgba(220,38,38,0.10)",
    dangerBorder: isDark ? "rgba(239,68,68,0.32)" : "rgba(220,38,38,0.30)",
    track: isDark ? "rgba(255,255,255,0.08)" : "rgba(25,28,29,0.08)",
    onMint: "#0B1F19",
    shadow: isDark ? "none" : "0 1px 3px rgba(16,24,20,0.06)",
    menuBg: isDark ? "#0D0F0F" : "#FFFFFF",
    menuBorder: isDark ? "#89938F" : "rgba(25,28,29,0.18)",
    menuHover: isDark ? "#252728" : "#EEF3F1",
    menuShadow: isDark
      ? "0 8px 20px rgba(0,0,0,0.45)"
      : "0 8px 20px rgba(16,24,20,0.12)",
  };
}

const ORANGE = "linear-gradient(90deg, #FFA600, #FF4B04)";

// ── Small building blocks ──────────────────────────────────────────────────
function Card({ t, className = "", children }) {
  return (
    <section
      className={`rounded-2xl ${className}`}
      style={{
        background: t.card,
        border: `1px solid ${t.border}`,
        boxShadow: t.shadow,
      }}
    >
      {children}
    </section>
  );
}

function IconBox({
  t,
  icon: Icon,
  color,
  size = 20,
  box = 40,
  bg,
  borderColor,
}) {
  return (
    <div
      className="flex shrink-0 items-center justify-center rounded-xl"
      style={{
        width: box,
        height: box,
        background: bg || t.inner,
        border: `1px solid ${borderColor || t.border}`,
      }}
    >
      <Icon size={size} color={color || t.accent} />
    </div>
  );
}

function Pill({ bg, color, dot, children, className = "" }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-1 text-[11px] font-bold ${className}`}
      style={{ background: bg, color }}
    >
      {dot && (
        <span
          className="inline-block h-1.5 w-1.5 rounded-full"
          style={{ background: color }}
        />
      )}
      {children}
    </span>
  );
}

function Bar({ t, pct, color, h = 6 }) {
  return (
    <div
      className="w-full overflow-hidden rounded-full"
      style={{ height: h, background: t.track }}
    >
      <div
        className="h-full rounded-full transition-[width] duration-500"
        style={{
          width: `${Math.min(Math.max(pct, 0), 100)}%`,
          background: color,
        }}
      />
    </div>
  );
}

function MoneyField({ t, value, onChange, suffix, wide = false, color }) {
  return (
    <label
      className={`flex items-center gap-2 rounded-xl px-3 py-2.5 ${wide ? "w-full" : "w-32"}`}
      style={{ background: t.inner, border: `1px solid ${t.border}` }}
    >
      <span className="text-[13px] font-bold" style={{ color: color || t.sub }}>
        $
      </span>
      <input
        type="text"
        inputMode="decimal"
        value={value}
        onChange={(e) => {
          const val = e.target.value.replace(/[^0-9.]/g, "");
          onChange(Math.max(0, Number(val) || 0));
        }}
        className="w-full min-w-0 bg-transparent text-start text-[14px] font-bold outline-none"
        style={{
          color: color || t.heading,
          fontFamily: "'Arial', sans-serif",
        }}
      />
      {suffix && (
        <span className="text-[10px] font-bold" style={{ color: t.sub }}>
          {suffix}
        </span>
      )}
    </label>
  );
}

function GhostBtn({
  t,
  icon: Icon,
  iconColor,
  children,
  onClick,
  className = "",
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-[12px] font-bold transition-opacity hover:opacity-80 ${className}`}
      style={{
        background: t.inner,
        color: t.soft,
        border: `1px solid ${t.border}`,
      }}
    >
      {Icon && <Icon size={16} color={iconColor} />}
      {children}
    </button>
  );
}

function OrangeBtn({
  icon: Icon,
  children,
  onClick,
  className = "",
  disabled = false,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-[13px] font-bold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      style={{ background: ORANGE }}
    >
      {Icon && <Icon size={16} />}
      {children}
    </button>
  );
}

function SectionHead({
  t,
  icon,
  title,
  sub,
  children,
  titleColor,
  iconColor,
  iconBg,
  iconBorder,
}) {
  return (
    <div className="flex items-start justify-between gap-3">
      <div className="flex min-w-0 items-center gap-3">
        <IconBox
          t={t}
          icon={icon}
          color={iconColor}
          bg={iconBg}
          borderColor={iconBorder}
        />
        <div className="min-w-0">
          <h2
            className="text-[16px] font-extrabold leading-tight"
            style={{ color: titleColor || t.heading }}
          >
            {title}
          </h2>
          {sub && (
            <p className="mt-1 text-[11px] leading-5" style={{ color: t.sub }}>
              {sub}
            </p>
          )}
        </div>
      </div>
      {children}
    </div>
  );
}

function StatCard({
  t,
  label,
  icon: Icon,
  value,
  note,
  pct,
  barColor,
  badge,
  valueColor,
  badgeColor,
}) {
  const vColor = valueColor || barColor;
  return (
    <div
      className="relative flex flex-col gap-3 rounded-2xl p-4"
      style={{ background: t.card, border: `1px solid ${t.border}` }}
    >
      <div className="flex items-center justify-between">
        <span style={{ color: t.sub, fontSize: 12 }}>{label}</span>
        <div
          className="flex items-center justify-center rounded-xl"
          style={{ background: t.iconBg, width: 40, height: 40 }}
        >
          <Icon size={20} style={{ color: barColor }} />
        </div>
      </div>

      <div className="flex items-center justify-between gap-2">
        <div className="flex items-baseline gap-1" dir="ltr">
          <span style={{ color: vColor, fontSize: 11 }}>$ USD</span>
          <span style={{ color: vColor, fontSize: 22, fontWeight: 700 }}>
            {value}
          </span>
        </div>
        {badge && (
          <span
            className="rounded-full px-2 py-0.5 text-xs font-bold"
            style={{ background: t.innerStrong, color: badgeColor || barColor }}
          >
            {badge}
          </span>
        )}
      </div>

      <p className="text-right" style={{ color: t.sub, fontSize: 11 }}>
        {note}
      </p>

      <div
        className="w-full overflow-hidden rounded-full"
        style={{ height: 4, background: t.border }}
      >
        <div
          className="h-full rounded-full transition-all"
          style={{ width: `${pct}%`, background: barColor }}
        />
      </div>
    </div>
  );
}

// ── Recharge success banner ────────────────────────────────────────────────
function SuccessBanner({ t, tr, info, onClose }) {
  return (
    <div
      role="status"
      className="flex items-center gap-3 rounded-2xl px-4 py-3 sm:px-5"
      style={{
        background: t.card,
        border: `1px solid ${t.border}`,
        boxShadow: t.shadow,
      }}
    >
      <div
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
        style={{
          background: t.accentBg,
          border: `1px solid ${t.accentBorder}`,
        }}
      >
        <MdOutlineCheckCircle size={20} color={t.accent} />
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-[14px] font-extrabold" style={{ color: t.accent }}>
          {tr("recharge.success.title")}
        </p>
        <p className="mt-0.5 text-[11px] leading-5" style={{ color: t.sub }}>
          {tr("recharge.success.added")}{" "}
          <b dir="ltr" style={{ color: t.accent }}>
            ${fmt(info.added)}
          </b>
          {" | "}
          {tr("recharge.success.newBudget")}{" "}
          <b dir="ltr" style={{ color: t.heading }}>
            ${fmt(info.newBudget)}
          </b>
          {" | "}
          {tr("recharge.success.walletLeft")}{" "}
          <b dir="ltr" style={{ color: t.goldText }}>
            ${fmt(info.walletLeft)}
          </b>
        </p>
      </div>

      <span
        className="hidden shrink-0 text-[10px] sm:inline"
        style={{ color: t.sub }}
      >
        {tr("recharge.success.id")} <span dir="ltr">{info.id}</span>
      </span>
      <button
        type="button"
        aria-label="إغلاق"
        onClick={onClose}
        className="shrink-0 transition-opacity hover:opacity-70"
      >
        <MdOutlineClose size={16} color={t.sub} />
      </button>
    </div>
  );
}

// ── Insufficient wallet banner ─────────────────────────────────────────────
function InsufficientBanner({ t, tr, required, available, rate, onCover }) {
  return (
    <div
      role="alert"
      className="flex flex-col gap-3 rounded-2xl px-4 py-3 sm:flex-row sm:items-center sm:px-5"
      style={{
        background: t.card,
        border: `1px solid ${t.dangerBorder}`,
        boxShadow: t.shadow,
      }}
    >
      <div className="flex min-w-0 flex-1 items-start gap-3">
        <div
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
          style={{ background: t.dangerBg }}
        >
          <MdOutlineWarningAmber size={22} color={t.danger} />
        </div>
        <div className="min-w-0">
          <p className="text-[15px] font-extrabold" style={{ color: t.danger }}>
            {tr("recharge.insufficient.title")}
          </p>
          <p className="mt-0.5 text-[11px] leading-5" style={{ color: t.sub }}>
            {tr.rich("recharge.insufficient.message", {
              required: fmt(required),
              requiredSar: fmt(required * rate),
              available: fmt(available),
              availableSar: fmt(available * rate),
              req: (chunks) => <b style={{ color: t.heading }}>{chunks}</b>,
              avail: (chunks) => <b style={{ color: t.danger }}>{chunks}</b>,
            })}
          </p>
        </div>
      </div>

      <OrangeBtn
        icon={MdOutlineAddCard}
        onClick={onCover}
        className="w-full !py-2.5 !text-[12px] sm:w-auto"
      >
        {tr("recharge.insufficient.action")}
      </OrangeBtn>
    </div>
  );
}
function FaultBanner({ t, tr, onRetry }) {
  return (
    <div
      role="alert"
      className="flex flex-col gap-3 rounded-2xl px-4 py-3 sm:flex-row sm:items-center sm:px-5"
      style={{
        background: t.card,
        border: `1px solid ${t.dangerBorder}`,
        boxShadow: t.shadow,
      }}
    >
      <div className="flex min-w-0 flex-1 items-start gap-3">
        <div
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
          style={{ background: t.dangerBg }}
        >
          <MdOutlineWarningAmber size={22} color={t.danger} />
        </div>
        <div className="min-w-0">
          <p className="text-[15px] font-extrabold" style={{ color: t.danger }}>
            {tr("recharge.fault.title")}
          </p>
          <p className="mt-0.5 text-[11px] leading-5" style={{ color: t.sub }}>
            {tr("recharge.fault.message")}
          </p>
        </div>
      </div>

      <OrangeBtn
        icon={MdOutlineRefresh}
        onClick={onRetry}
        className="w-full !py-2.5 !text-[12px] sm:w-auto"
      >
        {tr("recharge.fault.retry")}
      </OrangeBtn>
    </div>
  );
}
function NotifRow({ t, icon: Icon, iconBg, iconColor, title, time, children }) {
  return (
    <div
      className="flex items-start gap-3 rounded-xl p-3"
      style={{ background: t.inner, border: `1px solid ${t.border}` }}
    >
      <div
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full"
        style={{ background: iconBg }}
      >
        <Icon size={18} color={iconColor} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[13px] font-extrabold" style={{ color: t.heading }}>
          {title}
        </p>
        <p className="mt-1 text-[11px] leading-5" style={{ color: t.sub }}>
          {children}
        </p>
      </div>
      <span className="shrink-0 text-[10px]" dir="ltr" style={{ color: t.sub }}>
        {time}
      </span>
    </div>
  );
}

function DepletedNotifications({ t, tr, campaignId, time, email }) {
  return (
    <Card t={t} className="flex flex-col gap-4 p-4 sm:p-5">
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <MdOutlineNotificationsActive size={22} color={t.goldText} />
          <h2
            className="text-[14px] font-extrabold leading-tight"
            style={{ color: t.heading }}
          >
            {tr("notifications.title")}
          </h2>
        </div>
        <Pill bg={t.accentBg} color={t.accent} className="!py-0.5">
          {tr("notifications.badge")}
        </Pill>
      </div>

      <div style={{ borderTop: `1px solid ${t.border}` }} />

      <NotifRow
        t={t}
        icon={MdOutlineNotifications}
        iconBg="rgba(220,38,38,0.16)"
        iconColor="#DC2626"
        title={tr("notifications.instant.title")}
        time={time}
      >
        {tr("notifications.instant.message", { campaignId })}
      </NotifRow>

      <NotifRow
        t={t}
        icon={MdOutlineMail}
        iconBg={t.accentBg}
        iconColor={t.accent}
        title={tr("notifications.email.title")}
        time={time}
      >
        {tr.rich("notifications.email.message", {
          address: email,
          mail: (chunks) => (
            <b dir="ltr" style={{ color: t.accent }}>
              {chunks}
            </b>
          ),
        })}
      </NotifRow>
    </Card>
  );
}
function AutoRechargeCard({
  t,
  tr,
  threshold,
  onThreshold,
  amount,
  onAmount,
  insufficient,
}) {
  const red = insufficient ? t.danger : undefined;
  return (
    <Card t={t} className="flex flex-col gap-4 px-4 py-4 sm:px-5">
      <p
        className="inline-flex items-center gap-2 text-[14px] font-extrabold"
        style={{ color: insufficient ? t.danger : t.heading }}
      >
        <MdOutlineAutorenew size={18} color={insufficient ? t.danger : t.sub} />
        {tr("recharge.autoRecharge.title")}
      </p>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <div className="flex items-center justify-between gap-3">
          <span className="text-[11px]" style={{ color: t.sub }}>
            {tr("recharge.autoRecharge.when")}
          </span>
          <MoneyField
            t={t}
            value={threshold}
            onChange={onThreshold}
            color={red}
          />
        </div>
        <div className="flex items-center justify-between gap-3">
          <span className="text-[11px]" style={{ color: t.sub }}>
            {tr("recharge.autoRecharge.charge")}
          </span>
          <MoneyField t={t} value={amount} onChange={onAmount} color={red} />
        </div>
      </div>

      <p
        className="flex items-start gap-2 rounded-lg p-2.5 text-[10px] leading-5"
        style={{
          background: t.inner,
          color: t.sub,
          border: `1px solid ${t.border}`,
        }}
      >
        <MdOutlineInfo size={14} className="mt-0.5 shrink-0" />
        {tr("recharge.autoRecharge.note")}
      </p>
    </Card>
  );
}

function AdRow({ t, tr, ad, isLast, isRTL }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuPos, setMenuPos] = useState({ top: 0, left: 0 });
  const btnRef = useRef(null);

  const MENU_WIDTH = 168;
  const MENU_HEIGHT = 80;
  const GAP = 6;

  // القائمة fixed، فنسكرها عند السكرول أو تغيير حجم الشاشة
  useEffect(() => {
    if (!menuOpen) return;
    const close = () => setMenuOpen(false);
    window.addEventListener("scroll", close, true);
    window.addEventListener("resize", close);
    return () => {
      window.removeEventListener("scroll", close, true);
      window.removeEventListener("resize", close);
    };
  }, [menuOpen]);

  const toggleMenu = () => {
    if (menuOpen) {
      setMenuOpen(false);
      return;
    }
    const btn = btnRef.current;
    if (!btn) return;

    const rect = btn.getBoundingClientRect();

    // فتح لفوق إذا ما في مساحة كافية تحت
    const openAbove = window.innerHeight - rect.bottom < MENU_HEIGHT + GAP;
    const top = openAbove ? rect.top - MENU_HEIGHT - GAP : rect.bottom + GAP;

    // محاذاة حسب اتجاه اللغة، مع منع الخروج من الشاشة
    const rawLeft = isRTL ? rect.left : rect.right - MENU_WIDTH;
    const left = Math.max(
      8,
      Math.min(rawLeft, window.innerWidth - MENU_WIDTH - 8),
    );

    setMenuPos({ top, left });
    setMenuOpen(true);
  };

  const Icon = ad.icon || MdOutlineVideoLibrary;
  const toneColor =
    ad.tone === "mint" ? t.accent : ad.tone === "gold" ? t.goldText : t.sub;
  const active = ad.status === "ACTIVE";

  const itemClass =
    "group flex w-full items-center justify-start gap-2.5 rounded-xl px-2.5 py-2 text-start text-[11px] font-medium transition-colors hover:bg-[var(--menu-hover)]";
  const iconClass =
    "shrink-0 text-[var(--icon)] transition-colors group-hover:text-[var(--icon-hover)]";

  return (
    <tr style={{ borderBottom: isLast ? "none" : `1px solid ${t.border}` }}>
      <td className="px-5 py-4 text-center">
        <div className="flex items-center gap-3">
          <IconBox t={t} icon={Icon} color={toneColor} size={18} box={36} />
          <div className="min-w-0">
            <p className="text-[13px] font-bold" style={{ color: t.heading }}>
              {ad.name}
            </p>
            <p className="mt-0.5 text-[11px]" style={{ color: t.sub }}>
              {ad.sub}
            </p>
          </div>
        </div>
      </td>

      <td className="px-5 py-4">
        <Pill
          dot
          bg={active ? t.accentBg : t.goldBg}
          color={active ? t.accent : t.goldText}
        >
          {active ? tr("adsTable.statusActive") : tr("adsTable.statusPaused")}
        </Pill>
      </td>

      <td
        className="px-5 py-4 text-[13px] font-medium"
        style={{ color: t.text }}
      >
        {ad.clicks.toLocaleString("en-US")}
      </td>

      <td
        className="px-5 py-4 text-[13px] font-bold"
        style={{ color: t.goldText }}
      >
        {ad.ctr}
      </td>

      <td
        className="px-5 py-4 text-[13px] font-medium"
        style={{ color: t.text }}
      >
        ${fmt(ad.cost)}
      </td>

      {/* الإجراءات */}
      <td className="px-5 py-4 text-center">
        <button
          ref={btnRef}
          type="button"
          aria-label={tr("adsTable.columns.actions")}
          onClick={toggleMenu}
          className="inline-flex h-8 w-8 items-center justify-center rounded-lg transition-opacity hover:opacity-70"
        >
          <MdOutlineMoreVert size={18} color={t.sub} />
        </button>

        {menuOpen && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setMenuOpen(false)}
            />

            <div
              dir={isRTL ? "rtl" : "ltr"}
              className="fixed z-50 overflow-hidden rounded-2xl"
              style={{
                top: menuPos.top,
                left: menuPos.left,
                width: MENU_WIDTH,
                background: t.menuBg,
                border: `1px solid ${t.menuBorder}`,
                boxShadow: t.menuShadow,
                padding: 4,
                "--menu-hover": t.menuHover,
                "--icon": t.heading,
                "--icon-hover": t.accent,
              }}
            >
              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                className={itemClass}
                style={{ color: t.heading }}
              >
                <MdOutlineSaveAlt size={16} className={iconClass} />
                <span>{tr("adsTable.menu.details")}</span>
              </button>

              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                className={itemClass}
                style={{ color: t.heading }}
              >
                <MdOutlineGpsFixed size={16} className={iconClass} />
                <span>{tr("adsTable.menu.manageBudget")}</span>
              </button>
            </div>
          </>
        )}
      </td>
    </tr>
  );
}
// ── Paused banner ──────────────────────────────────────────────────────────
function PausedBanner({ t, tr, frozen, onResume }) {
  return (
    <div
      role="status"
      className="flex flex-col gap-3 rounded-2xl px-4 py-3 sm:flex-row sm:items-center sm:px-5"
      style={{
        background: t.card,
        border: `1px solid ${t.dangerBorder}`,
        boxShadow: t.shadow,
      }}
    >
      <div className="flex min-w-0 flex-1 items-start gap-3">
        <div
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
          style={{ background: t.dangerBg }}
        >
          <MdOutlinePause size={22} color={t.danger} />
        </div>
        <div className="min-w-0">
          <p
            className="text-[15px] font-extrabold"
            style={{ color: t.heading }}
          >
            {tr("paused.title")}
          </p>
          <p className="mt-0.5 text-[11px] leading-5" style={{ color: t.sub }}>
            {tr.rich("paused.message", {
              amount: fmt(frozen),
              b: (chunks) => (
                <b dir="ltr" style={{ color: t.gold }}>
                  {chunks}
                </b>
              ),
            })}
          </p>
        </div>
      </div>

      <OrangeBtn
        icon={MdOutlinePlayArrow}
        onClick={onResume}
        className="w-full !py-2.5 !text-[12px] sm:w-auto"
      >
        {tr("paused.resume")}
      </OrangeBtn>
    </div>
  );
}

// ── Frozen budget bar ──────────────────────────────────────────────────────
function FrozenProgress({ t, tr, total, spent, frozen, frozenAt, startDate }) {
  const spentPct = total > 0 ? Math.round((spent / total) * 1000) / 10 : 0;
  const frozenPct = Math.round((100 - spentPct) * 10) / 10;

  return (
    <div
      className="rounded-xl p-4"
      style={{ background: t.inner, border: `1px solid ${t.border}` }}
    >
      <p className="mb-3 text-[11px]" style={{ color: t.sub }}>
        {tr("summary.bigProgress")} ${fmt(total)}
      </p>

      <div className="mb-2 flex items-center justify-between gap-2 text-[11px] font-bold">
        <span
          className="inline-flex items-center gap-1.5"
          style={{ color: t.danger }}
        >
          <span
            className="h-1.5 w-1.5 rounded-full"
            style={{ background: t.danger }}
          />
          {tr("paused.spentLabel", { pct: spentPct, amount: fmt(spent) })}
        </span>
        <span
          className="inline-flex items-center gap-1.5"
          style={{ color: t.accent }}
        >
          <span
            className="h-1.5 w-1.5 rounded-full"
            style={{ background: t.accent }}
          />
          {tr("paused.frozenLabel", { pct: frozenPct, amount: fmt(frozen) })}
        </span>
      </div>

      {/* شريط بلونين: مصروف + مجمّد */}
      <div
        className="flex h-2.5 w-full overflow-hidden rounded-full"
        style={{ background: t.track }}
      >
        <div style={{ width: `${spentPct}%`, background: t.danger }} />
        <div style={{ width: `${frozenPct}%`, background: t.mint }} />
      </div>

      <div
        className="mt-3 flex flex-col gap-1 text-[11px] sm:flex-row sm:items-center sm:justify-between"
        style={{ color: t.sub }}
      >
        <span>{tr("paused.startedAt", { date: startDate })}</span>
        <span>{tr("paused.frozenAt", { time: frozenAt })}</span>
        <span>{tr("paused.validity")}</span>
      </div>
    </div>
  );
}

function RadioMark({ on, t }) {
  return (
    <span className="flex h-4 w-4 items-center justify-center rounded-full" style={{ border: `2px solid ${on ? t.mint : t.sub}` }}>
      {on && <span className="h-2 w-2 rounded-full" style={{ background: t.mint }} />}
    </span>
  );
}

// ── Quick resume options (بدل الحد اليومي) ─────────────────────────────────
function QuickResumeCard({ t, tr, frozen, defaultLimit, onResumeNow }) {
  const [mode, setMode] = useState("rate"); // "rate" | "schedule"
  const [limit, setLimit] = useState(defaultLimit);
  const [date, setDate] = useState("");
  const days = limit > 0 ? Math.ceil(frozen / limit) : 0;

  const optionStyle = (on) => ({
    background: t.inner,
    border: `1px solid ${on ? t.accentBorder : t.border}`,
  });

  return (
    <Card t={t} className="flex flex-col gap-4 p-4 sm:p-5">
      <SectionHead
        t={t}
        icon={MdOutlineTune}
        title={tr("quickResume.title")}
        sub={tr("quickResume.subtitle")}
      >
        <Pill bg={t.innerStrong} color={t.sub} className="!py-0.5">
          {tr("quickResume.badge")}
        </Pill>
      </SectionHead>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* 1) استئناف بمعدل إنفاق مخصص */}
        <div
          className="flex flex-col gap-3 rounded-xl p-4"
          style={optionStyle(mode === "rate")}
        >
          <button
            type="button"
            onClick={() => setMode("rate")}
            className="flex items-center justify-between text-start"
          >
            <span
              className="text-[14px] font-extrabold"
              style={{ color: t.heading }}
            >
              {tr("quickResume.rate.title")}
            </span>
            <RadioMark on={mode === "rate"} t={t} />
          </button>
          <p className="text-[11px] leading-5" style={{ color: t.sub }}>
            {tr("quickResume.rate.desc")}
          </p>

          <p className="text-[11px]" style={{ color: t.sub }}>
            {tr("quickResume.rate.label")}
          </p>
          <div className="flex items-center gap-3">
            <MoneyField t={t} value={limit} onChange={setLimit} wide />
            <span className="shrink-0 text-[10px]" style={{ color: t.sub }}>
              {tr("quickResume.rate.coverage", { days })}
            </span>
          </div>

          <OrangeBtn
            icon={MdOutlinePlayArrow}
            disabled={mode !== "rate" || limit <= 0}
            onClick={() => onResumeNow(limit)}
            className="w-full"
          >
            {tr("quickResume.rate.action")}
          </OrangeBtn>
        </div>

        {/* 2) جدولة استئناف تلقائي */}
        <div
          className="flex flex-col gap-3 rounded-xl p-4"
          style={optionStyle(mode === "schedule")}
        >
          <button
            type="button"
            onClick={() => setMode("schedule")}
            className="flex items-center justify-between text-start"
          >
            <span
              className="text-[14px] font-extrabold"
              style={{ color: t.heading }}
            >
              {tr("quickResume.schedule.title")}
            </span>
            <RadioMark on={mode === "schedule"} t={t} />
          </button>
          <p className="text-[11px] leading-5" style={{ color: t.sub }}>
            {tr("quickResume.schedule.desc")}
          </p>

          <p className="text-[11px]" style={{ color: t.sub }}>
            {tr("quickResume.schedule.label")}
          </p>
          <label
            className="flex items-center gap-2 rounded-xl px-3 py-2.5"
            style={{ background: t.card, border: `1px solid ${t.border}` }}
          >
            <MdOutlineCalendarMonth size={16} color={t.sub} />
            <input
              type="datetime-local"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full bg-transparent text-[12px] font-medium outline-none"
              style={{ color: t.heading, colorScheme: "dark light" }}
            />
          </label>

          <GhostBtn
            t={t}
            icon={MdOutlineEventRepeat}
            onClick={() => {}}
            className="w-full !py-3"
          >
            {tr("quickResume.schedule.action")}
          </GhostBtn>
        </div>
      </div>
    </Card>
  );
}
function CampaignSwitcher({ t, tr, campaigns, selectedId, onSelect }) {
  const [open, setOpen] = useState(false);
  const current = campaigns.find((c) => c.id === selectedId) ?? campaigns[0];

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-3 rounded-lg px-4 py-2 text-[12px] font-bold transition-opacity hover:opacity-80"
        style={{
          background: open ? t.mint : t.innerStrong,
          color: open ? t.onMint : t.soft,
          border: `1px solid ${open ? t.mint : t.border}`,
        }}
      >
        <span>{tr("summary.toggleCampaign")}</span>
        <MdOutlineExpandMore
          size={18}
          className={`transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div
            className="absolute z-50 mt-2 flex max-h-72 w-72 flex-col gap-1 overflow-y-auto rounded-2xl p-1.5"
            style={{
              insetInlineEnd: 0,
              background: t.menuBg,
              border: `1px solid ${t.menuBorder}`,
              boxShadow: t.menuShadow,
            }}
          >
            {campaigns.map((c) => {
              const on = c.id === current.id;
              const pct =
                c.budget.total > 0
                  ? Math.round((c.budget.spent / c.budget.total) * 100)
                  : 0;
              const paused = c.status === "PAUSED";
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => {
                    onSelect(c.id);
                    setOpen(false);
                  }}
                  className="flex flex-col gap-1.5 rounded-xl p-2.5 text-start transition-colors"
                  style={{
                    background: on ? t.accentBg : "transparent",
                    border: `1px solid ${on ? t.accentBorder : "transparent"}`,
                  }}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className="text-[12px] font-extrabold"
                      style={{ color: t.heading }}
                    >
                      {c.name}
                    </span>
                    <span
                      className="h-2 w-2 shrink-0 rounded-full"
                      style={{ background: paused ? t.gold : t.accent }}
                    />
                  </div>
                  <div
                    className="flex items-center justify-between text-[10px]"
                    style={{ color: t.sub }}
                  >
                    <span dir="ltr">{c.displayId}</span>
                    <span>
                      ${fmt(c.budget.spent)} / ${fmt(c.budget.total)}
                    </span>
                  </div>
                  <Bar
                    t={t}
                    pct={pct}
                    color={pct >= 100 ? t.danger : t.mint}
                    h={4}
                  />
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────
function BudgetContent({ campaigns, onRefresh }) {
  const router = useRouter();
  const { isDark } = useTheme();
  const locale = useLocale();
  const isRTL = locale === "ar";
  const t = getTokens(isDark);
  const tr = useTranslations("budgetManagement");

  const [selectedId, setSelectedId] = useState(campaigns[0].id);
  const campaign = campaigns.find((c) => c.id === selectedId) ?? campaigns[0];
  // ── States ──
  const [rechargeAmount, setRechargeAmount] = useState(500);
  const [autoThreshold, setAutoThreshold] = useState(100);
  const [autoAmount, setAutoAmount] = useState(500);
  const [dailyEnabled, setDailyEnabled] = useState(campaign.daily.enabled);
  const [dailyLimit, setDailyLimit] = useState(campaign.daily.limit);
  const [isUpdating, setIsUpdating] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [rechargeFault, setRechargeFault] = useState(false);
  const [isPaused, setIsPaused] = useState(campaign.status === "PAUSED");
  const [budgetTotal, setBudgetTotal] = useState(campaign.budget.total);
  const { balance: walletBalance, status: walletStatus, setBalance: setWalletBalance, refresh: refreshWallet } = useWallet();
  const walletLoaded = walletStatus === "ready";
  const [submitting, setSubmitting] = useState(false);
  const [successInfo, setSuccessInfo] = useState(null);
  const [showBulk, setShowBulk] = useState(false);
  const [dailyUpdating, setDailyUpdating] = useState(false);
  const [statusUpdating, setStatusUpdating] = useState(false);

  // ── Derived values ──
  const total = budgetTotal;
  const spent = Math.min(campaign.budget.spent, total);
  const remaining = Math.max(total - spent, 0);
  const frozenAmount = remaining;
  const isDepleted = total > 0 && remaining === 0;
  const showPaused =
    isPaused && !isDepleted && campaign.pauseReason !== "DAILY_LIMIT_REACHED";
  const spentPct = total > 0 ? Math.round((spent / total) * 100) : 0;
  const remainingPct = 100 - spentPct;
  const showBudgetAlert = spentPct >= 50 && !isDepleted;
  const dailyReached = campaign.daily.todaySpent >= dailyLimit;
  const dailyBlocked =
    dailyEnabled &&
    !isDepleted &&
    !isPaused &&
    (dailyReached || (walletLoaded && walletBalance < dailyLimit));
  const newTotal = budgetTotal + rechargeAmount;
  const todayPct =
    dailyLimit > 0
      ? Math.round((campaign.daily.todaySpent / dailyLimit) * 100)
      : 0;

  // رصيد المحفظة vs المبلغ المطلوب شحنه (بعد ما يوصل الرصيد الحقيقي فقط)
  const insufficient = walletLoaded && rechargeAmount > walletBalance;
  const rechargeError = insufficient || rechargeFault;
  const canRecharge = walletLoaded && rechargeAmount > 0 && !insufficient;
  const deficit = Math.max(rechargeAmount - walletBalance, 0);

  // ── Effects ──
  useEffect(() => {
    // Intentional form reset when the selected campaign changes.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setBudgetTotal(campaign.budget.total);
    setDailyLimit(campaign.daily.limit);
    setIsPaused(campaign.status === "PAUSED");
    setDailyEnabled(campaign.daily.enabled);
    setSuccessInfo(null);
    setRechargeFault(false);
  }, [
    campaign.id,
    campaign.budget.total,
    campaign.daily.limit,
    campaign.daily.enabled,
    campaign.status,
  ]);

  useEffect(() => {
    // Intentional: clear the previous request error when amount changes.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setRechargeFault(false);
  }, [rechargeAmount]);

  // ── Handlers ──
  const handleConfirmRecharge = async () => {
    if (!canRecharge || submitting) return;
    setSubmitting(true);
    try {
      const d = await rechargeCampaign(campaign.id, rechargeAmount);
      setRechargeFault(false);
      setBudgetTotal(d.totalBudget);
      setWalletBalance(d.walletBalanceAfter);
      setIsPaused(d.campaignStatus !== "ACTIVE");
      setSuccessInfo({
        id: d.transactionId,
        added: d.amountAdded,
        newBudget: d.totalBudget,
        walletLeft: d.walletBalanceAfter,
      });
      onRefresh?.();
    } catch (e) {
      if (e.code === "INSUFFICIENT_BALANCE") {
        // نحدّث الرصيد الحقيقي، وبانر الرصيد بيظهر لحاله
        refreshWallet().catch(() => {});
      } else {
        // NETWORK_ERROR / INTERNAL_ERROR / غيرها
        setRechargeFault(true);
      }
    } finally {
      setSubmitting(false);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };
  const handleDailyLimitChange = async (newLimit) => {
    const nextLimit = Number(newLimit);

    if (!Number.isFinite(nextLimit) || nextLimit <= 0) return;
    if (nextLimit === dailyLimit || dailyUpdating) return;

    setDailyUpdating(true);

    try {
      await setDailyBudget(campaign.id, nextLimit);
      setDailyLimit(nextLimit);
    } catch (e) {
      console.error("Failed to update daily budget:", e);
    } finally {
      setDailyUpdating(false);
    }
  };

  const handlePauseResume = async () => {
    if (statusUpdating) return;

    setStatusUpdating(true);

    try {
      if (isPaused) {
        await resumeCampaign(campaign.id);
        setIsPaused(false);
      } else {
        await pauseCampaign(campaign.id);
        setIsPaused(true);
      }

      await onRefresh?.();
    } catch (e) {
      console.error("Failed to change campaign status:", e);
    } finally {
      setStatusUpdating(false);
    }
  };

  const handleQuickResume = async (newLimit) => {
    if (statusUpdating || dailyUpdating) return;

    setStatusUpdating(true);

    try {
      await setDailyBudget(campaign.id, newLimit);
      await resumeCampaign(campaign.id);

      setDailyLimit(newLimit);
      setIsPaused(false);

      await onRefresh?.();
    } catch (e) {
      console.error("Failed to resume campaign:", e);
    } finally {
      setStatusUpdating(false);
    }
  };

  // Send the advertiser through the existing funding flow to cover a shortfall.
  const handleCoverDeficit = () => {
    if (deficit <= 0) return;
    router.push(`/${locale}/advertiser/wallet/top-up`);
  };

  if (showDetails) {
    return (
      <DailyLimitDetails
        campaign={campaign}
        limit={dailyLimit}
        walletBalance={walletBalance}
        onBack={() => setShowDetails(false)}
        onResume={async (newLimit) => {
          await handleDailyLimitChange(newLimit);
          setShowDetails(false);
        }}
      />
    );
  }
  if (showBulk) {
    return (
      <BulkRecharge
        campaigns={campaigns}
        walletBalance={walletBalance}
        onBack={() => setShowBulk(false)}
        onDone={async ({ walletBalance: b }) => {
          if (b != null) setWalletBalance(b);
          await onRefresh?.();
        }}
      />
    );
  }

  return (
    <div
      dir={isRTL ? "rtl" : "ltr"}
      className={`${tajawal.className} min-h-screen`}
      style={{ background: t.page, color: t.text }}
    >
      <div className="mx-auto flex w-full max-w-[1400px] flex-col gap-4 p-3 sm:p-5 lg:p-6">
        {/* ── 1) Header + banners + geo ───────────────────────────────── */}
        <div className="flex flex-col gap-2">
          <Card t={t} className="px-4 py-3 sm:px-5">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                  <h1
                    className="text-[18px] font-extrabold leading-tight sm:text-[20px]"
                    style={{ color: t.heading }}
                  >
                    {tr("title")}
                  </h1>
                  <Pill
                    dot
                    bg={t.accentBg}
                    color={t.accent}
                    className="!py-0.5"
                  >
                    {tr("active")}
                  </Pill>
                </div>
                <p
                  className="mt-1 text-[12px] leading-5"
                  style={{ color: t.sub }}
                >
                  {tr("subtitle")}
                </p>
              </div>
              <GhostBtn
                t={t}
                icon={MdOutlineAddCard}
                onClick={() => setShowBulk(true)}
                className="w-full lg:w-auto"
              >
                شحن جماعي
              </GhostBtn>
              <div
                className="flex w-full shrink-0 items-center gap-3 self-stretch rounded-xl px-3 py-2 sm:w-fit sm:self-start lg:self-center"
                style={{ background: t.inner, border: `1px solid ${t.border}` }}
              >
                <div
                  className="flex h-8 w-8 items-center justify-center rounded-lg"
                  style={{ background: t.innerStrong }}
                >
                  <MdOutlineVerifiedUser size={18} color={t.accent} />
                </div>
                <div>
                  <p className="text-[10px]" style={{ color: t.sub }}>
                    {tr("complianceStatus")}
                  </p>
                  <p
                    className="text-[13px] font-bold"
                    style={{ color: t.accent }}
                  >
                    {tr("compliant")}
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* بانر نجاح الشحن */}
          {successInfo && (
            <SuccessBanner
              t={t}
              tr={tr}
              info={successInfo}
              onClose={() => setSuccessInfo(null)}
            />
          )}

          <Card t={t} className="px-4 py-3 sm:px-5">
            <div className="flex flex-col gap-3 md:flex-row md:items-center">
              <div className="flex min-w-0 flex-1 items-start gap-3">
                <IconBox t={t} icon={MdOutlinePublic} size={18} box={34} />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                    <h3
                      className="text-[13px] font-extrabold"
                      style={{ color: t.heading }}
                    >
                      {tr("geoRegion.title")}
                    </h3>
                    <Pill
                      dot
                      bg={t.accentBg}
                      color={t.accent}
                      className="!py-0.5"
                    >
                      {tr("geoRegion.badge")}
                    </Pill>
                  </div>
                  <p
                    className="mt-1 text-[11px] leading-5"
                    style={{ color: t.sub }}
                  >
                    {tr("geoRegion.description")}
                  </p>
                </div>
              </div>
              <GhostBtn
                t={t}
                icon={MdOutlineTune}
                iconColor="#94D3C1"
                className="w-full !py-2 md:w-auto"
              >
                {tr("geoRegion.changeCountry")}
              </GhostBtn>
            </div>
          </Card>
          {/* بانر رصيد المحفظة غير كافٍ */}
          {rechargeFault ? (
            <FaultBanner t={t} tr={tr} onRetry={handleConfirmRecharge} />
          ) : (
            insufficient && (
              <InsufficientBanner
                t={t}
                tr={tr}
                required={rechargeAmount}
                available={walletBalance}
                rate={MOCK.wallet.sarRate}
                onCover={handleCoverDeficit}
              />
            )
          )}
          {/* بانر إيقاف الحملة */}
          {isPaused && (
            <PausedBanner
              t={t}
              tr={tr}
              frozen={frozenAmount}
              onResume={handlePauseResume}
            />
          )}
        </div>

        {/* ── 2) Main grid ────────────────────────────────────────────── */}
        <div className="mt-6 grid grid-cols-1 items-start gap-4 xl:grid-cols-[minmax(0,1fr)_380px]">
          {/* Right column (in RTL): summary + daily limit + security */}
          <div className="order-2 flex min-w-0 flex-col gap-4 xl:order-none">
            {/* Summary */}
            <Card t={t} className="flex flex-col gap-4 p-4 sm:p-5">
              <SectionHead
                t={t}
                icon={MdOutlineTrendingUp}
                title={tr("summary.title")}
                sub={tr("summary.subtitle")}
              >
                <button
                  type="button"
                  onClick={async () => {
                    if (isUpdating) return;

                    setIsUpdating(true);

                    try {
                      await onRefresh?.();

                      await refreshWallet();
                    } catch (e) {
                      console.error("Refresh failed:", e);
                    } finally {
                      setIsUpdating(false);
                    }
                  }}
                  className="inline-flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-[11px] font-bold transition-all hover:opacity-80"
                  style={{
                    background: isUpdating ? t.innerStrong : t.inner,
                    color: isUpdating ? t.heading : t.soft,
                    border: `1px solid ${isUpdating ? t.innerStrong : t.border}`,
                  }}
                >
                  <MdOutlineRefresh
                    size={15}
                    color={isUpdating ? t.heading : undefined}
                  />
                  <span className="hidden sm:inline">
                    {tr("summary.refresh")}
                  </span>
                </button>
              </SectionHead>

              {/* Campaign row */}
              <div
                className="flex flex-col gap-3 rounded-xl p-3 sm:flex-row sm:items-center sm:justify-between"
                style={{ background: t.inner, border: `1px solid ${t.border}` }}
              >
                <div className="flex min-w-0 items-center gap-3">
                  <IconBox t={t} icon={MdOutlineGpsFixed} box={38} />
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p
                        className="text-[14px] font-extrabold"
                        style={{ color: t.heading }}
                      >
                        {tr("summary.campaignName", {
                          name: campaign.name,
                        })}
                      </p>
                      <span
                        className="rounded-md px-2 py-0.5 text-[10px] font-bold"
                        dir="ltr"
                        style={{ background: t.innerStrong, color: t.soft }}
                      >
                        {campaign.displayId}
                      </span>
                    </div>
                    <p
                      className="mt-1 flex flex-wrap items-center gap-2 text-[11px]"
                      style={{ color: t.sub }}
                    >
                      <span
                        className="inline-flex items-center gap-1.5"
                        style={{ color: t.accent }}
                      >
                        <span
                          className="h-1.5 w-1.5 rounded-full"
                          style={{ background: t.accent }}
                        />
                        {tr("active")}
                      </span>
                      <span>
                        {tr("summary.campaignType", {
                          type: campaign.type,
                        })}
                      </span>
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handlePauseResume}
                    disabled={statusUpdating}
                    className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-[12px] font-bold transition-opacity hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-50"
                    style={{
                      background: isPaused ? t.mint : t.innerStrong,
                      color: isPaused ? t.onMint : t.soft,
                      border: `1px solid ${isPaused ? t.mint : t.border}`,
                    }}
                  >
                    {isPaused ? (
                      <MdOutlinePlayArrow size={16} />
                    ) : (
                      <MdOutlinePause size={16} />
                    )}

                    {isPaused
                      ? tr("paused.resume")
                      : tr("summary.pauseCampaign")}
                  </button>

                  <CampaignSwitcher
                    t={t}
                    tr={tr}
                    campaigns={campaigns}
                    selectedId={selectedId}
                    onSelect={setSelectedId}
                  />
                </div>
              </div>

              {/* KPIs */}
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <StatCard
                  t={t}
                  label={tr("kpi.totalBudget")}
                  icon={HiOutlinePresentationChartBar}
                  value={fmt(total)}
                  note={tr("summary.totalBudgetNote")}
                  pct={100}
                  barColor={t.mint}
                />
                <StatCard
                  t={t}
                  label={tr("kpi.spent")}
                  icon={MdOutlineSaveAlt}
                  value={fmt(spent)}
                  badge={`${spentPct}%`}
                  note={tr("summary.spentNote")}
                  pct={spentPct}
                  barColor={t.gold}
                />
                <StatCard
                  t={t}
                  label={tr("kpi.remaining")}
                  icon={MdOutlineRequestQuote}
                  value={isDepleted ? "0" : fmt(remaining)}
                  badge={`${remainingPct}%`}
                  note={tr("summary.remainingNote")}
                  pct={remainingPct}
                  barColor={t.mint}
                  valueColor={isDepleted ? "#DC2626" : undefined}
                  badgeColor={isDepleted ? "#DC2626" : undefined}
                />
              </div>

              {/* Big progress */}
              {isPaused ? (
                <FrozenProgress
                  t={t}
                  tr={tr}
                  total={total}
                  spent={spent}
                  frozen={frozenAmount}
                  frozenAt={MOCK.paused.frozenAt}
                  startDate={MOCK.paused.startDate}
                />
              ) : (
                <div
                  className="rounded-xl p-4"
                  style={{
                    background: t.inner,
                    border: `1px solid ${t.border}`,
                  }}
                >
                  <div
                    className="mb-2 flex items-center justify-between"
                    style={{ flexDirection: isRTL ? "row-reverse" : "row" }}
                  >
                    {/* يمين — سقف الميزانية */}
                    <p className="text-[11px]" style={{ color: t.sub }}>
                      {tr("summary.bigProgress")} ${fmt(total)}
                    </p>

                    {/* يسار — التحذير */}
                    {isDepleted ? (
                      <div
                        className="flex items-center gap-2"
                        style={{ flexDirection: isRTL ? "row-reverse" : "row" }}
                      >
                        <span
                          style={{
                            color: "#DC2626",
                            fontSize: 14,
                            fontWeight: 800,
                          }}
                        >
                          {tr("campaignStopped")}
                        </span>
                        <MdOutlinePause size={20} color="#DC2626" />
                      </div>
                    ) : (
                      showBudgetAlert && (
                        <div
                          className="flex items-center gap-1.5"
                          style={{
                            flexDirection: isRTL ? "row-reverse" : "row",
                          }}
                        >
                          <span
                            style={{
                              color: "#DC2626",
                              fontSize: 12,
                              fontWeight: 700,
                            }}
                          >
                            {tr("budgetAlert", {
                              percent: spentPct,
                              remaining: fmt(remaining),
                            })}
                          </span>
                          <MdOutlineInfo size={14} color="#DC2626" />
                        </div>
                      )
                    )}
                  </div>

                  <div className="relative">
                    <Bar t={t} pct={spentPct} color={t.mint} h={10} />
                    <span
                      className="absolute top-0 h-full w-0.5"
                      style={{
                        insetInlineStart: "80%",
                        background: t.gold,
                        opacity: 0.9,
                      }}
                    />
                  </div>

                  <div className="mt-3 flex flex-col gap-1 text-[11px] sm:flex-row sm:items-center sm:justify-between">
                    <span style={{ color: t.sub }}>
                      {tr("summary.progressLabel", {
                        spent: fmt(spent),
                        percent: spentPct,
                      })}
                    </span>
                    <span className="font-bold" style={{ color: t.accent }}>
                      {tr("summary.rechargeHint")}
                    </span>
                    <span style={{ color: t.sub }}>
                      {tr("summary.bigProgress")} ${fmt(total)}
                    </span>
                  </div>
                </div>
              )}
              {/* Alert */}
              <div
                className="flex flex-col gap-3 rounded-xl p-4 sm:flex-row sm:items-center"
                style={{ background: t.inner, border: `1px solid ${t.border}` }}
              >
                <div className="flex min-w-0 flex-1 items-start gap-3">
                  <div
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
                    style={{ background: t.goldBg }}
                  >
                    <MdOutlineNotificationsActive
                      size={20}
                      color={t.goldText}
                    />
                  </div>
                  <div className="min-w-0">
                    <p
                      className="text-[13px] font-extrabold"
                      style={{ color: t.heading }}
                    >
                      {tr("summary.alert.title")}
                    </p>
                    <p
                      className="mt-1 text-[11px] leading-5"
                      style={{ color: t.sub }}
                    >
                      {tr("summary.alert.message", { percent: remainingPct })}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  className="inline-flex shrink-0 items-center gap-2 self-start text-[12px] font-bold transition-opacity hover:opacity-80 sm:self-center"
                  style={{ color: t.accent }}
                >
                  <MdOutlineArrowBack
                    size={16}
                    className="rtl:rotate-0 ltr:rotate-180"
                  />
                  {tr("summary.alert.action")}
                </button>
              </div>
            </Card>

            {/* Daily limit */}
            {isPaused ? (
              <QuickResumeCard
                t={t}
                tr={tr}
                frozen={frozenAmount}
                defaultLimit={dailyLimit}
                onResumeNow={handleQuickResume}
              />
            ) : (
              <Card t={t} className="flex flex-col gap-4 p-4 sm:p-5">
                <SectionHead
                  t={t}
                  icon={MdOutlineTune}
                  title={tr("dailyLimit.title")}
                  sub={tr("dailyLimit.subtitle")}
                >
                  <button
                    type="button"
                    role="switch"
                    aria-checked={dailyEnabled}
                    onClick={() => setDailyEnabled((v) => !v)}
                    className="inline-flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-[11px] font-bold transition-colors"
                    style={{
                      background: dailyEnabled ? t.accentBg : t.inner,
                      color: dailyEnabled ? t.accent : t.soft,
                      border: `1px solid ${dailyEnabled ? t.accentBorder : t.border}`,
                    }}
                  >
                    <MdOutlineLightbulb size={15} />
                    <span className="hidden sm:inline">
                      {tr("dailyLimit.toggle")}
                    </span>
                  </button>
                </SectionHead>

                {/* رسالة التطبيق الفوري / بلوغ الحد */}
                {dailyEnabled &&
                  (dailyBlocked ? (
                    <div
                      role="alert"
                      className="flex flex-wrap items-center justify-between gap-3"
                    >
                      <p
                        className="text-[16px] font-extrabold leading-7"
                        style={{ color: t.danger }}
                      >
                        {tr("dailyLimit.reached", { amount: fmt(dailyLimit) })}
                      </p>

                      <button
                        type="button"
                        onClick={() => setShowDetails(true)}
                        className="inline-flex items-center gap-2 text-[12px] font-bold transition-opacity hover:opacity-80"
                        style={{ color: t.heading }}
                      >
                        {tr("dailyLimit.details")}
                        <MdOutlineArrowBack
                          size={16}
                          color={t.accent}
                          className="rtl:rotate-0 ltr:rotate-180"
                        />
                      </button>
                    </div>
                  ) : (
                    <p
                      role="status"
                      className="text-[16px] font-extrabold leading-7"
                      style={{ color: isDark ? "#22C55E" : "#15803D" }}
                    >
                      {tr("dailyLimit.applied", { amount: fmt(dailyLimit) })}
                    </p>
                  ))}

                <div
                  className={
                    dailyEnabled ? "" : "pointer-events-none opacity-50"
                  }
                >
                  <p
                    className="mb-3 text-[12px] font-medium"
                    style={{ color: t.soft }}
                  >
                    {tr("dailyLimit.label")}
                  </p>

                  <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        aria-label="تقليل"
                        onClick={() => handleDailyLimitChange(dailyLimit - 5)}
                        className="flex h-11 w-11 items-center justify-center rounded-xl transition-opacity hover:opacity-80"
                        style={{ background: t.innerStrong, color: t.heading }}
                      >
                        <MdOutlineRemove size={20} />
                      </button>
                      <div
                        className="flex min-w-[110px] items-baseline justify-center gap-1.5"
                        dir="ltr"
                      >
                        <span
                          className="text-[32px] font-extrabold leading-none tracking-tight"
                          style={{ color: t.heading }}
                        >
                          {fmt(dailyLimit)}
                        </span>
                        <span
                          className="text-[16px] font-bold"
                          style={{ color: t.sub }}
                        >
                          $
                        </span>
                      </div>
                      <button
                        type="button"
                        aria-label="زيادة"
                        onClick={() => handleDailyLimitChange(dailyLimit + 5)}
                        className="flex h-11 w-11 items-center justify-center rounded-xl transition-opacity hover:opacity-80"
                        style={{
                          background: "transparent",
                          color: t.heading,
                          border: `1px solid ${t.border}`,
                        }}
                      >
                        <MdOutlineAdd size={20} />
                      </button>
                    </div>

                    <div className="min-w-0 lg:w-[360px]">
                      <p
                        className="mb-2 text-[11px] font-medium"
                        style={{ color: t.sub }}
                      >
                        {tr("dailyLimit.quickSelect")}
                      </p>
                      <div className="grid grid-cols-3 gap-2">
                        {DAILY_PRESETS.map((v) => {
                          const on = dailyLimit === v;

                          return (
                            <button
                              key={v}
                              type="button"
                              onClick={() => handleDailyLimitChange(v)}
                              disabled={dailyUpdating}
                              className="rounded-xl py-2.5 text-[13px] font-bold transition-colors disabled:cursor-not-allowed disabled:opacity-50"
                              style={{
                                background: on ? t.mint : t.innerStrong,
                                color: on ? t.onMint : t.soft,
                              }}
                            >
                              ${v}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>

                {/* AI recommendation */}
                <div
                  className="flex flex-col gap-3 rounded-xl p-4 sm:flex-row sm:items-center"
                  style={{
                    background: t.inner,
                    border: `1px solid ${t.border}`,
                  }}
                >
                  <div className="flex min-w-0 flex-1 items-start gap-3">
                    <IconBox t={t} icon={MdOutlineAutoAwesome} />
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <p
                          className="text-[13px] font-extrabold"
                          style={{ color: t.heading }}
                        >
                          {tr("dailyLimit.ai.title")}
                        </p>
                        <span
                          className="rounded-md px-2 py-0.5 text-[10px] font-bold"
                          style={{ background: t.accentBg, color: t.accent }}
                        >
                          {tr("dailyLimit.ai.badge")}
                        </span>
                      </div>
                      <p
                        className="mt-1 text-[11px] leading-5"
                        style={{ color: t.sub }}
                      >
                        {tr("dailyLimit.ai.message")}
                      </p>
                    </div>
                  </div>
                  <OrangeBtn
                    icon={MdOutlineCheckCircle}
                    onClick={() => handleDailyLimitChange(75)}
                    disabled={dailyUpdating}
                    className="h-[38px] w-full sm:w-auto"
                  >
                    {tr("dailyLimit.ai.action")}
                  </OrangeBtn>
                </div>

                {/* Today usage */}
                <div>
                  <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                    <span
                      className="inline-flex items-center gap-2 text-[12px] font-bold"
                      style={{ color: t.heading }}
                    >
                      <MdOutlineTimelapse size={16} color={t.sub} />
                      {tr("dailyLimit.today.title")}
                    </span>
                    <span className="text-[11px]" style={{ color: t.sub }}>
                      <b style={{ color: t.heading }}>
                        ${fmt(campaign.daily.todaySpent)}
                      </b>{" "}
                      {tr("dailyLimit.today.label")}{" "}
                      <b style={{ color: t.heading }}>${fmt(dailyLimit)}</b> (
                      {todayPct}%)
                    </span>
                  </div>
                  <Bar
                    t={t}
                    pct={todayPct}
                    color={todayPct > 90 ? "#F87171" : t.mint}
                    h={8}
                  />
                  <p
                    className="mt-2 inline-flex items-center gap-1.5 text-[10px]"
                    style={{ color: t.sub }}
                  >
                    <MdOutlineSchedule size={13} />
                    {tr("dailyLimit.today.description")}
                  </p>
                </div>
              </Card>
            )}
            {/* التوثيق والحماية */}
            <Card t={t} className="p-3 sm:p-4">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="flex min-w-0 items-center gap-3">
                  <IconBox t={t} icon={MdOutlineFingerprint} />
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                      <p
                        className="text-[13px] font-extrabold"
                        style={{ color: t.heading }}
                      >
                        {tr("security.title")}
                      </p>
                      <span
                        className="text-[10px] font-medium"
                        dir="ltr"
                        style={{ color: t.accent }}
                      >
                        {tr("security.badge")}
                      </span>
                    </div>
                    <p
                      className="mt-0.5 text-[11px] leading-5"
                      style={{ color: t.sub }}
                    >
                      {tr("security.lastModified", {
                        name: "أحمد الفضلي",
                        role: "مدير الحملة",
                        date: "28 فبراير 2025",
                        time: "14:22",
                      })}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col-reverse gap-2 sm:flex-row sm:items-center sm:gap-3">
                  <button
                    type="button"
                    className="inline-flex items-center justify-center gap-2 px-3 py-2.5 text-[13px] font-bold transition-opacity hover:opacity-70"
                    style={{ color: t.soft }}
                  >
                    <MdOutlineClose size={10} />
                    {tr("security.cancelChanges")}
                  </button>
                  <button
                    type="button"
                    className="inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-[12px] font-extrabold transition-opacity hover:opacity-90"
                    style={{ background: t.mint, color: t.onMint }}
                  >
                    <MdOutlineSave size={13} />
                    {tr("security.saveChanges")}
                  </button>
                </div>
              </div>
            </Card>
          </div>

          {/* Left column (in RTL): recharge + notifications */}
          <div className="order-1 flex min-w-0 flex-col gap-4 xl:order-none">
            <Card t={t} className="flex min-w-0 flex-col gap-4 p-4 sm:p-5">
              <SectionHead
                t={t}
                icon={rechargeError ? MdOutlineAddCard : MdOutlineCreditCard}
                title={tr("recharge.title")}
                sub={tr("recharge.subtitle")}
                titleColor={rechargeError ? t.danger : undefined}
                iconColor={rechargeError ? t.danger : undefined}
                iconBg={rechargeError ? t.dangerBg : undefined}
                iconBorder={rechargeError ? t.dangerBorder : undefined}
              />

              {/* Balance */}
              <div>
                <div className="mb-2 flex items-center justify-between gap-2">
                  <span className="text-[11px]" style={{ color: t.sub }}>
                    {tr("recharge.available")}
                  </span>
                  {!insufficient && (
                    <Pill bg={t.accentBg} color={t.accent} className="!py-0.5">
                      <MdOutlineCheck size={12} />
                      {tr("recharge.availableBadge")}
                    </Pill>
                  )}
                </div>
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-baseline gap-2" dir="ltr">
                    <span
                      className="text-[11px] font-bold"
                      style={{ color: t.accent }}
                    >
                      USD $
                    </span>
                    <span
                      className="text-[30px] font-extrabold leading-none tracking-tight"
                      style={{ color: t.accent }}
                    >
                      {fmt(walletBalance)}
                    </span>
                  </div>
                  <p className="text-[10px]" style={{ color: t.sub }}>
                    ≈ {fmt(walletBalance * MOCK.wallet.sarRate)} ر.س
                  </p>
                </div>
              </div>

              {/* Amount */}
              <div>
                <p
                  className="mb-2 text-[12px] font-bold"
                  style={{ color: t.soft }}
                >
                  {tr("recharge.amountLabel")}
                </p>
                <label
                  className="flex items-center gap-2 rounded-xl px-3 py-3"
                  style={{
                    background: t.inner,
                    border: `1px solid ${t.border}`,
                  }}
                >
                  <span
                    className="text-[15px] font-bold"
                    style={{ color: t.accent }}
                  >
                    $
                  </span>
                  <input
                    type="text"
                    inputMode="decimal"
                    value={rechargeAmount}
                    onChange={(e) => {
                      const val = e.target.value.replace(/[^0-9.]/g, "");
                      setRechargeAmount(Number(val) || 0);
                    }}
                    className="w-full min-w-0 bg-transparent text-start text-[20px] font-extrabold outline-none"
                    style={{
                      color: rechargeError ? t.danger : t.heading,
                      fontFamily: "Arial, sans-serif",
                    }}
                  />
                  <span
                    className="text-[10px] font-bold"
                    style={{ color: t.sub }}
                  >
                    USD
                  </span>
                </label>
                <div className="mt-3 grid grid-cols-3 gap-2">
                  {RECHARGE_PRESETS.map((v) => {
                    const on = rechargeAmount === v;
                    const over = rechargeError || v > walletBalance;
                    return (
                      <button
                        key={v}
                        type="button"
                        onClick={() => setRechargeAmount(v)}
                        className="rounded-xl py-2.5 text-[12px] font-bold transition-colors"
                        style={{
                          background: on ? t.mint : t.inner,
                          color: on ? t.onMint : over ? t.danger : t.soft,
                          border: `1px solid ${on ? t.mint : t.border}`,
                        }}
                      >
                        +${v.toLocaleString("en-US")}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Preview */}
              <div
                className="rounded-xl p-4"
                style={{ background: t.inner, border: `1px solid ${t.border}` }}
              >
                <p
                  className="mb-3 inline-flex items-center gap-2 text-[12px] font-bold"
                  style={{ color: rechargeError ? t.danger : t.heading }}
                >
                  <MdOutlineVisibility
                    size={16}
                    color={rechargeError ? t.danger : t.sub}
                  />
                  {tr("recharge.preview.title")}
                </p>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px]" style={{ color: t.sub }}>
                    {tr("recharge.preview.newTotal")}
                  </span>
                  <span
                    className="text-[20px] font-extrabold"
                    dir="ltr"
                    style={{ color: t.accent }}
                  >
                    $ {fmt(newTotal)}
                  </span>
                </div>
                <div
                  className="mt-3 flex items-center justify-between gap-2 pt-3 text-[10px]"
                  style={{ borderTop: `1px solid ${t.border}` }}
                >
                  <span style={{ color: t.sub }}>
                    {tr("recharge.preview.current", {
                      amount: budgetTotal.toLocaleString("en-US"),
                    })}
                  </span>
                  <span className="font-bold" style={{ color: t.goldText }}>
                    {tr("recharge.preview.adding", {
                      amount: rechargeAmount.toLocaleString("en-US"),
                    })}
                  </span>
                </div>
              </div>

              {/* Auto recharge */}
              <div
                className="flex flex-col gap-3 rounded-xl p-4"
                style={{ background: t.inner, border: `1px solid ${t.border}` }}
              >
                <p
                  className="inline-flex items-center gap-2 text-[12px] font-bold"
                  style={{ color: rechargeError ? t.danger : t.heading }}
                >
                  <MdOutlineAutorenew
                    size={16}
                    color={rechargeError ? t.danger : t.sub}
                  />
                  {tr("recharge.autoRecharge.title")}
                </p>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-[11px]" style={{ color: t.sub }}>
                    {tr("recharge.autoRecharge.when")}
                  </span>
                  <MoneyField
                    t={t}
                    value={autoThreshold}
                    onChange={setAutoThreshold}
                    color={rechargeError ? t.danger : undefined}
                  />
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-[11px]" style={{ color: t.sub }}>
                    {tr("recharge.autoRecharge.charge")}
                  </span>
                  <MoneyField
                    t={t}
                    value={autoAmount}
                    onChange={setAutoAmount}
                    color={rechargeError ? t.danger : undefined}
                  />
                </div>
                <p
                  className="flex items-start gap-2 rounded-lg p-2.5 text-[10px] leading-5"
                  style={{
                    background: t.card,
                    color: t.sub,
                    border: `1px solid ${t.border}`,
                  }}
                >
                  <MdOutlineInfo size={14} className="mt-0.5 shrink-0" />
                  {tr("recharge.autoRecharge.note")}
                </p>
              </div>

              {/* Confirm */}
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setRechargeAmount(0)}
                  className="shrink-0 px-2 text-[12px] font-bold transition-opacity hover:opacity-70"
                  style={{ color: t.soft }}
                >
                  {tr("recharge.cancel")}
                </button>
                <OrangeBtn
                  icon={MdOutlineBolt}
                  onClick={handleConfirmRecharge}
                  disabled={!canRecharge || submitting}
                  className="h-[43px] flex-1 !px-3 !text-[13px]"
                >
                  {tr("recharge.confirm", { amount: fmt(rechargeAmount) })}
                </OrangeBtn>
              </div>
            </Card>

            {isDepleted && (
              <DepletedNotifications
                t={t}
                tr={tr}
                campaignId={campaign.displayId}
                time={MOCK.notifications.time}
                email={MOCK.notifications.email}
              />
            )}
          </div>
        </div>

        {/* ── 3) Ads table ────────────────────────────────────────────── */}
        <Card t={t}>
          <div className="flex flex-col gap-1 overflow-x-auto overflow-y-visible px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <h3
              className="text-[15px] font-extrabold"
              style={{ color: t.heading }}
            >
              {tr("adsTable.title")}
            </h3>
            <span className="text-[11px]" style={{ color: t.sub }}>
              {tr("adsTable.subtitle", { count: campaign.ads.length })}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] border-collapse">
              <thead>
                <tr
                  style={{
                    borderTop: `1px solid ${t.border}`,
                    borderBottom: `1px solid ${t.border}`,
                  }}
                >
                  {[
                    tr("adsTable.columns.ad"),
                    tr("adsTable.columns.status"),
                    tr("adsTable.columns.clicks"),
                    tr("adsTable.columns.ctr"),
                    tr("adsTable.columns.cost"),
                  ].map((h) => (
                    <th
                      key={h}
                      className="px-5 py-3 text-start text-[11px] font-medium"
                      style={{ color: t.sub }}
                    >
                      {h}
                    </th>
                  ))}
                  <th
                    className="px-5 py-3 text-center text-[11px] font-medium"
                    style={{ color: t.sub }}
                  >
                    {tr("adsTable.columns.actions")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {campaign.ads.map((ad, i) => (
                  <AdRow
                    key={ad.id}
                    t={t}
                    tr={tr}
                    ad={ad}
                    isRTL={isRTL}
                    isLast={i === campaign.ads.length - 1}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}
export default function BudgetManagement() {
  const { isDark } = useTheme();
  const locale = useLocale();
  const t = getTokens(isDark);
  const tr = useTranslations("budgetManagement");

  const [campaigns, setCampaigns] = useState(null);
  const [error, setError] = useState(false);

  const load = useCallback(async () => {
    try {
      const list = await fetchBudgetCampaigns();
      setCampaigns(list);
      setError(false);
      return list;
    } catch (e) {
      setError(true);
      throw e;
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, [load]);

  const message = error
    ? tr("loadError")
    : !campaigns
      ? tr("loading")
      : campaigns.length === 0
        ? tr("noCampaigns")
        : null;

  if (message) {
    return (
      <div
        dir={locale === "ar" ? "rtl" : "ltr"}
        className={`${tajawal.className} flex min-h-screen items-center justify-center`}
        style={{ background: t.page, color: t.sub }}
      >
        <p className="text-[13px]">{message}</p>
      </div>
    );
  }

  return <BudgetContent campaigns={campaigns} onRefresh={load} />;
}
