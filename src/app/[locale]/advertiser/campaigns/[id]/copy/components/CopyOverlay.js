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
      className="fixed inset-0 z-10 flex items-center justify-center"
      style={{
        background: isDark ? "rgba(0,0,0,0.6)" : "rgba(180,180,180,0.4)",
        backdropFilter: "blur(6px)",
        ...(locale === "ar" ? { right: "240px" } : { left: "260px" }),
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