"use client";
import { useEffect, useState } from "react";
import { getCampaignById } from "@/services/campaign";
import CampaignDetails from "./CampaignDetails";

// بيانات وهمية مؤقتة لحين ما الـ backend يشتغل
const MOCK_CAMPAIGN = {
  _id: "mock-id-001",
  name: "حملة الربع الرابع - التوسع الرقمي",
  contentType: "CLIPPING",
  totalBudget: 100000,
  brief: { mainIdea: "مجموعة ألفا المالية" },
  stats: {
    totalSpent: 45200,
    totalViews: 1200000,
    totalApprovedVideos: 45890,
    totalCreators: 34,
  },
  status: "ACTIVE",
  targetCountries: ["SAU", "EGY", "ARE"],
  statusHistory: [
    { action: "CREATED",     createdAt: "2024-09-15T00:00:00.000Z" },
    { action: "SUBMITTED",   createdAt: "2024-09-18T00:00:00.000Z" },
    { action: "AI_APPROVED", createdAt: "2024-09-25T00:00:00.000Z" },
    { action: "ACTIVATED",   createdAt: "2024-10-01T00:00:00.000Z" },
  ],
  createdAt: "2024-09-15T00:00:00.000Z",
  completedAt: null,
};

export default function CampaignDetailsClient({ campaignId }) {
  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading]   = useState(!!campaignId);
  const [error, setError]       = useState(null);

  useEffect(() => {
  if (!campaignId) return;  

  getCampaignById(campaignId)
    .then((res) => {
      const data = res?.data?.campaign;
      if (data) {
        setCampaign(data);
      } else {
        console.warn("No campaign data returned, using mock.");
        setCampaign({ ...MOCK_CAMPAIGN, _id: campaignId });
      }
    })
    .catch(() => {
      setCampaign({ ...MOCK_CAMPAIGN, _id: campaignId });
    })
    .finally(() => setLoading(false));
}, [campaignId]);

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-8 h-8 border-2 border-[#94D3C1] border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!campaign) return (
    <div className="flex items-center justify-center min-h-screen text-red-400 text-sm">
      {error || "لم يتم العثور على بيانات الحملة"}
    </div>
  );

  return <CampaignDetails campaign={campaign} />;
}

// "use client";
// import { useEffect, useState } from "react";
// import { getCampaignById } from "@/services/campaign";
// import CampaignDetails from "./CampaignDetails";

// export default function CampaignDetailsClient({ campaignId }) {
//   const [campaign, setCampaign] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     getCampaignById(campaignId)
//       .then((res) => setCampaign(res.data.campaign))
//       .catch((err) => setError(err.message))
//       .finally(() => setLoading(false));
//   }, [campaignId]);

//   if (loading) return (
//     <div className="flex items-center justify-center min-h-screen">
//       <div className="w-8 h-8 border-2 border-[#94D3C1] border-t-transparent rounded-full animate-spin" />
//     </div>
//   );

//   if (error) return (
//     <div className="flex items-center justify-center min-h-screen text-red-400">
//       {error}
//     </div>
//   );

//   return <CampaignDetails campaign={campaign} />;
// }