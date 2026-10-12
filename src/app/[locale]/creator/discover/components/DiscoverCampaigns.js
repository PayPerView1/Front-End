"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useTheme } from "@/context/ThemeContext";
import {
  MdSearch,
  MdClose,
  MdOutlineSort,
  MdOutlineExpandMore,
  MdFavorite,
  MdCheckCircle,
  MdFavoriteBorder,
  MdVerified,
  MdOutlineLocationOn,
  MdOutlineVideoLibrary,
  MdOutlineMusicNote,
  MdOutlineInfo,
  MdSend,
  MdChevronLeft,
  MdChevronRight,
  MdOutlineGavel,
  MdOutlineMenuBook,
  MdContentCut,
  MdOutlinePeopleAlt,
  MdOutlineSlideshow,
  MdMic,
  MdOutlineCategory,
  MdOutlineApps,
  MdOutlineNotificationsActive,
} from "react-icons/md";
import { FaInstagram, FaFacebookF, FaTiktok, FaYoutube } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import ApplyConfirmModal from "../[id]/components/ApplyConfirmModal";
import ApplyAlreadyModal from "../[id]/components/ApplyAlreadyModal";

const TYPE_ICONS = {
  ALL: MdOutlineApps,
  CLIPPING: MdContentCut,
  UGC: MdOutlinePeopleAlt,
  SLIDESHOW: MdOutlineSlideshow,
  AUDIO: MdMic,
};

const PLATFORM_ICONS = {
  instagram: { icon: FaInstagram, color: "#E1306C" },
  facebook: { icon: FaFacebookF, color: "#1877F2" },
  tiktok: { icon: FaTiktok, color: "#FFFFFF" },
  youtube: { icon: FaYoutube, color: "#FF0000" },
  x: { icon: FaXTwitter, color: "#E7E9EA" },
};

const ORANGE = "linear-gradient(90deg, #FFA600, #FF4B04)";
const PAGE_SIZE = 3;

// ── الدول: أكواد ISO + أسماء من Intl + أعلام صور (إيموجي الأعلام ما بتظهر بويندوز) ──
const COUNTRY_CODES =
  "AD AE AF AG AI AL AM AO AQ AR AS AT AU AW AX AZ BA BB BD BE BF BG BH BI BJ BL BM BN BO BQ BR BS BT BV BW BY BZ CA CC CD CF CG CH CI CK CL CM CN CO CR CU CV CW CX CY CZ DE DJ DK DM DO DZ EC EE EG EH ER ES ET FI FJ FK FM FO FR GA GB GD GE GF GG GH GI GL GM GN GP GQ GR GS GT GU GW GY HK HM HN HR HT HU ID IE IL IM IN IO IQ IR IS IT JE JM JO JP KE KG KH KI KM KN KP KR KW KY KZ LA LB LC LI LK LR LS LT LU LV LY MA MC MD ME MF MG MH MK ML MM MN MO MP MQ MR MS MT MU MV MW MX MY MZ NA NC NE NF NG NI NL NO NP NR NU NZ OM PA PE PF PG PH PK PL PM PN PR PS PT PW PY QA RE RO RS RU RW SA SB SC SD SE SG SH SI SJ SK SL SM SN SO SR SS ST SV SX SY SZ TC TD TF TG TH TJ TK TL TM TN TO TR TT TV TW TZ UA UG UM US UY UZ VA VC VE VG VI VN VU WF WS YE YT ZA ZM ZW".split(
    " ",
  );

const makeCountryName = (locale) => {
  let dn = null;
  try {
    dn = new Intl.DisplayNames([locale], { type: "region" });
  } catch {}
  return (code) => dn?.of(code) || code;
};

function Flag({ code }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`https://flagcdn.com/w40/${String(code).toLowerCase()}.png`}
      alt=""
      width={18}
      height={13}
      loading="lazy"
      className="inline-block h-[13px] w-[18px] shrink-0 rounded-[2px] object-cover"
    />
  );
}

