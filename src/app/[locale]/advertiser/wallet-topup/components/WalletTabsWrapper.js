"use client";

import { useState } from "react";
import WalletTopupPage from "./WalletTopupPage";
import WalletTopup133Page from "./WalletTopup133Page";
import WalletTopup134Page from "./WalletTopup134Page";
import WalletTopup135Page from "./WalletTopup135Page";
import WalletTopup142Page from "./WalletTopup142Page";
import PaymentFailed124Page from "./PaymentFailed124Page";
import PaymentCancelled125Page from "./PaymentCancelled125Page";
import {
  FiCreditCard,
  FiXCircle,
  FiAlertTriangle,
  FiCheckCircle,
  FiAlertCircle,
  FiSlash,
  FiDollarSign,
} from "react-icons/fi";

const TABS = [
  { id: "136",  label: "136 — شحن المحفظة (الرئيسية)",          icon: FiCreditCard     },
  { id: "142",  label: "142 — تأكيد العملية",                    icon: FiCheckCircle    },
  { id: "133",  label: "133 — خطأ: الحد الأدنى",                icon: FiAlertTriangle  },
  { id: "134",  label: "134 — خطأ: الحد الأقصى",                icon: FiAlertCircle    },
  { id: "135",  label: "135 — خطأ: أحرف غير صحيحة",             icon: FiSlash          },
  { id: "124",  label: "124 — فشل الدفع",                       icon: FiXCircle        },
  { id: "125",  label: "125 — إلغاء الدفع",                     icon: FiDollarSign     },
];

export default function WalletTabsWrapper() {
  const [activeTab, setActiveTab] = useState("136");

  return (
    <div>
      {/* ── Top Switcher Bar ── */}
      <div className="bg-[#0B0D0E] border-b border-white/10 px-4 py-2.5 flex items-center justify-between flex-wrap gap-2 text-xs">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-gray-400 font-medium">عرض شاشة التدفق:</span>

          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => setActiveTab(id)}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer font-medium ${
                activeTab === id
                  ? "bg-[#94D3C1]/20 border border-[#94D3C1] text-[#94D3C1] shadow-[0_0_10px_rgba(148,211,193,0.2)]"
                  : "bg-white/5 border border-white/10 text-gray-400 hover:text-white"
              }`}
            >
              <Icon size={13} />
              <span>{label}</span>
            </button>
          ))}
        </div>

        <div className="text-[11px] text-gray-500 font-mono shrink-0">
          MacBook Pro 16_ - {activeTab}
        </div>
      </div>

      {/* ── Render Current Tab ── */}
      {activeTab === "136"  && <WalletTopupPage />}
      {activeTab === "142"  && <WalletTopup142Page />}
      {activeTab === "133"  && <WalletTopup133Page />}
      {activeTab === "134"  && <WalletTopup134Page />}
      {activeTab === "135"  && <WalletTopup135Page />}
      {activeTab === "124"  && <PaymentFailed124Page />}
      {activeTab === "125"  && <PaymentCancelled125Page />}
    </div>
  );
}
