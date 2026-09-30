'use client';
import React from 'react';
import { 
  CheckCircle, FileText, CheckSquare, Clock, Check, Download, Landmark
} from 'lucide-react';

export default function SuccessState({ onSwitchState }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      {/* Right Column (Wide) */}
      <div className="lg:col-span-2 bg-[rgba(25,30,31,1)] rounded-2xl border border-[rgba(63,73,69,1)] p-8">
        <div className="flex flex-col items-center justify-center text-center mb-8">
          <div className="w-16 h-16 bg-[rgba(148,211,193,0.1)] rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="w-8 h-8 text-[rgba(148,211,193,1)]" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">تم تقديم طلب استرداد الرصيد بالكامل بنجاح</h2>
          <p className="text-sm text-[#9A9A9A] max-w-lg">
            سيتم معالجة الطلب وتحويل المبلغ إلى وسيلة الدفع الأصلية خلال <span className="text-[#FFC107]">3 إلى 5 أيام عمل</span> دون أي قيود مالية معلقة. وفقاً لسياسة الاسترداد السريعة والامتثال المصرفي.
          </p>
        </div>

        <div className="bg-[rgba(17,20,21,1)] rounded-xl p-4 border border-[rgba(63,73,69,1)] flex items-start gap-4 mb-8">
          <div className="p-2 bg-[rgba(63,73,69,1)] rounded-lg shrink-0">
            <FileText className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <h4 className="text-sm font-bold text-white mb-1">إشعار التدقيق الفوري مرسل</h4>
            <p className="text-xs text-[#9A9A9A]">تم إرسال نسخة السند المعتمد وكشف العملية إلى <span className="text-[#FF8C00]">Pay.Per.view@company.com</span></p>
          </div>
          <button className="flex items-center gap-1 bg-[rgba(63,73,69,1)] hover:bg-[rgba(63,73,69,1)] text-white text-xs px-3 py-1.5 rounded-lg transition-colors">
            <CheckSquare className="w-3 h-3" />
            إشعار موثق رقمياً
          </button>
        </div>

        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <span className="text-xs font-bold text-[rgba(148,211,193,1)]">مكتمل بنسبة 100%</span>
            <span className="text-xs text-[#9A9A9A]">فحوصات النظام اللحظية الآلية (AUTOMATED SYSTEM VALIDATION CHECKS)</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="bg-[rgba(17,20,21,1)] border border-[rgba(63,73,69,1)] p-3 rounded-xl flex items-center justify-between">
              <div>
                <h5 className="text-xs font-bold text-white mb-0.5">فحص صحة المبلغ المسترد</h5>
                <p className="text-[10px] text-[#666666]">المبلغ مودع (2,850.00$) ومطابق تماماً لسجل المحفظة</p>
              </div>
              <CheckCircle className="w-4 h-4 text-[rgba(148,211,193,1)]" />
            </div>
            <div className="bg-[rgba(17,20,21,1)] border border-[rgba(63,73,69,1)] p-3 rounded-xl flex items-center justify-between">
              <div>
                <h5 className="text-xs font-bold text-white mb-0.5">خلو الالتزامات الإعلانية النشطة</h5>
                <p className="text-[10px] text-[#666666]">تم التدقيق الآلي: لا توجد فواتير مؤجلة أو حملات قيد النقر</p>
              </div>
              <CheckCircle className="w-4 h-4 text-[rgba(148,211,193,1)]" />
            </div>
            <div className="bg-[rgba(17,20,21,1)] border border-[rgba(63,73,69,1)] p-3 rounded-xl flex items-center justify-between">
              <div>
                <h5 className="text-xs font-bold text-white mb-0.5">التحقق من وسيلة الدفع الأصلية</h5>
                <p className="text-[10px] text-[#666666]">البطاقة الائتمانية المنتهية بـ 4092 مؤهلة للإيداع العكسي المباشر</p>
              </div>
              <CheckCircle className="w-4 h-4 text-[rgba(148,211,193,1)]" />
            </div>
            <div className="bg-[rgba(17,20,21,1)] border border-[rgba(63,73,69,1)] p-3 rounded-xl flex items-center justify-between">
              <div>
                <h5 className="text-xs font-bold text-white mb-0.5">الامتثال المالي والشرعي</h5>
                <p className="text-[10px] text-[#666666]">مستوفي لكافة المعايير الشرعية وتصاريح الهيئة المالية</p>
              </div>
              <CheckCircle className="w-4 h-4 text-[rgba(148,211,193,1)]" />
            </div>
          </div>
        </div>

        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <span className="text-xs font-bold text-[#FF8C00] bg-[#FF8C00]/10 px-2 py-1 rounded">المرحلة 2 من 4</span>
            <div className="text-end">
              <h4 className="text-sm font-bold text-white mb-0.5">المراحل الإجرائية لدورة الاسترداد المالي</h4>
              <p className="text-[10px] text-[#666666]">مخطط تتبع معالجة الحوالة البنكية وفق المعايير الزمنية المعتمدة</p>
            </div>
          </div>
          
          <div className="relative flex justify-between">
            <div className="absolute top-4 left-0 w-full h-[1px] bg-[rgba(63,73,69,1)] -z-10"></div>
            
            <div className="flex flex-col items-center text-center w-1/4">
              <div className="w-8 h-8 rounded-full bg-[rgba(17,20,21,1)] border border-[rgba(63,73,69,1)] flex items-center justify-center text-xs text-[#666666] mb-2">4</div>
              <span className="text-[10px] font-bold text-[#666666]">وصول المبلغ للحساب</span>
              <span className="text-[9px] text-[#666666] mt-1">تأكيد القيد المالي المباشر<br/>31 يناير 2026</span>
            </div>
            <div className="flex flex-col items-center text-center w-1/4">
              <div className="w-8 h-8 rounded-full bg-[rgba(17,20,21,1)] border border-[rgba(63,73,69,1)] flex items-center justify-center text-xs text-[#666666] mb-2">3</div>
              <span className="text-[10px] font-bold text-[#666666]">إرسال الحوالة البنكية</span>
              <span className="text-[9px] text-[#666666] mt-1">شبكة سداد / فيزا الدولية<br/>خلال 48 ساعة</span>
            </div>
            <div className="flex flex-col items-center text-center w-1/4">
              <div className="w-8 h-8 rounded-full bg-[#FF8C00] flex items-center justify-center text-xs text-white mb-2 shadow-[0_0_10px_rgba(249,115,22,0.5)]">
                <Clock className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-bold text-[#FF8C00]">التدقيق الحسابي والمصرفي</span>
              <span className="text-[9px] text-[#FF8C00]/70 mt-1">قيد المراجعة (Processing)<br/>المرحلة الحالية</span>
            </div>
            <div className="flex flex-col items-center text-center w-1/4">
              <div className="w-8 h-8 rounded-full bg-[rgba(148,211,193,1)] flex items-center justify-center text-xs text-white mb-2 shadow-[0_0_10px_rgba(20,184,166,0.3)]">
                <Check className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-bold text-white">تقديم وتأكيد الطلب</span>
              <span className="text-[9px] text-[#666666] mt-1">28 يناير 2026 - 02:45 م<br/>مكتمل بنجاح</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <button className="flex items-center justify-center gap-2 bg-[rgba(17,20,21,1)] hover:bg-[rgba(63,73,69,0.5)] text-white text-sm font-medium py-3 px-6 rounded-xl transition-colors">
            <Download className="w-4 h-4" />
            تحميل إشعار الاستلام (PDF)
          </button>
          <button onClick={() => onSwitchState('initial')} className="flex-1 bg-[rgba(148,211,193,0.1)] hover:bg-[rgba(148,211,193,0.2)] text-[rgba(148,211,193,1)] text-sm font-medium py-3 rounded-xl transition-colors border border-[rgba(148,211,193,0.2)]">
            العودة إلى لوحة المحفظة
          </button>
          <button onClick={() => onSwitchState('cancelled')} className="flex items-center justify-center gap-2 flex-1 bg-[#FF8C00] hover:bg-[#E67E00] text-white text-sm font-medium py-3 rounded-xl transition-colors shadow-lg shadow-[#FF8C00]/20">
            <FileText className="w-4 h-4" />
            إلغاء طلب الاسترداد
          </button>
        </div>

      </div>

      {/* Left Column (Narrow) */}
      <div className="bg-[rgba(25,30,31,1)] rounded-2xl border border-[rgba(63,73,69,1)] p-6 self-start">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-[rgba(63,73,69,1)]">
          <Landmark className="w-5 h-5 text-[#9A9A9A]" />
          <h2 className="text-lg font-bold text-white">بيانات الحساب البنكي المُستقبل</h2>
        </div>

        <div className="space-y-5">
          <div className="flex justify-between items-center border-b border-[rgba(63,73,69,0.5)] pb-3">
            <span className="text-xs text-[#666666]">اسم البنك:</span>
            <span className="text-sm font-bold text-white">مصرف الراجحي (Al Rajhi Bank)</span>
          </div>
          <div className="flex justify-between items-center border-b border-[rgba(63,73,69,0.5)] pb-3">
            <span className="text-xs text-[#666666]">رقم الآيبان (IBAN):</span>
            <span className="text-xs font-bold text-[rgba(148,211,193,1)]" style={{ letterSpacing: '1px' }}>SA44 8000 0456 **** 4092</span>
          </div>
          <div className="flex justify-between items-center border-b border-[rgba(63,73,69,0.5)] pb-3">
            <span className="text-xs text-[#666666]">اسم المستفيد:</span>
            <span className="text-sm font-bold text-white">مؤسسة الحلول الرقمية المتقدمة</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-[#666666]">طريقة التسوية:</span>
            <span className="text-xs font-bold text-[#FF8C00]">إعادة قيد فوري لوسيلة الدفع</span>
          </div>
        </div>
      </div>

    </div>
  );
}
