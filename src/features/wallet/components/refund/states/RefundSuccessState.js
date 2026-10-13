'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import { 
  CheckCircle, FileText, CheckSquare, Clock, Check, Download, Landmark
} from 'lucide-react';

export default function RefundSuccessState({ onSwitchState, onCancel, refund, cancelling = false }) {
  const router = useRouter();
  const locale = useLocale();
  const approved = ['APPROVED', 'COMPLETED'].includes(String(refund?.status || '').toUpperCase());
  const refundAmount = Number(refund?.amount ?? refund?.netAmount ?? 0);
  const formattedAmount = new Intl.NumberFormat(locale, { style: 'currency', currency: 'USD' }).format(refundAmount);
  const createdAt = refund?.createdAt ? new Date(refund.createdAt).toLocaleString(locale) : '—';
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      {/* Right Column (Wide) */}
      <div className="lg:col-span-2 bg-[#151819] rounded-2xl border border-white/[.08] p-8">
        <div className="flex flex-col items-center justify-center text-center mb-8">
          <div className="w-16 h-16 bg-[rgba(148,211,193,0.1)] rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="w-8 h-8 text-[#94D3C1]" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">{approved ? 'تمت الموافقة على طلب الاسترداد' : 'تم تقديم طلب الاسترداد بنجاح'}</h2>
          <p className="text-sm text-[#8A9490] max-w-lg">
            {approved ? 'تمت الموافقة على الطلب، ويجري إرجاع المبلغ وفق حالة المعاملة لدى مزود الدفع.' : <>حالة الطلب: <span className="text-[#E9C349]">قيد المراجعة</span>. سيتم تحديثها بعد مراجعة فريق الحسابات.</>}
          </p>
        </div>

        <div className="bg-[#101213] rounded-xl p-4 border border-white/[.08] flex items-start gap-4 mb-8">
          <div className="p-2 bg-white/[.08] rounded-lg shrink-0">
            <FileText className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <h4 className="text-sm font-bold text-white mb-1">تم تسجيل طلب الاسترداد</h4>
            <p className="text-xs text-[#8A9490]">رقم الطلب: <span className="text-[#E9C349]">{refund?.refundRequestId || '—'}</span></p>
          </div>
          <button className="flex items-center gap-1 bg-white/[.08] hover:bg-white/[.08] text-white text-xs px-3 py-1.5 rounded-lg transition-colors">
            <CheckSquare className="w-3 h-3" />
            إشعار موثق رقمياً
          </button>
        </div>

        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <span className="text-xs font-bold text-[#94D3C1]">مكتمل بنسبة 100%</span>
            <span className="text-xs text-[#8A9490]">فحوصات النظام اللحظية الآلية (AUTOMATED SYSTEM VALIDATION CHECKS)</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="bg-[#101213] border border-white/[.08] p-3 rounded-xl flex items-center justify-between">
              <div>
                <h5 className="text-xs font-bold text-white mb-0.5">فحص صحة المبلغ المسترد</h5>
                <p className="text-[10px] text-[#8A9490]">المبلغ المطلوب: {formattedAmount}</p>
              </div>
              <CheckCircle className="w-4 h-4 text-[#94D3C1]" />
            </div>
            <div className="bg-[#101213] border border-white/[.08] p-3 rounded-xl flex items-center justify-between">
              <div>
                <h5 className="text-xs font-bold text-white mb-0.5">خلو الالتزامات الإعلانية النشطة</h5>
                <p className="text-[10px] text-[#8A9490]">تم التدقيق الآلي: لا توجد فواتير مؤجلة أو حملات قيد النقر</p>
              </div>
              <CheckCircle className="w-4 h-4 text-[#94D3C1]" />
            </div>
            <div className="bg-[#101213] border border-white/[.08] p-3 rounded-xl flex items-center justify-between">
              <div>
                <h5 className="text-xs font-bold text-white mb-0.5">التحقق من وسيلة الدفع الأصلية</h5>
                <p className="text-[10px] text-[#8A9490]">طريقة الاسترداد: {refund?.refundMethod || 'بحسب إعداد الحساب'}</p>
              </div>
              <CheckCircle className="w-4 h-4 text-[#94D3C1]" />
            </div>
            <div className="bg-[#101213] border border-white/[.08] p-3 rounded-xl flex items-center justify-between">
              <div>
                <h5 className="text-xs font-bold text-white mb-0.5">الامتثال المالي والشرعي</h5>
                <p className="text-[10px] text-[#8A9490]">مستوفي لكافة المعايير الشرعية وتصاريح الهيئة المالية</p>
              </div>
              <CheckCircle className="w-4 h-4 text-[#94D3C1]" />
            </div>
          </div>
        </div>

        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <span className="text-xs font-bold text-[#E9C349] bg-[#E9C349]/10 px-2 py-1 rounded">المرحلة 2 من 4</span>
            <div className="text-end">
              <h4 className="text-sm font-bold text-white mb-0.5">المراحل الإجرائية لدورة الاسترداد المالي</h4>
              <p className="text-[10px] text-[#8A9490]">مخطط تتبع معالجة الحوالة البنكية وفق المعايير الزمنية المعتمدة</p>
            </div>
          </div>
          
          <div className="relative flex justify-between">
            <div className="absolute top-4 left-0 w-full h-[1px] bg-white/[.08] -z-10"></div>
            
            <div className="flex flex-col items-center text-center w-1/4">
              <div className="w-8 h-8 rounded-full bg-[#101213] border border-white/[.08] flex items-center justify-center text-xs text-[#8A9490] mb-2">4</div>
              <span className="text-[10px] font-bold text-[#8A9490]">وصول المبلغ للحساب</span>
              <span className="text-[9px] text-[#8A9490] mt-1">بانتظار تحديث حالة الطلب<br/>{createdAt}</span>
            </div>
            <div className="flex flex-col items-center text-center w-1/4">
              <div className="w-8 h-8 rounded-full bg-[#101213] border border-white/[.08] flex items-center justify-center text-xs text-[#8A9490] mb-2">3</div>
              <span className="text-[10px] font-bold text-[#8A9490]">إرسال الحوالة البنكية</span>
              <span className="text-[9px] text-[#8A9490] mt-1">شبكة سداد / فيزا الدولية<br/>خلال 48 ساعة</span>
            </div>
            <div className="flex flex-col items-center text-center w-1/4">
              <div className="w-8 h-8 rounded-full bg-[#E9C349] flex items-center justify-center text-xs text-white mb-2 shadow-[0_0_10px_rgba(249,115,22,0.5)]">
                <Clock className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-bold text-[#E9C349]">التدقيق الحسابي والمصرفي</span>
              <span className="text-[9px] text-[#E9C349]/70 mt-1">قيد المراجعة (Processing)<br/>المرحلة الحالية</span>
            </div>
            <div className="flex flex-col items-center text-center w-1/4">
              <div className="w-8 h-8 rounded-full bg-[#94D3C1] flex items-center justify-center text-xs text-white mb-2 shadow-[0_0_10px_rgba(20,184,166,0.3)]">
                <Check className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-bold text-white">تقديم وتأكيد الطلب</span>
              <span className="text-[9px] text-[#8A9490] mt-1">{createdAt}<br/>تم إرسال الطلب</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <button className="flex items-center justify-center gap-2 bg-[#101213] hover:bg-white/[.08] text-white text-sm font-medium py-3 px-6 rounded-xl transition-colors">
            <Download className="w-4 h-4" />
            تحميل إشعار الاستلام (PDF)
          </button>
          <button onClick={() => router.push(`/${locale}/advertiser/wallet`)} className="flex-1 bg-[rgba(148,211,193,0.1)] hover:bg-[rgba(148,211,193,0.2)] text-[#94D3C1] text-sm font-medium py-3 rounded-xl transition-colors border border-[rgba(148,211,193,0.2)]">
            العودة إلى لوحة المحفظة
          </button>
          {!approved && <button onClick={onCancel} disabled={cancelling || !refund?.refundRequestId} className="flex items-center justify-center gap-2 flex-1 text-white text-sm font-medium py-3 rounded-xl disabled:cursor-not-allowed disabled:opacity-50" style={{ background: "linear-gradient(90deg, #FDA100 0%, #FE5403 100%)" }}>
            <FileText className="w-4 h-4" />
            {cancelling ? 'جارٍ إلغاء الطلب…' : 'إلغاء طلب الاسترداد'}
          </button>}
        </div>

      </div>

      {/* Left Column (Narrow) */}
      <div className="bg-[#151819] rounded-2xl border border-white/[.08] p-6 self-start">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/[.08]">
          <Landmark className="w-5 h-5 text-[#8A9490]" />
          <h2 className="text-lg font-bold text-white">بيانات الحساب البنكي المُستقبل</h2>
        </div>

        <div className="space-y-5">
          <div className="flex justify-between items-center border-b border-white/[.08] pb-3">
            <span className="text-xs text-[#8A9490]">اسم البنك:</span>
            <span className="text-sm font-bold text-white">مصرف الراجحي (Al Rajhi Bank)</span>
          </div>
          <div className="flex justify-between items-center border-b border-white/[.08] pb-3">
            <span className="text-xs text-[#8A9490]">رقم الآيبان (IBAN):</span>
            <span className="text-xs font-bold text-[#94D3C1]" style={{ letterSpacing: '1px' }}>{refund?.refundMethod || '—'}</span>
          </div>
          <div className="flex justify-between items-center border-b border-white/[.08] pb-3">
            <span className="text-xs text-[#8A9490]">اسم المستفيد:</span>
            <span className="text-sm font-bold text-white">مؤسسة الحلول الرقمية المتقدمة</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-[#8A9490]">طريقة التسوية:</span>
            <span className="text-xs font-bold text-[#E9C349]">إعادة قيد فوري لوسيلة الدفع</span>
          </div>
        </div>
      </div>

    </div>
  );
}