// ── بيانات تجريبية: استبدلها بنتيجة الـ API ─────────────────────────────────
const MOCK_CAMPAIGNS = [
  {
    id: "c1",
    brand: "الزهرة للتمويل والاستثمار",
    title: "قص ونشر مقاطع توعوية عن الاستثمار الآمن",
    desc: "استعراض مقاطع تشويقية من بودكاست الاستثمار الآمن، مع إضافة نصوص تفاعلية ومؤثرات صوتية نقية خالية من المعازف.",
    type: "CLIPPING",
    cover: null,
    gradient: "linear-gradient(135deg,#0f2b3d,#0b1620)",
    countries: ["SA", "AE"],
    materials: ["14 مقطع خام 4K", "صوتيات حلال"],
    platforms: ["instagram", "facebook", "tiktok", "youtube", "x"],
    cpm: 12,
    remaining: 4800,
    total: 10000,
    createdAt: "2026-09-28",
    endsAt: "2026-11-20",
    relevance: 92,
  },
  {
    id: "c2",
    brand: "المروج للأزياء المحتشمة",
    title: "مراجعات وتجارب تصوير إطلالات العيد",
    desc: "استعراض وتنسيق العبايات والفساتين الراقية بأسلوب راقٍ، مع إبراز جودة الأقمشة الفاخرة.",
    type: "UGC",
    cover: null,
    gradient: "linear-gradient(135deg,#3b2f1a,#14100a)",
    countries: ["SA", "AE"],
    materials: ["14 مقطع خام 4K", "صوتيات حلال"],
    platforms: ["instagram", "facebook", "tiktok"],
    cpm: 1,
    remaining: 4800,
    total: 10000,
    createdAt: "2026-09-25",
    endsAt: "2026-10-30",
    relevance: 88,
  },
  {
    id: "c3",
    brand: "منصة وفر للادخار بالذهب",
    title: "تصميم ومونتاج مقاطع تشويقية لتطبيق الادخار",
    desc: "مونتاج لقطات شاشة التطبيق وإبراز ميزات الادخار الآلي للسبائك الذهبية والفضية بأسلوب عصري وسريع ومتقن.",
    type: "SLIDESHOW",
    cover: null,
    gradient: "linear-gradient(135deg,#1c2a24,#0b0f0d)",
    countries: ["SA", "AE"],
    materials: ["14 مقطع خام 4K", "صوتيات حلال"],
    platforms: ["instagram", "facebook", "tiktok"],
    cpm: 1,
    remaining: 4800,
    total: 10000,
    createdAt: "2026-09-20",
    endsAt: "2026-12-05",
    relevance: 75,
  },
  {
    id: "c4",
    brand: "بيت العود",
    title: "تعليق صوتي لإعلانات العطور الشرقية",
    desc: "تسجيل تعليق صوتي هادئ يعرّف بباقة العطور الطبيعية الخالية من الكحول.",
    type: "AUDIO",
    cover: null,
    gradient: "linear-gradient(135deg,#33201a,#120a07)",
    countries: ["KW"],
    materials: ["نص جاهز", "صوتيات حلال"],
    platforms: ["instagram", "tiktok"],
    cpm: 3,
    remaining: 2200,
    total: 4000,
    createdAt: "2026-09-18",
    endsAt: "2026-10-18",
    relevance: 81,
  },
  {
    id: "c5",
    brand: "زاد المسلم",
    title: "مقاطع قصيرة للترويج لتطبيق الأذكار",
    desc: "قص مقاطع من محتوى التطبيق وإبراز مزايا التذكير بالأذكار اليومية.",
    type: "CLIPPING",
    cover: null,
    gradient: "linear-gradient(135deg,#102a2a,#081212)",
    countries: ["SA", "EG"],
    materials: ["9 مقاطع خام HD", "صوتيات حلال"],
    platforms: ["tiktok", "youtube"],
    cpm: 2,
    remaining: 900,
    total: 2000,
    createdAt: "2026-09-12",
    endsAt: "2026-11-02",
    relevance: 69,
  },
  {
    id: "c6",
    brand: "مخبز السنابل",
    title: "تجربة المنتجات الصحية: محتوى UGC",
    desc: "تصوير تجربة تذوق للمنتجات الصحية بأسلوب عفوي وصادق.",
    type: "UGC",
    cover: null,
    gradient: "linear-gradient(135deg,#3a2a12,#120d05)",
    countries: ["AE"],
    materials: ["دليل التصوير", "صوتيات حلال"],
    platforms: ["instagram", "tiktok", "youtube"],
    cpm: 4,
    remaining: 3100,
    total: 5000,
    createdAt: "2026-09-08",
    endsAt: "2026-12-20",
    relevance: 64,
  },
];

