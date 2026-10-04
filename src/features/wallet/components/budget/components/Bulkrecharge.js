"use client";
import { useState, useEffect } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Tajawal } from "next/font/google";
import { useTheme } from "@/context/ThemeContext";
import { bulkRecharge } from "@/features/wallet/services/budget";
import {
  MdOutlineArrowBack,
  MdOutlineArrowForward,
  MdOutlineVerifiedUser,
  MdOutlineWarningAmber,
  MdOutlineBolt,
  MdOutlineCheck,
  MdOutlineCheckCircle,
  MdOutlineTune,
  MdOutlineBalance,
  MdOutlinePieChart,
  MdOutlineFactCheck,
  MdOutlineReceiptLong,
  MdOutlineExpandMore,
  MdOutlineAddCard,
} from "react-icons/md";

const tajawal = Tajawal({
  subsets: ["arabic"],
  weight: ["400", "500", "700", "800"],
});

// سعر الصرف مش جاي من الـ API حالياً
const SAR_RATE = 3.75;

const PRESETS = [100, 200, 300, 500];
const DEFAULT_PRESET = 200;
const ORANGE = "linear-gradient(90deg, #FFA600, #FF4B04)";

const fmt = (n) =>
  Number(n).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

// ── Theme tokens (نفس باقي الصفحات) ────────────────────────────────────────
function getTokens(isDark) {
  return {
    page: isDark ? "#0A0B0B" : "#F1F4F3",
    card: isDark ? "#141616" : "#FFFFFF",
    inner: isDark ? "#1B1E1E" : "#F3F6F5",
    innerStrong: isDark ? "#252929" : "#E6ECEA",
    chartBg: isDark ? "#0D0F0F" : "#F3F6F5",
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
    goldBorder: isDark ? "rgba(233,195,73,0.45)" : "rgba(138,106,0,0.45)",
    danger: isDark ? "#EF4444" : "#DC2626",
    dangerBg: isDark ? "rgba(239,68,68,0.14)" : "rgba(220,38,38,0.10)",
    dangerBorder: isDark ? "rgba(239,68,68,0.32)" : "rgba(220,38,38,0.30)",
    track: isDark ? "rgba(255,255,255,0.08)" : "rgba(25,28,29,0.08)",
    onMint: "#0B1F19",
    shadow: isDark ? "none" : "0 1px 3px rgba(16,24,20,0.06)",
  };
}

// ── Small building blocks ──────────────────────────────────────────────────
function Card({ t, className = "", style, children, ...rest }) {
  return (
    <section
      {...rest}
      className={`rounded-2xl ${className}`}
      style={{
        background: t.card,
        border: `1px solid ${t.border}`,
        boxShadow: t.shadow,
        ...style,
      }}
    >
      {children}
    </section>
  );
}

