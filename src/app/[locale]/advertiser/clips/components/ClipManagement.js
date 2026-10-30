"use client";
import { useMemo, useRef, useState, useEffect } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useTheme } from "@/context/ThemeContext";
import {
  MdSearch,
  MdOutlineExpandMore,
  MdCheckCircle,
  MdOutlineViewModule,
  MdOutlineViewList,
  MdOutlineCampaign,
  MdOutlinePendingActions,
  MdOutlineTaskAlt,
  MdOutlineVerified,
  MdOutlineNotificationsActive,
  MdOutlineEnhancedEncryption,
  MdOutlineTrendingUp,
  MdOutlineAccessTime,
  MdOutlineShield,
  MdOutlineArrowBack,
  MdOutlineArrowForward,
  MdChevronLeft,
  MdChevronRight,
} from "react-icons/md";

const PAGE_SIZE = 6;
const MINT = "#94D3C1";

/* ───────────── بيانات تجريبية (استبدلها بالـ API) ───────────── */
// pendingClips = مقاطع جديدة بانتظار المراجعة، deliveredClips = كل المقاطع المسلّمة
const MOCK_CAMPAIGNS = [
  { id: "ACAM-2026-038", image: "", brand: { ar: "مؤسسة الذهب العالمية المالية", en: "Global Gold Financial" }, title: { ar: "حملة تطبيق الذهب الرقمي الذكي", en: "Smart Digital Gold App Campaign" }, deliveredClips: 9, pendingClips: 9, cpm: 8.0, views: 710650, escrow: 24500, createdAt: "2026-09-28" },
  { id: "ACAM-2026-054", image: "", brand: { ar: "دار الأزياء الراقية", en: "Haute Couture House" }, title: { ar: "حملة أزياء صيف الدانة الراقية", en: "Al-Dana Summer Fashion Campaign" }, deliveredClips: 11, pendingClips: 11, cpm: 7.2, views: 142800, escrow: 12400, createdAt: "2026-10-02" },
  { id: "ACAM-2026-061", image: "", brand: { ar: "شركة عطور الأصالة الطبيعية", en: "Al-Asala Natural Perfumes" }, title: { ar: "حملة عطر مسك الأصيل 2026", en: "Original Musk Perfume 2026" }, deliveredClips: 14, pendingClips: 14, cpm: 6.5, views: 184320, escrow: 8500, createdAt: "2026-10-05" },
  { id: "ACAM-2026-027", image: "", brand: { ar: "توافل لنقل السفر الذكية", en: "Tawafel Smart Travel" }, title: { ar: "حملة حقائب السفر الذكية", en: "Smart Travel Bags Campaign" }, deliveredClips: 16, pendingClips: 0, cpm: 6.0, views: 245190, escrow: 16000, createdAt: "2026-09-12" },
  { id: "ACAM-2026-035", image: "", brand: { ar: "مجوهرات النخبة السياسية", en: "Elite Jewelry" }, title: { ar: "حملة ساعات النخبة الماسية", en: "Elite Diamond Watches Campaign" }, deliveredClips: 18, pendingClips: 0, cpm: 9.5, views: 312190, escrow: 18900, createdAt: "2026-09-18" },
  { id: "ACAM-2026-052", image: "", brand: { ar: "مطاعم القمة المتخصصة", en: "Al-Qimma Restaurants" }, title: { ar: "حملة قهوة البن الخولاني الفاخر", en: "Premium Khawlani Coffee Campaign" }, deliveredClips: 8, pendingClips: 8, cpm: 5.5, views: 95400, escrow: 6200, createdAt: "2026-10-08" },
];

const MOCK_STATS = {
  activeCampaigns: 6,
  deliveryRate: 94, // معدل التسليم %
  pendingClips: 42,
  pendingCampaigns: 4, // عدد الحملات المعنية بالمراجعة
  approvedClips: 128,
  weeklyGrowth: 18, // نمو الأسبوع %
  reservedBudget: 86500,
  securedPercent: 100, // نسبة المؤمّن %
};

