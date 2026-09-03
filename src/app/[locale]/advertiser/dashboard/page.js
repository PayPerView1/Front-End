"use client";

import { useLocale } from "next-intl";

export default function AdvertiserDashboardPage() {
  const locale = useLocale();

  return (
    <div
      dir={locale === "ar" ? "rtl" : "ltr"}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "60vh",
        gap: "12px",
        opacity: 0.6,
      }}
    >
      <h1 style={{ fontSize: "1.5rem", fontWeight: "bold" }}>
        {locale === "ar" ? "لوحة تحكم صاحب الحملة" : "Advertiser Dashboard"}
      </h1>
      <p style={{ fontSize: "0.9rem" }}>
        {locale === "ar"
          ? "قيد الإنشاء — ستُضاف صفحات صاحب الحملة هنا قريباً."
          : "Under construction — advertiser pages will be added here soon."}
      </p>
    </div>
  );
}
