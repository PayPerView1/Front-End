'use client';
import React from 'react';
import { 
  AlertTriangle, AlertCircle, Info, Lock, Download, FileText, CheckCircle, XCircle, Search, Headset, ArrowRight, ShieldAlert, CheckSquare, List
} from 'lucide-react';

export default function RejectedState({ onSwitchState }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      {/* Right Column (Wide) */}
      <div className="lg:col-span-2 space-y-6">
        
        {/* Rejected Header */}
        <div className="bg-[#1E1515] border border-[#E53535]/50 rounded-2xl p-6 relative overflow-hidden flex justify-between items-center text-end">
          <div className="bg-[#E53535]/10 p-4 rounded-full">
            <AlertTriangle className="w-8 h-8 text-[#E53535]" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">تم رفض طلب استرداد الرصيد المالي</h2>
            <p className="text-[11px] text-[#9A9A9A] max-w-2xl">
              تم فحص الطلب بواسطة فريق الامتثال والرقابة المالية الآلية. وتبين وجود موانع مصرفية وتشغيلية تحول دون إتمام الاسترداد في الوقت الحالي، عملاً ببروتوكولات الأمان لمنصة إعلانات الزمرد. تم الحفاظ على سيولة حسابك كاملة وإلغاء التعليق المؤقت.
            </p>
          </div>
        </div>

        <div className="flex justify-between items-center mb-2 px-2">
          <div className="flex items-center gap-2">
            <span className="text-xs bg-[#E53535]/10 text-[#E53535] px-2 py-1 rounded">2 أسباب رئيسية مكتشفة</span>
          </div>
          <div className="text-end">
            <h3 className="text-lg font-bold text-white">أسباب رفض طلب الاسترداد المالي</h3>
            <p className="text-[10px] text-[#666666]">تفاصيل التدقيق النظامي مع الإجراءات اللازمة لتصحيح الطلب</p>
          </div>
        </div>

        {/* Reason 1 */}
        <div className="bg-[rgba(25,30,31,1)] border border-[rgba(63,73,69,1)] rounded-2xl p-6">
          <div className="flex justify-end items-center gap-3 mb-4">
            <h4 className="text-sm font-bold text-white">1. وجود حملات إعلانية نشطة تستهلك الميزانية المحجوزة</h4>
            <div className="bg-[#FFC107]/10 p-2 rounded-lg">
              <AlertCircle className="w-5 h-5 text-[#FFC107]" />
            </div>
          </div>
          <p className="text-xs text-[#9A9A9A] text-end mb-6">
            تبين أن هناك حملات ترويجية جارية حالياً تستنفد من مخصصات السيولة للحساب لضمان عدم توقف المزايدات التلقائية. لا يمكن استرداد مبالغ مرتبطة باستهلاك إعلاني نشط.
          </p>
          
          <div className="text-end mb-4">
            <span className="text-[10px] text-[#FFC107] flex items-center justify-end gap-1"><Info className="w-3 h-3"/> الحملات التي تمنع صرف المبلغ المطلوب:</span>
          </div>
          
          <div className="flex gap-4 justify-end">
            <div className="bg-[rgba(17,20,21,1)] border border-[rgba(63,73,69,1)] rounded-xl p-3 flex items-center gap-2">
              <span className="text-[10px] text-[#666666]">$85.50 / يومياً</span>
              <span className="text-xs text-white">حملة: العروض الصيفية</span>
              <div className="w-2 h-2 rounded-full bg-[rgba(148,211,193,1)]"></div>
            </div>
            <div className="bg-[rgba(17,20,21,1)] border border-[rgba(63,73,69,1)] rounded-xl p-3 flex items-center gap-2">
              <span className="text-[10px] text-[#666666]">$120.00 / يومياً</span>
              <span className="text-xs text-white">حملة: إطلاق منتج جديد</span>
              <div className="w-2 h-2 rounded-full bg-[rgba(148,211,193,1)]"></div>
            </div>
          </div>
        </div>

        {/* Reason 2 */}
        <div className="bg-[rgba(25,30,31,1)] border border-[rgba(63,73,69,1)] rounded-2xl p-6">
          <div className="flex justify-end items-center gap-3 mb-4">
            <h4 className="text-sm font-bold text-white">2. عدم تطابق في البيانات المصرفية والمعلومات المسجلة</h4>
            <div className="bg-[#E53535]/10 p-2 rounded-lg">
              <ShieldAlert className="w-5 h-5 text-[#E53535]" />
            </div>
          </div>
          <p className="text-xs text-[#9A9A9A] text-end mb-6">
            كشف الفحص الآلي عن وجود تباين جوهري بين الاسم التجاري المسجل في وثائق الحساب الإعلاني (السجل التجاري) وبين اسم المستفيد من الحساب البنكي الموجه إليه طلب التحويل.
          </p>

          <div className="bg-[rgba(17,20,21,1)] border border-[rgba(63,73,69,1)] rounded-xl p-4 text-end mb-6">
            <div className="flex items-center justify-between border-b border-[rgba(63,73,69,0.5)] pb-2 mb-3">
              <span className="text-[10px] text-[#E53535] font-bold bg-[#E53535]/10 px-2 py-0.5 rounded">فشل المطابقة (Mismatch)</span>
              <span className="text-xs text-[#9A9A9A] flex items-center gap-1">معيار التدقيق الأمني (AML) / مكافحة غسيل الأموال <ShieldAlert className="w-3 h-3 text-[#E53535]"/></span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-bold text-white">شركة الزمرد للتسويق الرقمي ذ.م.م</span>
              <span className="text-[11px] text-[#666666]">الاسم في الحساب الإعلاني:</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-[#E53535]">AHMED M. AL-GHAMDI (شخصي)</span>
              <span className="text-[11px] text-[#666666]">اسم صاحب الحساب المصرفي المدخل:</span>
            </div>
          </div>

          <div className="bg-[rgba(17,20,21,1)] border border-[rgba(63,73,69,1)] rounded-xl p-4 flex items-start gap-3">
            <div className="flex-1 text-end">
              <h5 className="text-xs font-bold text-[rgba(148,211,193,1)] mb-1">كيفية المعالجة:</h5>
              <p className="text-[10px] text-[#9A9A9A] leading-relaxed">
                يجب أن يكون الحساب البنكي مسجلاً رسمياً باسم المنشأة المعلنة المعتمدة، أو تقديم تفويض بنكي معتمد يربط الحسابين ورفعه إلى إدارة الحسابات للتحقق.
              </p>
            </div>
            <CheckSquare className="w-5 h-5 text-[rgba(148,211,193,1)] shrink-0 mt-1" />
          </div>
        </div>

        {/* Lock / Restore block */}
        <div className="bg-[rgba(25,30,31,1)] border border-[rgba(63,73,69,1)] rounded-2xl p-6 flex justify-between items-center">
          <div className="text-end">
            <h4 className="text-sm font-bold text-white mb-1">تأكيد فك الحجز المالي المؤقت</h4>
            <p className="text-[10px] text-[#9A9A9A]">تم فك الحجز المؤقت فوراً وإعادة مبلغ 500.00$ بالكامل إلى رصيدك المتاح. ورصيدك الحالي جاهز للاستخدام.</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-center">
              <span className="block text-sm font-bold text-[rgba(148,211,193,1)]">+$500.00 USD</span>
              <span className="text-[9px] text-[#666666]">أعيد للحساب</span>
            </div>
            <div className="bg-[rgba(148,211,193,0.1)] p-3 rounded-full">
              <Lock className="w-6 h-6 text-[rgba(148,211,193,1)]" />
            </div>
          </div>
        </div>

      </div>

      {/* Left Column (Narrow) */}
      <div className="space-y-6">
        
        {/* Timeline */}
        <div className="bg-[rgba(25,30,31,1)] rounded-2xl border border-[rgba(63,73,69,1)] p-6">
          <div className="flex justify-between items-center mb-8 border-b border-[rgba(63,73,69,1)] pb-4">
            <span className="text-[10px] bg-[rgba(63,73,69,1)] px-2 py-1 rounded text-[#9A9A9A]">تسلسل العمليات والقرارات الزمنية الموثقة</span>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-white">سجل التدقيق والمراجعة المالية</h2>
              <List className="w-4 h-4 text-[#9A9A9A]" />
            </div>
          </div>

          <div className="relative border-r border-[rgba(63,73,69,1)] pr-6 mr-3 space-y-8">
            <div className="relative">
              <div className="absolute -right-9 top-0 w-6 h-6 rounded-full bg-[rgba(148,211,193,1)] flex items-center justify-center border-4 border-[#141414]">
                <Check className="w-3 h-3 text-white" />
              </div>
              <div className="text-end">
                <h4 className="text-xs font-bold text-white mb-1">تقديم طلب استرداد رصيد</h4>
                <p className="text-[9px] text-[#666666] mb-1">تم إنشاء طلب سحب لمبلغ 500.00$ وتعليق المبلغ مؤقتاً في المحفظة.</p>
                <span className="text-[8px] text-[#666666]">10:30 ص</span>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -right-9 top-0 w-6 h-6 rounded-full bg-[rgba(148,211,193,1)] flex items-center justify-center border-4 border-[#141414]">
                <Check className="w-3 h-3 text-white" />
              </div>
              <div className="text-end">
                <h4 className="text-xs font-bold text-white mb-1">الفحص والمراجعة الآلية</h4>
                <p className="text-[9px] text-[#666666] mb-1">فحص جاهزية السيولة ومطابقة الهوية المصرفية مع معايير الامتثال.</p>
                <span className="text-[8px] text-[#666666]">11:15 ص</span>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -right-9 top-0 w-6 h-6 rounded-full bg-[#E53535] flex items-center justify-center border-4 border-[#141414]">
                <XCircle className="w-3 h-3 text-white" />
              </div>
              <div className="text-end">
                <h4 className="text-xs font-bold text-[#E53535] mb-1">صدور قرار عدم الموافقة</h4>
                <p className="text-[9px] text-[#666666] mb-1">رفض الطلب آلياً لتعارض الميزانيات واختلاف بيانات الحساب البنكي.</p>
                <span className="text-[8px] text-[#666666]">11:45 ص</span>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -right-9 top-0 w-6 h-6 rounded-full bg-[#FFC107] flex items-center justify-center border-4 border-[#141414]">
                <Lock className="w-3 h-3 text-black" />
              </div>
              <div className="text-end">
                <h4 className="text-xs font-bold text-[#FFC107] mb-1">فك الحجز وإعادة الرصيد</h4>
                <p className="text-[9px] text-[#666666] mb-1">تم استرجاع مبلغ 500.00$ لرصيد المحفظة النشط وتصفير الرسوم الإدارية.</p>
                <span className="text-[8px] text-[#666666]">11:46 ص</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="bg-[rgba(25,30,31,1)] rounded-2xl border border-[rgba(63,73,69,1)] p-6 space-y-3">
          <button onClick={() => onSwitchState('initial')} className="w-full bg-[#FF8C00] hover:bg-[#E67E00] text-white font-bold py-3.5 rounded-xl transition-colors shadow-lg shadow-[#FF8C00]/20">
            إيقاف الحملات وتعديل البيانات لإعادة التقديم
          </button>
          <button className="w-full bg-[rgba(17,20,21,1)] hover:bg-[rgba(63,73,69,0.5)] border border-[rgba(63,73,69,1)] text-white text-sm font-bold py-3.5 rounded-xl transition-colors flex items-center justify-center gap-2">
            التواصل الفوري مع الدعم المالي والامتثال (24/7)
            <Headset className="w-4 h-4 text-[rgba(148,211,193,1)]" />
          </button>
          <button onClick={() => onSwitchState('initial')} className="w-full bg-transparent hover:bg-[rgba(63,73,69,0.5)] text-[#9A9A9A] text-sm py-3 rounded-xl transition-colors">
            العودة إلى لوحة تحكم المحفظة &larr;
          </button>
          
          <div className="border-t border-[rgba(63,73,69,1)] pt-4 mt-2">
            <button className="w-full flex items-center justify-between text-[10px] text-[#666666] hover:text-white transition-colors">
              <span>140 KB</span>
              <span className="flex items-center gap-2">تحميل إشعار قرار الرفض المالي الرسمي (PDF) <Download className="w-3 h-3"/></span>
            </button>
          </div>
        </div>

        {/* FAQ */}
        <div className="bg-[rgba(25,30,31,1)] rounded-2xl border border-[rgba(63,73,69,1)] p-6 text-end">
          <h4 className="text-xs font-bold text-white mb-2 flex items-center justify-end gap-2">
            هل يؤثر الرفض على أداء إعلاناتي الحالية؟ <Info className="w-4 h-4 text-[rgba(148,211,193,1)]"/>
          </h4>
          <p className="text-[10px] text-[#9A9A9A] leading-relaxed">
            لا إطلاقاً. رصيدك المتاح البالغ $2,850 يعمل بكامل طاقته ومتاح لتمويل مزاداتك وظهور حملاتك دون أي انقطاع أو تأثير سلبي على نقاط الجودة.
          </p>
        </div>

      </div>
    </div>
  );
}