/* ───────────── مساعدات ───────────── */
const pick = (v, locale) =>
  v && typeof v === "object" ? v[locale] ?? v.ar ?? v.en ?? "" : v ?? "";

const num = (n) => Number(n).toLocaleString("en-US");

function pageList(current, totalPages) {
  if (totalPages <= 5) return Array.from({ length: totalPages }, (_, i) => i + 1);
  const list = [1];
  if (current > 3) list.push("…");
  for (let p = Math.max(2, current - 1); p <= Math.min(totalPages - 1, current + 1); p++) list.push(p);
  if (current < totalPages - 2) list.push("…");
  list.push(totalPages);
  return list;
}

/* ───────────── قائمة منسدلة (fixed + clamp) ───────────── */
function SortDropdown({ t, label, options, value, onChange, isRtl, width = "16rem" }) {
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
    setPos({ top: rect.bottom + 6, left: Math.max(8, Math.min(preferred, vw - w - 8)), width: w });
    setOpen(true);
  };

  return (
    <div className="relative min-w-0">
      <button
        ref={btnRef}
        type="button"
        onClick={toggle}
        className={`flex h-11 w-full items-center gap-2 rounded-xl border px-3 text-xs font-medium transition-all hover:border-[#94D3C1] sm:w-auto ${t.field} ${t.text}`}
      >
        <span className="flex-1 truncate text-start">{label}</span>
        <MdOutlineExpandMore size={18} className={`shrink-0 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div
            ref={panelRef}
            className={`fixed z-50 flex flex-col gap-1 rounded-xl border p-1.5 shadow-2xl ${t.card} ${t.border}`}
            style={{ top: pos.top, left: pos.left, width: pos.width }}
          >
            {options.map((o) => {
              const on = value === o.value;
              return (
                <button
                  key={o.value}
                  type="button"
                  onClick={() => {
                    onChange(o.value);
                    setOpen(false);
                  }}
                  className={`flex w-full items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-start text-[11px] transition-colors ${
                    on ? "bg-[#94D3C1]/15 font-bold text-[#94D3C1]" : `${t.subText} hover:bg-[#94D3C1]/10`
                  }`}
                >
                  <span className="flex-1">{o.label}</span>
                  {on && <MdCheckCircle size={18} className="shrink-0" />}
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

/* ───────────── كارد إحصائية ───────────── */
function StatCard({
  t,
  icon: Icon,
  label,
  value,
  valueColor,
  suffix,
  suffixColor,
  footerIcon: FooterIcon,
  footer,
  footerEnd,
  footerEndColor,
}) {
  return (
    <div className={`flex flex-col gap-3 rounded-xl border p-4 ${t.card} ${t.border}`}>
      {/* الأعلى: الأيقونة + التسمية والقيمة */}
      <div className="flex items-center gap-3">
        <span
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border ${t.field}`}
        >
          <Icon size={22} color={MINT} />
        </span>

        <div className="min-w-0 flex-1">
          <p className={`truncate text-[11px] ${t.subText}`}>{label}</p>
          <p className="mt-0.5 flex items-baseline gap-2">
            <span
              className={`text-2xl font-extrabold leading-none ${valueColor ? "" : t.text}`}
              style={valueColor ? { color: valueColor } : undefined}
            >
              {value}
            </span>
            {suffix && (
              <span className="text-[11px] font-medium" style={{ color: suffixColor || MINT }}>
                {suffix}
              </span>
            )}
          </p>
        </div>
      </div>

      {/* الفاصل */}
      <div className={`border-t ${t.border}`} />

      {/* الأسفل: نص مميّز + نص ثانوي */}
      <div className="flex items-center justify-between gap-2 text-[11px]">
        <span className="inline-flex min-w-0 items-center gap-1.5 font-medium" style={{ color: MINT }}>
          {FooterIcon && <FooterIcon size={14} className="shrink-0" />}
          <span className="truncate">{footer}</span>
        </span>
        <span
          className={`shrink-0 ${footerEndColor ? "font-bold" : t.subText}`}
          style={footerEndColor ? { color: footerEndColor } : undefined}
        >
          {footerEnd}
        </span>
      </div>
    </div>
  );
}

