"use client";

import { useState } from "react";
import BankTransferPage from "./BankTransferPage";
import MultiDepositPage from "../../multi-deposit/components/MultiDepositPage";
import DepositGatewayPage from "../../deposit/components/DepositGatewayPage";
import DepositSuccessPage from "../../deposit-success/components/DepositSuccessPage";
import { FiLayers, FiCreditCard, FiGlobe, FiCheckCircle } from "react-icons/fi";

export default function BankTransferTabsWrapper() {
  const [activeTab, setActiveTab] = useState("success"); // Default to 143 as newly requested!

  return (
    <div>
      {/* Top Switcher Bar between 126, 143, 127 and 130 */}
      <div className="bg-[#0B0D0E] border-b border-white/10 px-4 py-2.5 flex items-center justify-between flex-wrap gap-2 text-xs">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-gray-400 font-medium">عرض شاشة التدفق:</span>

          {/* Tab 1: 126 */}
          <button
            type="button"
            onClick={() => setActiveTab("gateway")}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer font-medium ${
              activeTab === "gateway"
                ? "bg-[#94D3C1]/20 border border-[#94D3C1] text-[#94D3C1] shadow-[0_0_10px_rgba(148,211,193,0.2)]"
                : "bg-white/5 border border-white/10 text-gray-400 hover:text-white"
            }`}
          >
            <FiGlobe size={14} />
            <span>1. اختيار وسيلة الدفع (MacBook Pro 126)</span>
          </button>

          {/* Tab 2: 143 (Deposit Success) */}
          <button
            type="button"
            onClick={() => setActiveTab("success")}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer font-medium ${
              activeTab === "success"
                ? "bg-[#94D3C1]/20 border border-[#94D3C1] text-[#94D3C1] shadow-[0_0_10px_rgba(148,211,193,0.2)]"
                : "bg-white/5 border border-white/10 text-gray-400 hover:text-white"
            }`}
          >
            <FiCheckCircle size={14} />
            <span>2. تأكيد الشحن ونجاح الإيداع (MacBook Pro 143)</span>
          </button>

          {/* Tab 3: 127 */}
          <button
            type="button"
            onClick={() => setActiveTab("multi-deposit")}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer font-medium ${
              activeTab === "multi-deposit"
                ? "bg-[#94D3C1]/20 border border-[#94D3C1] text-[#94D3C1] shadow-[0_0_10px_rgba(148,211,193,0.2)]"
                : "bg-white/5 border border-white/10 text-gray-400 hover:text-white"
            }`}
          >
            <FiLayers size={14} />
            <span>3. الرصيد التراكمي والشحن المتعدد (MacBook Pro 127)</span>
          </button>

          {/* Tab 4: 130 */}
          <button
            type="button"
            onClick={() => setActiveTab("bank-transfer")}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer font-medium ${
              activeTab === "bank-transfer"
                ? "bg-[#94D3C1]/20 border border-[#94D3C1] text-[#94D3C1] shadow-[0_0_10px_rgba(148,211,193,0.2)]"
                : "bg-white/5 border border-white/10 text-gray-400 hover:text-white"
            }`}
          >
            <FiCreditCard size={14} />
            <span>4. تدقيق وتأكيد التحويل المصرفي (MacBook Pro 130)</span>
          </button>
        </div>

        <div className="text-[11px] text-gray-500 font-mono">
          {activeTab === "gateway"
            ? "MacBook Pro 16_ - 126"
            : activeTab === "success"
            ? "MacBook Pro 16_ - 143"
            : activeTab === "multi-deposit"
            ? "MacBook Pro 16_ - 127"
            : "MacBook Pro 16_ - 130"}
        </div>
      </div>

      {/* Render Current Tab */}
      {activeTab === "gateway" ? (
        <DepositGatewayPage />
      ) : activeTab === "success" ? (
        <DepositSuccessPage />
      ) : activeTab === "multi-deposit" ? (
        <MultiDepositPage />
      ) : (
        <BankTransferPage />
      )}
    </div>
  );
}
