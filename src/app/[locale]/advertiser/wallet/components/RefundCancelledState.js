'use client';
import React from 'react';
import { 
  CheckSquare, FileText, CheckCircle, Lock, Download, RefreshCcw, Landmark, CreditCard, ChevronDown, List, Info, StopCircle, RefreshCw, HelpCircle
} from 'lucide-react';

export default function RefundCancelledState({ onSwitchState }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      {/* Right Column (Wide) */}
      <div className="lg:col-span-2 space-y-6">
        
        {/* Cancelled Header */}
        <div className="bg-[rgba(25,30,31,1)] border border-[rgba(63,73,69,1)] rounded-2xl p-6 relative overflow-hidden flex justify-between items-center text-end">
          <div className="bg-[rgba(148,211,193,0.1)] p-4 rounded-xl">
            <CheckSquare className="w-8 h-8 text-[rgba(148,211,193,1)]" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">تم إلغاء طلب استرداد الرصيد بنجاح</h2>
            <p className="text-[11px] text-[#9A9A9A] max-w-2xl">
              تم إلغاء طلب الاسترداد، وأُعيد كامل المبلغ <span className="text-white font-bold">USD 500.00$</span> إلى رصيدك المتاح في المحفظة دون خصم أي رسوم إدارية. تم إيقاف إجراءات التحويل البنكي وفك الحجز المالي تلقائياً.
            </p>
          </div>
        </div>

        {/* Restore Balance block */}
        <div className="bg-[rgba(25,30,31,1)] border border-[rgba(63,73,69,1)] rounded-2xl p-6">
          <div className="flex justify-between items-center mb-6">
            <span className="text-[10px] bg-[rgba(148,211,193,0.1)] text-[rgba(148,211,193,1)] px-2 py-1 rounded">تسوية لحظية</span>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white">تأكيد فك الحجز المالي وإعادة التوازن</h3>
              <RefreshCw className="w-4 h-4 text-[rgba(148,211,193,1)]" />
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 bg-[rgba(17,20,21,1)] border border-[rgba(63,73,69,1)] rounded-xl p-4 text-center flex flex-col justify-center">
              <span className="text-xs text-[#666666] mb-1">المبلغ المحجوز سابقاً</span>
              <span className="text-lg font-bold text-[#E53535] line-through">$500.00</span>
              <span className="text-[9px] text-[#666666] mt-1">طلب استرداد معلق</span>
            </div>
            
            <div className="flex-1 bg-[rgba(17,20,21,1)] border border-[rgba(63,73,69,1)] rounded-xl p-4 text-center flex flex-col justify-center items-center">
              <Lock className="w-5 h-5 text-[#9A9A9A] mb-2" />
              <span className="text-xs text-white">إلغاء الحجز الفوري</span>
            </div>

            <div className="flex-1 bg-[rgba(148,211,193,0.1)] border border-[rgba(148,211,193,1)]/30 rounded-xl p-4 text-center flex flex-col justify-center">
              <span className="text-xs text-[rgba(148,211,193,1)] mb-1">المضاف للرصيد المتاح</span>
              <span className="text-xl font-bold text-[rgba(148,211,193,1)]">+$500.00</span>
              <span className="text-[9px] text-[rgba(148,211,193,1)]/70 mt-1">رصيد صالح للاستخدام</span>
            </div>
          </div>

          <div className="flex items-start gap-3 bg-[rgba(17,20,21,1)] p-3 rounded-lg border border-[rgba(63,73,69,1)]">
            <Info className="w-4 h-4 text-[#FFC107] shrink-0 mt-0.5" />
            <p className="text-[10px] text-[#9A9A9A] text-end flex-1">
              تأكيد النظام: لن يتم تطبيق أي قيود أو اشتراطات على حسابك الإعلاني، وجميع حملاتك النشطة تستمر في العمل والتمويل المباشر من هذا الرصيد.
            </p>
          </div>
        </div>

        {/* Details */}
        <div className="bg-[rgba(25,30,31,1)] border border-[rgba(63,73,69,1)] rounded-2xl p-6">
          <div className="flex justify-between items-center mb-6">
            <span className="text-[10px] text-[#666666]">معرف الإجراء: EV7-99201</span>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white">تفاصيل طلب الاسترداد الملغى والمطابقة</h3>
              <FileText className="w-4 h-4 text-[rgba(148,211,193,1)]" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-[rgba(17,20,21,1)] border border-[rgba(63,73,69,1)] rounded-xl p-4 text-end">
              <span className="text-[10px] text-[#666666] block mb-1">رقم الطلب المرجعي</span>
              <span className="text-sm font-bold text-white">REF-CAN-849201-58</span>
            </div>
            <div className="bg-[rgba(17,20,21,1)] border border-[rgba(63,73,69,1)] rounded-xl p-4 text-end">
              <span className="text-[10px] text-[#666666] block mb-1">وسيلة الاسترداد المقترحة</span>
              <div className="flex items-center justify-end gap-2">
                <span className="text-sm font-bold text-white">بطاقة مدى / فيزا (**** 4092)</span>
                <CreditCard className="w-4 h-4 text-[#9A9A9A]" />
              </div>
            </div>
            <div className="bg-[rgba(17,20,21,1)] border border-[rgba(63,73,69,1)] rounded-xl p-4 text-end">
              <span className="text-[10px] text-[#666666] block mb-1">تاريخ ووقت تقديم الطلب</span>
              <span className="text-xs font-bold text-white">اليوم، 10:30:15 صباحاً (UTC+3)</span>
            </div>
            <div className="bg-[rgba(17,20,21,1)] border border-[rgba(63,73,69,1)] rounded-xl p-4 text-end">
              <span className="text-[10px] text-[#666666] block mb-1">تاريخ ووقت تنفيذ الإلغاء</span>
              <span className="text-xs font-bold text-white">اليوم، 11:20:42 صباحاً (قبل المعالجة)</span>
            </div>
            <div className="bg-[rgba(17,20,21,1)] border border-[rgba(63,73,69,1)] rounded-xl p-4 text-end md:col-span-2 flex justify-between items-center">
              <span className="text-xs font-bold text-[#FFC107]">تم الإيقاف والتراجع التلقائي (Voided)</span>
              <span className="text-[10px] text-[#666666]">حالة التحويل البنكي المصرفي</span>
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="bg-[rgba(25,30,31,1)] rounded-2xl border border-[rgba(63,73,69,1)] p-6">
          <div className="flex justify-between items-center mb-8 border-b border-[rgba(63,73,69,1)] pb-4">
            <span className="text-[10px] text-[#9A9A9A] flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-[rgba(148,211,193,1)]"></div> مكتمل ومغلق</span>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-white">سجل الإجراءات الزمنية المباشرة للطلب</h2>
              <Clock className="w-4 h-4 text-[#9A9A9A]" />
            </div>
          </div>

          <div className="relative border-r border-[rgba(63,73,69,1)] pr-6 mr-3 space-y-8">
            <div className="relative">
              <div className="absolute -right-9 top-0 w-6 h-6 rounded-full bg-[rgba(17,20,21,1)] flex items-center justify-center border-4 border-[#141414]">
                <div className="w-2 h-2 rounded-full bg-[rgba(148,211,193,1)]"></div>
              </div>
              <div className="text-end">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[9px] text-[#666666]">10:30:15 ص</span>
                  <h4 className="text-xs font-bold text-white">تقديم طلب الاسترداد من قبل المعلن</h4>
                </div>
                <p className="text-[9px] text-[#666666]">قام المعلن بإنشاء طلب استرداد رصيد بقيمة 500.00$ إلى بطاقة البنك المقترنة.</p>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -right-9 top-0 w-6 h-6 rounded-full bg-[rgba(17,20,21,1)] flex items-center justify-center border-4 border-[#141414]">
                <div className="w-2 h-2 rounded-full bg-[#FFC107]"></div>
              </div>
              <div className="text-end">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[9px] text-[#666666]">10:45:00 ص</span>
                  <h4 className="text-xs font-bold text-[#FFC107]">حجز الرصيد ومطابقة السيولة المبدئية</h4>
                </div>
                <p className="text-[9px] text-[#666666]">تم حجز المبلغ مؤقتاً في انتظار موافقة قسم العمليات المصرفية دون تسوية بنكية فعلية.</p>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -right-9 top-0 w-6 h-6 rounded-full bg-[rgba(17,20,21,1)] flex items-center justify-center border-4 border-[#141414]">
                <div className="w-2 h-2 rounded-full bg-[#9A9A9A]"></div>
              </div>
              <div className="text-end">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[9px] text-[#666666]">11:20:10 ص</span>
                  <h4 className="text-xs font-bold text-white">إجراء الإلغاء: نقر زر "إلغاء الطلب"</h4>
                </div>
                <p className="text-[9px] text-[#666666]">اختار المعلن إلغاء الطلب قبل إتمام التصدير المالي، وتأكيد الرغبة في إبقاء المبلغ بالحساب.</p>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -right-9 top-0 w-6 h-6 rounded-full bg-[rgba(148,211,193,1)] flex items-center justify-center border-4 border-[#141414]">
                <Check className="w-3 h-3 text-white" />
              </div>
              <div className="text-end">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[9px] text-[#666666]">11:20:42 ص</span>
                  <h4 className="text-xs font-bold text-[rgba(148,211,193,1)]">فك الحجز المالي وإشعار المحفظة الرقمية</h4>
                </div>
                <p className="text-[9px] text-[#666666]">اكتمال عملية فك الحجز وإعادة إدراج 500.00$ في رصيد المحفظة المتاح فورياً، وإغلاق ملف الطلب.</p>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Left Column (Narrow) */}
      <div className="space-y-6">
        
        {/* Available Balance now */}
        <div className="bg-[rgba(25,30,31,1)] rounded-2xl border border-[rgba(63,73,69,1)] p-6 text-end">
          <span className="text-xs text-[#666666] block mb-1">الرصيد المتاح بالمحفظة الآن</span>
          <span className="text-2xl font-bold text-[rgba(148,211,193,1)] block mb-1">$2,850.00</span>
          <span className="text-[9px] text-[#666666]">تم استرداد 500.00$ فوراً</span>
        </div>

        {/* Summary Table */}
        <div className="bg-[rgba(25,30,31,1)] rounded-2xl border border-[rgba(63,73,69,1)] p-6">
          <div className="flex justify-between items-center mb-6">
            <span className="text-[9px] text-[#666666]">USD / الدولار</span>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-white">الملخص المحاسبي لحركة الرصيد</h2>
              <Landmark className="w-4 h-4 text-[#FFC107]" />
            </div>
          </div>

          <div className="space-y-4 mb-6 text-end">
            <div className="flex justify-between items-center text-xs pb-3 border-b border-[rgba(63,73,69,0.5)]">
              <span className="font-bold text-white">$2,850.00</span>
              <span className="text-[#9A9A9A]">الرصيد الأصلي قبل طلب الاسترداد</span>
            </div>
            <div className="flex justify-between items-center text-xs pb-3 border-b border-[rgba(63,73,69,0.5)]">
              <span className="font-bold text-[#E53535]">-$500.00</span>
              <span className="text-[#9A9A9A] flex items-center justify-end gap-1">
                الحجز المؤقت (أثناء الطلب) <StopCircle className="w-3 h-3 text-[#E53535]"/>
              </span>
            </div>
            <div className="flex justify-between items-center text-xs pb-3 border-b border-[rgba(63,73,69,0.5)]">
              <span className="font-bold text-[rgba(148,211,193,1)]">+$500.00</span>
              <span className="text-[#9A9A9A] flex items-center justify-end gap-1">
                استرجاع المبلغ (بعد الإلغاء) <CheckCircle className="w-3 h-3 text-[rgba(148,211,193,1)]"/>
              </span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-[#FFC107]">$0.00</span>
              <span className="text-[#9A9A9A]">رسوم العمليات والتسوية</span>
            </div>
          </div>

          <div className="bg-[rgba(17,20,21,1)] rounded-xl p-4 border border-[rgba(63,73,69,1)] mb-6 flex justify-between items-center">
            <span className="text-lg font-bold text-[#FFC107]">$2,850.00</span>
            <div className="text-end">
              <span className="text-xs font-bold text-white block">الرصيد الصافي المتاح للتصرف</span>
              <span className="text-[9px] text-[#666666]">تم التحديث الفوري لحظياً</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="bg-[rgba(25,30,31,1)] rounded-2xl border border-[rgba(63,73,69,1)] p-6">
          <div className="flex justify-end items-center gap-2 mb-4">
            <h3 className="text-sm font-bold text-white">الإجراءات الموصى بها</h3>
            <CheckCircle className="w-4 h-4 text-[rgba(148,211,193,1)]" />
          </div>
          <p className="text-[10px] text-[#9A9A9A] text-end mb-6">
            رصيدك متوفر بالكامل الآن. يمكنك الانتقال مباشرة لإطلاق أو تمويل حملتك الإعلانية لتحقيق أهدافك التسويقية.
          </p>
          
          <div className="space-y-3">
            <button onClick={() => onSwitchState('initial')} className="w-full bg-[#FF8C00] hover:bg-[#E67E00] text-white text-sm font-bold py-3.5 rounded-xl transition-colors shadow-lg shadow-[#FF8C00]/20 flex items-center justify-center gap-2">
              العودة إلى لوحة تحكم المحفظة
              <Landmark className="w-4 h-4" />
            </button>
            <button className="w-full bg-transparent hover:bg-[rgba(63,73,69,0.5)] border border-[rgba(63,73,69,1)] text-[rgba(148,211,193,1)] text-sm font-bold py-3.5 rounded-xl transition-colors flex items-center justify-center gap-2">
              إنشاء أو تمويل حملة إعلانية جديدة
              <CreditCard className="w-4 h-4" />
            </button>
            
            <div className="pt-4 text-center">
              <button className="text-[10px] text-[#666666] hover:text-white transition-colors flex items-center justify-center gap-2 w-full">
                تحميل إشعار فك الحجز وإلغاء الاسترداد (PDF) <Download className="w-3 h-3"/>
              </button>
            </div>
          </div>
        </div>

        {/* Support */}
        <div className="p-4 bg-[rgba(25,30,31,1)] border border-[rgba(63,73,69,1)] rounded-2xl">
          <div className="flex justify-end items-center gap-2 mb-2">
            <h4 className="text-xs font-bold text-white">هل قمت بالإلغاء بالخطأ؟</h4>
            <HelpCircle className="w-4 h-4 text-[rgba(148,211,193,1)]" />
          </div>
          <p className="text-[10px] text-[#9A9A9A] text-end mb-4">
            يمكنك إعادة تقديم طلب استرداد رصيد في أي وقت دون أي قيود، أو التواصل مع مستشارك المالي المخصص على مدار الساعة لمساعدتك في أي استفسار مصرفي.
          </p>
          <div className="flex justify-between items-center text-xs">
            <button className="text-[#FFC107] hover:text-yellow-400 flex items-center gap-1">محادثة الدعم المالي <Headset className="w-3 h-3"/></button>
            <button onClick={() => onSwitchState('initial')} className="text-[rgba(148,211,193,1)] hover:text-teal-300">طلب استرداد جديد</button>
          </div>
        </div>

      </div>
    </div>
  );
}
