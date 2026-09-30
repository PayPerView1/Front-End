// ============================================================
// ملف: app/[locale]/advertiser/analytics/components/StatsCards.js
// ============================================================

"use client";

import React from "react";

// Icons
import {
  MdOutlineAccountBalanceWallet,
  MdOutlineCreditCard,
  MdOutlinePayments,
  MdOutlineSavings,
  MdOutlineShield,
  MdOutlineCreditCardOff,
  MdOutlineFactCheck,
} from "react-icons/md";
import { FiTrendingUp, FiTrendingDown } from "react-icons/fi";

export default function StatsCards({ t, dark = true, isEmpty = false, isRtl = true }) {
  // 1. بيانات الحالة الفارغة
  const emptyStats = [
    {
      key: "balance",
      label: t("stats.balance"),
      value: "$0.00",
      currency: "USD",
      sub: t("stats.balanceSub"),
      subColor: "#888888",
      valueColor: "#94D3C1",
      icon: MdOutlineAccountBalanceWallet,
      bottomText: t("stats.balanceBottom"),
      bottomColor: "#EAB308",
      hasDot: true,
    },
    {
      key: "prevDeposits",
      label: t("stats.prevDeposits"),
      value: "$0.00",
      currency: "USD",
      sub: t("stats.prevDepositsSub"),
      subColor: "#888888",
      valueColor: "#94D3C1",
      icon: MdOutlinePayments,
      bottomText: t("stats.prevDepositsBottom"),
      bottomIcon: MdOutlineCreditCardOff,
      bottomColor: "#888888",
    },
    {
      key: "adSpend",
      label: t("stats.adSpend"),
      value: "$0.00",
      currency: "USD",
      sub: t("stats.adSpendSub"),
      subColor: "#888888",
      valueColor: "#94D3C1",
      icon: MdOutlineCreditCard,
      bottomText: t("stats.adSpendBottom"),
      bottomIcon: MdOutlineShield,
      bottomColor: "#94D3C1",
    },
    {
      key: "cashback",
      label: t("stats.cashback"),
      value: "$0.00",
      currency: "USD",
      sub: t("stats.cashbackSub"),
      subColor: "#888888",
      valueColor: "#94D3C1",
      icon: MdOutlineSavings,
      bottomText: t("stats.cashbackBottom"),
      bottomIcon: MdOutlineFactCheck,
      bottomColor: "#888888",
    },
  ];

  // 2. بيانات الحالة الممتلئة (تم تطبيق لون المبلغ #94D3C1 على الجميع)
  const populatedStats = [
    {
      key: "balance",
      label: t("stats.balance"),
      value: "$24,500.00",
      currency: "USD",
      sub: t("stats.balanceSubPop"),
      subColor: "#EAB308",
      valueColor: "#94D3C1",
      icon: MdOutlineAccountBalanceWallet,
      bottomText: t("stats.balanceBottomPop", t("stats.balanceBottom")),
      bottomIcon: MdOutlineFactCheck,
      bottomColor: "#94D3C1",
    },
    {
      key: "prevDeposits",
      label: t("stats.prevDeposits"),
      value: "+$15,450.00",
      currency: "USD",
      sub: t("stats.prevDepositsSubPop"),
      subColor: dark ? "#888888" : "#666666",
      valueColor: "#94D3C1",
      icon: MdOutlinePayments,
      trend: "14.8%",
      trendLabel: t("stats.trendLabel"),
      trendUp: true,
    },
    {
      key: "adSpend",
      label: t("stats.adSpend"),
      value: "+$15,450.00",
      currency: "USD",
      sub: t("stats.adSpendSubPop", "31,200.00 ر.س"),
      subColor: dark ? "#888888" : "#666666",
      valueColor: "#94D3C1",
      icon: MdOutlineCreditCard,
      bottomText: t("stats.adSpendBottomPop", "12 حملة نشطة تحت النشر والمتابعة"),
      bottomIcon: MdOutlineCreditCard,
      bottomColor: "#94D3C1",
    },
    {
      key: "cashback",
      label: t("stats.cashback"),
      value: "+$1,450.00",
      currency: "USD",
      sub: t("stats.cashbackSubPop", "5,437.50 ر.س"),
      subColor: dark ? "#888888" : "#666666",
      valueColor: "#94D3C1",
      icon: MdOutlineSavings,
      bottomText: t("stats.cashbackBottomPop"),
      bottomIcon: MdOutlineShield,
      bottomColor: "#94D3C1",
    },
  ];

  const stats = isEmpty ? emptyStats : populatedStats;

  return (
    <div dir={isRtl ? "rtl" : "ltr"} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
      {stats.map((s) => {
        const Icon = s.icon;
        const BottomIcon = s.bottomIcon;

        return (
          <div
            key={s.key}
            className={`rounded-2xl p-4 border flex flex-col justify-between gap-3 transition-all ${
              dark ? "bg-[#121212] border-[#222222]" : "bg-white border-[#E5E5E5]"
            }`}
          >
            {/* 1. الهيدر العلوي */}
            <div className="flex items-center justify-between gap-2">
              <span className={`text-xs font-medium ${dark ? "text-[#A0A0A0]" : "text-[#666666]"}`}>
                {s.label}
              </span>
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${dark ? "bg-[#1E2328]" : "bg-[#F3F4F6]"}`}>
                <Icon size={18} color="#94D3C1" />
              </div>
            </div>

            {/* 2. القيمة والعملة */}
            <div className="flex flex-col gap-0.5 text-start">
              <div className="flex items-baseline gap-1.5 flex-wrap">
                {s.currency && (
                  <span className="text-xs font-medium text-[#94D3C1]">
                    {s.currency}
                  </span>
                )}
                <span
                  className="text-xl sm:text-2xl font-bold tracking-tight"
                  style={{ color: s.valueColor || "#94D3C1" }}
                >
                  {s.value}
                </span>
              </div>

              {s.sub && (
                <span
                  className="text-xs font-medium"
                  style={{ color: s.subColor || (dark ? "#888888" : "#666666") }}
                >
                  {s.sub}
                </span>
              )}
            </div>

            {/* 3. الجزء السفلي */}
            <div className={`pt-3 border-t flex items-center justify-start ${dark ? "border-[#1F1F1F]" : "border-[#F0F0F0]"}`}>
              {s.trend ? (
                <div className="flex items-center gap-1.5">
                  <span className="px-2 py-0.5 rounded bg-[#1A2E22] text-[#4CAF50] text-xs font-bold flex items-center gap-1">
                    {s.trendUp ? <FiTrendingUp size={12} /> : <FiTrendingDown size={12} />}
                    {s.trend}
                  </span>
                  {s.trendLabel && (
                    <span className={`text-xs ${dark ? "text-[#777777]" : "text-[#888888]"}`}>
                      {s.trendLabel}
                    </span>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-1.5">
                  {BottomIcon && (
                    <BottomIcon
                      size={16}
                      className="shrink-0"
                      style={{ color: s.bottomColor || "#94D3C1" }}
                    />
                  )}

                  {s.hasDot && (
                    <span
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ backgroundColor: s.bottomColor || "#EAB308" }}
                    />
                  )}

                  <span
                    className="text-xs font-medium text-start"
                    style={{ color: s.bottomColor || (dark ? "#9A9A9A" : "#666666") }}
                  >
                    {s.bottomText}
                  </span>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}