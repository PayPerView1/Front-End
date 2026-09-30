'use client';
import React from 'react';
import { Wallet, CreditCard, Shield, CheckCircle } from 'lucide-react';

export default function TopCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {/* Card 1 */}
      <div className="bg-[rgba(25,30,31,1)] rounded-2xl p-5 border border-[rgba(63,73,69,1)] flex flex-col justify-between">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3">
            <div className="bg-[rgba(63,73,69,0.5)] p-2 rounded-lg">
              <Wallet className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-sm text-[#9A9A9A] font-medium">الرصيد المتاح للاسترداد الفوري</h3>
              <span className="text-[10px] text-[#666666]">قابل للتحويل الخارجي</span>
            </div>
          </div>
          <span className="bg-[rgba(63,73,69,1)] text-white text-[10px] px-2 py-1 rounded">متاح الآن</span>
        </div>
        
        <div className="mb-4">
          <div className="flex items-baseline gap-1 justify-end">
            <span className="text-sm text-[#9A9A9A]">USD</span>
            <span className="text-3xl font-bold text-[rgba(148,211,193,1)]">$2,850.00</span>
          </div>
          <p className="text-[11px] text-[#666666] text-end mt-1">ما يعادل تقريباً: 10,687.50 ر.س (سعر الصرف البنكي المعتمد 3.75)</p>
        </div>
        
        <div className="flex items-center gap-2 text-[rgba(148,211,193,1)] text-[11px] bg-[rgba(148,211,193,0.1)] p-2 rounded-lg mt-auto">
          <CheckCircle className="w-3 h-3 shrink-0" />
          <span>تم التحقق من ملكية الحساب ومصدر الأموال</span>
          <span className="mr-auto text-[#666666]">ID: ACC-7729-EM</span>
        </div>
      </div>

      {/* Card 2 */}
      <div className="bg-[rgba(25,30,31,1)] rounded-2xl p-5 border border-[rgba(63,73,69,1)] flex flex-col justify-between">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-[rgba(63,73,69,0.5)] p-2 rounded-lg">
            <CreditCard className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-sm text-[#9A9A9A] font-medium">الرصيد المحجوز لحملات نشطة</h3>
          </div>
        </div>
        
        <div className="mb-4 text-end">
          <div className="text-3xl font-bold text-[#FFC107]">$650.00</div>
          <p className="text-[11px] text-[#666666] mt-1">2 حملات ترويجية جارية الآن</p>
        </div>
        
        <div className="text-[11px] text-[#666666] bg-[rgba(17,20,21,0.5)] p-2 rounded-lg text-center border-t border-[rgba(63,73,69,1)] mt-auto">
          لا يمكن استرداده حتى إيقاف الحملات
        </div>
      </div>

      {/* Card 3 */}
      <div className="bg-[rgba(25,30,31,1)] rounded-2xl p-5 border border-[rgba(63,73,69,1)] flex flex-col justify-between">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-[rgba(63,73,69,0.5)] p-2 rounded-lg">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-sm text-[#9A9A9A] font-medium">ميزانية خالية من الالتزامات</h3>
          </div>
        </div>
        
        <div className="mb-4 text-end">
          <div className="text-3xl font-bold text-white">$2,850.00</div>
          <p className="text-[11px] text-[#666666] mt-1">جاهزة للصرف أو السحب الفوري</p>
        </div>
        
        <div className="mt-auto">
          <div className="w-full bg-[rgba(63,73,69,1)] rounded-full h-1.5 mb-2">
            <div className="bg-teal-400 h-1.5 rounded-full" style={{ width: '81.5%' }}></div>
          </div>
          <div className="text-[11px] text-[#666666] text-center">
            نسبة السيولة المتاحة 81.5%
          </div>
        </div>
      </div>
    </div>
  );
}