// ── أدوات صغيرة ─────────────────────────────────────────────────────────────
const money = (n) => `$${Number(n).toLocaleString("en-US")}`;

function pageList(current, totalPages) {
  if (totalPages <= 5)
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  const list = [1];
  if (current > 3) list.push("…");
  for (
    let p = Math.max(2, current - 1);
    p <= Math.min(totalPages - 1, current + 1);
    p++
  ) {
    list.push(p);
  }
  if (current < totalPages - 2) list.push("…");
  list.push(totalPages);
  return list;
}

function Dropdown({
  t,
  icon: Icon,
  width = "17rem",
  listHeight = "max-h-60",
  label,
  options,
  value,
  onChange,
  isRtl,
  title,
  meta,
  searchable = false,
  searchPlaceholder,
  emptyLabel,
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const btnRef = useRef(null);
  const panelRef = useRef(null);
  const [pos, setPos] = useState({ top: 0, left: 0, width: 0 });

  const close = () => {
    setOpen(false);
    setQuery("");
  };

  // القائمة fixed: نسكرها عند السكرول (برا القائمة) أو تغيير حجم الشاشة
  useEffect(() => {
    if (!open) return;
    const onMove = (e) => {
      if (e?.target && panelRef.current?.contains(e.target)) return;
      setOpen(false);
      setQuery("");
    };
    window.addEventListener("scroll", onMove, true);
    window.addEventListener("resize", onMove);
    return () => {
      window.removeEventListener("scroll", onMove, true);
      window.removeEventListener("resize", onMove);
    };
  }, [open]);

  const toggle = () => {
    if (open) return close();
    const rect = btnRef.current?.getBoundingClientRect();
    if (!rect) return setOpen(true);

    const vw = window.innerWidth;
    const w = Math.min(parseFloat(width) * 16, vw - 16);
    // محاذاة حسب اتجاه اللغة، مع منع الخروج من حدود الشاشة
    const preferred = isRtl ? rect.right - w : rect.left;
    const left = Math.max(8, Math.min(preferred, vw - w - 8));

    setPos({ top: rect.bottom + 6, left, width: w });
    setOpen(true);
  };

  const q = query.trim().toLowerCase();
  const shown =
    searchable && q
      ? options.filter((o) => o.label.toLowerCase().includes(q))
      : options;

  return (
    <div className="relative">
      <button
        ref={btnRef}
        type="button"
        onClick={toggle}
        className={`flex h-11 w-full items-center gap-2 rounded-xl border px-3 text-xs font-medium transition-all hover:border-[#94D3C1] sm:w-auto ${t.field} ${t.text}`}
      >
        {Icon && <Icon size={16} className="shrink-0" />}
        <span className="flex-1 whitespace-nowrap text-start">{label}</span>
        <MdOutlineExpandMore
          size={18}
          className={`shrink-0 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={close} />
          <div
            ref={panelRef}
            className={`fixed z-50 rounded-xl border p-1.5 shadow-2xl ${t.card} ${t.border}`}
            style={{ top: pos.top, left: pos.left, width: pos.width }}
          >
            {title && (
              <div className="flex items-center justify-between gap-2 px-2 pb-1 pt-0 text-[10px]">
                <span className={t.subText}>{title}</span>
                {meta && (
                  <span className="font-bold text-[#94D3C1]">{meta}</span>
                )}
              </div>
            )}

            {searchable && (
              <label
                className={`mb-1.5 flex items-center gap-2 rounded-lg border px-2.5 py-1.5 focus-within:border-[#94D3C1] ${t.field}`}
              >
                <MdSearch size={14} color="#9A9A9A" className="shrink-0" />
                <input
                  autoFocus
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={searchPlaceholder}
                  className={`min-w-0 flex-1 bg-transparent text-[11px] outline-none placeholder-[#9A9A9A] ${t.text}`}
                />
              </label>
            )}

            <div
              className={`flex ${listHeight} flex-col gap-1 overflow-y-auto`}
            >
              {shown.length === 0 && (
                <p className={`px-3 py-4 text-center text-[11px] ${t.subText}`}>
                  {emptyLabel}
                </p>
              )}
              {shown.map((o) => {
                const on = value === o.value;
                return (
                  <button
                    key={o.value}
                    type="button"
                    onClick={() => {
                      onChange(o.value);
                      close();
                    }}
                    className={`flex w-full items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-start text-[11px] transition-colors ${
                      on
                        ? "bg-[#94D3C1]/15 font-bold text-[#94D3C1]"
                        : `${t.subText} hover:bg-[#94D3C1]/10`
                    }`}
                  >
                    {o.code && <Flag code={o.code} />}
                    <span className="flex-1">{o.label}</span>
                    {on && <MdCheckCircle size={18} className="shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function CampaignCard({
  t, s, c, isDark, countryName, favorite, onToggleFav, onApply, onDetails, applied,
}) {
  const pct = c.total > 0 ? Math.round((c.remaining / c.total) * 100) : 0;

  return (
    <article
      className={`flex min-w-0 flex-col overflow-hidden rounded-2xl border ${t.card} ${t.border}`}
      style={{ boxShadow: isDark ? "none" : "0 1px 3px rgba(0,0,0,0.08)" }}
    >
      {/* الغلاف */}
      <div className="relative h-40 w-full bg-black">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={c.cover || "/images/image.png"}
          alt={c.title}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        <button
          type="button"
          aria-label={s("favorite")}
          aria-pressed={favorite}
          onClick={() => onToggleFav(c.id)}
          className="absolute end-3 top-3 flex h-8 w-8 items-center justify-center rounded-lg border border-white/15 bg-black/40 text-white backdrop-blur transition-colors hover:bg-black/60"
        >
          {favorite ? (
            <MdFavorite size={16} color="#F87171" />
          ) : (
            <MdFavoriteBorder size={16} />
          )}
        </button>
      </div>

      {/* المحتوى */}
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex items-center gap-1.5 text-[11px] font-medium text-[#94D3C1]">
          <MdVerified size={14} className="shrink-0" />
          <span className="truncate">{c.brand}</span>
        </div>

        <h3 className={`text-base font-bold leading-snug ${t.text}`}>
          {c.title}
        </h3>
        <p className={`text-xs leading-5 ${t.subText}`}>{c.desc}</p>

        <div className="flex flex-col gap-2 text-xs">
          <div className="flex items-start gap-2">
            <span
              className={`flex w-16 shrink-0 items-center gap-1 ${t.subText}`}
            >
              <MdOutlineLocationOn size={14} />
              {s("countries")}
            </span>
            <span className={`flex flex-wrap gap-x-3 gap-y-1 ${t.text}`}>
              {c.countries.map((code) => (
                <span key={code} className="inline-flex items-center gap-1.5">
                  <Flag code={code} />
                  {countryName(code)}
                </span>
              ))}
            </span>
          </div>

          <div className="flex items-start gap-2">
            <span
              className={`flex w-16 shrink-0 items-center gap-1 ${t.subText}`}
            >
              <MdOutlineVideoLibrary size={14} />
              {s("materials")}
            </span>
            <span className={`flex flex-wrap gap-x-3 gap-y-1 ${t.text}`}>
              <span className="inline-flex items-center gap-1">
                <MdOutlineVideoLibrary size={13} className="text-[#94D3C1]" />
                {c.materials[0]}
              </span>
              {c.materials[1] && (
                <span className="inline-flex items-center gap-1">
                  <MdOutlineMusicNote size={13} className="text-[#E9C349]" />
                  {c.materials[1]}
                </span>
              )}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`flex w-16 shrink-0 items-center gap-1 ${t.subText}`}
            >
              <MdOutlineCategory size={14} />
              {s("platforms")}
            </span>
            <span className="flex items-center gap-2.5">
              {c.platforms.map((p) => {
                const cfg = PLATFORM_ICONS[p];
                if (!cfg) return null;
                const PIcon = cfg.icon;
                return (
                  <PIcon
                    key={p}
                    size={14}
                    color={p === "tiktok" && !isDark ? "#111111" : cfg.color}
                  />
                );
              })}
            </span>
          </div>
        </div>

        {/* العائد والميزانية */}
        <div className={`mt-auto border-t pt-3 ${t.border}`}>
          <div className="mb-2 flex items-center justify-between gap-2">
            <span className="text-lg font-extrabold text-[#E9C349]" dir="ltr">
              ${Number(c.cpm).toFixed(2)} / 1K
            </span>
            <span className={`text-[11px] ${t.subText}`}>
              {s("cpmLabel")}
            </span>
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
              style={{ width: `${pct}%`, background: "#94D3C1" }}
            />
          </div>

          <div
            className={`mt-1.5 flex items-center justify-between text-[11px] ${t.subText}`}
          >
            <span>
              {s("remaining")}{" "}
              <b dir="ltr" className={t.text}>
                {money(c.remaining)}
              </b>
            </span>
            <span>
              {s("total")}{" "}
              <b dir="ltr" className={t.text}>
                {money(c.total)}
              </b>
            </span>
          </div>
        </div>

        {/* الأزرار */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onApply(c)}
            className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-xl text-sm font-bold text-white transition-opacity hover:opacity-90"
  style={{ background: ORANGE }}
>
  {applied ? s("applied") : s("apply")}
  {!applied && <MdSend size={15} className="rtl:-scale-x-100" />}
</button>
<button
  type="button"
  aria-label={s("details")}
  title={s("details")}
  onClick={() => onDetails(c)}
  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border transition-all hover:border-[#94D3C1] ${t.field} ${t.subText}`}
>
  <MdOutlineInfo size={18} />
</button>
        </div>
      </div>
    </article>
  );
}

// ── الصفحة ──────────────────────────────────────────────────────────────────
export default function DiscoverCampaigns({ campaigns = MOCK_CAMPAIGNS }) {
  const { isDark } = useTheme();
  const locale = useLocale();
  const s = useTranslations("discover");
  const router = useRouter();
  const isRtl = locale === "ar";
  const types = s.raw("types");
  const sortLabels = s.raw("sort");

  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("newest");
  const [country, setCountry] = useState("ALL");
  const [type, setType] = useState("ALL");
  const [page, setPage] = useState(1);
  const [favorites, setFavorites] = useState(() => new Set());
  const [applyTarget, setApplyTarget] = useState(null);
  const [appliedIds, setAppliedIds] = useState(() => new Set());
  const [alreadyTarget, setAlreadyTarget] = useState(null);

  useEffect(() => {
    const savedIds = new Set();
    campaigns.forEach((campaign) => {
      try {
        if (
          window.localStorage.getItem(
            `ppv:applied-campaign:${campaign.id}`,
          )
        ) {
          savedIds.add(campaign.id);
        }
      } catch (error) {
        console.error(
          `Could not read application status for campaign ${campaign.id}:`,
          error,
        );
      }
    });
    setAppliedIds(savedIds);
  }, [campaigns]);

  const t = {
    bg: isDark ? "bg-[#0D0D0D]" : "bg-[#F0F2F5]",
    card: isDark ? "bg-[#111111]" : "bg-white",
    border: isDark ? "border-[#1E2D3D]" : "border-[#E2E8F0]",
    field: isDark
      ? "bg-[#1A1A1A] border-[#2D2D2D]"
      : "bg-white border-[#E2E8F0]",
    text: isDark ? "text-white" : "text-[#0F172A]",
    subText: isDark ? "text-[#9A9A9A]" : "text-[#64748B]",
  };

  // ── تصفية وترتيب ──
  const q = search.trim().toLowerCase();
  const matches = (c, ignoreType) =>
    (ignoreType || type === "ALL" || c.type === type) &&
    (country === "ALL" || c.countries.includes(country)) &&
    (!q ||
      c.brand.toLowerCase().includes(q) ||
      c.title.toLowerCase().includes(q) ||
      c.desc.toLowerCase().includes(q));

  const filtered = campaigns
    .filter((c) => matches(c, false))
    .sort((a, b) => {
      if (sort === "cpm") return b.cpm - a.cpm;
      if (sort === "endingSoon") {
        return (
          new Date(a.endsAt ?? "9999-12-31") -
          new Date(b.endsAt ?? "9999-12-31")
        );
      }
      if (sort === "relevance") return (b.relevance ?? 0) - (a.relevance ?? 0);
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const visible = filtered.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE,
  );

  // عدّادات التبويبات تتبع البحث والدولة
  const counts = { ALL: campaigns.filter((c) => matches(c, true)).length };
  Object.keys(types).forEach((k) => {
    if (k !== "ALL") {
      counts[k] = campaigns.filter(
        (c) => c.type === k && matches(c, true),
      ).length;
    }
  });

  const countryName = useMemo(() => makeCountryName(locale), [locale]);
  const countryOptions = useMemo(
    () => [
      { value: "ALL", label: s("allCountries") },
      ...COUNTRY_CODES.map((code) => ({
        value: code,
        code,
        label: countryName(code),
      })).sort((a, b) => a.label.localeCompare(b.label, locale)),
    ],
    [s, countryName, locale],
  );
  const selectedCountry = countryOptions.find((o) => o.value === country);
  const countryLabel =
    country === "ALL" || !selectedCountry ? (
      s("allCountries")
    ) : (
      <span className="inline-flex items-center gap-1.5">
        <Flag code={selectedCountry.code} />
        {selectedCountry.label}
      </span>
    );
  const sortOptions = Object.keys(sortLabels).map((value) => ({
    value,
    label: s(`sort.${value}`),
  }));

  // ── handlers ──
  const resetPage = () => setPage(1);
  const toggleFav = (id) =>
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  const handleApply = (c) => {
    try {
      const savedApplication = window.localStorage.getItem(
        `ppv:applied-campaign:${c.id}`,
      );
      if (savedApplication) {
        setAlreadyTarget({
          ...c,
          application: JSON.parse(savedApplication),
        });
        setAppliedIds((prev) => new Set(prev).add(c.id));
        return;
      }
    } catch (error) {
      console.error(`Could not read application for campaign ${c.id}:`, error);
    }
    setApplyTarget(c);
  };
  const handleDetails = (c) => router.push(`/${locale}/creator/discover/${c.id}`);

  const PrevIcon = isRtl ? MdChevronRight : MdChevronLeft;
  const NextIcon = isRtl ? MdChevronLeft : MdChevronRight;

  return (
    <div
      dir={isRtl ? "rtl" : "ltr"}
      className={`flex min-h-screen w-full min-w-0 flex-1 flex-col gap-6 p-4 sm:p-6 ${t.bg}`}
    >
      {/* الهيدر */}
      <header className="flex flex-col gap-2">
        <h1 className={`text-2xl font-bold sm:text-3xl ${t.text}`}>
          {s("title")}
        </h1>
        <p className={`max-w-3xl text-sm leading-6 ${t.subText}`}>
          {s("subtitle")}
        </p>
      </header>

      {/* البحث والفلاتر */}
      <section
        className={`flex flex-col gap-3 rounded-2xl border p-3 sm:p-4 ${t.card} ${t.border}`}
      >
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <label
            className={`flex h-11 min-w-0 flex-1 items-center gap-2 rounded-xl border px-3 transition-all focus-within:border-[#94D3C1] ${t.field}`}
          >
            <MdSearch size={18} color="#9A9A9A" className="shrink-0" />
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                resetPage();
              }}
              placeholder={s("searchPlaceholder")}
              className={`min-w-0 flex-1 bg-transparent text-sm outline-none placeholder-[#9A9A9A] ${t.text}`}
            />
            {search && (
              <button
                type="button"
                aria-label={s("clear")}
                onClick={() => {
                  setSearch("");
                  resetPage();
                }}
                className="shrink-0 text-[#9A9A9A] transition-colors hover:text-[#94D3C1]"
              >
                <MdClose size={16} />
              </button>
            )}
          </label>

          <div className="grid grid-cols-2 gap-3 lg:flex">
            <Dropdown
              t={t}
              icon={MdOutlineSort}
              label={s(`sort.${sort}`)}
              options={sortOptions}
              width="13rem"
              title={s("sortTitle")}
              meta={s("sortCount", { n: sortOptions.length })}
              value={sort}
              onChange={(v) => {
                setSort(v);
                resetPage();
              }}
              isRtl={isRtl}
            />
            <Dropdown
              t={t}
              width="14rem"
              listHeight="max-h-44"
              label={countryLabel}
              options={countryOptions}
              title={s("countryTitle")}
              meta={s("countryCount", { n: COUNTRY_CODES.length })}
              searchable
              searchPlaceholder={s("countrySearch")}
              emptyLabel={s("empty")}
              value={country}
              onChange={(v) => {
                setCountry(v);
                resetPage();
              }}
              isRtl={isRtl}
            />
          </div>
        </div>

        {/* تبويبات النوع */}
        <div className="flex flex-wrap items-center gap-2">
          {Object.keys(types).map((k) => {
            const TIcon = TYPE_ICONS[k];
            const on = type === k;
            return (
              <button
                key={k}
                type="button"
                onClick={() => {
                  setType(k);
                  resetPage();
                }}
                className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-bold transition-all ${
                  on
                    ? "border-transparent text-white"
                    : `${t.field} ${t.subText} hover:border-[#94D3C1]`
                }`}
                style={on ? { background: ORANGE } : undefined}
              >
                <TIcon size={14} color={on ? "#FFFFFF" : "#FE9400"} />
                {s(`types.${k}`)} ({counts[k]})
              </button>
            );
          })}
        </div>
      </section>

      {/* الكاردات أو الحالة الفارغة */}
      {visible.length === 0 ? (
        <div
          className={`flex flex-col items-center gap-5 rounded-2xl border px-6 py-14 text-center ${t.border}`}
          style={{ background: isDark ? "#191C1D" : "#FFFFFF" }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/img-campaings.png"
            alt=""
            className="h-28 w-28 object-contain sm:h-36 sm:w-36"
          />

          <h2 className={`text-xl font-bold sm:text-2xl ${t.text}`}>
            {s("emptyTitle")}
          </h2>

          <p className={`max-w-md text-xs leading-6 ${t.subText}`}>
            {s("emptyDesc")}
          </p>

          {/* TODO: اربط الزر بتفعيل الإشعارات */}
          <button
            type="button"
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl px-5 text-xs font-bold text-white transition-opacity hover:opacity-90"
            style={{ background: ORANGE }}
          >
            <MdOutlineNotificationsActive size={16} />
            {s("emptyNotify")}
          </button>

          <p className={`flex items-center gap-2 text-[10px] ${t.subText}`}>
            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#94D3C1]" />
            {s("emptyChecked")}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {visible.map((c) => (
            <CampaignCard
              key={c.id}
              t={t}
              s={s}
              c={c}
              isDark={isDark}
              countryName={countryName}
              favorite={favorites.has(c.id)}
              onToggleFav={toggleFav}
              onApply={handleApply}
  onDetails={handleDetails}
  applied={appliedIds.has(c.id)}
            />
          ))}
        </div>
      )}

      {/* الترقيم */}
      {filtered.length > 0 && (
        <nav
          aria-label={s("pagination")}
          className={`flex flex-col gap-3 rounded-2xl border px-4 py-3 sm:flex-row sm:items-center sm:justify-between ${t.card} ${t.border}`}
        >
          <p className={`text-xs ${t.subText}`}>
            {s("showing", { shown: visible.length, total: filtered.length })}
          </p>

          <div
            aria-disabled={totalPages <= 1}
            className={`flex items-center gap-1.5 transition-opacity ${
              totalPages <= 1 ? "pointer-events-none opacity-50" : ""
            }`}
          >
            <button
              type="button"
              aria-label={s("prev")}
              disabled={safePage <= 1}
              onClick={() => setPage(safePage - 1)}
              className={`flex h-8 w-8 items-center justify-center rounded-lg border transition-all hover:border-[#94D3C1] disabled:cursor-not-allowed disabled:opacity-40 ${t.field} ${t.text}`}
            >
              <PrevIcon size={18} />
            </button>

            {pageList(safePage, totalPages).map((p, i) =>
              p === "…" ? (
                <span key={`dots-${i}`} className={`px-1 text-xs ${t.subText}`}>
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
              aria-label={s("next")}
              disabled={safePage >= totalPages}
              onClick={() => setPage(safePage + 1)}
              className={`flex h-8 w-8 items-center justify-center rounded-lg border transition-all hover:border-[#94D3C1] disabled:cursor-not-allowed disabled:opacity-40 ${t.field} ${t.text}`}
            >
              <NextIcon size={18} />
            </button>
          </div>
        </nav>
      )}

      {/* ميثاق الإعلانات الحلال */}
      <section
        className="flex flex-col gap-4 rounded-2xl border p-4 sm:flex-row sm:items-center sm:p-5"
        style={{
          background: isDark
            ? "linear-gradient(90deg, rgba(0, 77, 64, 0.2) 0%, rgba(25, 28, 29, 1) 50%, rgba(40, 73, 67, 0.2) 100%)"
            : "linear-gradient(90deg, rgba(148,211,193,0.35), rgba(255,255,255,0.9))",
          borderColor: isDark
            ? "rgba(148,211,193,0.15)"
            : "rgba(28,107,88,0.25)",
        }}
      >
        <div
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
          style={{
            background: isDark
              ? "rgba(148,211,193,0.08)"
              : "rgba(28,107,88,0.15)",
          }}
        >
          <MdOutlineGavel size={22} color={isDark ? "#94D3C1" : "#1C6B58"} />
        </div>

        <div className="min-w-0 flex-1">
          <h2 className={`text-sm font-bold sm:text-base ${t.text}`}>
            {s("charterTitle")}
          </h2>
          <p className={`mt-1 text-xs leading-5 ${t.subText}`}>
            {s("charterDesc")}
          </p>
        </div>

        {/* TODO: اربط الزر بصفحة أو مودال الميثاق الشرعي */}
        <button
          type="button"
          className={`inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-xs font-bold transition-opacity hover:opacity-80 ${t.field} ${t.text}`}
          style={isDark ? { background: "rgba(40, 42, 43, 1)" } : undefined}
        >
          <MdOutlineMenuBook size={16} />
          {s("charterBtn")}
        </button>
      </section>
      <ApplyConfirmModal
  open={!!applyTarget}
  campaign={
    applyTarget && {
      id: applyTarget.id,
      name: applyTarget.title,
      brand: applyTarget.brand,
      cpm: applyTarget.cpm,
      platforms: applyTarget.platforms,
    }
  }
  onClose={() => setApplyTarget(null)}
  onConfirm={async () => {
    // TODO: ابعت طلب التقديم للـ API
    const application = {
      ref: `APP-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      campaignName: applyTarget.title,
      campaignCode: applyTarget.id,
      submittedAt: new Date().toISOString(),
      cpm: applyTarget.cpm,
    };
    window.localStorage.setItem(
      `ppv:applied-campaign:${applyTarget.id}`,
      JSON.stringify(application),
    );
    setAppliedIds((prev) => new Set(prev).add(applyTarget.id));
  }}
/>
      <ApplyAlreadyModal
        open={!!alreadyTarget}
        application={alreadyTarget?.application}
        onClose={() => setAlreadyTarget(null)}
        onExplore={() => setAlreadyTarget(null)}
        onViewOrders={() => {
          setAlreadyTarget(null);
          router.push(`/${locale}/creator/dashboard`);
        }}
      />
    </div>
  );
}