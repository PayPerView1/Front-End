"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { useTheme } from "@/context/ThemeContext";
import { useWallet } from "../WalletProvider";

export default function WalletOverview() {
  const locale = useLocale();
  const { isDark } = useTheme();
  const t = useTranslations("Analytics");
  const budgetT = useTranslations("budgetManagement");
  const { balance, status, error, refresh } = useWallet();
  const money = new Intl.NumberFormat(locale, { style: "currency", currency: "USD" });
  const styles = {
    page: isDark ? "bg-[#0B0D0E] text-white" : "bg-[#F1F4F3] text-[#191C1D]",
    card: isDark
      ? "border-white/10 bg-[#151819]"
      : "border-[#E5EAE8] bg-white shadow-sm",
    muted: isDark ? "text-gray-400" : "text-[#5F6A66]",
    subtle: isDark ? "text-gray-500" : "text-[#68736F]",
    accent: isDark ? "text-[#94D3C1]" : "text-[#1C6B58]",
    button: isDark
      ? "border-white/10 text-gray-300 hover:border-[#94D3C1]/50"
      : "border-[#D5DEDB] text-[#404945] hover:border-[#1C6B58]/50",
  };
  const actions = [
    { href: "/advertiser/wallet/top-up", title: t("chargeNow"), description: t("stats.balanceBottom") },
    { href: "/advertiser/wallet/refund", title: t("transactions.types.refund"), description: t("refundFoot") },
    { href: "/advertiser/wallet/budget", title: budgetT("title"), description: budgetT("subtitle") },
    { href: "/advertiser/wallet/transactions", title: t("transactions.title"), description: t("manageGuide") },
  ];

  return (
    <main dir={locale === "ar" ? "rtl" : "ltr"} className={`min-h-screen px-4 py-8 sm:px-8 ${styles.page}`}>
      <div className="mx-auto max-w-6xl">
        <header className="mb-7 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className={`mb-2 text-sm ${styles.accent}`}>{t("emptyTag")}</p>
            <h1 className="text-3xl font-bold">{t("stats.balance")}</h1>
          </div>
          <button
            onClick={() => refresh().catch(() => {})}
            className={`rounded-xl border px-4 py-2 text-sm transition-colors ${styles.button}`}
          >
            {locale === "ar" ? "تحديث الرصيد" : "Refresh balance"}
          </button>
        </header>
        <section className={`mb-6 rounded-2xl border p-6 sm:p-8 ${styles.card}`}>
          <p className={`mb-2 text-sm ${styles.muted}`}>{t("stats.balance")}</p>
          {status === "loading" ? (
            <p className={`text-xl ${styles.muted}`}>جارٍ تحميل الرصيد…</p>
          ) : status === "error" ? (
            <div role="alert" className="flex flex-wrap items-center gap-3 text-red-600">
              <span>{error}</span>
              <button onClick={() => refresh().catch(() => {})} className="underline">
                إعادة المحاولة
              </button>
            </div>
          ) : (
            <p className={`text-4xl font-bold ${styles.accent}`} dir="ltr">
              {money.format(balance)}
            </p>
          )}
          <p className={`mt-3 text-xs ${styles.subtle}`}>
            يتم تحميل الرصيد من حسابك الحالي.
          </p>
        </section>
        <nav aria-label="إدارة المحفظة" className="grid gap-4 sm:grid-cols-2">
          {actions.map((action) => (
            <Link
              key={action.href}
              href={`/${locale}${action.href}`}
              className={`rounded-2xl border p-5 transition-colors hover:border-[#1C6B58]/40 ${styles.card}`}
            >
              <h2 className="mb-2 text-lg font-semibold">{action.title}</h2>
              <p className={`text-sm ${styles.muted}`}>{action.description}</p>
            </Link>
          ))}
        </nav>
      </div>
    </main>
  );
}
