"use client";

import React, { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import {
  MdOutlineClose,
  MdOutlineShield,
  MdFilterList,
  MdOutlineReceiptLong,
} from "react-icons/md";
import { FiDownload } from "react-icons/fi";
import {
  BsFiletypeXlsx,
  BsFiletypePdf,
  BsFiletypeCsv,
} from "react-icons/bs";
import { HiCheckCircle } from "react-icons/hi";

export default function ExportModal({ dark = true, isRtl = true, onClose, onExport }) {
  const t = useTranslations("exportModal");

  const [selectedFormat, setSelectedFormat] = useState(null);
  const [includeBankRef, setIncludeBankRef] = useState(false);
  const [attachHash, setAttachHash] = useState(false);
  const [sendEmailCopy, setSendEmailCopy] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);

  const completionPercent =
    (!selectedFormat ? 0 : 45) +
    (includeBankRef ? 18 : 0) +
    (attachHash ? 18 : 0) +
    (sendEmailCopy ? 19 : 0);

  const displayProgress = Math.round(
    isExporting ? exportProgress : Math.min(completionPercent, 100),
  );

  useEffect(() => {
    if (!selectedFormat) {
      setExportProgress(0);
      return;
    }

    if (!isExporting) {
      setExportProgress(Math.min(completionPercent, 100));
    }
  }, [selectedFormat, isExporting, completionPercent]);

  const handleDownload = async () => {
    if (!selectedFormat || isExporting) return;

    setIsExporting(true);
    setExportProgress(Math.max(12, completionPercent));

    const timer = setInterval(() => {
      setExportProgress((prev) => {
        if (prev >= 96) return prev;
        return Math.min(prev + 18, 96);
      });
    }, 220);

    try {
      if (onExport) {
        await onExport({ format: selectedFormat, includeBankRef, attachHash, sendEmailCopy });
      }

      setExportProgress(100);
      setTimeout(() => {
        onClose?.();
      }, 250);
    } finally {
      clearInterval(timer);
      setIsExporting(false);
    }
  };

  const formats = [
    {
      id: "xlsx",
      Icon: BsFiletypeXlsx,
      label: t("xlsxFormat"),
      desc: t("xlsxDesc"),
      color: "text-emerald-500",
    },
    {
      id: "csv",
      Icon: BsFiletypeCsv,
      label: t("csvFormat"),
      desc: t("csvDesc"),
      color: "text-[#94D3C1]",
    },
    {
      id: "pdf",
      Icon: BsFiletypePdf,
      label: t("pdfFormat"),
      desc: t("pdfDesc"),
      color: "text-red-500",
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-3 sm:p-4 overflow-y-auto lg:pr-[260px]">
      <div
        className={`rounded-2xl border w-full max-w-md shadow-2xl p-3.5 sm:p-4 space-y-2.5 sm:space-y-3 max-h-[92vh] overflow-y-auto my-auto ${
          dark
            ? "bg-[#14181B] border-gray-800 text-white"
            : "bg-white border-gray-200 text-gray-900"
        }`}
        dir={isRtl ? "rtl" : "ltr"}
      >
        {/* Header */}
        <div className={`flex items-start justify-between border-b pb-2.5 sm:pb-3 ${
          dark ? "border-gray-800/80" : "border-gray-100"
        }`}>
          <div className="flex items-center gap-2.5">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center border shrink-0 ${
              dark ? "bg-[#1F2429] border-gray-700/50" : "bg-gray-50 border-gray-200"
            }`}>
              <FiDownload className="text-[#94D3C1] text-base" />
            </div>

            <div>
              <h3 className="text-xs sm:text-sm font-bold leading-snug bg-gradient-to-r from-[#94D3C1] to-[#E9C349] bg-clip-text text-transparent">
                {t("exportTitle")}
              </h3>

              <p className={`text-[0.6rem] sm:text-[0.65rem] mt-0.5 leading-tight ${
                dark ? "text-gray-400" : "text-gray-500"
              }`}>
                {t("exportDesc")}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className={`p-1.5 rounded-lg transition-colors border cursor-pointer shrink-0 ${
              dark 
                ? "bg-[#1F2429] text-gray-400 hover:text-white border-gray-700/50" 
                : "bg-gray-50 text-gray-500 hover:text-gray-900 border-gray-200"
            }`}
          >
            <MdOutlineClose size={15} />
          </button>
        </div>

        {/* Active Filter Range Box */}
        <div className={`flex items-center justify-between p-2.5 rounded-xl border gap-2 ${
          dark ? "bg-[#1A1F24] border-gray-800" : "bg-gray-50 border-gray-200"
        }`}>
          <div className="flex items-center gap-2 min-w-0">
            <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-amber-400 shrink-0 ${
              dark ? "bg-[#252C33]" : "bg-white border border-gray-100"
            }`}>
              <MdFilterList size={15} />
            </div>

            <div className="min-w-0">
              <div className={`text-[0.68rem] sm:text-[0.7rem] font-bold truncate ${
                dark ? "text-gray-200" : "text-gray-700"
              }`}>
                {t("filterRangeTitle")}
              </div>

              <div className={`text-[0.58rem] sm:text-[0.6rem] truncate ${
                dark ? "text-gray-400" : "text-gray-500"
              }`}>
                {t("filterPeriod")}
              </div>
            </div>
          </div>

          <div className={`flex items-center gap-1 px-2 py-1 rounded-lg border text-[#94D3C1] text-[0.6rem] sm:text-[0.65rem] font-semibold shrink-0 ${
            dark ? "bg-[#1C332B] border-[#94D3C1]/30" : "bg-[#E6F4F1] border-[#94D3C1]/30"
          }`}>
            <MdOutlineReceiptLong size={12} />
            <span>{t("transactionsCount")}</span>
          </div>
        </div>

        {/* Format Selection Section */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <span className={`text-[0.68rem] sm:text-[0.7rem] font-bold ${
              dark ? "text-gray-200" : "text-gray-700"
            }`}>
              {t("exportFormats")}
            </span>

            <span className={`text-[0.58rem] sm:text-[0.6rem] ${
              dark ? "text-gray-400" : "text-gray-500"
            }`}>
              {t("encodingNote")}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
            {formats.map((f) => {
              const Icon = f.Icon;
              const active = selectedFormat === f.id;

              return (
                <button
                  key={f.id}
                  onClick={() => setSelectedFormat(f.id)}
                  className={`flex flex-col justify-between p-2 sm:p-2.5 rounded-xl border text-right transition-all cursor-pointer relative ${
                    active
                      ? dark 
                        ? "bg-[#182622] border-[#94D3C1] shadow-md shadow-[#94D3C1]/10"
                        : "bg-[#E6F4F1] border-[#94D3C1] shadow-sm"
                      : dark
                        ? "bg-[#1A1F24] border-gray-800 hover:border-gray-700"
                        : "bg-gray-50 border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-center justify-between w-full mb-1.5">
                    <div className={`w-5 h-5 sm:w-6 sm:h-6 rounded-md flex items-center justify-center shrink-0 ${
                      dark ? "bg-[#252C33]" : "bg-white"
                    }`}>
                      <Icon className={`text-xs sm:text-sm ${f.color}`} />
                    </div>

                    <div
                      className={`w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full flex items-center justify-center border shrink-0 ${
                        active
                          ? dark ? "bg-[#94D3C1] border-[#94D3C1] text-black" : "bg-[#94D3C1] border-[#94D3C1] text-white"
                          : dark ? "border-gray-600 bg-transparent" : "border-gray-300 bg-white"
                      }`}
                    >
                      {active && <HiCheckCircle className="text-[10px] sm:text-xs" />}
                    </div>
                  </div>

                  <div>
                    <div className={`text-[0.62rem] sm:text-[0.68rem] font-bold mb-0.5 truncate ${
                      dark ? "text-white" : "text-gray-800"
                    }`}>
                      {f.label}
                    </div>

                    <div className={`text-[0.52rem] sm:text-[0.58rem] leading-tight line-clamp-2 ${
                      dark ? "text-gray-400" : "text-gray-500"
                    }`}>
                      {f.desc}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Security & Settings Section */}
        <div className="space-y-1.5">
          <span className={`text-[0.68rem] sm:text-[0.7rem] font-bold block ${
            dark ? "text-gray-200" : "text-gray-700"
          }`}>
            {t("securityTitle")}
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 sm:gap-2">
            <label className={`flex items-center gap-1.5 p-2 rounded-lg border cursor-pointer ${
              dark ? "bg-[#1A1F24] border-gray-800" : "bg-gray-50 border-gray-200"
            }`}>
              <input
                type="checkbox"
                checked={includeBankRef}
                onChange={(e) => setIncludeBankRef(e.target.checked)}
                className="w-3.5 h-3.5 accent-[#94D3C1] rounded shrink-0"
              />

              <span className={`text-[0.62rem] leading-tight ${
                dark ? "text-gray-300" : "text-gray-600"
              }`}>
                {t("includeBankRef")}
              </span>
            </label>

            <label className={`flex items-center gap-1.5 p-2 rounded-lg border cursor-pointer ${
              dark ? "bg-[#1A1F24] border-gray-800" : "bg-gray-50 border-gray-200"
            }`}>
              <input
                type="checkbox"
                checked={attachHash}
                onChange={(e) => setAttachHash(e.target.checked)}
                className="w-3.5 h-3.5 accent-[#94D3C1] rounded shrink-0"
              />

              <span className={`text-[0.62rem] flex items-center gap-0.5 leading-tight ${
                dark ? "text-gray-300" : "text-gray-600"
              }`}>
                {t("attachHash")}
                <MdOutlineShield className="text-amber-400 shrink-0" />
              </span>
            </label>
          </div>

          <label className={`flex items-center gap-1.5 p-2 rounded-lg border cursor-pointer ${
            dark ? "bg-[#1A1F24] border-gray-800" : "bg-gray-50 border-gray-200"
          }`}>
            <input
              type="checkbox"
              checked={sendEmailCopy}
              onChange={(e) => setSendEmailCopy(e.target.checked)}
              className="w-3.5 h-3.5 accent-[#94D3C1] rounded shrink-0"
            />

            <span className={`text-[0.62rem] leading-tight ${
              dark ? "text-gray-300" : "text-gray-600"
            }`}>
              {t("sendEmailCopy")}
            </span>
          </label>
        </div>

        {/* Progress / File Ready Card */}
        <div className={`p-2 sm:p-2.5 rounded-xl border space-y-1.5 ${
          dark ? "bg-[#1A1F24] border-gray-800" : "bg-gray-50 border-gray-200"
        }`}>
          <div className="flex items-center justify-between text-[0.62rem] sm:text-[0.65rem]">
            <div className="flex items-center gap-1 font-semibold bg-gradient-to-r from-[#94D3C1] to-[#E9C349] bg-clip-text text-transparent">
              <HiCheckCircle size={14} className="text-[#94D3C1] shrink-0" />
              <span>{t("dataSuccess", { percent: displayProgress })}</span>
            </div>

            <span className={`text-[0.58rem] sm:text-[0.6rem] shrink-0 ${
              dark ? "text-gray-400" : "text-gray-500"
            }`}>
              {t("fileSize")}{" "}
              <span className={dark ? "text-gray-200" : "text-gray-700"}>2.4 MB</span>
            </span>
          </div>

          {/* Progress Bar */}
          <div className={`w-full h-1 rounded-full overflow-hidden ${
            dark ? "bg-gray-800" : "bg-gray-200"
          }`}>
            <div
              className="h-full bg-gradient-to-r from-[#94D3C1] to-[#E9C349] transition-all duration-300 ease-out"
              style={{ width: `${isExporting ? exportProgress : Math.min(completionPercent, 100)}%` }}
            />
          </div>

          <div className="flex items-center justify-between gap-1 text-[0.58rem] sm:text-[0.6rem] pt-0.5">
            <span className={`font-mono truncate max-w-[130px] sm:max-w-[200px] ${
              dark ? "text-gray-400" : "text-gray-500"
            }`}>
              {selectedFormat
                ? `PayPerView_Audit_Ledger_March2026.${selectedFormat}`
                : t("selectFormatFirst")}
            </span>

            <span className="text-amber-400 font-semibold shrink-0">
              {displayProgress}%
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 pt-1">
          <button
            disabled={!selectedFormat || isExporting}
            onClick={handleDownload}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-bold transition-all ${
              selectedFormat && !isExporting
                ? "bg-gradient-to-r from-[#FF5603] to-[#FF9900] text-white hover:brightness-110 cursor-pointer shadow-md shadow-orange-950/30"
                : dark 
                  ? "bg-gray-700/50 text-gray-400 cursor-not-allowed border border-gray-700/50"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed border border-gray-200"
            }`}
          >
            {isExporting ? (
              <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin shrink-0" />
            ) : (
              <FiDownload size={14} className="shrink-0" />
            )}
            <span>{isExporting ? "..." : t("downloadBtn")}</span>
          </button>

          <button
            onClick={onClose}
            className={`px-3.5 sm:px-4 py-2.5 rounded-xl text-xs font-semibold transition-colors border cursor-pointer shrink-0 ${
              dark
                ? "bg-[#21272E] text-gray-300 hover:bg-[#283038] hover:text-white border-gray-700/50"
                : "bg-white text-gray-600 hover:bg-gray-50 hover:text-gray-900 border-gray-300"
            }`}
          >
            {t("cancelExport")}
          </button>
        </div>

        {/* Footer Note */}
        <div className={`flex items-center justify-center gap-1 text-[0.55rem] sm:text-[0.58rem] pt-0.5 text-center ${
          dark ? "text-gray-500" : "text-gray-400"
        }`}>
          <MdOutlineShield className="text-amber-400/80 text-xs shrink-0" />

          <span>{t("footerSecurityNote")}</span>
        </div>
      </div>
    </div>
  );
}