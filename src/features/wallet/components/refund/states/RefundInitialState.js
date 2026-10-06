'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import { 
  CheckCircle, Info, ArrowRight, CheckSquare,
  Receipt, Shield, AlertCircle, ChevronDown
} from 'lucide-react';

export default function RefundInitialState({ onSwitchState, onSubmit, submitting = false, balance = 0 }) {
  const router = useRouter();
  const locale = useLocale();
  const [amount, setAmount] = useState('500');
  const [selectedMethod, setSelectedMethod] = useState('original');

  const handleMaxAmount = () => setAmount(String(Math.max(Number(balance) || 0, 0)));
  const handleSubmit = () => {
    const value = Number(String(amount).replace(/,/g, ''));
    if (value < 10) {
      onSwitchState('error_min');
      return;
    }
    onSubmit?.(value);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      {/* Right Column (Wide) */}
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-[#151819] rounded-2xl border border-white/[.08] p-6">
          <div className="flex items-center gap-3 mb-6">
            <Receipt className="w-5 h-5 text-[#8A9490]" />
            <h2 className="text-lg font-bold text-white">تحديد قيمة الاسترداد والبيانات</h2>
          </div>
          <p className="text-sm text-[#8A9490] mb-6">أدخل القيمة المراد استرجاعها، أو استخدم أزرار التعيين السريع أدناه.</p>
          
          <div className="mb-6">
            <div className="flex justify-between items-end mb-2">
              <label className="text-sm font-medium text-white">المبلغ المطلوب استرداده (USD)</label>
              <span className="text-[11px] text-[#8A9490]">الحد الأدنى 10.00$ ، الرصيد المتاح {Number(balance || 0).toFixed(2)}$</span>
            </div>
            <div className="relative">
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[#8A9490] font-bold">$</span>
              <input 
                type="text" 
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full bg-[#101213] border border-white/[.08] rounded-xl py-3 pr-8 pl-24 text-white text-lg font-bold focus:outline-none focus:border-[#94D3C1] transition-colors"
              />
              <button 
                onClick={handleMaxAmount}
                className="absolute left-2 top-1/2 -translate-y-1/2 text-[#94D3C1] text-xs font-medium bg-[rgba(148,211,193,0.1)] px-3 py-1.5 rounded-lg hover:bg-[rgba(148,211,193,0.2)] transition-colors"
              >
                الحد الأقصى
              </button>
            </div>
          </div>

          <div className="flex gap-2 mb-6">
            <button className="flex-1 bg-white/[.08] hover:bg-white/[.08] text-white text-sm py-2 rounded-xl transition-colors">اختيار سريع:</button>
            <button onClick={() => setAmount('200')} className={`flex-1 ${amount === '200' ? 'bg-[rgba(148,211,193,0.2)] text-[#94D3C1] border border-[rgba(148,211,193,0.5)]' : 'bg-[#101213] border border-white/[.08] text-[#8A9490] hover:bg-white/[.08]'} text-sm py-2 rounded-xl transition-colors`}>$200</button>
            <button onClick={() => setAmount('500')} className={`flex-1 ${amount === '500' ? 'bg-[rgba(148,211,193,0.2)] text-[#94D3C1] border border-[rgba(148,211,193,0.5)]' : 'bg-[#101213] border border-white/[.08] text-[#8A9490] hover:bg-white/[.08]'} text-sm py-2 rounded-xl transition-colors`}>$500</button>
            <button onClick={() => setAmount('1000')} className={`flex-1 ${amount === '1000' ? 'bg-[rgba(148,211,193,0.2)] text-[#94D3C1] border border-[rgba(148,211,193,0.5)]' : 'bg-[#101213] border border-white/[.08] text-[#8A9490] hover:bg-white/[.08]'} text-sm py-2 rounded-xl transition-colors`}>$1,000</button>
            <button onClick={handleMaxAmount} className={`flex-[2] ${Number(amount) === Number(balance) ? 'bg-[rgba(148,211,193,0.2)] text-[#94D3C1] border border-[rgba(148,211,193,0.5)]' : 'bg-[#101213] border border-white/[.08] text-[#8A9490] hover:bg-white/[.08]'} text-sm py-2 rounded-xl transition-colors`}>استرداد كامل الرصيد (${Number(balance || 0).toFixed(2)}$)</button>
          </div>

          <div className="bg-[rgba(148,211,193,0.05)] border border-[rgba(148,211,193,0.2)] rounded-xl p-4 flex gap-4 mb-8">
            <CheckCircle className="w-5 h-5 text-[#94D3C1] shrink-0 mt-0.5" />
            <div>
              <h4 className="text-[#94D3C1] text-sm font-bold mb-1">المبلغ المدخل متاح ومستوفٍ للشروط</h4>
              <p className="text-[#8A9490] text-xs">القيمة ضمن نطاق السيولة المسموح به وخالية من أي تعارض مع الحملات الجارية.</p>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-sm font-bold text-white mb-4">اختر وجهة تحويل المبلغ المسترد:</h3>
            
            <div className="space-y-3">
              <label className={`block cursor-pointer border rounded-xl p-4 transition-colors ${selectedMethod === 'original' ? 'bg-[rgba(148,211,193,0.05)] border-[rgba(148,211,193,0.5)]' : 'bg-[#101213] border-white/[.08] hover:border-[#94D3C1]'}`}>
                <div className="flex items-start gap-4">
                  <div className="mt-1">
                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${selectedMethod === 'original' ? 'border-[#94D3C1]' : 'border-gray-500'}`}>
                      {selectedMethod === 'original' && <div className="w-2 h-2 rounded-full bg-[#94D3C1]"></div>}
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                      <h4 className="text-sm font-bold text-white">وسيلة الدفع الأصلية (Original Source)</h4>
                      <span className="text-[10px] text-[#E9C349] bg-[#E9C349]/10 px-2 py-0.5 rounded">3 - 5 أيام عمل</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <p className="text-xs text-[#8A9490]">بطاقة مدى / فيزا المشحون بها الرصيد المنتهية بـ **** 4092</p>
                      <span className="text-[10px] text-[#8A9490]">معالجة فورية</span>
                    </div>
                  </div>
                </div>
              </label>

              <label className={`block cursor-pointer border rounded-xl p-4 transition-colors ${selectedMethod === 'bank' ? 'bg-[rgba(148,211,193,0.05)] border-[rgba(148,211,193,0.5)]' : 'bg-[#101213] border-white/[.08] hover:border-[#94D3C1]'}`}>
                <div className="flex items-start gap-4">
                  <div className="mt-1">
                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${selectedMethod === 'bank' ? 'border-[#94D3C1]' : 'border-gray-500'}`}>
                      {selectedMethod === 'bank' && <div className="w-2 h-2 rounded-full bg-[#94D3C1]"></div>}
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                      <h4 className="text-sm font-bold text-white">تحويل بنكي مباشر (Bank Wire Transfer)</h4>
                      <span className="text-[10px] text-[#8A9490] bg-white/[.08] px-2 py-0.5 rounded">5 - 7 أيام عمل</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <p className="text-xs text-[#8A9490]">تحويل مباشر إلى الآيبان البنكي للشركة أو المعلن</p>
                      <span className="text-[10px] text-[#8A9490]">تخضع للمقاصة البنكية</span>
                    </div>
                  </div>
                </div>
              </label>
            </div>
          </div>

          <div className="bg-[#101213] rounded-xl p-4 border border-white/[.08]">
            <div className="flex justify-between items-center mb-3">
              <div className="flex items-center gap-2">
                <span className="text-[#94D3C1] font-bold text-sm">مستوفٍ بالكامل <ChevronDown className="inline w-4 h-4" /></span>
              </div>
              <span className="text-xs text-[#8A9490]">فحص الالتزامات المالية والمعايير (Scenario 13)</span>
            </div>
            <div className="grid grid-cols-2 gap-y-3 gap-x-4 text-xs text-[#8A9490]">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-[#94D3C1]"></div>
                <span>الحملات المتعاقد عليها: <span className="text-white">0 نزاعات نشطة</span></span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-[#94D3C1]"></div>
                <span>مستحقات صناع المحتوى: <span className="text-white">مسواة بالكامل</span></span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-[#94D3C1]"></div>
                <span>التدقيق الشرعي للإعلانات: <span className="text-white">متوافق بنسبة 100%</span></span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-[#94D3C1]"></div>
                <span>المطالبات الضريبية: <span className="text-white">لا توجد متأخرات</span></span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Left Column (Narrow) */}
      <div className="space-y-6">
        
        {/* Fee Calculator */}
        <div className="bg-[#151819] rounded-2xl border border-white/[.08] p-6">
          <div className="flex items-center gap-3 mb-6">
            <CheckSquare className="w-5 h-5 text-[#8A9490]" />
            <h2 className="text-lg font-bold text-white">حاسبة الرسوم الشفافة</h2>
          </div>

          <div className="space-y-4 mb-6">
            <div className="flex justify-between items-center text-sm">
              <span className="text-[#8A9490]">المبلغ المطلوب استرداده</span>
              <span className="font-bold text-white">${Number(amount || 0).toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-[#8A9490] flex items-center gap-1">
                رسوم البوابات والتحويل المصرفي (2%) <Info className="w-3 h-3 text-[#8A9490]" />
              </span>
              <span className="font-bold text-[#DC2626]">-${(Number(amount || 0) * 0.02).toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-[#8A9490]">ضريبة القيمة المضافة على الرسوم (15%)</span>
              <span className="text-[10px] text-[#8A9490]">مشمولة ضمن العملية</span>
            </div>
          </div>

          <div className="bg-[#101213] rounded-xl p-4 border border-white/[.08] mb-6">
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm text-white">صافي المبلغ المسترد لحسابك الفعلي:</span>
              <span className="text-2xl font-bold text-[#94D3C1]">${(Number(amount || 0) * 0.98).toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[10px] text-[#8A9490]">يودع دون أي خصومات إضافية لاحقة</span>
              <span className="text-xs text-[#E9C349] font-bold">{(Number(amount || 0) * 0.98 * 3.75).toFixed(2)} ر.س</span>
            </div>
          </div>

          <div className="border-t border-white/[.08] pt-6 mb-6">
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm text-[#8A9490]">الرصيد المتبقي في المحفظة بعد العملية:</span>
              <span className="font-bold text-[#E9C349]">${Math.max(Number(balance || 0) - Number(amount || 0), 0).toFixed(2)}</span>
            </div>
            <div className="text-[10px] text-[#8A9490]">حساب نشط ومتاح لإطلاق إعلانات جديدة</div>
          </div>

          <div className="bg-[#101213] rounded-xl p-4 flex gap-3 mb-6">
            <AlertCircle className="w-5 h-5 text-[#8A9490] shrink-0" />
            <p className="text-xs text-[#8A9490] leading-relaxed">
              سيتم حجز المبلغ فوراً <span className="font-bold text-white">(قيد المراجعة - Pending)</span> فور النقر على التأكيد. وإشعارك بالبريد الإلكتروني ورسالة SMS عند إتمام التحويل من قبل الإدارة المالية.
            </p>
          </div>

          <div className="space-y-3">
            <button 
              onClick={handleSubmit}
              disabled={submitting}
              className="w-full text-[#1D1D1D] font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 shadow-lg"
              style={{ background: "linear-gradient(90deg, #FDA100 0%, #FE5403 100%)" }}
            >
              {submitting ? 'جارٍ إرسال الطلب…' : `تأكيد وإرسال طلب الاسترداد (Net $${(Number(amount || 0) * 0.98).toFixed(2)})`}
              <ArrowRight className="w-5 h-5 -rotate-135" />
            </button>
            <button onClick={() => router.push(`/${locale}/advertiser/wallet`)} className="w-full bg-[#101213] hover:bg-white/[.08] border border-white/[.08] text-white font-bold py-3.5 rounded-xl transition-colors">
              إلغاء والعودة إلى تفاصيل المحفظة
            </button>
          </div>
        </div>

        {/* Security Banner */}
        <div className="flex items-start gap-3 p-4 bg-[#151819] border border-white/[.08] rounded-2xl">
          <Shield className="w-6 h-6 text-[#94D3C1] shrink-0" />
          <div>
            <h4 className="text-sm font-bold text-white mb-1">ضوابط الحماية المالية المعتمدة</h4>
            <p className="text-[10px] text-[#8A9490] leading-relaxed">
              تخضع عمليات الاسترداد في منصة إعلانات الزعيم للائحة حماية أموال العملاء الصادرة عن البنك المركزي السعودي وهيئة الزكاة والضريبة والجمارك (ZATCA)، مع ضمان خلو كافة المعاملات من أي شبهات غسيل أموال أو احتيال مالي.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
