


"use client";

import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import {
  FiXCircle,
  FiArrowRight,
  FiRotateCcw,
  FiShield,
  FiHelpCircle,
} from "react-icons/fi";
import { MdOutlineAccountBalanceWallet } from "react-icons/md";

/* ─────────────────────────────────────────────
   Design Tokens
───────────────────────────────────────────── */
const T = {
  bg: "#0B0D0E",
  card: "#151819",
  cardInner: "#101213",
  cardBorder: "rgba(255,255,255,0.08)",
  accent: "#94D3C1",
  accentBorder: "rgba(148,211,193,0.35)",
  accentBg: "rgba(148,211,193,0.08)",
  orange: "#FF5A00",
  danger: "#F87171",
  dangerBg: "rgba(248,113,113,0.08)",
  dangerBorder: "rgba(248,113,113,0.22)",
  warning: "#E9C349",
  warningBg: "rgba(233,195,73,0.10)",
  warningBorder: "rgba(233,195,73,0.25)",
  text: "#FFFFFF",
  sub: "#C5CECA",
  muted: "#8A9490",
};

export default function PaymentCancelPage() {
  const router = useRouter();
  const locale = useLocale();

  return (
    <div
      dir="rtl"
      className="min-h-screen text-white pb-16 pt-4"
      style={{
        backgroundColor: T.bg,
        fontFamily: "var(--font-tajawal), 'Tajawal', sans-serif",
      }}
    >
      <div className="max-w-[760px] mx-auto px-4 sm:px-6">

        {/* ── Header Navigation ── */}
        <div className="flex items-center justify-between mb-6">
          <button
            type="button"
            onClick={() => router.push(`/${locale}/advertiser/wallet-topup`)}
            className="inline-flex items-center gap-2 text-xs text-gray-400 hover:text-white transition-colors"
          >
            <span className="w-7 h-7 rounded-full border border-white/10 flex items-center justify-center hover:border-white/30">
              <FiArrowRight size={14} />
            </span>
            <span>العودة لإدارة الرصيد</span>
          </button>
          <div className="flex items-center gap-2 text-xs text-[#8A9490]">
            <FiShield size={13} className="text-[#94D3C1]" />
            <span>اتصال آمن ومشفّر</span>
          </div>
        </div>

        {/* ══════════════════════════════════════════════
            MAIN CARD
        ══════════════════════════════════════════════ */}
        <div
          className="rounded-[20px] border p-8 sm:p-10 text-center"
          style={{
            backgroundColor: T.card,
            borderColor: T.dangerBorder,
            boxShadow: "0 8px 40px rgba(248,113,113,0.06)",
          }}
        >
          {/* Icon */}
          <div
            className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6"
            style={{ backgroundColor: T.dangerBg, border: `1.5px solid ${T.dangerBorder}` }}
          >
            <FiXCircle size={38} className="text-red-400" />
          </div>

          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-gray-300 mb-4">
            <span
              className="w-1.5 h-1.5 rounded-full bg-red-400"
            />
            <span>تم إلغاء العملية</span>
          </div>

          {/* Title */}
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-3">
            تم إلغاء عملية الدفع
          </h1>
          <p className="text-sm text-[#8A9490] leading-relaxed max-w-md mx-auto mb-8">
            اخترت إلغاء عملية الدفع. لم يتم خصم أي مبلغ من حسابك. يمكنك المحاولة مجدداً في أي وقت.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-sm mx-auto">
            <button
              type="button"
              onClick={() => router.push(`/${locale}/advertiser/wallet-topup`)}
              className="flex-1 flex items-center justify-center gap-2.5 py-3 px-5 rounded-xl font-bold text-sm text-white shadow-lg transition-transform active:scale-[0.98] hover:brightness-110 cursor-pointer"
              style={{
                background: "linear-gradient(90deg, #FB9D00 0%, #FC5601 100%)",
                boxShadow: "0 4px 15px rgba(251,157,0,0.3)",
              }}
            >
              <FiRotateCcw size={17} />
              <span>حاول مرة أخرى</span>
            </button>
            <button
              type="button"
              onClick={() => router.push(`/${locale}/advertiser/dashboard`)}
              className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-medium text-gray-200 bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all cursor-pointer"
            >
              <MdOutlineAccountBalanceWallet size={16} />
              <span>صفحة المحفظة</span>
            </button>
          </div>
        </div>

        {/* ══════════════════════════════════════════════
            INFO SECTION
        ══════════════════════════════════════════════ */}
        <div className="mt-5 flex flex-col gap-3">

          {/* Reassurance note */}
          <div
            className="rounded-xl px-4 py-3.5 flex items-start gap-3"
            style={{ backgroundColor: T.accentBg, border: `1px solid ${T.accentBorder}` }}
          >
            <FiShield size={15} className="text-[#94D3C1] mt-0.5 shrink-0" />
            <p className="text-xs text-[#94D3C1] leading-relaxed">
              لم يتم خصم أي مبلغ من حسابك المصرفي أو محفظتك. إلغاء الدفعة آمن تماماً ولا يُنشئ أي التزامات مالية.
            </p>
          </div>

          {/* Why cancelled hint */}
          <div
            className="rounded-xl px-4 py-3.5 flex items-start gap-3"
            style={{ backgroundColor: T.warningBg, border: `1px solid ${T.warningBorder}` }}
          >
            <FiHelpCircle size={15} className="text-[#E9C349] mt-0.5 shrink-0" />
            <div>
              <p className="text-xs text-[#E9C349] font-semibold mb-1">لماذا تمّ الإلغاء؟</p>
              <ul className="text-xs text-[#E9C349]/80 leading-relaxed space-y-1 list-disc list-inside">
                <li>اخترت الضغط على "إلغاء" أو العودة في صفحة PayPal</li>
                <li>انتهت مهلة الجلسة (session timeout)</li>
                <li>انقطع الاتصال أثناء إتمام الدفع</li>
              </ul>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
