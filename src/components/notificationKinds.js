import {
  MdOutlineCloudDone,
  MdOutlineCloudOff,
  MdOutlineSend,
  MdOutlineVisibilityOff,
  MdOutlineWarningAmber,
  MdErrorOutline,
  MdOutlineCheckCircleOutline,
} from "react-icons/md";

/** الأنواع الأربعة للإشعارات (تُحفظ في الحقل `kind`) */
export const KINDS = {
  DOWNLOAD_READY: "DOWNLOAD_READY",
  DOWNLOAD_FAILED: "DOWNLOAD_FAILED",
  APPLICATION_SUBMITTED: "APPLICATION_SUBMITTED",
  PREVIEW_UNAVAILABLE: "PREVIEW_UNAVAILABLE",
  CAMPAIGN_SUSPENDED: "CAMPAIGN_SUSPENDED",
  APPLICATION_REJECTED: "APPLICATION_REJECTED",
  APPLICATION_ACCEPTED: "APPLICATION_ACCEPTED",
  AD_CLIP_SUBMITTED: "AD_CLIP_SUBMITTED",
  CLIP_APPROVED: "CLIP_APPROVED",
};

export const KIND_META = {
  [KINDS.DOWNLOAD_READY]: {
    Icon: MdOutlineCloudDone,
    color: "#94D3C1",
    ar: {
      title: "تم اكتمال تنزيل الملفات بنجاح!",
      body: "تم تجميع وحفظ حزمة المواد الإعلانية الكاملة ({size} GB) بصيغة ZIP المشفرة بأعلى معايير الحماية في مجلد التنزيلات على جهازك، وتحتوي على كافة المشاهد الخام والمؤثرات المعتمدة شرعياً للبدء بالإنتاج.",
    },
    en: {
      title: "Your files finished downloading successfully!",
      body: "The full ad materials package ({size} GB) was compiled and saved as an encrypted ZIP in your Downloads folder, containing all raw footage and Shariah-approved effects, ready for production.",
    },
  },
  [KINDS.DOWNLOAD_FAILED]: {
    Icon: MdOutlineCloudOff,
    color: "#F2554D",
    ar: {
      title: "فشل تنزيل حزمة الأصول — حدث انقطاع في الاتصال بالشبكة",
      body: "تعذر استكمال تنزيل ملفات الحملة (انقطع التنزيل بسبب عدم استقرار الاتصال بالخادم السحابي). أعد المحاولة عند توفر الاتصال بالإنترنت.",
    },
    en: {
      title: "Asset pack download failed — network connection lost",
      body: "Couldn't finish downloading the campaign files (the download was interrupted by an unstable connection to the cloud server). Please try again once you're back online.",
    },
  },
  [KINDS.APPLICATION_SUBMITTED]: {
    Icon: MdOutlineSend,
    color: "#94D3C1",
    ar: {
      title: "تم إرسال طلب انضمامك بنجاح",
      body: "تم إرسال طلبك للانضمام إلى حملة «{campaign}» وهو الآن قيد المراجعة من المعلن. سنُعلمك فور اتخاذ القرار.",
    },
    en: {
      title: "Your join request was submitted",
      body: "Your request to join \"{campaign}\" was sent and is now under the advertiser's review. We'll let you know as soon as a decision is made.",
    },
  },
  [KINDS.PREVIEW_UNAVAILABLE]: {
    Icon: MdOutlineVisibilityOff,
    color: "#E9C349",
    ar: {
      title: "المعاينة غير متاحة",
      body: "لا يوجد ملف للمعاينة لحملة «{campaign}» حالياً. سيظهر الملف هنا فور توفره.",
    },
    en: {
      title: "Preview unavailable",
      body: "There is no file to preview for \"{campaign}\" right now. It will be available here as soon as it's ready.",
    },
  },
  [KINDS.CAMPAIGN_SUSPENDED]: {
    Icon: MdOutlineWarningAmber,
    color: "#E9C349",
    ar: {
      title: "تنبيه:",
      body: "حملة «{campaign}» تم إيقافها مؤقتاً لحين مراجعتها، ولم تعد متاحة للتقديم.",
    },
    en: {
      title: "Notice:",
      body: "The campaign \"{campaign}\" has been temporarily suspended pending review and is no longer open for applications.",
    },
  },
  [KINDS.APPLICATION_REJECTED]: {
    Icon: MdErrorOutline,
    color: "#F2554D",
    ar: {
      title: "نأسف لإبلاغك بأنه لم يتم قبول طلبك لهذه الحملة",
      body: "نشكرك على اهتمامك وحرصك على التقديم على حملة «{campaign}»، ونود إبلاغك بأنه لم يتم قبول طلبك حيث تم استيفاء كامل الميزانية.",
    },
    en: {
      title: "We're sorry, your request for this campaign wasn't accepted",
      body: "Thank you for your interest in applying to \"{campaign}\". We regret to inform you that your request wasn't accepted because the full budget has been filled.",
    },
  },
  [KINDS.APPLICATION_ACCEPTED]: {
    Icon: MdOutlineCheckCircleOutline,
    color: "#4CC96B",
    ar: {
      title: "تهانينا! تمت الموافقة على طلب انضمامك للحملة",
      body: "تم قبول طلبك لحملة «{campaign}». تم فتح الوصول الكامل إلى المواد الإعلانية، وروابط التتبع الخاصة بك، والدليل الإبداعي لتبدأ العمل والإنتاج فوراً.",
    },
    en: {
      title: "Congratulations! Your request to join the campaign was approved",
      body: "Your request for \"{campaign}\" was accepted. You now have full access to the ad materials, your tracking links and the creative guide, so you can start producing right away.",
    },
  },
  [KINDS.AD_CLIP_SUBMITTED]: {
    Icon: MdOutlineSend,
    color: "#94D3C1",
    ar: {
      title: "{campaign}",
      body: "تم تسليم مقطع فيديو إعلاني جديد بواسطة صانع المحتوى",
    },
    en: {
      title: "{campaign}",
      body: "A new advertising video clip has been submitted by the content creator.",
    },
  },
  [KINDS.CLIP_APPROVED]: {
    Icon: MdOutlineCheckCircleOutline,
    color: "#4CC96B",
    ar: {
      title: "تم اعتماد المقطع",
      body: "تم اعتماد مقطع {creator} لحملة «{campaign}».",
    },
    en: {
      title: "Clip approved",
      body: "{creator}'s clip for \"{campaign}\" has been approved.",
    },
  },
};

