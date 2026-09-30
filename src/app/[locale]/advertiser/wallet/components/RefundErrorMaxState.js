'use client';
import React, { useState } from 'react';
import { 
  AlertCircle, Shield, XCircle, Calculator, Info, Headset, Landmark, CreditCard, Clock, Lock
} from 'lucide-react';

export default function RefundErrorMaxState({ onSwitchState }) {
  const [amount, setAmount] = useState('3,500.00');
  const [selectedMethod, setSelectedMethod] = useState('original');
  const [agree, setAgree] = useState(false);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      {/* Right Column (Wide) */}
      <div className="lg:col-span-2 space-y-6">
        
        {/* Error Banner */}
        <div className="bg-[#1E1515] border border-[#E53535]/50 rounded-2xl p-6 mb-6">
          <div className="flex items-start gap-4">
            <div className="bg-[#E53535]/10 p-2 rounded-lg shrink-0">
              <AlertCircle className="w-6 h-6 text-[#E53535]" />
            </div>
            <div className="w-full">
              <h3 className="text-lg font-bold text-white mb-4">لا يمكن إتمام الطلب: المبلغ المطلوب يتجاوز الرصيد المتاح في المحفظة</h3>
              
              <div className="bg-[rgba(17,20,21,1)] border border-[#E53535]/30 rounded-xl p-4 mb-4 flex items-center justify-center gap-2">
                <XCircle className="w-5 h-5 text-[#E53535]" />
                <p className="text-[#E53535] font-bold text-sm">المبلغ المطلوب يتجاوز الرصيد المتاح. الرصيد المتاح: $2,850.00 دولار أمريكي</p>
              </div>
              
              <p className="text-xs text-[#9A9A9A] leading-relaxed">
                وفقاً للسياسات المالية للمنصة والمعايير الشرعية المعتمدة، لا يمكن سحب مبالغ تتجاوز رصيد المحفظة الصافي أو استخدام الأرصدة المحجوزة لتغطية الحملات الإعلانية القائمة في حسابك.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-[rgba(25,30,31,1)] rounded-2xl border border-[rgba(63,73,69,1)] p-6">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2">
              <span className="text-xs text-[rgba(148,211,193,1)]">نموذج استرداد السيولة المعتمد</span>
              <Shield className="w-3 h-3 text-[rgba(148,211,193,1)]" />
            </div>
            <h2 className="text-sm font-bold text-white">الخطوة 1 من 2 - تدقيق وتحديد تفاصيل الاسترداد</h2>
          </div>

          <div className="mb-2">
            <div className="flex justify-between items-end mb-2">
              <span className="text-[11px] text-[#666666]">العملة الأساسية: USD ($)</span>
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-[#E53535] font-bold">(غير مطابق للسقف)</span>
                <label className="text-sm font-medium text-white">المبلغ المراد استرداده</label>
              </div>
            </div>
            <div className="relative">
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[#9A9A9A] font-bold">$</span>
              <input 
                type="text" 
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full bg-[rgba(17,20,21,1)] border border-[#E53535]/50 rounded-xl py-4 pr-8 pl-4 text-[#E53535] text-lg font-bold text-left focus:outline-none focus:border-[#E53535] transition-colors"
              />
            </div>
          </div>
          
          <div className="bg-[#E53535]/10 border border-[#E53535]/20 rounded-lg p-3 flex justify-end gap-2 mb-8">
            <span className="text-xs text-[#E53535] font-bold">خطأ في التحقق: المبلغ ${amount} يتجاوز رصيدك المتاح البالغ $2,850.00. يرجى تصحيح القيمة للمتابعة.</span>
            <AlertCircle className="w-4 h-4 text-[#E53535] shrink-0" />
          </div>

          <div className="mb-8">
            <div className="text-end mb-4">
              <span className="text-xs text-[#9A9A9A]">اختيار سريع لمبالغ محددة مسبقاً:</span>
            </div>
            <div className="flex flex-wrap md:flex-nowrap gap-2 justify-end">
              <button className="bg-[rgba(17,20,21,1)] border border-[rgba(63,73,69,1)] hover:border-[#9A9A9A] text-[#9A9A9A] text-xs py-2 px-4 rounded-xl transition-colors">
                $10.00 (الحد الأدنى)
              </button>
              <button className="bg-[rgba(17,20,21,1)] border border-[rgba(63,73,69,1)] hover:border-[#9A9A9A] text-[#9A9A9A] text-xs py-2 px-4 rounded-xl transition-colors">
                $100.00
              </button>
              <button className="bg-[rgba(17,20,21,1)] border border-[rgba(63,73,69,1)] hover:border-[#9A9A9A] text-[#9A9A9A] text-xs py-2 px-4 rounded-xl transition-colors">
                $500.00
              </button>
              <button className="bg-[rgba(17,20,21,1)] border border-[rgba(63,73,69,1)] hover:border-[#9A9A9A] text-[#9A9A9A] text-xs py-2 px-4 rounded-xl transition-colors">
                $1,000.00
              </button>
              <button className="bg-[#FFC107]/10 border border-[#FFC107]/30 text-[#FFC107] text-xs py-2 px-4 rounded-xl transition-colors flex items-center gap-2">
                $2,850.00 (بكامل الرصيد المتاح - الحد الأقصى)
                <div className="w-1.5 h-1.5 rounded-full bg-[#FFC107]"></div>
              </button>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-xs font-bold text-white text-end mb-4">وجهة إيداع المبلغ المسترد:</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    <span className="text-[9px] text-[#666666]">مصرف الراجحي - تسوية سريعة</span>
                  </div>
                </div>
              </label>

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
              أقر بموافقتي على شروط استرداد الميزانية، وتطبيق الرسوم الإدارية والمصرفية المقررة، وأفهم أنه لا يمكن سحب مبالغ تتجاوز الرصيد الفعلي، وتخضع العملية للتدقيق المالي الفوري لمنع التعثر أو السحب على المكشوف.
            </p>
          </div>

          <div className="flex gap-4">
            <button className="bg-[rgba(17,20,21,1)] hover:bg-[rgba(63,73,69,0.5)] border border-[rgba(63,73,69,1)] text-white text-sm font-medium py-3 px-6 rounded-xl transition-colors shrink-0">
              إلغاء والعودة للمحفظة
            </button>
            <button className="flex-1 bg-[rgba(63,73,69,1)] text-[#666666] text-sm font-bold py-3 rounded-xl cursor-not-allowed flex items-center justify-center gap-2">
              <Lock className="w-4 h-4" />
              متابعة طلب الاسترداد (معطل - المبلغ يتجاوز الرصيد)
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
            <h2 className="text-sm font-bold text-white">جدول التدقيق والمطابقة المالية</h2>
          </div>

          <div className="space-y-4 mb-6">
            <div className="flex justify-between items-center text-xs pb-3 border-b border-[rgba(63,73,69,0.5)]">
              <span className="text-[#9A9A9A]">المبلغ المطلوب حالياً:</span>
              <span className="font-bold text-white">${amount}</span>
            </div>
            <div className="flex justify-between items-center text-xs pb-3 border-b border-[rgba(63,73,69,0.5)]">
              <span className="text-[#9A9A9A]">الرصيد المتاح للسحب:</span>
              <span className="font-bold text-[rgba(148,211,193,1)]">$2,850.00</span>
            </div>
            <div className="flex justify-between items-center text-xs pb-3 border-b border-[#E53535]/50 bg-[#E53535]/10 -mx-6 px-6 py-2">
              <span className="text-[#E53535]">العجز المالي (المبلغ الزائد):</span>
              <span className="font-bold text-[#E53535]">-$650.00</span>
            </div>
            <div className="flex justify-between items-center text-xs pb-3 border-b border-[rgba(63,73,69,0.5)]">
              <span className="text-[#9A9A9A]">حالة المطابقة النظامية:</span>
              <span className="text-[#E53535] flex items-center gap-1 font-bold">
                غير مطابق (تجاوز للرصيد) <XCircle className="w-3 h-3" />
              </span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-[#9A9A9A]">رسوم المعالجة العكسية (2%):</span>
              <span className="text-[#666666]">تُحسب عند التعديل</span>
            </div>
          </div>

          <div className="bg-[rgba(17,20,21,1)] rounded-xl p-4 border border-[#E53535]/30 mb-6">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs text-white">الرصيد المتبقي المتوقع:</span>
              <span className="text-sm font-bold text-[#E53535]">غير صالح (عجز)</span>
            </div>
          </div>

          <div className="mt-4">
            <div className="flex justify-between text-[10px] mb-1">
              <span className="text-[#9A9A9A]">نسبة التغطية المالية:</span>
              <span className="text-[#E53535]">81.4% (ناقصة)</span>
            </div>
            <div className="w-full bg-[rgba(63,73,69,1)] rounded-full h-1.5 flex overflow-hidden">
              <div className="bg-teal-400 h-1.5" style={{ width: '81.4%' }}></div>
              <div className="bg-[#E53535] h-1.5" style={{ width: '18.6%' }}></div>
            </div>
            <div className="flex justify-between text-[8px] mt-1 text-[#666666]">
              <span>$2,850 متاح</span>
              <span>$650 عجز مالي</span>
            </div>
          </div>
        </div>

        {/* Security Rules */}
        <div className="bg-[rgba(25,30,31,1)] border border-[rgba(63,73,69,1)] rounded-2xl p-6">
          <div className="flex justify-end items-center gap-2 mb-6">
            <h3 className="text-sm font-bold text-white">الضوابط الشرعية والمصرفية لمنع السحب على المكشوف</h3>
            <Shield className="w-5 h-5 text-[rgba(148,211,193,1)]" />
          </div>

          <div className="space-y-4 text-end">
            <div>
              <h4 className="text-xs font-bold text-white mb-1 flex items-center justify-end gap-2">
                قاعدة عدم السحب على المكشوف (Zero-Overdraft): <Lock className="w-3 h-3 text-[#FFC107]" />
              </h4>
              <p className="text-[10px] text-[#9A9A9A] leading-relaxed">
                تحظر اللائحة المصرفية والشرعية للمنصة استرداد مبالغ تفوق الرصيد الحقيقي المودع، درءاً لشبهات الفوائد أو التمويل غير المصرح به.
              </p>
            </div>
            <div>
              <h4 className="text-xs font-bold text-white mb-1 flex items-center justify-end gap-2">
                حماية مخصصات الحملات النشطة: <Shield className="w-3 h-3 text-[rgba(148,211,193,1)]" />
              </h4>
              <p className="text-[10px] text-[#9A9A9A] leading-relaxed">
                يتم حجز وفصل الأرصدة المربوطة بعقود شراء نشطة لضمان حقوق الناشرين وعدم توقف إعلاناتك فجأة.
              </p>
            </div>
            <div>
              <h4 className="text-xs font-bold text-white mb-1 flex items-center justify-end gap-2">
                مدة التنفيذ والتسوية: <Clock className="w-3 h-3 text-[#9A9A9A]" />
              </h4>
              <p className="text-[10px] text-[#9A9A9A] leading-relaxed">
                تتم المعالجة خلال 3 إلى 5 أيام عمل بنكية عند تقديم طلب مستوفٍ للشروط ومطابق للرصيد المتاح.
              </p>
            </div>
          </div>
        </div>

        {/* Support Banner */}
        <div className="p-4 bg-[rgba(25,30,31,1)] border border-[rgba(63,73,69,1)] rounded-2xl">
          <div className="flex justify-end items-center gap-2 mb-2">
            <h4 className="text-xs font-bold text-white">هل تحتاج إلى استرداد كامل مع إيقاف الحملات؟</h4>
            <div className="bg-[rgba(148,211,193,0.1)] p-1.5 rounded-lg">
              <Headset className="w-4 h-4 text-[rgba(148,211,193,1)]" />
            </div>
          </div>
          <p className="text-[10px] text-[#9A9A9A] text-end mb-4">
            إذا كنت ترغب بسحب الرصيد المحجوز ($650.00)، يمكنك إيقاف الحملات النشطة أولاً ليتحول رصيدها تلقائياً إلى رصيدك المتاح.
          </p>
          <button className="w-full bg-[rgba(17,20,21,1)] hover:bg-[rgba(63,73,69,0.5)] border border-[rgba(63,73,69,1)] text-[rgba(148,211,193,1)] text-xs py-2 rounded-lg transition-colors flex justify-center items-center gap-2">
            محادثة فورية مع مستشار الحساب
            <Headset className="w-3 h-3" />
          </button>
        </div>

      </div>
    </div>
  );
}
