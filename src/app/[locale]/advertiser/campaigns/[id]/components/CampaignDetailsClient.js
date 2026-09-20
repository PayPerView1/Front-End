"use client";
import { useEffect, useState } from "react";
import { getCampaignById } from "@/services/campaign";
import CampaignDetails from "./CampaignDetails";

export default function CampaignDetailsClient({ campaignId }) {
  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading]   = useState(!!campaignId);
  const [error, setError]       = useState(null);

  useEffect(() => {
    if (!campaignId) return;

    setLoading(true);
    getCampaignById(campaignId)
      .then((res) => {
        const data = res?.data?.campaign || res?.campaign || (res?.data && typeof res.data === "object" ? res.data : null);
        if (data && (data._id || data.id || data.name)) {
          setCampaign(data);
        } else {
          console.warn("API getCampaignById returned fallback/empty data.");
          setCampaign(null);
          setError("لم يتم العثور على بيانات الحملة في قاعدة البيانات");
        }
      })
      .catch((err) => {
        console.error("Failed to fetch campaign details:", err);
        setError("حدث خطأ أثناء الاتصال بالسيرفر لجلب تفاصيل الحملة");
      })
      .finally(() => setLoading(false));
  }, [campaignId]);

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-8 h-8 border-2 border-[#94D3C1] border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!campaign) return (
    <div className="flex items-center justify-center min-h-screen text-red-400 text-sm font-semibold">
      {error || "لم يتم العثور على بيانات الحملة"}
    </div>
  );

  return <CampaignDetails campaign={campaign} />;
}