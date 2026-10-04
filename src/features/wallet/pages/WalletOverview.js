"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { useWallet } from "../WalletProvider";

export default function WalletOverview() {
  const locale = useLocale();
  const t = useTranslations("Analytics");
  const budgetT = useTranslations("budgetManagement");
  const { balance, status, error, refresh } = useWallet();
  const money = new Intl.NumberFormat(locale, { style: "currency", currency: "USD" });
  const actions = [
    { href: "/advertiser/wallet/top-up", title: t("chargeNow"), description: t("stats.balanceBottom") },
    { href: "/advertiser/wallet/refund", title: t("transactions.types.refund"), description: t("refundFoot") },
    { href: "/advertiser/wallet/budget", title: budgetT("title"), description: budgetT("subtitle") },
    { href: "/advertiser/wallet/transactions", title: t("transactions.title"), description: t("manageGuide") },
  ];

  return (
    <main dir={locale === "ar" ? "rtl" : "ltr"} className="min-h-screen bg-[#0B0D0E] px-4 py-8 text-white sm:px-8">
      <div className="mx-auto max-w-6xl">
        <header className="mb-7 flex flex-wrap items-end justify-between gap-4">
          <div><p className="mb-2 text-sm text-[#94D3C1]">{t("emptyTag")}</p><h1 className="text-3xl font-bold">{t("stats.balance")}</h1></div>
          <button onClick={() => refresh().catch(() => {})} className="rounded-xl border border-white/10 px-4 py-2 text-sm text-gray-300 hover:border-[#94D3C1]/50">{locale === "ar" ? "تحديث الرصيد" : "Refresh balance"}</button>
        </header>
        <section className="mb-6 rounded-2xl border border-white/10 bg-[#151819] p-6 sm:p-8">
          <p className="mb-2 text-sm text-gray-400">{t("stats.balance")}</p>
          {status === "loading" ? <p className="text-xl text-gray-400">جارٍ تحميل الرصيد…</p> : status === "error" ? <div role="alert" className="flex flex-wrap items-center gap-3 text-red-300"><span>{error}</span><button onClick={() => refresh().catch(() => {})} className="underline">إعادة المحاولة</button></div> : <p className="text-4xl font-bold text-[#94D3C1]" dir="ltr">{money.format(balance)}</p>}
          <p className="mt-3 text-xs text-gray-500">يتم تحميل الرصيد من حسابك الحالي.</p>
        </section>
        <nav aria-label="إدارة المحفظة" className="grid gap-4 sm:grid-cols-2">
          {actions.map((action) => <Link key={action.href} href={`/${locale}${action.href}`} className="rounded-2xl border border-white/10 bg-[#151819] p-5 transition hover:border-[#94D3C1]/40"><h2 className="mb-2 text-lg font-semibold">{action.title}</h2><p className="text-sm text-gray-400">{action.description}</p></Link>)}
        </nav>
      </div>
    </main>
  );
}
