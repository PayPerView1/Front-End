'use client';
import React, { useState } from 'react';
import { 
  AlertCircle, Shield, XCircle, Calculator, Info, Headset
} from 'lucide-react';

export default function ErrorMinState({ onSwitchState }) {
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
        
        <div className="bg-[#1E1515] border border-[#E53535]/50 rounded-2xl p-6 mb-6 relative overflow-hidden">
          <div className="flex items-start gap-4">
            <div className="bg-[#E53535]/10 p-2 rounded-full shrink-0">
              <AlertCircle className="w-6 h-6 text-[#E53535]" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white mb-4">لا يمكن إتمام الطلب: المبلغ المدخل أقل من الحد الأدنى المسموح به</h3>
              
              <div className="bg-[rgba(17,20,21,1)] border border-[#E53535]/30 rounded-xl p-4 mb-4">
                <p className="text-[#E53535] font-bold text-sm text-center">الحد الأدنى لمبلغ الاسترداد هو $10.00 (The minimum refund is $10) !</p>
              </div>
              
              <p className="text-xs text-[#9A9A9A] leading-relaxed">
                نظراً للتكاليف التشغيلية ورسوم بوابات الدفع المصرفية العكسية (2%)، فإن منصة إعلانات الزمرد الرقمية لا تقبل طلبات الاسترداد التي تقل قيمتها عن <span className="text-white font-bold">10.00 دولار أمريكي</span>. يرجى تعديل المبلغ المدخل للمتابعة.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-[rgba(25,30,31,1)] rounded-2xl border border-[rgba(63,73,69,1)] p-6">
          <div className="flex justify-between items-center mb-6">
            <span className="text-xs text-[#666666]">الخطوة 1 من 2</span>
            <h2 className="text-sm font-bold text-white">إعداد وتأكيد تفاصيل الاسترداد</h2>
          </div>
          <p className="text-[10px] text-[#666666] text-end mb-6">قم بتحديد المبلغ واختيار الوجهة البنكية المعتمدة لاستلام الرصيد المسترد.</p>

          <div className="mb-2">
            <div className="flex justify-between items-end mb-2">
              <span className="text-[11px] text-[#666666]">الحد الأقصى المتاح: 2,850.00$</span>
              <label className="text-sm font-medium text-white">المبلغ المطلوب استرداده بالدولار الأمريكي (USD) *</label>
            </div>
            <div className="relative">
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[#9A9A9A] font-bold">$</span>
              <input 
                type="text" 
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full bg-[rgba(17,20,21,1)] border border-[#E53535]/50 rounded-xl py-4 pr-8 pl-4 text-white text-lg font-bold text-left focus:outline-none focus:border-[#E53535] transition-colors"
              />
            </div>
          </div>
          
          <div className="bg-[#E53535]/10 border border-[#E53535]/20 rounded-lg p-3 flex gap-2 mb-8">
            <AlertCircle className="w-4 h-4 text-[#E53535] shrink-0" />
            <span className="text-xs text-[#E53535] font-bold">خطأ في التحقق: المبلغ ${amount} غير صالح. الحد الأدنى لمبلغ الاسترداد هو $10.00</span>
          </div>

          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <span className="text-xs text-[rgba(148,211,193,1)]">تجاوز الخطأ باختيار شريحة</span>
              <span className="text-xs text-[#9A9A9A]">مبالغ سريعة مقترحة (مطابقة للضوابط):</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
              <button className="bg-[rgba(17,20,21,1)] border border-[rgba(63,73,69,1)] hover:border-[#9A9A9A] text-white flex flex-col items-center justify-center py-3 rounded-xl transition-colors">
                <span className="font-bold text-sm mb-1">$2,850.00</span>
                <span className="text-[9px] text-[#666666]">كامل الرصيد المتاح</span>
              </button>
              <button className="bg-[rgba(17,20,21,1)] border border-[rgba(63,73,69,1)] hover:border-[#9A9A9A] text-white flex flex-col items-center justify-center py-3 rounded-xl transition-colors">
                <span className="font-bold text-sm mb-1">$100.00</span>
                <span className="text-[9px] text-[#666666]">شريحة متقدمة</span>
              </button>
              <button className="bg-[rgba(17,20,21,1)] border border-[rgba(63,73,69,1)] hover:border-[#9A9A9A] text-white flex flex-col items-center justify-center py-3 rounded-xl transition-colors">
                <span className="font-bold text-sm mb-1">$50.00</span>
                <span className="text-[9px] text-[#666666]">شريحة متوسطة</span>
              </button>
              <button className="bg-[rgba(17,20,21,1)] border border-[rgba(63,73,69,1)] hover:border-[#9A9A9A] text-white flex flex-col items-center justify-center py-3 rounded-xl transition-colors">
                <span className="font-bold text-sm mb-1">$25.00</span>
                <span className="text-[9px] text-[#666666]">شريحة أساسية</span>
              </button>
              <button className="bg-[#FFC107]/10 border border-[#FFC107]/30 text-[#FFC107] flex flex-col items-center justify-center py-3 rounded-xl transition-colors relative">
                <div className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#FFC107]"></div>
                <span className="font-bold text-sm mb-1">$10.00</span>
                <span className="text-[9px] text-[#FFC107]/70">الحد الأدنى (موصى به)</span>
              </button>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-xs text-[#9A9A9A] text-end mb-4">اختر وجهة استلام مبلغ الاسترداد:</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Option 2 */}
              <label className={`cursor-pointer border rounded-xl p-4 transition-colors ${selectedMethod === 'bank' ? 'bg-[rgba(148,211,193,0.05)] border-[rgba(148,211,193,0.5)]' : 'bg-[rgba(17,20,21,1)] border-[rgba(63,73,69,1)] hover:border-[rgba(148,211,193,1)]'}`}>
                <div className="flex justify-between items-start gap-4 text-end">
                  <div className="mt-1">
                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${selectedMethod === 'bank' ? 'border-[rgba(148,211,193,1)]' : 'border-gray-500'}`}>
                      {selectedMethod === 'bank' && <div className="w-2 h-2 rounded-full bg-[rgba(148,211,193,1)]"></div>}
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-end items-center gap-2 mb-1">
                      <h4 className="text-sm font-bold text-white">تحويل بنكي محلي (آيبان)</h4>
                      <Landmark className="w-4 h-4 text-[#9A9A9A]" />
                    </div>
                    <p className="text-[10px] text-[#9A9A9A] mb-1" style={{ letterSpacing: '1px' }}>SA03 8000 0201 **** 5811</p>
                    <span className="text-[9px] text-[#666666]">معالجة عبر مسار سريع (SAR)</span>
                  </div>
                </div>
              </label>

              {/* Option 1 */}
              <label className={`cursor-pointer border rounded-xl p-4 transition-colors ${selectedMethod === 'original' ? 'bg-[rgba(148,211,193,0.05)] border-[rgba(148,211,193,0.5)]' : 'bg-[rgba(17,20,21,1)] border-[rgba(63,73,69,1)] hover:border-[rgba(148,211,193,1)]'}`}>
                <div className="flex justify-between items-start gap-4 text-end">
                  <div className="mt-1">
                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${selectedMethod === 'original' ? 'border-[rgba(148,211,193,1)]' : 'border-gray-500'}`}>
                      {selectedMethod === 'original' && <div className="w-2 h-2 rounded-full bg-[rgba(148,211,193,1)]"></div>}
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-end items-center gap-2 mb-1">
                      <h4 className="text-sm font-bold text-white">بطاقة مدى / فيزا الأصلية</h4>
                      <CreditCard className="w-4 h-4 text-[rgba(148,211,193,1)]" />
                    </div>
                    <p className="text-[10px] text-[#9A9A9A] mb-1">المنتهية بالأرقام <span className="font-bold text-white">4092 ****</span></p>
                    <span className="text-[9px] text-[#FFC107]">رسوم معالجة عكسية: 2.0%</span>
                  </div>
                </div>
              </label>
            </div>
          </div>

          <div className="flex items-start gap-3 bg-[rgba(17,20,21,1)] p-4 rounded-xl border border-[rgba(63,73,69,1)] mb-8">
            <div className="mt-0.5">
              <input 
                type="checkbox" 
                className="w-4 h-4 accent-[rgba(148,211,193,1)]"
                checked={agree}
                onChange={(e) => setAgree(e.target.checked)}
              />
            </div>
            <p className="text-[10px] text-[#9A9A9A] leading-relaxed text-end flex-1">
              أقر بموافقتي على شروط استرداد الميزانية، وتطبيق الرسوم الإدارية والمصرفية المقررة، وأتفهم أن الحد الأدنى الإلزامي هو <span className="font-bold text-white">$10.00</span> لتمكين إرسال المطالبة عبر شبكة الدفع.
            </p>
          </div>

          <div className="flex gap-4">
            <button className="bg-[rgba(17,20,21,1)] hover:bg-[rgba(63,73,69,0.5)] border border-[rgba(63,73,69,1)] text-white text-sm font-medium py-3 px-6 rounded-xl transition-colors shrink-0">
              إلغاء والعودة للمحفظة
            </button>
            <button className="flex-1 bg-[rgba(63,73,69,1)] text-[#666666] text-sm font-bold py-3 rounded-xl cursor-not-allowed flex items-center justify-center gap-2">
              <Shield className="w-4 h-4" />
              متابعة طلب الاسترداد (معطل - يلزم تصحيح المبلغ)
            </button>
          </div>

        </div>
      </div>

      {/* Left Column (Narrow) */}
      <div className="space-y-6">
        
        {/* Live Calc */}
        <div className="bg-[rgba(25,30,31,1)] rounded-2xl border border-[rgba(63,73,69,1)] p-6">
          <div className="flex justify-between items-center mb-6">
            <Calculator className="w-4 h-4 text-[rgba(148,211,193,1)]" />
            <h2 className="text-sm font-bold text-white">جدول المحاكاة والخصومات الحالية</h2>
            <span className="text-[9px] text-[#666666] uppercase">Live Calc</span>
          </div>

          <div className="space-y-4 mb-6">
            <div className="flex justify-between items-center text-xs pb-3 border-b border-[rgba(63,73,69,0.5)]">
              <span className="text-[#9A9A9A]">المبلغ المدخل حالياً:</span>
              <span className="font-bold text-white">${amount}</span>
            </div>
            <div className="flex justify-between items-center text-xs pb-3 border-b border-[rgba(63,73,69,0.5)]">
              <span className="text-[#9A9A9A]">حالة المطابقة النظامية:</span>
              <span className="text-[#E53535] flex items-center gap-1 font-bold">
                غير مطابق (أقل من الحد) <XCircle className="w-3 h-3" />
              </span>
            </div>
            <div className="flex justify-between items-center text-xs pb-3 border-b border-[rgba(63,73,69,0.5)]">
              <span className="text-[#9A9A9A]">الحد الأدنى المطلوب:</span>
              <span className="font-bold text-white">$10.00</span>
            </div>
            <div className="flex justify-between items-center text-xs pb-3 border-b border-[rgba(63,73,69,0.5)]">
              <span className="text-[#9A9A9A]">رسوم بوابات المعالجة العكسية (2%):</span>
              <span className="font-bold text-white">$0.20</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-[#9A9A9A]">رسوم التدقيق الأمني:</span>
              <span className="text-[#FFC107] font-bold">مجاناً ($0.00)</span>
            </div>
          </div>

          <div className="bg-[rgba(17,20,21,1)] rounded-xl p-4 border border-[rgba(63,73,69,1)] mb-6">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs text-white">صافي الاسترداد المتوقع عند الحد الأدنى:</span>
              <span className="text-lg font-bold text-[rgba(148,211,193,1)]">$9.80</span>
            </div>
            <div className="text-[9px] text-[#666666] text-end">المبلغ الذي سيصل لحسابك البنكي الفعلي بعد خصم تكلفة المعالجة</div>
          </div>

          <div className="flex justify-between items-center text-xs pt-4 border-t border-[rgba(63,73,69,1)]">
            <span className="text-[#9A9A9A]">رصيد المحفظة المتبقي بعد الاسترداد:</span>
            <span className="font-bold text-white">$2840.00</span>
          </div>
        </div>

        {/* Security Rules */}
        <div className="bg-[#1E1B10] border border-yellow-900/30 rounded-2xl p-6">
          <div className="flex justify-end items-center gap-2 mb-6">
            <h3 className="text-sm font-bold text-[#FFC107]">الضوابط المصرفية والمعايير الشرعية</h3>
            <Shield className="w-5 h-5 text-[#FFC107]" />
          </div>

          <div className="space-y-4 text-end">
            <div>
              <h4 className="text-xs font-bold text-white mb-1 flex items-center justify-end gap-2">
                قاعدة الحد الأدنى ($10): <CheckCircle className="w-3 h-3 text-[#FFC107]" />
              </h4>
              <p className="text-[10px] text-[#9A9A9A] leading-relaxed">
                تم اعتماد هذا السقف بالتعاون مع البنوك الشريكة لتجنب استنزاف أرصدة الحملات الصغيرة برسوم المقاصة البنكية الثابتة.
              </p>
            </div>
            <div>
              <h4 className="text-xs font-bold text-white mb-1 flex items-center justify-end gap-2">
                مدة التنفيذ: <Clock className="w-3 h-3 text-[#FFC107]" />
              </h4>
              <p className="text-[10px] text-[#9A9A9A] leading-relaxed">
                تودع المبالغ المستردة في البطاقة المصرفية خلال <span className="text-[#FFC107]">3 إلى 5 أيام عمل</span> دون احتساب العطلات الرسمية.
              </p>
            </div>
            <div>
              <h4 className="text-xs font-bold text-white mb-1 flex items-center justify-end gap-2">
                الامتثال الشرعي: <Shield className="w-3 h-3 text-[#FFC107]" />
              </h4>
              <p className="text-[10px] text-[#9A9A9A] leading-relaxed">
                تخضع جميع عمليات التحويل والاسترداد للتدقيق للهيئة الشرعية المعتمدة للمنصة، دون أي فوائد أو غرامات تأخير.
              </p>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-yellow-900/30 flex justify-between items-center">
            <button className="bg-[rgba(17,20,21,1)] hover:bg-[rgba(63,73,69,0.5)] border border-[rgba(63,73,69,1)] text-white text-xs px-4 py-2 rounded-lg transition-colors">
              طلب إغلاق الحساب
            </button>
            <div className="text-end">
              <h4 className="text-[11px] font-bold text-white">هل رصيدك الكلي أقل من $10؟</h4>
              <p className="text-[9px] text-[#666666]">تواصل مع مسؤول تسوية الحسابات</p>
            </div>
          </div>
        </div>

        {/* Support Banner */}
        <div className="flex items-center justify-between p-4 bg-[rgba(25,30,31,1)] border border-[rgba(63,73,69,1)] rounded-2xl cursor-pointer hover:border-[rgba(148,211,193,1)] transition-colors">
          <span className="text-xs font-bold text-[rgba(148,211,193,1)]">محادثة فورية</span>
          <div className="flex items-center gap-3">
            <div className="text-end">
              <h4 className="text-xs font-bold text-white mb-0.5">فريق الدعم المالي السريع</h4>
              <p className="text-[9px] text-[#666666]">متاح على مدار 24 ساعة للمساعدة في فك حظر العمليات</p>
            </div>
            <div className="bg-[#FFC107]/10 p-2 rounded-lg">
              <Headset className="w-4 h-4 text-[#FFC107]" />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
