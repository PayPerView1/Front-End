'use client';
import React from 'react';
import { Wallet, CreditCard, Shield, CheckCircle } from 'lucide-react';

export default function RefundTopCards({ walletBalance = 0, reservedBalance = 0, availableBalance = 0 }) {
  const format = (amount) => amount == null ? "—" : Number(amount).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {/* Card 1 */}
      <div className="bg-[#151819] rounded-2xl p-5 border border-white/[.08] flex flex-col justify-between">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3">
            <div className="bg-white/[.08] p-2 rounded-lg">
              <Wallet className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-sm text-white font-medium">الرصيد المتاح للاسترداد الفوري</h3>
              <span className="text-[10px] text-[#8A9490]">قابل للتحويل الخارجي</span>
            </div>
          </div>
          <span className="bg-white/[.08] text-white text-[10px] px-2 py-1 rounded">متاح الآن</span>
        </div>
        
        <div className="mb-4">
          <div className="flex items-baseline gap-1 justify-end">
            <span className="text-sm text-[#8A9490]">USD</span>
            <span className="text-3xl font-bold text-[#94D3C1]">${format(availableBalance)}</span>
          </div>
          <p className="text-[11px] text-[#8A9490] text-end mt-1">ما يعادل تقريباً: {format(availableBalance * 3.75)} ر.س (سعر الصرف البنكي 3.75)</p>
        </div>
        
        <div className="flex items-center gap-2 text-[#94D3C1] text-[11px] bg-[rgba(148,211,193,0.1)] p-2 rounded-lg mt-auto">
          <CheckCircle className="w-3 h-3 shrink-0" />
          <span>تم التحقق من ملكية الحساب ومصدر الأموال</span>
          <span className="mr-auto text-[#8A9490]">ID: ACC-7729-EM</span>
        </div>
      </div>

      {/* Card 2 */}
      <div className="bg-[#151819] rounded-2xl p-5 border border-white/[.08] flex flex-col justify-between">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-white/[.08] p-2 rounded-lg">
            <CreditCard className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-sm text-white font-medium">الرصيد المحجوز لحملات نشطة</h3>
          </div>
        </div>
        
        <div className="mb-4 text-end">
          <div className="text-3xl font-bold text-[#E9C349]">${format(reservedBalance)}</div>
          <p className="text-[11px] text-[#8A9490] mt-1">الرصيد المرتبط بميزانيات الحملات النشطة</p>
        </div>
        
        <div className="text-[11px] text-[#8A9490] bg-[#101213] p-2 rounded-lg text-center border-t border-white/[.08] mt-auto">
          لا يمكن استرداده حتى إيقاف الحملات
        </div>
      </div>

      {/* Card 3 */}
      <div className="bg-[#151819] rounded-2xl p-5 border border-white/[.08] flex flex-col justify-between">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-white/[.08] p-2 rounded-lg">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-sm text-white font-medium">ميزانية خالية من الالتزامات</h3>
          </div>
        </div>
        
        <div className="mb-4 text-end">
          <div className="text-3xl font-bold text-white">${format(walletBalance)}</div>
          <p className="text-[11px] text-[#8A9490] mt-1">الرصيد الحالي في المحفظة</p>
        </div>
        
        <div className="mt-auto">
          <div className="w-full bg-white/[.08] rounded-full h-1.5 mb-2">
            <div className="bg-teal-400 h-1.5 rounded-full" style={{ width: `${walletBalance > 0 && availableBalance != null ? Math.min(100, (availableBalance / walletBalance) * 100) : 0}%` }}></div>
          </div>
          <div className="text-[11px] text-[#8A9490] text-center">
            نسبة السيولة المتاحة {walletBalance > 0 && availableBalance != null ? Math.round((availableBalance / walletBalance) * 100) : '—'}%
          </div>
        </div>
      </div>
    </div>
  );
}
