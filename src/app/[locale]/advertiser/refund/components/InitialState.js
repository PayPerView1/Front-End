'use client';
import React, { useState } from 'react';
import { 
  CheckCircle, Info, ArrowRight, CheckSquare,
  Receipt, Shield, AlertCircle, ChevronDown
} from 'lucide-react';

export default function InitialState({ onSwitchState }) {
  const [amount, setAmount] = useState('500');
  const [selectedMethod, setSelectedMethod] = useState('original');

  const handleMaxAmount = () => setAmount('2850');

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      {/* Right Column (Wide) */}
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-[rgba(25,30,31,1)] rounded-2xl border border-[rgba(63,73,69,1)] p-6">
          <div className="flex items-center gap-3 mb-6">
            <Receipt className="w-5 h-5 text-[#9A9A9A]" />
            <h2 className="text-lg font-bold text-white">تحديد قيمة الاسترداد والبيانات</h2>
          </div>
          <p className="text-sm text-[#9A9A9A] mb-6">أدخل القيمة المراد استرجاعها، أو استخدم أزرار التعيين السريع أدناه.</p>
          
          <div className="mb-6">
            <div className="flex justify-between items-end mb-2">
              <label className="text-sm font-medium text-white">المبلغ المطلوب استرداده (USD)</label>
              <span className="text-[11px] text-[#666666]">الحد الأدنى 10.00$ ، الحد الأقصى 2,850.00$</span>
            </div>
            <div className="relative">
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[#9A9A9A] font-bold">$</span>
              <input 
                type="text" 
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full bg-[rgba(17,20,21,1)] border border-[rgba(63,73,69,1)] rounded-xl py-3 pr-8 pl-24 text-white text-lg font-bold focus:outline-none focus:border-[rgba(148,211,193,1)] transition-colors"
              />
              <button 
                onClick={handleMaxAmount}
                className="absolute left-2 top-1/2 -translate-y-1/2 text-[rgba(148,211,193,1)] text-xs font-medium bg-[rgba(148,211,193,0.1)] px-3 py-1.5 rounded-lg hover:bg-[rgba(148,211,193,0.2)] transition-colors"
              >
                الحد الأقصى
              </button>
            </div>
          </div>

          <div className="flex gap-2 mb-6">
            <button className="flex-1 bg-[rgba(63,73,69,1)] hover:bg-[rgba(63,73,69,1)] text-white text-sm py-2 rounded-xl transition-colors">اختيار سريع:</button>
            <button onClick={() => setAmount('200')} className={`flex-1 ${amount === '200' ? 'bg-[rgba(148,211,193,0.2)] text-[rgba(148,211,193,1)] border border-[rgba(148,211,193,0.5)]' : 'bg-[rgba(17,20,21,1)] border border-[rgba(63,73,69,1)] text-[#9A9A9A] hover:bg-[rgba(63,73,69,0.5)]'} text-sm py-2 rounded-xl transition-colors`}>$200</button>
            <button onClick={() => setAmount('500')} className={`flex-1 ${amount === '500' ? 'bg-[rgba(148,211,193,0.2)] text-[rgba(148,211,193,1)] border border-[rgba(148,211,193,0.5)]' : 'bg-[rgba(17,20,21,1)] border border-[rgba(63,73,69,1)] text-[#9A9A9A] hover:bg-[rgba(63,73,69,0.5)]'} text-sm py-2 rounded-xl transition-colors`}>$500</button>
            <button onClick={() => setAmount('1000')} className={`flex-1 ${amount === '1000' ? 'bg-[rgba(148,211,193,0.2)] text-[rgba(148,211,193,1)] border border-[rgba(148,211,193,0.5)]' : 'bg-[rgba(17,20,21,1)] border border-[rgba(63,73,69,1)] text-[#9A9A9A] hover:bg-[rgba(63,73,69,0.5)]'} text-sm py-2 rounded-xl transition-colors`}>$1,000</button>
            <button onClick={() => setAmount('2850')} className={`flex-[2] ${amount === '2850' ? 'bg-[rgba(148,211,193,0.2)] text-[rgba(148,211,193,1)] border border-[rgba(148,211,193,0.5)]' : 'bg-[rgba(17,20,21,1)] border border-[rgba(63,73,69,1)] text-[#9A9A9A] hover:bg-[rgba(63,73,69,0.5)]'} text-sm py-2 rounded-xl transition-colors`}>استرداد كامل الرصيد ($2,850)</button>
          </div>

          <div className="bg-[rgba(148,211,193,0.05)] border border-[rgba(148,211,193,0.2)] rounded-xl p-4 flex gap-4 mb-8">
            <CheckCircle className="w-5 h-5 text-[rgba(148,211,193,1)] shrink-0 mt-0.5" />
            <div>
              <h4 className="text-[rgba(148,211,193,1)] text-sm font-bold mb-1">المبلغ المدخل متاح ومستوفٍ للشروط</h4>
              <p className="text-[#9A9A9A] text-xs">القيمة ضمن نطاق السيولة المسموح به وخالية من أي تعارض مع الحملات الجارية.</p>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-sm font-bold text-white mb-4">اختر وجهة تحويل المبلغ المسترد:</h3>
            
            <div className="space-y-3">
              {/* Option 1 */}
              <label className={`block cursor-pointer border rounded-xl p-4 transition-colors ${selectedMethod === 'original' ? 'bg-[rgba(148,211,193,0.05)] border-[rgba(148,211,193,0.5)]' : 'bg-[rgba(17,20,21,1)] border-[rgba(63,73,69,1)] hover:border-[rgba(148,211,193,1)]'}`}>
                <div className="flex items-start gap-4">
                  <div className="mt-1">
                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${selectedMethod === 'original' ? 'border-[rgba(148,211,193,1)]' : 'border-gray-500'}`}>
                      {selectedMethod === 'original' && <div className="w-2 h-2 rounded-full bg-[rgba(148,211,193,1)]"></div>}
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                      <h4 className="text-sm font-bold text-white">وسيلة الدفع الأصلية (Original Source)</h4>
                      <span className="text-[10px] text-[#FFC107] bg-[#FFC107]/10 px-2 py-0.5 rounded">3 - 5 أيام عمل</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <p className="text-xs text-[#9A9A9A]">بطاقة مدى / فيزا المشحون بها الرصيد المنتهية بـ **** 4092</p>
                      <span className="text-[10px] text-[#666666]">معالجة فورية</span>
                    </div>
                  </div>
                </div>
              </label>

              {/* Option 2 */}
              <label className={`block cursor-pointer border rounded-xl p-4 transition-colors ${selectedMethod === 'bank' ? 'bg-[rgba(148,211,193,0.05)] border-[rgba(148,211,193,0.5)]' : 'bg-[rgba(17,20,21,1)] border-[rgba(63,73,69,1)] hover:border-[rgba(148,211,193,1)]'}`}>
                <div className="flex items-start gap-4">
                  <div className="mt-1">
                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${selectedMethod === 'bank' ? 'border-[rgba(148,211,193,1)]' : 'border-gray-500'}`}>
                      {selectedMethod === 'bank' && <div className="w-2 h-2 rounded-full bg-[rgba(148,211,193,1)]"></div>}
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                      <h4 className="text-sm font-bold text-white">تحويل بنكي مباشر (Bank Wire Transfer)</h4>
                      <span className="text-[10px] text-[#9A9A9A] bg-[rgba(63,73,69,1)] px-2 py-0.5 rounded">5 - 7 أيام عمل</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <p className="text-xs text-[#9A9A9A]">تحويل مباشر إلى الآيبان البنكي للشركة أو المعلن</p>
                      <span className="text-[10px] text-[#666666]">تخضع للمقاصة البنكية</span>
                    </div>
                  </div>
                </div>
              </label>
            </div>
          </div>

          {/* Checks */}
          <div className="bg-[rgba(17,20,21,1)] rounded-xl p-4 border border-[rgba(63,73,69,1)]">
            <div className="flex justify-between items-center mb-3">
              <div className="flex items-center gap-2">
                <span className="text-[rgba(148,211,193,1)] font-bold text-sm">مستوفٍ بالكامل <ChevronDown className="inline w-4 h-4" /></span>
              </div>
              <span className="text-xs text-[#666666]">فحص الالتزامات المالية والمعايير (Scenario 13)</span>
            </div>
            <div className="grid grid-cols-2 gap-y-3 gap-x-4 text-xs text-[#9A9A9A]">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-[rgba(148,211,193,1)]"></div>
                <span>الحملات المتعاقد عليها: <span className="text-white">0 نزاعات نشطة</span></span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-[rgba(148,211,193,1)]"></div>
                <span>مستحقات صناع المحتوى: <span className="text-white">مسواة بالكامل</span></span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-[rgba(148,211,193,1)]"></div>
                <span>التدقيق الشرعي للإعلانات: <span className="text-white">متوافق بنسبة 100%</span></span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-[rgba(148,211,193,1)]"></div>
                <span>المطالبات الضريبية: <span className="text-white">لا توجد متأخرات</span></span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Left Column (Narrow) */}
      <div className="space-y-6">
        
        {/* Fee Calculator */}
        <div className="bg-[rgba(25,30,31,1)] rounded-2xl border border-[rgba(63,73,69,1)] p-6">
          <div className="flex items-center gap-3 mb-6">
            <CheckSquare className="w-5 h-5 text-[#9A9A9A]" />
            <h2 className="text-lg font-bold text-white">حاسبة الرسوم الشفافة</h2>
          </div>

          <div className="space-y-4 mb-6">
            <div className="flex justify-between items-center text-sm">
              <span className="text-[#9A9A9A]">المبلغ المطلوب استرداده</span>
              <span className="font-bold text-white">${Number(amount || 0).toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-[#9A9A9A] flex items-center gap-1">
                رسوم البوابات والتحويل المصرفي (2%) <Info className="w-3 h-3 text-[#666666]" />
              </span>
              <span className="font-bold text-[#E53535]">-${(Number(amount || 0) * 0.02).toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-[#9A9A9A]">ضريبة القيمة المضافة على الرسوم (15%)</span>
              <span className="text-[10px] text-[#666666]">مشمولة ضمن العملية</span>
            </div>
          </div>

          <div className="bg-[rgba(17,20,21,1)] rounded-xl p-4 border border-[rgba(63,73,69,1)] mb-6">
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm text-white">صافي المبلغ المسترد لحسابك الفعلي:</span>
              <span className="text-2xl font-bold text-[rgba(148,211,193,1)]">${(Number(amount || 0) * 0.98).toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[10px] text-[#666666]">يودع دون أي خصومات إضافية لاحقة</span>
              <span className="text-xs text-[#FFC107] font-bold">{(Number(amount || 0) * 0.98 * 3.75).toFixed(2)} ر.س</span>
            </div>
          </div>

          <div className="border-t border-[rgba(63,73,69,1)] pt-6 mb-6">
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm text-[#9A9A9A]">الرصيد المتبقي في المحفظة بعد العملية:</span>
              <span className="font-bold text-[#FFC107]">${(2850 - Number(amount || 0)).toFixed(2)}</span>
            </div>
            <div className="text-[10px] text-[#666666]">حساب نشط ومتاح لإطلاق إعلانات جديدة</div>
          </div>

          <div className="bg-[rgba(63,73,69,0.3)] rounded-xl p-4 flex gap-3 mb-6">
            <AlertCircle className="w-5 h-5 text-[#9A9A9A] shrink-0" />
            <p className="text-xs text-[#9A9A9A] leading-relaxed">
              سيتم حجز المبلغ فوراً <span className="font-bold text-white">(قيد المراجعة - Pending)</span> فور النقر على التأكيد. وإشعارك بالبريد الإلكتروني ورسالة SMS عند إتمام التحويل من قبل الإدارة المالية.
            </p>
          </div>

          <div className="space-y-3">
            <button 
              onClick={() => onSwitchState('success')}
              className="w-full bg-[#FF8C00] hover:bg-[#E67E00] text-white font-bold py-3.5 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-lg shadow-[#FF8C00]/20"
            >
              تأكيد وإرسال طلب الاسترداد (Net ${(Number(amount || 0) * 0.98).toFixed(2)})
              <ArrowRight className="w-5 h-5 -rotate-135" />
            </button>
            <button className="w-full bg-[rgba(17,20,21,1)] hover:bg-[rgba(63,73,69,0.5)] border border-[rgba(63,73,69,1)] text-white font-bold py-3.5 rounded-xl transition-colors">
              إلغاء والعودة إلى تفاصيل المحفظة
            </button>
          </div>
        </div>

        {/* Security Banner */}
        <div className="flex items-start gap-3 p-4 bg-[rgba(25,30,31,1)] border border-[rgba(63,73,69,1)] rounded-2xl">
          <Shield className="w-6 h-6 text-[rgba(148,211,193,1)] shrink-0" />
          <div>
            <h4 className="text-sm font-bold text-white mb-1">ضوابط الحماية المالية المعتمدة</h4>
            <p className="text-[10px] text-[#666666] leading-relaxed">
              تخضع عمليات الاسترداد في منصة إعلانات الزعيم للائحة حماية أموال العملاء الصادرة عن البنك المركزي السعودي وهيئة الزكاة والضريبة والجمارك (ZATCA)، مع ضمان خلو كافة المعاملات من أي شبهات غسيل أموال أو احتيال مالي.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
