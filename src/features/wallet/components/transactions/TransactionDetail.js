// ============================================================
// ملف: app/[locale]/advertiser/analytics/components/TransactionDetail.js
// ============================================================

"use client";

import React from "react";
import {
  MdOutlineShield,
  MdHelpOutline,
  MdOutlineContentCopy,
  MdOutlineQrCodeScanner,
  MdOutlineArrowBack,
  MdOutlineArrowForward,
} from "react-icons/md";
import { FiDownload, FiLock, FiCheckCircle } from "react-icons/fi";
import { BsFiletypePdf, BsFiletypeCsv, BsShieldCheck, BsPatchCheckFill } from "react-icons/bs";
import { HiOutlineDocumentText, HiOutlineSparkles, HiOutlineCreditCard } from "react-icons/hi2";
import { TbReceiptTax } from "react-icons/tb";

/* ---------- مكوّنات مساعدة ---------- */
function Card({ icon, title, tag, tagClass, children, foot, dark = true }) {
  const defaultTagClass = dark
    ? "bg-gray-800/80 text-gray-400 font-mono"
    : "bg-gray-100 text-gray-600 font-mono";

  return (
    <div className={`rounded-2xl border p-4 sm:p-5 space-y-3.5 flex flex-col ${dark ? "bg-[#14181B] border-gray-800" : "bg-white border-gray-200"}`}>
      <div className={`flex items-center justify-between border-b pb-3 ${dark ? "border-gray-800/80" : "border-gray-200"}`}>
        <div className="flex items-center gap-2.5">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${dark ? "bg-[#004D40] text-[#94D3C1]" : "bg-[#94D3C1] text-[#004D40]"}`}>
            {icon}
          </div>
          <h3 className={`text-xs font-bold ${dark ? "text-white" : "text-gray-900"}`}>{title}</h3>
        </div>
        {tag && <span className={`text-[0.62rem] px-2.5 py-0.5 rounded-md ${tagClass || defaultTagClass}`}>{tag}</span>}
      </div>
      <div className="flex-1 space-y-2">{children}</div>
      {foot}
    </div>
  );
}

function Row({ label, children, dark = true }) {
  return (
    <div className={`flex justify-between gap-3 py-2 text-xs border-b last:border-0 ${dark ? "border-gray-800/40 text-gray-200" : "border-gray-100 text-gray-800"}`}>
      <span className={dark ? "text-gray-400" : "text-gray-500"}>{label}</span>
      <span className="font-semibold">{children}</span>
    </div>
  );
}

export default function TransactionDetail({ t, dark = true, isRtl = true, tx = null, onBack }) {
  const mutedText = dark ? "text-gray-400" : "text-gray-600";
  const warningText = dark ? "text-amber-400" : "text-amber-700";
  const successText = dark ? "#94D3C1" : "text-emerald-700";
  const accentText = dark ? "text-[#94D3C1]" : "text-[#00695C]";
  const footBox = `flex items-center justify-between gap-2 text-[0.65rem] p-2.5 rounded-xl border ${
    dark ? "text-gray-400 bg-[#1A1F24] border-gray-800/80" : "text-gray-600 bg-gray-50 border-gray-200"
  }`;

  const txnId = tx?.id || "TXN-2026-08940";
  const amount = tx?.amount || "$3,200.00";
  const sarLabel = t("sarLabel");
  const receiptTimestamp = new Date(2026, 2, 28, 21, 15, 30);
  const receiptDate = new Intl.DateTimeFormat(isRtl ? "ar-SA" : "en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(receiptTimestamp);
  const amountSar = tx?.amountSar || `(-12,000.00 ${sarLabel})`;
  const time = tx?.time || new Intl.DateTimeFormat(isRtl ? "ar-SA" : "en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).format(receiptTimestamp);
  const paymentMethod = tx?.paymentMethod || t("internalWallet");

  return (
    <div dir={isRtl ? "rtl" : "ltr"} className={`space-y-4 w-full text-start font-sans ${dark ? "text-gray-200" : "text-gray-800"}`}>
      {/* زر الرجوع */}
      {onBack && (
        <div className="flex items-center justify-start">
          <button
            onClick={onBack}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
              dark
                ? "bg-[#14191E] border-gray-800 text-gray-300 hover:bg-gray-800 hover:text-white"
                : "bg-white border-gray-300 text-gray-700 hover:bg-gray-100"
            }`}
          >
            {isRtl ? <MdOutlineArrowForward size={16} /> : <MdOutlineArrowBack size={16} />}
            <span>{t("back")}</span>
          </button>
        </div>
      )}

      {/* 1. الهيدر الرئيسي للمعاملة */}
      <section className={`relative overflow-hidden rounded-2xl border p-5 lg:p-6 shadow-2xl ${
        dark 
          ? "bg-gradient-to-br from-[#14191E] via-[#12161A] to-[#0E1114] border-gray-800" 
          : "bg-gradient-to-br from-white via-gray-50 to-gray-100 border-gray-200"
      }`}>
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 ${successText} text-[0.7rem] font-bold`}>
                <FiCheckCircle size={12} />
                {t("completedVerified")}
              </span>
              <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 ${warningText} text-[0.7rem] font-bold`}>
                <TbReceiptTax size={12} />
                {t("taxExempt")}
              </span>
              <span className={`text-xs font-mono px-2.5 py-1 rounded-lg border ${
                dark ? "text-gray-400 bg-gray-900/60 border-gray-800" : "text-gray-600 bg-gray-100 border-gray-300"
              }`}>
                {t("txnId")} {txnId}
              </span>
            </div>

            <div className="flex items-baseline gap-3">
              <h1 className={`text-3xl lg:text-4xl font-extrabold tracking-tight ${dark ? "text-white" : "text-gray-900"}`}>{amount}</h1>
              <span className="text-lg lg:text-xl font-bold text-[#FE9701]">({amountSar})</span>
            </div>

            <p className={`flex items-center gap-2 text-xs ${mutedText} max-w-2xl leading-relaxed`}>
              <span className="w-1.5 h-1.5 rounded-full bg-[#94D3C1] shrink-0" />
              {t("deductionDesc")}
            </p>
          </div>

          <button 
            style={{ background: "linear-gradient(270deg, #FE9701 0%, #FE5D04 100%)" }}
            className="shrink-0 w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-white font-bold text-xs shadow-lg transition-all hover:brightness-110 cursor-pointer"
          >
            <FiDownload size={16} />
            <span>{t("downloadInvoice")}</span>
          </button>
        </div>

        <div className={`mt-5 pt-3 border-t flex flex-col sm:flex-row items-center justify-between text-[0.68rem] ${mutedText} gap-2 ${
          dark ? "border-gray-800/80" : "border-gray-200"
        }`}>

          <div className={`flex items-center gap-1 font-mono ${dark ? "text-amber-400/90" : "text-amber-700"}`}>
            <BsPatchCheckFill size={12} />
            <span>{t("auditFingerprint")} #9962-E640-2026-SHARIA-VERIFIED</span>
          </div>
          <div>
              {t("dateLabel")} <span className={dark ? "text-gray-200" : "text-gray-800"}>{receiptDate}</span> | {t("timeLabel")}{" "}
            <span className={dark ? "text-gray-200" : "text-gray-800"}>{time}</span> {t("timezone")}
          </div>
          
        </div>
      </section>

      {/* 2. شبكة الكروت (2x2) */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Card 1: البيانات الأساسية للمعاملة */}
        <Card
          dark={dark}
          icon={<HiOutlineDocumentText size={18} />}
          title={t("coreInfoTitle")}
          tag={t("coreLedgerTag")}
          foot={
            <div className={footBox}>
              <span className="flex items-center gap-1.5">
                <FiLock className={`${warningText} shrink-0`} size={13} />
                {t("immutableNotice")}
              </span>
            </div>
          }
        >
          <Row dark={dark} label={t("intlTxnId")}>
            <span className={`font-mono font-bold ${accentText}`}>{txnId}</span>
          </Row>
          <Row dark={dark} label={t("dateTime")}>{receiptDate} - {time}</Row>
          <Row dark={dark} label={t("txnType")}>
            <span className={warningText}>{t("txnTypeVal")}</span>
          </Row>
          <Row dark={dark} label={t("currentStatus")}>
            <span className={`${successText} flex items-center gap-1`}>
              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: "#94D3C1" }} />
              {t("statusCleared")}
            </span>
          </Row>
          <Row dark={dark} label={t("shariaCompliance")}>
            <span className={successText}>{t("shariaVal")}</span>
          </Row>
        </Card>

        {/* Card 2: طريقة الدفع والقناة المالية */}
        <Card
          dark={dark}
          icon={<HiOutlineCreditCard size={18} />}
          title={t("paymentMethodTitle")}
          tag={t("walletDirectTag")}
          foot={
            <div className={footBox}>
              <span className={`flex items-center gap-1.5 ${successText}`}>
                <BsShieldCheck size={14} />
                {t("tlsSecured")}
              </span>
              <span className="font-mono text-gray-500">SSL SECURE</span>
            </div>
          }
        >
          <Row dark={dark} label={t("paymentSource")}>{paymentMethod}</Row>
          <Row dark={dark} label={t("balanceBefore")}>
            <span className="font-mono">
              $27,700.00 <span className="text-gray-500">(103,875.00 {sarLabel})</span>
            </span>
          </Row>
          <Row dark={dark} label={t("balanceAfter")}>
            <span className="font-mono">
                $24,500.00 <span className="text-[#94D3C1]/70">(91,875.00 ر.س)</span>
            </span>
          </Row>
          <Row dark={dark} label={t("processingChannel")}>{t("emeraldSecure")}</Row>
          <Row dark={dark} label={t("extraFees")}>
            <span className={warningText}>{t("exemptFees")}</span>
          </Row>
        </Card>

        {/* Card 3: الحملة الإعلانية المرتبطة */}
        <Card
          dark={dark}
          icon={<HiOutlineSparkles size={18} />}
          title={t("linkedCampaignTitle")}
          tag={t("activeNow")}
          tagClass={dark ? "bg-emerald-950 #94D3C1 font-semibold border border-emerald-800/50" : "bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200"}
          foot={
            <div className="space-y-1.5 pt-1">
              <div className="flex justify-between text-[0.65rem]">
                <span className={mutedText}>{t("fundingProgress")}</span>
                <span className={`${accentText} font-bold`}>78% {t("funded")}</span>
              </div>
              <div className={`w-full h-1.5 ${dark ? "bg-gray-800" : "bg-gray-200"} rounded-full overflow-hidden`}>
                <div 
                  className="h-full rounded-full transition-all duration-500" 
                  style={{ background: "linear-gradient(90deg, #E9C349 0%, #94D3C1 100%)", width: "78%" }} 
                />
              </div>
            </div>
          }
        >
          <Row dark={dark} label={t("campaignName")}>
            <span className={`font-bold ${dark ? "text-white" : "text-gray-900"}`}>{t("itemDesc")}</span>
          </Row>
          <Row dark={dark} label={t("campaignId")}>
            <span className={`font-mono ${accentText}`}>#CAMP-8821</span>
          </Row>
          <Row dark={dark} label={t("promoType")}>{t("promoTypeVal")}</Row>
          <Row dark={dark} label={t("totalApprovedBudget")}>
            <span className="font-mono">$10,000.00</span>
          </Row>
          <Row dark={dark} label={t("depositedAmount")}>
            <span className={`font-mono font-bold ${accentText}`}>+{amount}</span>
          </Row>
        </Card>

        {/* Card 4: الوصف والبيان المحاسبي القياسي */}
        <Card
          dark={dark}
          icon={<TbReceiptTax size={18} />}
          title={t("accountingDescTitle")}
          tag={t("generalLedgerTag")}
          foot={
            <div className={footBox}>
              <span>{t("auditorText")}</span>
              <span className={`${successText} font-bold`}>{t("approvedTag")}</span>
            </div>
          }
        >
          <div className="space-y-2.5 text-xs">
            <div>
              <span className={`${mutedText} text-[0.68rem] block mb-1`}>{t("detailedDescLabel")}</span>
              <p className={`p-2 rounded-lg border leading-relaxed text-[0.7rem] ${
                dark ? "text-gray-300 bg-[#1A1F24] border-gray-800/80" : "text-gray-700 bg-gray-50 border-gray-200"
              }`}>
                {tx?.description || t("detailedDescVal")}
              </p>
            </div>

            <div className={`p-2.5 rounded-xl border font-mono text-[0.68rem] space-y-1 ${
              dark ? "bg-[#101417] border-gray-800/60" : "bg-gray-50 border-gray-200"
            }`}>
              <div className={`flex justify-between border-b pb-1 mb-1 font-sans font-bold ${
                dark ? "border-gray-800 text-gray-400" : "border-gray-200 text-gray-600"
              }`}>
                <span>{t("doubleEntryTitle")}</span>
                <span className={`${warningText} font-mono`}>JV-2026-4412</span>
              </div>
              <div className={`flex justify-between ${successText}`}>
                <span>{t("debitAccount")}</span>
                <span>{amount}</span>
              </div>
              <div className={`flex justify-between ${successText}`}>
                <span>{t("creditAccount")}</span>
                <span>{amount}</span>
              </div>
            </div>

            <div className="flex items-center justify-between text-[0.65rem]">
              <span className={mutedText}>{t("auditStatus")}</span>
              <span className={`${successText} font-semibold flex items-center gap-1`}>
                <BsPatchCheckFill size={12} />
                {t("ifrsCompliant")}
              </span>
            </div>
          </div>
        </Card>
      </section>

      {/* 3. سند الصرف الضريبي والإيصال الرقمي (تم إعادة الخلفية الأصلية الكلاسيكية) */}
      <section className={`relative overflow-hidden rounded-2xl border shadow-2xl ${
        dark ? "bg-[#14181B] border-gray-800" : "bg-white border-gray-200"
      }`}>
        {/* الخط العلوي بالتدرج */}
        <div 
          className="h-0.5 w-full" 
          style={{ background: "linear-gradient(90deg, #94D3C1 0%, #E9C349 50%, #94D3C1 100%)" }} 
        />

        <div className="p-4 lg:p-5 space-y-4">
          {/* ترويسة سند الصرف الضريبي والأزرار العلوية */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${dark ? "bg-[#004D40] text-[#94D3C1] border-[#94D3C1]/30" : "bg-[#94D3C1] text-[#004D40] border-[#00695C]/20"}`}>
                <BsShieldCheck size={22} />
              </div>
              <div>
                <h2 className={`text-sm lg:text-base font-bold ${dark ? "text-white" : "text-gray-900"}`}>
                  {t("receiptTitle")}
                </h2>
                <p className={`text-[0.65rem] ${mutedText}`}>
                  {t("receiptSub")}
                </p>
              </div>
            </div>

            {/* الأزرار العلوية الثلاثة */}
            <div className="flex w-full flex-wrap items-center justify-start gap-2 md:w-auto">
              {[
                [BsFiletypePdf, dark ? "text-red-400" : "text-red-600", t("exportPdf")],
                [BsFiletypeCsv, dark ? "text-[#94D3C1]" : "text-[#00695C]", t("exportCsv")],
                [MdOutlineContentCopy, dark ? "text-gray-300" : "text-gray-600", t("copyEncryptedLink")],
              ].map(([Icon, color, label]) => (
                <button
                  key={label}
                  dir={isRtl ? "rtl" : "ltr"}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[0.62rem] font-semibold border transition-all cursor-pointer ${
                    dark
                      ? "bg-[#1A2024] hover:bg-[#232B31] text-gray-300 border-gray-700/60"
                      : "bg-gray-100 hover:bg-gray-200 text-gray-700 border-gray-300"
                  }`}
                >
                  <Icon className={color} size={13} />
                  <span>{label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* الحاوية الداخلية للسند (خلفية داكنة متناسقة) */}
          <div className={`rounded-xl border p-4 lg:p-5 space-y-4 ${
            dark ? "bg-[#171B1A] border-gray-800/80" : "bg-gray-50 border-gray-200"
          }`}>
            <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_220px] gap-5 items-stretch">
              
              {/* تفاصيل السند والجدول والأختام تحته */}
              <div className="space-y-4 flex flex-col justify-between">
                
                {/* عنوان السند ورقم الفاتورة */}
                <div className={`flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b ${dark ? "border-gray-800/60" : "border-gray-200"} pb-2.5`}>
                  <div>
                    <span className={`${warningText} font-semibold text-[0.65rem] block`}>
                      {t("voucherNotice")}
                    </span>
                    <h3 className={`text-xs lg:text-sm font-bold ${dark ? "text-white" : "text-gray-900"}`}>
                      {t("officialVoucher")}
                    </h3>
                  </div>

                  <div className={`text-start lg:text-end font-mono text-[0.62rem] ${mutedText} space-y-0.5`} dir="ltr">
                    <div><span>INVOICE REF: </span><span className={accentText}>EMR-INV-2026-9921</span></div>
                    <div>VAT ID: 310294857600003</div>
                  </div>
                </div>

                {/* جدول المعاملة */}
                <div className="overflow-x-auto">
                  <table className="w-full text-start text-[0.65rem] min-w-120">
                    <thead>
                      <tr className={`border-b text-[0.6rem] ${dark ? "bg-[#202423] text-gray-400 border-gray-800" : "bg-gray-100 text-gray-600 border-gray-200"}`}>
                        <th className="px-3 py-2 text-start font-medium">{t("colItem")}</th>
                        <th className="px-3 py-2 text-center font-medium">{t("colQty")}</th>
                        <th className="px-3 py-2 text-start font-medium">{t("colAmountUsd")}</th>
                        <th className="px-3 py-2 text-start font-medium">{t("colTotalSar")}</th>
                        <th className="px-3 py-2 text-start font-medium">{t("colTax")}</th>
                      </tr>
                    </thead>
                    <tbody className={`divide-y ${dark ? "divide-gray-800/40" : "divide-gray-200"}`}>
                      <tr className={dark ? "bg-[#101313]" : "bg-white"}>
                        <td className={`px-3 py-2.5 font-semibold ${dark ? "text-gray-200" : "text-gray-800"}`}>
                          {t("itemDesc")}
                        </td>
                        <td className={`px-3 py-2.5 text-center font-mono ${mutedText}`}>1</td>
                        <td className={`px-3 py-2.5 font-mono whitespace-nowrap ${dark ? "text-gray-200" : "text-gray-800"}`}>$2,782.61</td>
                        <td className={`px-3 py-2.5 font-mono ${mutedText} whitespace-nowrap`}>10,434.78 {sarLabel}</td>
                        <td className={`px-3 py-2.5 font-mono ${warningText} whitespace-nowrap`}>$417.39</td>
                      </tr>
                      <tr className={`font-bold ${dark ? "bg-[#1A1E1D]" : "bg-gray-100"}`}>
                        <td className={`px-3 py-2.5 ${dark ? "text-gray-100" : "text-gray-900"}`}>
                          {t("finalDeductionTotal")}
                        </td>
                        <td className={`px-3 py-2.5 text-center font-mono ${mutedText}`}>-</td>
                        <td className={`px-3 py-2.5 font-mono ${dark ? "text-red-300" : "text-red-700"} whitespace-nowrap`}>-{amount}</td>
                        <td className={`px-3 py-2.5 font-mono ${warningText} whitespace-nowrap`}>{amountSar}</td>
                        <td className={`px-3 py-2.5 ${accentText} whitespace-nowrap`}>{t("taxRecovered")}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* الأختام الثلاثة: الأيقونة على اليمين والنصوص على اليسار وبجانبها (مثل الصورة) */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2">
                  {/* الختم الأول */}
                  <div className={`p-3 rounded-xl border flex items-center gap-3 ${
                    dark ? "bg-[#191D1C] border-gray-800 text-gray-300" : "bg-white border-gray-200 text-gray-700"
                  }`}>
                    <BsPatchCheckFill className={`${accentText} shrink-0`} size={28} />
                    <div className="flex flex-col text-start">
                      <span className={`text-[0.6rem] ${mutedText}`}>{t("financialAudit")}</span>
                      <span className={`text-[0.72rem] font-bold ${dark ? "text-white" : "text-gray-900"}`}>{t("auditApproved")}</span>
                    </div>
                  </div>

                  {/* الختم الثاني */}
                  <div className={`p-3 rounded-xl border flex items-center gap-3 ${
                    dark ? "bg-[#191D1C] border-gray-800 text-gray-300" : "bg-white border-gray-200 text-gray-700"
                  }`}>
                    <MdOutlineShield className={`${warningText} shrink-0`} size={28} />
                    <div className="flex flex-col text-start">
                      <span className={`text-[0.6rem] ${mutedText}`}>{t("taxCompliance")}</span>
                      <span className={`text-[0.72rem] font-bold ${dark ? "text-white" : "text-gray-900"}`}>{t("zatcaAuthority")}</span>
                    </div>
                  </div>

                  {/* الختم الثالث */}
                  <div className={`p-3 rounded-xl border flex items-center gap-3 ${
                    dark ? "bg-[#191D1C] border-gray-800 text-gray-300" : "bg-white border-gray-200 text-gray-700"
                  }`}>
                    <FiLock className={`${dark ? 'text-[#94D3C1]]' : 'text-[#00695c]'} shrink-0`} size={26} />
                    <div className="flex flex-col text-start">
                      <span className={`text-[0.6rem] ${mutedText}`}>{t("encryptedTimestamp")}</span>
                      <span className={`text-[0.65rem] font-mono ${dark ? "text-white" : "text-gray-900"}`} dir="ltr">2026-03-28 21:15:30Z</span>
                    </div>
                  </div>
                </div>

              </div>

              {/* قسم رمز QR / الباركود (على اليسار) */}
              <div className={`flex flex-col items-center justify-between gap-3 p-4 rounded-xl border text-center ${
                dark ? "bg-[#14181B] border-gray-800/80" : "bg-white border-gray-200"
              }`}>
                <span className={`text-[0.65rem] font-bold ${dark ? "text-[#FE9701]" : "text-amber-700"} flex items-center gap-1.5`}>
                  <MdOutlineQrCodeScanner size={15} />
                  {t("zatcaQr")}
                </span>
                
                <div className="w-28 h-28 bg-white rounded-lg p-2 flex items-center justify-center shadow-md">
                  <svg viewBox="0 0 24 24" fill="black" className="w-full h-full">
                    <path d="M2 2h8v8H2V2zm2 2v4h4V4H4zm9-2h8v8h-8V2zm2 2v4h4V4h-4zM2 14h8v8H2v-8zm2 2v4h4v-4H4zm13-2h2v2h-2v-2zm-4 0h2v2h-2v-2zm2 4h2v2h-2v-2zm2-2h2v2h-2v-2zm0 4h2v2h-2v-2zm-4 0h2v2h-2v-2z" />
                  </svg>
                </div>

                <div className="space-y-1">
                  <p className={`text-[0.55rem] ${mutedText} leading-tight`}>
                    {t("scanQrText")}
                  </p>
                  <span className={`text-[0.58rem] ${successText} font-semibold flex items-center justify-center gap-1`}>
                    <FiCheckCircle size={11} />
                    {t("validCert")}
                  </span>
                </div>
              </div>

            </div>

            {/* خط الباركود ورقم التوثيق السفلي */}
            <div className={`flex flex-col items-center gap-1 pt-3 border-t ${dark ? "border-gray-800/60" : "border-gray-200"}`}>
              <div
                aria-hidden
                className="h-6 w-full max-w-36 opacity-80"
                style={{
                  background:
                    "repeating-linear-gradient(90deg,#9ca3af 0 2px,transparent 2px 4px,#9ca3af 4px 5px,transparent 5px 9px)",
                }}
              />
              <span className={`text-[0.5rem] ${mutedText} font-mono tracking-wider`}>
                TXN-2026-08940-EMR-AUDIT-SEC
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 4. شريط الدعم */}
      <footer className={`flex flex-col sm:flex-row items-center justify-between p-3 rounded-xl border text-[0.68rem] gap-2 ${
        dark ? "bg-[#121619] border-gray-800/80 text-gray-400" : "bg-white border-gray-200 text-gray-600"
      }`}>
        <div className="flex items-center gap-2">
          <MdHelpOutline className={warningText} size={16} />
          <span>{t("supportQuery")}</span>
        </div>
        <div className="flex items-center gap-3">
          <a href="#" className={`${accentText} hover:underline font-semibold`}>{t("openSupportTicket")}</a>
          <span className={mutedText}>|</span>
          <a href="#" className="hover:underline">{t("termsLink")}</a>
        </div>
      </footer>
    </div>
  );
}