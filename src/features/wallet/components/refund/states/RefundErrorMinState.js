'use client';
import React, { useState } from 'react';
import { 
  AlertCircle, Shield, XCircle, Calculator, Info, Headset, Landmark, CreditCard, Clock
} from 'lucide-react';

export default function RefundErrorMinState({ onSwitchState }) {
  const [amount, setAmount] = useState('5.00');
  const [selectedMethod, setSelectedMethod] = useState('original');
  const [agree, setAgree] = useState(false);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      {/* Right Column (Wide) */}
      <div className="lg:col-span-2 space-y-6">
        
        {/* Error Banner */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white">فحص صلاحية مبلغ الاسترداد</h2>
        </div>
        
        <div className="bg-[#151819] border border-[#DC2626]/50 rounded-2xl p-6 mb-6 relative overflow-hidden">
          <div className="flex items-start gap-4">
            <div className="bg-[#DC2626]/10 p-2 rounded-full shrink-0">
              <AlertCircle className="w-6 h-6 text-[#DC2626]" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white mb-4">لا يمكن إتمام الطلب: المبلغ المدخل أقل من الحد الأدنى المسموح به</h3>
              
              <div className="bg-[#101213] border border-[#DC2626]/30 rounded-xl p-4 mb-4">
                <p className="text-[#DC2626] font-bold text-sm text-center">الحد الأدنى لمبلغ الاسترداد هو $10.00 (The minimum refund is $10) !</p>
              </div>
              
              <p className="text-xs text-[#8A9490] leading-relaxed">
                نظراً للتكاليف التشغيلية ورسوم بوابات الدفع المصرفية العكسية (2%)، فإن منصة إعلانات الزمرد الرقمية لا تقبل طلبات الاسترداد التي تقل قيمتها عن <span className="text-white font-bold">10.00 دولار أمريكي</span>. يرجى تعديل المبلغ المدخل للمتابعة.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-[#151819] rounded-2xl border border-white/[.08] p-6">
          <div className="flex justify-between items-center mb-6">
            <span className="text-xs text-[#8A9490]">الخطوة 1 من 2</span>
            <h2 className="text-sm font-bold text-white">إعداد وتأكيد تفاصيل الاسترداد</h2>
          </div>
          <p className="text-[10px] text-[#8A9490] text-end mb-6">قم بتحديد المبلغ واختيار الوجهة البنكية المعتمدة لاستلام الرصيد المسترد.</p>

          <div className="mb-2">
            <div className="flex justify-between items-end mb-2">
              <span className="text-[11px] text-[#8A9490]">الحد الأقصى المتاح: 2,850.00$</span>
              <label className="text-sm font-medium text-white">المبلغ المطلوب استرداده بالدولار الأمريكي (USD) *</label>
            </div>
            <div className="relative">
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[#8A9490] font-bold">$</span>
              <input 
                type="text" 
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full bg-[#101213] border border-[#DC2626]/50 rounded-xl py-4 pr-8 pl-4 text-white text-lg font-bold text-left focus:outline-none focus:border-[#DC2626] transition-colors"
              />
            </div>
          </div>
          
          <div className="bg-[#DC2626]/10 border border-[#DC2626]/20 rounded-lg p-3 flex gap-2 mb-8">
            <AlertCircle className="w-4 h-4 text-[#DC2626] shrink-0" />
            <span className="text-xs text-[#DC2626] font-bold">خطأ في التحقق: المبلغ ${amount} غير صالح. الحد الأدنى لمبلغ الاسترداد هو $10.00</span>
          </div>

          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <span className="text-xs text-[#94D3C1]">تجاوز الخطأ باختيار شريحة</span>
              <span className="text-xs text-[#8A9490]">مبالغ سريعة مقترحة (مطابقة للضوابط):</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
              <button className="bg-[#101213] border border-white/[.08] hover:border-[#8A9490] text-white flex flex-col items-center justify-center py-3 rounded-xl transition-colors">
                <span className="font-bold text-sm mb-1">$2,850.00</span>
                <span className="text-[9px] text-[#8A9490]">كامل الرصيد المتاح</span>
              </button>
              <button className="bg-[#101213] border border-white/[.08] hover:border-[#8A9490] text-white flex flex-col items-center justify-center py-3 rounded-xl transition-colors">
                <span className="font-bold text-sm mb-1">$100.00</span>
                <span className="text-[9px] text-[#8A9490]">شريحة متقدمة</span>
              </button>
              <button className="bg-[#101213] border border-white/[.08] hover:border-[#8A9490] text-white flex flex-col items-center justify-center py-3 rounded-xl transition-colors">
                <span className="font-bold text-sm mb-1">$50.00</span>
                <span className="text-[9px] text-[#8A9490]">شريحة متوسطة</span>
              </button>
              <button className="bg-[#101213] border border-white/[.08] hover:border-[#8A9490] text-white flex flex-col items-center justify-center py-3 rounded-xl transition-colors">
                <span className="font-bold text-sm mb-1">$25.00</span>
                <span className="text-[9px] text-[#8A9490]">شريحة أساسية</span>
              </button>
              <button className="bg-[#E9C349]/10 border border-[#E9C349]/30 text-[#E9C349] flex flex-col items-center justify-center py-3 rounded-xl transition-colors relative">
                <div className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#E9C349]"></div>
                <span className="font-bold text-sm mb-1">$10.00</span>
                <span className="text-[9px] text-[#E9C349]/70">الحد الأدنى (موصى به)</span>
              </button>
            </div>
          </div>

          <div className="flex items-start gap-3 bg-[#101213] p-4 rounded-xl border border-white/[.08] mb-8">
            <div className="mt-0.5">
              <input 
                type="checkbox" 
                className="w-4 h-4 accent-[#94D3C1]"
                checked={agree}
                onChange={(e) => setAgree(e.target.checked)}
              />
            </div>
            <p className="text-[10px] text-[#8A9490] leading-relaxed text-end flex-1">
              أقر بموافقتي على شروط استرداد الميزانية، وتطبيق الرسوم الإدارية والمصرفية المقررة، وأتفهم أن الحد الأدنى الإلزامي هو <span className="font-bold text-white">$10.00</span> لتمكين إرسال المطالبة عبر شبكة الدفع.
            </p>
          </div>

          <div className="flex gap-4">
            <button className="bg-[#101213] hover:bg-white/[.08] border border-white/[.08] text-white text-sm font-medium py-3 px-6 rounded-xl transition-colors shrink-0">
              إلغاء والعودة للمحفظة
            </button>
            <button className="flex-1 bg-white/[.08] text-[#8A9490] text-sm font-bold py-3 rounded-xl cursor-not-allowed flex items-center justify-center gap-2">
              <Shield className="w-4 h-4" />
              متابعة طلب الاسترداد (معطل - يلزم تصحيح المبلغ)
            </button>
          </div>

        </div>
      </div>

      {/* Left Column (Narrow) */}
      <div className="space-y-6">
        
        {/* Live Calc */}
        <div className="bg-[#151819] rounded-2xl border border-white/[.08] p-6">
          <div className="flex justify-between items-center mb-6">
            <Calculator className="w-4 h-4 text-[#94D3C1]" />
            <h2 className="text-sm font-bold text-white">جدول المحاكاة والخصومات الحالية</h2>
            <span className="text-[9px] text-[#8A9490] uppercase">Live Calc</span>
          </div>

          <div className="space-y-4 mb-6">
            <div className="flex justify-between items-center text-xs pb-3 border-b border-white/[.08]">
              <span className="text-[#8A9490]">المبلغ المدخل حالياً:</span>
              <span className="font-bold text-white">${amount}</span>
            </div>
            <div className="flex justify-between items-center text-xs pb-3 border-b border-white/[.08]">
              <span className="text-[#8A9490]">حالة المطابقة النظامية:</span>
              <span className="text-[#DC2626] flex items-center gap-1 font-bold">
                غير مطابق (أقل من الحد) <XCircle className="w-3 h-3" />
              </span>
            </div>
            <div className="flex justify-between items-center text-xs pb-3 border-b border-white/[.08]">
              <span className="text-[#8A9490]">الحد الأدنى المطلوب:</span>
              <span className="font-bold text-white">$10.00</span>
            </div>
            <div className="flex justify-between items-center text-xs pb-3 border-b border-white/[.08]">
              <span className="text-[#8A9490]">رسوم بوابات المعالجة العكسية (2%):</span>
              <span className="font-bold text-white">$0.20</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-[#8A9490]">رسوم التدقيق الأمني:</span>
              <span className="text-[#E9C349] font-bold">مجاناً ($0.00)</span>
            </div>
          </div>

          <div className="bg-[#101213] rounded-xl p-4 border border-white/[.08] mb-6">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs text-white">صافي الاسترداد المتوقع عند الحد الأدنى:</span>
              <span className="text-lg font-bold text-[#94D3C1]">$9.80</span>
            </div>
            <div className="text-[9px] text-[#8A9490] text-end">المبلغ الذي سيصل لحسابك البنكي الفعلي بعد خصم تكلفة المعالجة</div>
          </div>

          <div className="flex justify-between items-center text-xs pt-4 border-t border-white/[.08]">
            <span className="text-[#8A9490]">رصيد المحفظة المتبقي بعد الاسترداد:</span>
            <span className="font-bold text-white">$2840.00</span>
          </div>
        </div>

        {/* Support Banner */}
        <div className="flex items-center justify-between p-4 bg-[#151819] border border-white/[.08] rounded-2xl cursor-pointer hover:border-[#94D3C1] transition-colors">
          <span className="text-xs font-bold text-[#94D3C1]">محادثة فورية</span>
          <div className="flex items-center gap-3">
            <div className="text-end">
              <h4 className="text-xs font-bold text-white mb-0.5">فريق الدعم المالي السريع</h4>
              <p className="text-[9px] text-[#8A9490]">متاح على مدار 24 ساعة للمساعدة في فك حظر العمليات</p>
            </div>
            <div className="bg-[#E9C349]/10 p-2 rounded-lg">
              <Headset className="w-4 h-4 text-[#E9C349]" />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