function Pill({ bg, color, children, className = "" }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-1 text-[11px] font-bold ${className}`}
      style={{ background: bg, color }}
    >
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

function OrangeBtn({
  icon: Icon,
  children,
  onClick,
  disabled,
  className = "",
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

function GhostBtn({
  t,
  icon: Icon,
  children,
  onClick,
  disabled,
  className = "",
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-[12px] font-bold transition-opacity hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      style={{
        background: t.inner,
        color: t.soft,
        border: `1px solid ${t.border}`,
      }}
    >
      {Icon && <Icon size={16} />}
      {children}
    </button>
  );
}

function Checkbox({ t, checked, onChange, label, disabled }) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={onChange}
      className="flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-md transition-colors disabled:cursor-not-allowed"
      style={{
        background: checked ? t.mint : "transparent",
        border: `1.5px solid ${checked ? t.mint : t.sub}`,
      }}
    >
      {checked && <MdOutlineCheck size={15} color={t.onMint} />}
    </button>
  );
}

function AmountField({ t, label, value, onChange, disabled, invalid }) {
  return (
    <div className="flex w-full flex-col gap-1.5 sm:w-[168px]">
      <span className="text-[10px]" style={{ color: t.sub }}>
        {label}
      </span>
      <label
        className="flex items-center gap-2 rounded-xl px-3 py-2.5"
        style={{
          background: t.chartBg,
          border: `1px solid ${invalid ? t.dangerBorder : t.goldBorder}`,
          opacity: disabled ? 0.6 : 1,
        }}
      >
        <span className="text-[13px] font-bold" style={{ color: t.goldText }}>
          $
        </span>
        <input
          type="text"
          inputMode="decimal"
          dir="ltr"
          disabled={disabled}
          value={value}
          onChange={(e) => {
            const cleaned = e.target.value.replace(/[^0-9.]/g, "");
            onChange(Number(cleaned) || 0);
          }}
          className="w-full min-w-0 bg-transparent text-center text-[15px] font-extrabold outline-none"
          style={{
            color: invalid ? t.danger : t.heading,
            fontFamily: "Arial, sans-serif",
          }}
        />
      </label>
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────
// campaigns: نفس القائمة المحوّلة من toBudgetCampaign (من الأب)
// walletBalance: رصيد المحفظة الحالي من الأب
// onDone({ walletBalance }): بعد ما تخلص العملية (الأب بيحدّث الرصيد ويعمل refresh)
export default function BulkRecharge({
  campaigns = [],
  walletBalance: walletProp = 0,
  onBack,
  onDone,
}) {
  const { isDark } = useTheme();
  const locale = useLocale();
  const isRTL = locale === "ar";
  const t = getTokens(isDark);
  const tr = useTranslations("budgetManagement.bulkRecharge");

  // ── States ──
  const [wallet, setWallet] = useState(walletProp);
  const [amounts, setAmounts] = useState({}); // { [id]: number }
  const [selected, setSelected] = useState({}); // { [id]: boolean } (الافتراضي: الفعّالة)
  const [mode, setMode] = useState("manual"); // "manual" | "equal"
  const [equalTotal, setEqualTotal] = useState(600);
  const [filter, setFilter] = useState("active"); // "active" | "all"
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(null); // ملخص آخر عملية
  const [results, setResults] = useState({}); // { [id]: { state, message } }

  // لو الرصيد تحدّث من الأب (refresh) نزامنه
  useEffect(() => {
    // Keep the editable preview aligned with the shared wallet balance.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setWallet(walletProp);
  }, [walletProp]);

  // ── Rows من الحملات الحقيقية ──
  const rows = campaigns.map((c) => ({
    id: c.id,
    displayId: c.displayId,
    name: c.name,
    status: c.status,
    previousBalance: Math.max(c.budget.total - c.budget.spent, 0),
    dailyLimit: c.daily.limit,
    creators: c.creators,
    amount: amounts[c.id] ?? DEFAULT_PRESET,
  }));

  const isSelected = (c) => selected[c.id] ?? c.status === "ACTIVE";

  // ── Derived ──
  const visible =
    filter === "active" ? rows.filter((c) => c.status === "ACTIVE") : rows;
  const chosen = visible.filter(isSelected);
  const count = chosen.length;

  const equalShare =
    count > 0 ? Math.floor((equalTotal / count) * 100) / 100 : 0;
  const amountOf = (c) => (mode === "equal" ? equalShare : c.amount);

  const total = chosen.reduce((sum, c) => sum + amountOf(c), 0);
  const sufficient = total <= wallet;
  const remainingWallet = wallet - total;
  const deductedPct = wallet > 0 ? (total / wallet) * 100 : 0;
  const canConfirm =
    !submitting &&
    count > 0 &&
    total > 0 &&
    sufficient &&
    chosen.every((c) => amountOf(c) > 0);

  const activePreset =
    mode === "manual" &&
    count > 0 &&
    PRESETS.find((v) => chosen.every((c) => c.amount === v));

  const hasProblems = !!done && done.failed + done.skipped > 0;

  // ── Handlers ──
  const toggle = (c) => setSelected((s) => ({ ...s, [c.id]: !isSelected(c) }));

  const setAmount = (id, amount) =>
    setAmounts((prev) => ({ ...prev, [id]: amount }));

  const applyPreset = (v) => {
    setMode("manual");
    setAmounts((prev) => {
      const next = { ...prev };
      rows.forEach((c) => {
        if (isSelected(c)) next[c.id] = v;
      });
      return next;
    });
  };

  const handleEqual = () => {
    setEqualTotal(total > 0 ? total : 600);
    setMode("equal");
  };

  const handleBack = () => (onBack ? onBack() : window.history.back());

  const handleConfirm = async () => {
    if (!canConfirm) return;
    setSubmitting(true);
    setDone(null);
    setResults({});

    const lines = chosen.map((c) => ({ id: c.id, amount: amountOf(c) }));

    try {
      // تسلسلي، وبيوقف عند INSUFFICIENT_BALANCE
      const res = await bulkRecharge(lines);

      const nextResults = {};
      let okCount = 0;
      let okTotal = 0;
      let lastBalance = null;
      const txnIds = [];

      res.forEach((r) => {
        if (r.ok) {
          okCount += 1;
          okTotal += Number(r.data?.amountAdded ?? 0) ||
            lines.find((l) => l.id === r.id)?.amount ||
            0;
          if (r.data?.walletBalanceAfter != null) {
            lastBalance = Number(r.data.walletBalanceAfter);
          }
          if (r.data?.transactionId) txnIds.push(r.data.transactionId);
          nextResults[r.id] = { state: "ok" };
        } else {
          nextResults[r.id] = {
            state: "failed",
            message: r.error?.message || tr("result.failed"),
          };
        }
      });

      // الحملات اللي ما انعملت لأن الحلقة وقفت
      lines.forEach((l) => {
        if (!nextResults[l.id]) nextResults[l.id] = { state: "skipped" };
      });

      const failed = Object.values(nextResults).filter(
        (r) => r.state === "failed",
      ).length;
      const skipped = Object.values(nextResults).filter(
        (r) => r.state === "skipped",
      ).length;

      if (lastBalance != null) setWallet(lastBalance);
      setResults(nextResults);
      setDone({
        total: okTotal,
        sar: okTotal * SAR_RATE,
        count: okCount,
        failed,
        skipped,
        txnIds,
        time: new Date().toLocaleTimeString(isRTL ? "ar" : "en-US", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      });

      // الأب بيحدّث الرصيد وقائمة الحملات
      await onDone?.({ walletBalance: lastBalance });
    } catch (e) {
      console.error("Bulk recharge failed:", e);
      setDone({
        total: 0,
        sar: 0,
        count: 0,
        failed: lines.length,
        skipped: 0,
        txnIds: [],
        time: "",
      });
    } finally {
      setSubmitting(false);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const BackIcon = isRTL ? MdOutlineArrowForward : MdOutlineArrowBack;
  const dotColors = [t.mint, t.mint, t.gold];
  const shownTxn = done?.txnIds?.[0]
    ? `#${String(done.txnIds[0]).slice(0, 8)}`
    : null;

  return (
    <div
      dir={isRTL ? "rtl" : "ltr"}
      className={`${tajawal.className} min-h-screen`}
      style={{ background: t.page, color: t.text }}
    >
      <div className="mx-auto flex w-full max-w-[1400px] flex-col gap-4 p-3 sm:p-5 lg:p-6">
        {/* بانر النتيجة */}
        {done && (
          <div
            role={hasProblems ? "alert" : "status"}
            className="flex flex-wrap items-center gap-3 rounded-2xl px-4 py-3 sm:flex-nowrap sm:px-5"
            style={{
              background: t.card,
              border: `1px solid ${hasProblems ? t.dangerBorder : t.border}`,
              boxShadow: t.shadow,
            }}
          >
            <div
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
              style={{
                background: hasProblems ? t.dangerBg : t.accentBg,
                border: `1px solid ${hasProblems ? t.dangerBorder : t.accentBorder}`,
              }}
            >
              {hasProblems ? (
                <MdOutlineWarningAmber size={22} color={t.danger} />
              ) : (
                <MdOutlineCheckCircle size={22} color={t.accent} />
              )}
            </div>

            <div className="min-w-0 flex-1">
              <p
                className="text-[15px] font-extrabold"
                style={{ color: hasProblems ? t.danger : t.heading }}
              >
                {hasProblems ? tr("partial.title") : tr("verified.title")}
              </p>
              <p
                className="mt-1 text-[11px] leading-5"
                style={{ color: t.sub }}
              >
                {hasProblems
                  ? tr("partial.message", {
                      ok: done.count,
                      failed: done.failed,
                      skipped: done.skipped,
                    })
                  : tr.rich("verified.message", {
                      total: fmt(done.total),
                      sar: fmt(done.sar),
                      count: done.count,
                      gold: (chunks) => (
                        <b dir="ltr" style={{ color: t.goldText }}>
                          {chunks}
                        </b>
                      ),
                      mint: (chunks) => (
                        <b style={{ color: t.accent }}>{chunks}</b>
                      ),
                    })}
              </p>
            </div>

            <button
              type="button"
              onClick={() =>
                document
                  .getElementById("audit-log")
                  ?.scrollIntoView({ behavior: "smooth", block: "start" })
              }
              className="inline-flex shrink-0 items-center gap-2 rounded-xl px-4 py-2.5 text-[12px] font-bold text-white transition-opacity hover:opacity-90"
              style={{ background: ORANGE }}
            >
              <MdOutlineReceiptLong size={15} />
              {tr("verified.auditLog")}
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-[minmax(0,1fr)_340px] xl:grid-cols-[minmax(0,1fr)_380px]">
          {/* ═══ العمود الرئيسي: الحملات ═══ */}
          <div className="flex min-w-0 flex-col gap-4">
            <Card t={t} className="flex flex-col gap-4 p-4 sm:p-5">
              {/* العنوان + وضع التوزيع */}
              <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div className="flex min-w-0 items-start gap-3">
                  <MdOutlineFactCheck
                    size={24}
                    color={t.accent}
                    className="mt-0.5 shrink-0"
                  />
                  <div className="min-w-0">
                    <h1
                      className="text-[17px] font-extrabold leading-tight"
                      style={{ color: t.heading }}
                    >
                      {tr("title")}
                    </h1>
                    <p
                      className="mt-1 text-[11px] leading-5"
                      style={{ color: t.sub }}
                    >
                      {tr("subtitle")}
                    </p>
                  </div>
                </div>

                <div className="flex shrink-0 flex-wrap items-center gap-2">
                  <button
                    type="button"
                    disabled={submitting}
                    onClick={() => setMode("manual")}
                    className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-[12px] font-bold transition-opacity hover:opacity-90 disabled:opacity-50"
                    style={
                      mode === "manual"
                        ? { background: ORANGE, color: "#FFFFFF" }
                        : {
                            background: t.inner,
                            color: t.soft,
                            border: `1px solid ${t.border}`,
                          }
                    }
                  >
                    <MdOutlineTune size={16} />
                    {tr("mode.manual")}
                  </button>
                  <button
                    type="button"
                    disabled={submitting}
                    onClick={handleEqual}
                    className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-[12px] font-bold transition-opacity hover:opacity-90 disabled:opacity-50"
                    style={
                      mode === "equal"
                        ? { background: ORANGE, color: "#FFFFFF" }
                        : {
                            background: t.inner,
                            color: t.soft,
                            border: `1px solid ${t.border}`,
                          }
                    }
                  >
                    <MdOutlineBalance size={16} />
                    {tr("mode.equal")}
                  </button>
                </div>
              </div>

              {/* إجمالي التوزيع بالتساوي */}
              {mode === "equal" && (
                <div
                  className="flex flex-col gap-2 rounded-xl p-3 sm:flex-row sm:items-center sm:justify-between"
                  style={{
                    background: t.inner,
                    border: `1px solid ${t.border}`,
                  }}
                >
                  <div className="min-w-0">
                    <p
                      className="text-[12px] font-bold"
                      style={{ color: t.heading }}
                    >
                      {tr("equal.label")}
                    </p>
                    <p className="mt-0.5 text-[10px]" style={{ color: t.sub }}>
                      {tr("equal.hint", {
                        count,
                        share: fmt(equalShare),
                      })}
                    </p>
                  </div>
                  <AmountField
                    t={t}
                    label={tr("equal.fieldLabel")}
                    value={equalTotal}
                    onChange={setEqualTotal}
                    disabled={submitting}
                  />
                </div>
              )}

              {/* إضافة سريعة + فلتر */}
              <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[11px]" style={{ color: t.sub }}>
                    {tr("quickAdd.label")}
                  </span>
                  {PRESETS.map((v) => {
                    const on = activePreset === v;
                    return (
                      <button
                        key={v}
                        type="button"
                        disabled={submitting}
                        onClick={() => applyPreset(v)}
                        className="rounded-xl px-4 py-2 text-[12px] font-bold transition-colors disabled:opacity-50"
                        style={{
                          background: on ? t.accentBg : t.inner,
                          color: on ? t.accent : t.soft,
                          border: `1px solid ${on ? t.accentBorder : t.border}`,
                        }}
                      >
                        <span dir="ltr">+${v}</span>
                        {v === DEFAULT_PRESET && (
                          <span className="ms-1.5 text-[10px] font-medium">
                            ({tr("quickAdd.default")})
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>

                <label
                  className="relative inline-flex items-center gap-2 self-start text-[11px] lg:self-center"
                  style={{ color: t.sub }}
                >
                  {tr("filter.label")}
                  <span className="relative">
                    <select
                      value={filter}
                      disabled={submitting}
                      onChange={(e) => setFilter(e.target.value)}
                      className="appearance-none rounded-lg py-2 pe-8 ps-3 text-[11px] font-bold outline-none"
                      style={{
                        background: t.inner,
                        color: t.soft,
                        border: `1px solid ${t.border}`,
                      }}
                    >
                      <option value="active">{tr("filter.active")}</option>
                      <option value="all">{tr("filter.all")}</option>
                    </select>
                    <MdOutlineExpandMore
                      size={16}
                      color={t.sub}
                      className="pointer-events-none absolute end-2 top-1/2 -translate-y-1/2"
                    />
                  </span>
                </label>
              </div>
            </Card>

            {/* صفوف الحملات */}
            {visible.length === 0 && (
              <Card
                t={t}
                className="p-6 text-center text-[12px]"
                style={{ color: t.sub }}
              >
                {tr("empty")}
              </Card>
            )}

            {visible.map((c) => {
              const on = isSelected(c);
              const amount = amountOf(c);
              const paused = c.status !== "ACTIVE";
              const result = results[c.id];
              return (
                <Card
                  key={c.id}
                  t={t}
                  className="flex flex-col gap-4 p-4 transition-opacity sm:flex-row sm:items-center sm:justify-between"
                  style={{
                    background: t.inner,
                    opacity: on ? 1 : 0.6,
                    ...(result?.state === "failed"
                      ? { border: `1px solid ${t.dangerBorder}` }
                      : null),
                  }}
                >
                  <div className="flex min-w-0 items-start gap-3">
                    <div className="pt-0.5">
                      <Checkbox
                        t={t}
                        checked={on}
                        disabled={submitting}
                        onChange={() => toggle(c)}
                        label={c.name}
                      />
                    </div>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <p
                          className="text-[14px] font-extrabold"
                          style={{ color: t.heading }}
                        >
                          {c.name}
                        </p>
                        {paused && (
                          <Pill bg={t.goldBg} color={t.goldText}>
                            {tr("row.paused")}
                          </Pill>
                        )}
                        {result?.state === "ok" && (
                          <Pill bg={t.accentBg} color={t.accent}>
                            <MdOutlineCheck size={12} />
                            {tr("result.ok")}
                          </Pill>
                        )}
                        {result?.state === "failed" && (
                          <Pill bg={t.dangerBg} color={t.danger}>
                            {tr("result.failed")}
                          </Pill>
                        )}
                        {result?.state === "skipped" && (
                          <Pill bg={t.goldBg} color={t.goldText}>
                            {tr("result.skipped")}
                          </Pill>
                        )}
                      </div>
                      <p
                        className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px]"
                        style={{ color: t.sub }}
                      >
                        <span>
                          {tr("row.previous")}{" "}
                          <b dir="ltr" style={{ color: t.soft }}>
                            ${fmt(c.previousBalance)}
                          </b>
                        </span>
                        <span>
                          {tr("row.dailyLimit")}{" "}
                          <b dir="ltr" style={{ color: t.soft }}>
                            ${fmt(c.dailyLimit)}/{tr("row.day")}
                          </b>
                        </span>
                        <span>{tr("row.creators", { count: c.creators })}</span>
                      </p>
                      {result?.state === "failed" && result.message && (
                        <p
                          className="mt-1.5 text-[11px] font-bold"
                          style={{ color: t.danger }}
                        >
                          {result.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <AmountField
                    t={t}
                    label={tr("row.amount")}
                    value={amount}
                    onChange={(v) => setAmount(c.id, v)}
                    disabled={!on || mode === "equal" || submitting}
                  />
                </Card>
              );
            })}

            {/* سجل الشفافية */}
            <Card
              t={t}
              className="flex flex-col gap-4 p-4 sm:p-5"
              style={{ scrollMarginTop: 16 }}
              id="audit-log"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p
                  className="inline-flex items-center gap-2 text-[13px] font-extrabold"
                  style={{ color: t.heading }}
                >
                  <MdOutlineReceiptLong size={18} color={t.sub} />
                  {tr("audit.title")}
                </p>
                {shownTxn && (
                  <span
                    dir="ltr"
                    className="text-[11px] font-bold"
                    style={{ color: t.accent }}
                  >
                    {shownTxn}
                    {done.txnIds.length > 1 && ` +${done.txnIds.length - 1}`}
                  </span>
                )}
              </div>

              <div
                className="grid grid-cols-1 gap-4 rounded-xl p-4 text-[11px] sm:grid-cols-3"
                style={{
                  background: t.chartBg,
                  border: `1px solid ${t.border}`,
                }}
              >
                <div className="flex flex-col gap-1">
                  <span style={{ color: t.sub }}>{tr("audit.time")}</span>
                  <b style={{ color: t.heading }}>
                    {done?.time
                      ? tr("audit.today", { time: done.time })
                      : tr("audit.pending")}
                  </b>
                </div>
                <div className="flex flex-col gap-1">
                  <span style={{ color: t.sub }}>{tr("audit.method")}</span>
                  <b style={{ color: sufficient ? t.accent : t.danger }}>
                    {sufficient ? tr("audit.methodOk") : tr("audit.methodFail")}
                  </b>
                </div>
                <div className="flex flex-col gap-1 text-right">
                  <span style={{ color: t.sub }}>{tr("audit.effect")}</span>
                  <b dir={isRTL ? "rtl" : "ltr"} style={{ color: t.goldText }}>
                    {tr("audit.effectValue", {
                      amount: fmt(done ? done.total : total),
                    })}
                  </b>
                </div>
              </div>
            </Card>
          </div>

          {/* ═══ العمود الجانبي: الملخص ═══ */}
          <div className="flex min-w-0 flex-col gap-4">
            {/* التحقق من كفاية الرصيد */}
            <Card
              t={t}
              className="flex flex-col gap-4 p-4 sm:p-5"
              style={
                sufficient
                  ? undefined
                  : { border: `1px solid ${t.dangerBorder}` }
              }
            >
              <div className="flex items-center justify-between gap-2">
                <h2
                  className="inline-flex items-center gap-2 text-[15px] font-extrabold"
                  style={{ color: sufficient ? t.heading : t.danger }}
                >
                  {sufficient ? (
                    <MdOutlineVerifiedUser size={18} color={t.accent} />
                  ) : (
                    <MdOutlineWarningAmber size={18} color={t.danger} />
                  )}
                  {tr("check.title")}
                </h2>
                <Pill
                  bg={sufficient ? t.accentBg : t.dangerBg}
                  color={sufficient ? t.accent : t.danger}
                  className="!py-0.5 !text-[10px]"
                >
                  {sufficient ? tr("check.ok") : tr("check.fail")}
                </Pill>
              </div>

              <div className="flex items-center justify-between gap-2 text-[11px]">
                <span style={{ color: t.sub }}>{tr("check.before")}</span>
                <b dir="ltr" style={{ color: t.heading }}>
                  ${fmt(wallet)}
                </b>
              </div>

              <div className="flex items-center justify-between gap-2 text-[11px]">
                <span style={{ color: t.goldText }}>
                  {tr("check.total", { count })}
                </span>
                <b dir="ltr" style={{ color: t.goldText }}>
                  - ${fmt(total)}
                </b>
              </div>

              <div style={{ borderTop: `1px solid ${t.border}` }} />

              <div>
                <div className="flex items-center justify-between gap-2">
                  <span
                    className="text-[11px] font-bold"
                    style={{ color: sufficient ? t.accent : t.danger }}
                  >
                    {tr("check.remaining")}
                  </span>
                  <b
                    dir="ltr"
                    className="text-[20px] font-extrabold"
                    style={{ color: sufficient ? t.heading : t.danger }}
                  >
                    ${fmt(Math.max(remainingWallet, 0))}
                  </b>
                </div>
                <div className="mt-1 flex items-center justify-between gap-2 text-[10px]">
                  <span style={{ color: t.sub }}>{tr("check.available")}</span>
                  <span style={{ color: t.sub }}>
                    {tr("check.sar", {
                      amount: fmt(Math.max(remainingWallet, 0) * SAR_RATE),
                    })}
                  </span>
                </div>
                {!sufficient && (
                  <p
                    className="mt-2 text-[11px] font-bold"
                    style={{ color: t.danger }}
                  >
                    {tr("check.deficit", {
                      amount: fmt(total - wallet),
                    })}
                  </p>
                )}
              </div>

              <div>
                <div className="mb-1.5 flex items-center justify-between gap-2 text-[10px]">
                  <span style={{ color: t.sub }}>{tr("check.ratio")}</span>
                  <b
                    dir="ltr"
                    style={{ color: sufficient ? t.accent : t.danger }}
                  >
                    {deductedPct.toFixed(2)}%
                  </b>
                </div>
                <Bar
                  t={t}
                  pct={deductedPct}
                  color={sufficient ? t.mint : t.danger}
                  h={4}
                />
              </div>
            </Card>

            {/* توزيع المبالغ */}
            <Card t={t} className="flex flex-col gap-4 p-4 sm:p-5">
              <p
                className="inline-flex items-center gap-2 text-[13px] font-extrabold"
                style={{ color: t.heading }}
              >
                <MdOutlinePieChart size={16} color={t.goldText} />
                {tr("distribution.title")}
              </p>

              {count === 0 ? (
                <p className="text-[11px]" style={{ color: t.sub }}>
                  {tr("distribution.empty")}
                </p>
              ) : (
                <div className="flex flex-col gap-2">
                  {chosen.map((c, i) => (
                    <div
                      key={c.id}
                      className="flex items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-[11px]"
                      style={{
                        background: t.inner,
                        border: `1px solid ${t.border}`,
                      }}
                    >
                      <span
                        className="inline-flex min-w-0 items-center gap-2"
                        style={{ color: t.soft }}
                      >
                        <span
                          className="h-2 w-2 shrink-0 rounded-full"
                          style={{
                            background: dotColors[i % dotColors.length],
                          }}
                        />
                        <span className="truncate">{c.name}</span>
                      </span>
                      <b dir="ltr" style={{ color: t.heading }}>
                        ${fmt(amountOf(c))}
                      </b>
                    </div>
                  ))}
                </div>
              )}

              <div
                className="flex items-center justify-between gap-2 pt-3"
                style={{ borderTop: `1px solid ${t.border}` }}
              >
                <span
                  className="text-[12px] font-bold"
                  style={{ color: t.soft }}
                >
                  {tr("distribution.total")}
                </span>
                <b
                  dir="ltr"
                  className="text-[20px] font-extrabold"
                  style={{ color: t.goldText }}
                >
                  ${fmt(total)}
                </b>
              </div>
            </Card>

            {/* الإجراءات */}
            <Card t={t} className="flex flex-col gap-3 p-4 sm:p-5">
              <OrangeBtn
                icon={sufficient ? MdOutlineBolt : MdOutlineAddCard}
                onClick={handleConfirm}
                disabled={!canConfirm}
                className="w-full !py-3.5"
              >
                {submitting ? tr("submitting") : tr("actions.confirm")}
              </OrangeBtn>
              <GhostBtn
                t={t}
                icon={BackIcon}
                onClick={handleBack}
                disabled={submitting}
                className="w-full !py-3"
              >
                {tr("actions.back")}
              </GhostBtn>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
