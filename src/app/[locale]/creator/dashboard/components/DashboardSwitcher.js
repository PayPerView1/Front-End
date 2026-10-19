"use client";

import { useState } from "react";
import ProfileContent from "@/app/[locale]/creator/dashboard/components/ProfileContent";
import CreatorDashboard from "@/features/dashboard/CreatorDashboard";

export default function DashboardSwitcher() {
  const [view, setView] = useState("dashboard");

  if (view === "profile") {
    return (
      <div>
        <div className="p-3 px-6 bg-[#12151C] border-b border-[#1E2430] flex justify-between items-center">
          <span className="text-xs text-[#94A3B8]">عرض الملف الشخصي للصانع</span>
          <button
            type="button"
            onClick={() => setView("dashboard")}
            className="text-xs bg-[#1A222F] text-[#2DD4BF] px-3 py-1.5 rounded-lg border border-[#263345] hover:bg-[#202B3C] cursor-pointer"
          >
            ← العودة إلى لوحة التحكم الرئيسية
          </button>
        </div>
        <ProfileContent />
      </div>
    );
  }

  return <CreatorDashboard standalone={false} />;
}
