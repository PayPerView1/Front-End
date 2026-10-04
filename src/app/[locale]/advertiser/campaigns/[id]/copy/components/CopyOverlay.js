"use client";
import { useEffect, useState } from "react";
import { useTheme } from "@/context/ThemeContext";
import { useLocale } from "next-intl";
import { getCampaignById } from "@/services/campaign";
import CopyModal from "./CopyModal";

export default function CopyOverlay({ campaignId }) {
  const { isDark } = useTheme();
  const locale = useLocale();
  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading]   = useState(!!campaignId);

  useEffect(() => {
    if (!campaignId) return;

    getCampaignById(campaignId)
      .then((res) => {
        const data = res?.data?.campaign;
        setCampaign(data || { _id: campaignId, name: "الحملة" });
      })
      .catch(() => {
        setCampaign({ _id: campaignId, name: "حملة الربع الرابع" });
      })
      .finally(() => setLoading(false));
  }, [campaignId]);

  return (
     <div
  className={`fixed inset-0 z-10 flex items-center justify-center overflow-y-auto p-4 ${
    locale === "ar" ? "xl:right-[260px]" : "xl:left-[260px]"
  }`}
  style={{
    background: isDark ? "rgba(0,0,0,0.6)" : "rgba(180,180,180,0.4)",
    backdropFilter: "blur(6px)",
  }}
>
      {loading ? (
        <div className="w-8 h-8 border-2 border-[#94D3C1] border-t-transparent rounded-full animate-spin" />
      ) : campaign ? (
        <CopyModal campaign={campaign} />
      ) : null}
    </div>
  );
}