/* ───────────── كارد الحملة ───────────── */
function ClipCampaignCard({ t, s, c, locale, isDark, isRtl, listView, href }) {
  const Arrow = isRtl ? MdOutlineArrowBack : MdOutlineArrowForward;
  const hasPending = c.pendingClips > 0;

  return (
    <article
      className={`flex overflow-hidden rounded-2xl border ${t.card} ${t.border} ${
        listView ? "flex-col sm:flex-row" : "flex-col"
      }`}
      style={{ boxShadow: isDark ? "none" : "0 1px 3px rgba(0,0,0,0.08)" }}
    >
      {/* الصورة */}
      <div
        className={`relative shrink-0 overflow-hidden ${listView ? "h-44 sm:h-auto sm:min-h-44 sm:w-60" : "h-44"}`}
        style={{ background: "linear-gradient(135deg,#12332B 0%,#0B1F19 60%,#1A1A1A 100%)" }}
      >
        {/* الصورة تملأ الكارد كله، وكل الشارات فوقها */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={c.image || "/images/img-clipManagement.png"}
          alt=""
          className="absolute inset-0 h-full w-full object-cover object-center"
        />

        {/* شارة المراجعة: أعلى اليسار */}
        <span
          className="absolute left-3 top-3 z-10 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold backdrop-blur"
          style={
            hasPending
              ? { background: "rgba(148,211,193,0.92)", color: "#0B1F19" }
              : { background: "rgba(40,42,43,0.85)", color: "#D4D4D4" }
          }
        >
          {hasPending ? <MdOutlinePendingActions size={13} /> : <MdOutlineTaskAlt size={13} />}
          {hasPending ? s.newForReview(c.pendingClips) : s.fullyReviewed}
        </span>

        {/* رمز الحملة: أسفل اليمين فوق الصورة */}
        <span
          dir="ltr"
          className="absolute bottom-3 right-3 z-10 rounded-lg px-2.5 py-1 text-[10px] font-bold tracking-wide text-white"
          style={{ background: "rgba(0,0,0,0.75)" }}
        >
          #{String(c.id).replace(/^#/, "")}
        </span>
      </div>

      {/* المحتوى */}
      <div className="flex min-w-0 flex-1 flex-col gap-3 p-4">
        <div className="flex flex-col gap-1">
          <p className="flex items-center gap-1.5 text-[11px]" style={{ color: MINT }}>
            <MdOutlineVerified size={14} className="shrink-0" />
            <span className="truncate">{pick(c.brand, locale)}</span>
          </p>
          <h3 className={`text-base font-extrabold leading-snug ${t.text}`}>{pick(c.title, locale)}</h3>
        </div>

        <div className={`flex items-center justify-between rounded-lg px-3 py-2 text-[11px] ${isDark ? "bg-white/[0.04]" : "bg-black/[0.03]"}`}>
          <span className={t.subText}>{s.deliveredClips}</span>
          <span className={`font-bold ${t.text}`}>{c.deliveredClips}</span>
        </div>

        <div className="grid grid-cols-2 gap-3 text-[11px]">
          <div>
            <p className={t.subText}>{s.verifiedViews}</p>
            <p className={`mt-0.5 font-bold ${t.text}`}>{num(c.views)}</p>
          </div>
          <div>
            <p className={t.subText}>{s.cpmRate}</p>
            <p className="mt-0.5 font-bold" style={{ color: "#E9C349" }}>
              {c.cpm.toFixed(2)} <span className="text-[10px] font-medium">{s.currency}</span>
            </p>
          </div>
        </div>

        <div className={`border-t pt-3 ${t.border}`}>
          <p className={`text-[11px] ${t.subText}`}>{s.escrowRemaining}</p>
          <p className="mt-0.5 text-sm font-extrabold" style={{ color: MINT }}>
            {num(c.escrow)} <span className="text-[10px] font-medium">{s.currency}</span>
          </p>
        </div>

        <Link
          href={href}
          className="mt-auto flex h-11 items-center justify-center gap-2 rounded-xl text-xs font-bold text-white transition-opacity hover:opacity-90"
          style={{ background: "linear-gradient(90deg, #FFA600, #FF4B04)" }}
        >
          <span>{s.reviewClips(c.deliveredClips)}</span>
          <Arrow size={16} />
        </Link>
      </div>
    </article>
  );
}

/* ───────────── الصفحة ───────────── */
export default function ClipManagement({
  campaigns = MOCK_CAMPAIGNS,
  stats = MOCK_STATS,
  // صفحة مراجعة المقاطع تفتح داخل قسم "التقارير والتحليلات"
  // المسار: app/[locale]/advertiser/analytics/clips/[id]/page.js
  getCampaignHref = (c) => `/advertiser/analytics/clips/campaign/${c.id}`,
}) {
  const { isDark } = useTheme();
  const locale = useLocale();
  const tr = useTranslations("clipManagement");
  const isRtl = locale === "ar";

  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("mostPending");
  const [view, setView] = useState("grid");
  const [page, setPage] = useState(1);

  const t = {
    card: isDark ? "bg-[#111111]" : "bg-white",
    border: isDark ? "border-[#1E2D3D]" : "border-[#E2E8F0]",
    field: isDark ? "bg-[#1A1A1A] border-[#2D2D2D]" : "bg-white border-[#E2E8F0]",
    text: isDark ? "text-white" : "text-[#0F172A]",
    subText: isDark ? "text-[#9A9A9A]" : "text-[#64748B]",
  };

  const s = {
    newForReview: (n) => tr("newForReview", { count: n }),
    reviewClips: (n) => tr("reviewClips", { count: n }),
    fullyReviewed: tr("fullyReviewed"),
    deliveredClips: tr("deliveredClips"),
    verifiedViews: tr("verifiedViews"),
    cpmRate: tr("cpmRate"),
    escrowRemaining: tr("escrowRemaining"),
    currency: tr("currency"),
  };

  const sortOptions = [
    { value: "mostPending", label: tr("sort.mostPending") },
    { value: "newest", label: tr("sort.newest") },
    { value: "highestBudget", label: tr("sort.highestBudget") },
    { value: "mostViews", label: tr("sort.mostViews") },
  ];

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = campaigns.filter((c) => {
      if (!q) return true;
      const hay = [c.id, ...Object.values(c.title ?? {}), ...Object.values(c.brand ?? {})]
        .join(" ")
        .toLowerCase();
      return hay.includes(q);
    });
    const by = {
      mostPending: (a, b) => b.pendingClips - a.pendingClips,
      newest: (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
      highestBudget: (a, b) => b.escrow - a.escrow,
      mostViews: (a, b) => b.views - a.views,
    }[sort];
    return [...list].sort(by);
  }, [campaigns, query, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const visible = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const [PrevIcon, NextIcon] = isRtl ? [MdChevronRight, MdChevronLeft] : [MdChevronLeft, MdChevronRight];
  const listView = view === "list";

  return (
    <div
      dir={isRtl ? "rtl" : "ltr"}
      className="mx-auto flex w-full max-w-7xl flex-col gap-5 p-4 sm:p-6"
      style={{ fontFamily: "var(--font-tajawal), sans-serif" }}
    >
      {/* العنوان */}
      <header>
        <h1 className={`text-2xl font-extrabold ${t.text}`}>{tr("title")}</h1>
        <p className={`mt-1 max-w-3xl text-xs leading-relaxed ${t.subText}`}>{tr("subtitle")}</p>
      </header>

      {/* الإحصائيات */}
      <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          t={t}
          icon={MdOutlineCampaign}
          label={tr("stats.activeCampaigns")}
          value={stats.activeCampaigns}
          suffix={tr("stats.activeSuffix")}
          footerIcon={MdOutlineTrendingUp}
          footer={tr("stats.activeFooter", { percent: stats.deliveryRate })}
          footerEnd={tr("stats.activeFooterEnd")}
        />
        <StatCard
          t={t}
          icon={MdOutlineNotificationsActive}
          label={tr("stats.pendingClips")}
          value={stats.pendingClips}
          valueColor={MINT}
          suffix={tr("stats.pendingSuffix")}
          footerIcon={MdOutlineAccessTime}
          footer={tr("stats.pendingFooter")}
          footerEnd={tr("stats.pendingFooterEnd", { count: stats.pendingCampaigns })}
        />
        <StatCard
          t={t}
          icon={MdOutlineVerified}
          label={tr("stats.approvedClips")}
          value={stats.approvedClips}
          suffix={tr("stats.approvedSuffix")}
          footerIcon={MdOutlineTaskAlt}
          footer={tr("stats.approvedFooter")}
          footerEnd={tr("stats.approvedFooterEnd", { percent: stats.weeklyGrowth })}
        />
        <StatCard
          t={t}
          icon={MdOutlineEnhancedEncryption}
          label={tr("stats.reservedBudget")}
          value={num(stats.reservedBudget)}
          suffix={tr("currency")}
          suffixColor="#9A9A9A"
          footerIcon={MdOutlineShield}
          footer={tr("stats.reservedFooter")}
          footerEnd={tr("stats.reservedFooterEnd", { percent: stats.securedPercent })}
          footerEndColor="#E9C349"
        />
      </section>

      {/* الأدوات */}
      <section className={`flex flex-col gap-3 rounded-2xl border p-3 sm:flex-row sm:items-center ${t.card} ${t.border}`}>
        <label className={`flex h-11 min-w-0 flex-1 items-center gap-2 rounded-xl border px-3 focus-within:border-[#94D3C1] ${t.field}`}>
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

        <SortDropdown
          t={t}
          isRtl={isRtl}
          label={`${tr("sortBy")} ${sortOptions.find((o) => o.value === sort)?.label}`}
          options={sortOptions}
          value={sort}
          onChange={(v) => {
            setSort(v);
            setPage(1);
          }}
        />

        <div className={`flex h-11 shrink-0 items-center gap-1 self-start rounded-xl border p-1 ${t.field}`}>
          {[
            { v: "grid", Icon: MdOutlineViewModule, label: tr("viewGrid") },
            { v: "list", Icon: MdOutlineViewList, label: tr("viewList") },
          ].map(({ v, Icon, label }) => (
            <button
              key={v}
              type="button"
              aria-label={label}
              aria-pressed={view === v}
              onClick={() => setView(v)}
              className="flex h-8 w-8 items-center justify-center rounded-lg transition-colors"
              style={
                view === v
                  ? { background: "linear-gradient(90deg, #FFA600, #FF4B04)", color: "#FFFFFF" }
                  : { color: "#9A9A9A" }
              }
            >
              <Icon size={18} />
            </button>
          ))}
        </div>
      </section>

      {/* الكاردات */}
      {visible.length === 0 ? (
        <div className={`rounded-2xl border p-10 text-center text-sm ${t.card} ${t.border} ${t.subText}`}>
          {tr("empty")}
        </div>
      ) : (
        <div className={listView ? "flex flex-col gap-4" : "grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3"}>
          {visible.map((c) => (
            <ClipCampaignCard
              key={c.id}
              t={t}
              s={s}
              c={c}
              locale={locale}
              isDark={isDark}
              isRtl={isRtl}
              listView={listView}
              href={getCampaignHref(c)}
            />
          ))}
        </div>
      )}

      {/* الترقيم: يظهر فقط لما يكون في حملات */}
      {filtered.length > 0 && (
        <nav
          aria-label="pagination"
          className={`flex flex-col gap-3 rounded-2xl border px-4 py-3 sm:flex-row sm:items-center sm:justify-between ${t.card} ${t.border}`}
        >
          <p className={`text-xs ${t.subText}`}>{tr("showing", { shown: visible.length, total: filtered.length })}</p>

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
                <span key={`dots-${i}`} className={`px-1 text-xs ${t.subText}`}>…</span>
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
    </div>
  );
}