/** يستبدل {campaign} و{size} ... بقيم params */
export function fillText(text, params = {}) {
  return String(text).replace(/\{(\w+)\}/g, (_, k) => params[k] ?? "");
}

/**
 * يبني إشعاراً بنفس شكل إشعارات الـ context الحالية (id, unread, dateGroup...)
 * مثال: buildNotification("APPLICATION_ACCEPTED", { campaign: "عطور الأصالة" })
 */
export function buildNotification(kind, params = {}) {
  return {
    id: `${kind}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    kind,
    type: "activity", // مو "mention" عشان ما يختلط مع منشن الشات
    params,
    unread: true,
    createdAt: new Date().toISOString(),
    dateGroupAr: "اليوم",
    dateGroupEn: "Today",
  };
}

/** بيانات تجريبية لتظهر الأنواع الأربعة مباشرة */
export const SAMPLE_NOTIFICATIONS = [
  buildNotification(KINDS.DOWNLOAD_READY, { size: "1.40" }),
  buildNotification(KINDS.DOWNLOAD_FAILED),
  buildNotification(KINDS.CAMPAIGN_SUSPENDED, { campaign: "تطبيق ثروة الاستثماري" }),
  buildNotification(KINDS.APPLICATION_REJECTED, { campaign: "ملابس وأزياء عربية راقية" }),
  buildNotification(KINDS.APPLICATION_ACCEPTED, { campaign: "عطور الأصالة الفاخرة" }),
].map((n, i) => ({ ...n, id: `sample-${i}` }));