'use client';

import React, { useEffect, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import {
  Search,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Compass,
  ClipboardList,
  Clock3,
  Archive,
  Hourglass,
  ExternalLink,
  Upload,
  MessageSquare,
  Info,
  BadgeCheck,
} from 'lucide-react';
import { SiInstagram, SiTiktok, SiYoutube } from 'react-icons/si';

import { useMessages } from '@/context/MessagesContext';
import { useTheme } from '@/context/ThemeContext';
import { WithdrawModal } from './WithdrawModal';

const platformIcons = {
  youtube: { Icon: SiYoutube, className: 'text-[#FF0000]', label: 'YouTube' },
  tiktok: { Icon: SiTiktok, label: 'TikTok' },
  instagram: { Icon: SiInstagram, className: 'text-[#E4405F]', label: 'Instagram' },
};

// صور افتراضية (SVG مدمجة، بدون روابط خارجية). استبدلها بروابط الصور الحقيقية لما تتوفر.
const svgToDataUri = (svg) => `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;

const PERFUME_IMG = "/images/parthiom.webp";

const GOLD_APP_IMG = svgToDataUri(
  `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'><defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop offset='0' stop-color='#0e2f2a'/><stop offset='1' stop-color='#06120f'/></linearGradient></defs><rect width='64' height='64' fill='url(#g)'/><ellipse cx='32' cy='50' rx='14' ry='5' fill='#c9a23a'/><rect x='18' y='42' width='28' height='8' fill='#c9a23a'/><ellipse cx='32' cy='42' rx='14' ry='5' fill='#E9C349'/><rect x='18' y='34' width='28' height='8' fill='#c9a23a'/><ellipse cx='32' cy='34' rx='14' ry='5' fill='#F5D36B'/><polyline points='12,24 22,18 31,21 52,8' fill='none' stroke='#94D3C1' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'/></svg>`
);
const FASHION_IMG = "/images/fashion.jpg";


const getInitialOrders = (t) => [
  {
    id: '1',
    code: 'CMP-4492-APP',
    title: t('sampleOrders.perfumeTitle'),
    company: t('sampleOrders.sidraCompany'),
    image: PERFUME_IMG,
    status: 'pending',
    statusText: t('sampleOrders.pendingStatus'),
    cpm: '4.80',
    budgetOrLimit: '$15,000',
    budgetLabel: t('sampleOrders.campaignBudget'),
    platforms: ['youtube', 'tiktok', 'instagram'],
    dueDate: '2026-10-15',
    submittedAt: '2026-08-18T14:45:00',
    note: t('sampleOrders.pendingNote'),
  },
  {
    id: '2',
    code: 'HL-9801',
    title: t('sampleOrders.goldAppTitle'),
    company: t('sampleOrders.fintechCompany'),
    image: GOLD_APP_IMG,
    status: 'accepted',
    statusText: t('sampleOrders.acceptedStatus'),
    cpm: '5.20',
    budgetOrLimit: '$850.00',
    budgetLabel: t('sampleOrders.maxEarnings'),
    platforms: ['youtube', 'tiktok', 'instagram'],
    trackingCode: 'HL-9801',
    dueDate: '2026-10-10',
    approvedAt: '2026-08-18T16:10:00',
    note: t('sampleOrders.acceptedNote'),
  },
  {
    id: '3',
    code: 'CMP-1029-REJ',
    title: t('sampleOrders.fashionTitle'),
    company: t('sampleOrders.fashionStore'),
    image: FASHION_IMG,
    status: 'rejected',
    statusText: t('sampleOrders.rejectedStatus'),
    cpm: '3.90',
    budgetOrLimit: '$5,000',
    budgetLabel: t('sampleOrders.totalBudget'),
    platforms: ['youtube', 'instagram'],
    dueDate: '2026-10-25',
    closedAt: '2026-08-10T10:00:00',
    rejectionReason: t('sampleOrders.rejectionReason'),
  },
];

const fmtDate = (d, locale) =>
  new Date(d).toLocaleDateString(locale === 'ar' ? 'ar-u-nu-latn' : locale, { day: 'numeric', month: 'long', year: 'numeric' });
const fmtTime = (d, locale) =>
  new Date(d).toLocaleTimeString(locale === 'ar' ? 'ar-u-nu-latn' : locale, { hour: '2-digit', minute: '2-digit' });

export function OrdersContent() {
  const t = useTranslations('creatorOrders');
  const locale = useLocale();
  const [orders, setOrders] = useState(() => getInitialOrders(t));
  const [sortBy, setSortBy] = useState('newest');
  const [isSortMenuOpen, setIsSortMenuOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrderForWithdraw, setSelectedOrderForWithdraw] = useState(null);

  const { addSystemNotification } = useMessages();
  const { isDark } = useTheme();

  const theme = {
    page: isDark ? 'bg-[#050505] text-gray-100' : 'bg-[#f4f6f5] text-[#191c1d]',
    surface: isDark ? 'bg-[#121617] border-[#1e2425]' : 'bg-white border-[#e1e7e4]',
    inset: isDark ? 'bg-[#181d1e] border-[#252c2d]' : 'bg-[#f3f6f5] border-[#e1e7e4]',
    input: isDark
      ? 'bg-[#161a22] border-[#252c3d] text-white placeholder-gray-500'
      : 'bg-white border-[#d8dfdc] text-[#191c1d] placeholder-[#7a8581]',
    primaryText: isDark ? 'text-white' : 'text-[#191c1d]',
    secondaryText: isDark ? 'text-gray-400' : 'text-[#5f6a66]',
  };

  useEffect(() => {
    orders
      .filter((order) => order.status === 'accepted' || order.status === 'rejected')
      .forEach((order) => {
        const isAccepted = order.status === 'accepted';
        addSystemNotification({
          orderId: order.id,
          status: order.status,
          title: t(isAccepted ? 'notifications.acceptedTitle' : 'notifications.rejectedTitle'),
          text: isAccepted
            ? t('notifications.acceptedText', { title: order.title })
            : order.rejectionReason
              ? t('notifications.rejectedWithReason', { title: order.title, reason: order.rejectionReason })
              : t('notifications.rejectedText', { title: order.title }),
        });
      });
  }, [orders, addSystemNotification, t]);

  const filteredOrders = orders.filter((o) => {
    if (activeFilter === 'pending' && o.status !== 'pending') return false;
    if (activeFilter === 'accepted' && o.status !== 'accepted') return false;
    if (
      activeFilter === 'rejected' &&
      o.status !== 'rejected' &&
      o.status !== 'withdrawn'
    ) return false;

    if (
      searchQuery &&
      !o.title.includes(searchQuery) &&
      !o.code.includes(searchQuery)
    ) return false;

    return true;
  });

  const sortedOrders = [...filteredOrders].sort((a, b) => {
    if (sortBy === 'highestCost') {
      const aCost = Number(a.budgetOrLimit.replace(/[^\d.]/g, '')) || 0;
      const bCost = Number(b.budgetOrLimit.replace(/[^\d.]/g, '')) || 0;
      return bCost - aCost;
    }

    if (sortBy === 'endingSoon') {
      const aTime = a.dueDate ? new Date(a.dueDate).getTime() : Infinity;
      const bTime = b.dueDate ? new Date(b.dueDate).getTime() : Infinity;
      return aTime - bTime;
    }

    // Default: newest
    return Number(a.id) - Number(b.id);
  });

  const handleConfirmWithdraw = (orderId, reason) => {
    const targetOrder = orders.find((o) => o.id === orderId);

    setOrders((prev) =>
      prev.map((ord) =>
        ord.id === orderId
          ? {
              ...ord,
              status: 'withdrawn',
              statusText: t('withdrawn.status'),
              closedAt: new Date().toISOString(),
              rejectionReason: t('withdrawn.reasonText', {
                reason: t(reason === 'time_busy' ? 'withdrawn.busyReason' : 'withdrawn.personalReason'),
              }),
            }
          : ord
      )
    );

    if (targetOrder) {
      addSystemNotification({
        orderId: targetOrder.id,
        status: 'withdrawn',
        title: t('notifications.withdrawnTitle'),
        text: t('notifications.withdrawnText', { title: targetOrder.title }),
      });
    }

    setSelectedOrderForWithdraw(null);
  };

  const getStatusBadge = (order) => {
    const base = 'inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[10px] font-bold whitespace-nowrap';
    const tones = {
      pending: isDark ? 'border-amber-500/30 bg-amber-500/10 text-amber-300' : 'border-amber-200 bg-amber-50 text-amber-800',
      accepted: isDark ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300' : 'border-emerald-200 bg-emerald-50 text-emerald-800',
      withdrawn: isDark ? 'border-slate-500/30 bg-slate-500/10 text-slate-200' : 'border-slate-200 bg-slate-100 text-slate-700',
      rejected: isDark ? 'border-red-500/30 bg-red-500/10 text-red-300' : 'border-red-200 bg-red-50 text-red-700',
    };
    const dots = {
      pending: 'bg-amber-400 animate-pulse',
      accepted: 'bg-emerald-400',
      withdrawn: 'bg-slate-400',
      rejected: 'bg-red-400',
    };

    return (
      <span className={`${base} ${tones[order.status]}`}>
        <span className={`h-1.5 w-1.5 rounded-full ${dots[order.status]}`} />
        {order.statusText}
      </span>
    );
  };

  return (
    <div className={`min-h-screen w-full font-sans p-4 md:p-6 ${theme.page}`} dir={locale === 'ar' ? 'rtl' : 'ltr'}>

      {/* Title Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div className={locale === 'ar' ? 'text-right' : 'text-left'}>
          <h1 className={`text-3xl font-black mb-1 ${theme.primaryText}`}>{t('title')}</h1>
          <p className={`text-xs leading-relaxed max-w-2xl ${theme.secondaryText}`}>
            {t('description')}
          </p>
        </div>

        <button
          className="px-5 py-2.5 text-white font-bold text-xs rounded-xl shadow-[0_0_20px_rgba(252,145,2,0.25)] flex items-center justify-center gap-2 transition-all self-start md:self-auto shrink-0"
          style={{ background: 'linear-gradient(90deg, #FC9102 0%, #FB6103 100%)' }}
        >
          <Compass size={16} /> {t('exploreCampaigns')}
        </button>
      </div>

      {/* KPI Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-5">

        <div className={`${isDark ? 'bg-[#191C1D] border-[#1e2425]' : 'bg-white border-[#e1e7e4] shadow-sm'} border p-4 rounded-xl relative flex flex-col justify-between`}>
          <div className="flex items-start justify-between mb-3">
            <div className={`text-xs font-semibold ${theme.secondaryText}`}>{t('stats.total')}</div>
            <span className={`w-9 h-9 rounded-lg flex items-center justify-center ${isDark ? 'bg-[#212f2c] text-[#94D3C1]' : 'bg-emerald-50 text-emerald-700'}`}>
              <ClipboardList size={18} />
            </span>
          </div>
          <div className="flex items-center justify-between mb-3">
            <div className={`text-3xl font-black ${theme.primaryText}`}>14</div>
            <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-medium ${isDark ? 'text-[#94D3C1] bg-[#1a332a]' : 'text-emerald-800 bg-emerald-50'}`}>{t('stats.registered')}</span>
          </div>
          <div className={`w-full h-1.5 rounded-full overflow-hidden ${isDark ? 'bg-[#1c2223]' : 'bg-[#e8eeeb]'}`}>
            <div className="bg-[#94D3C1] h-full w-full rounded-full"></div>
          </div>
        </div>

        <div className={`${isDark ? 'bg-[#191C1D] border-[#1e2425]' : 'bg-white border-[#e1e7e4] shadow-sm'} border p-4 rounded-xl relative flex flex-col justify-between`}>
          <div className="flex items-start justify-between mb-3">
            <div className={`text-xs font-semibold ${theme.secondaryText}`}>{t('stats.pending')}</div>
            <span className={`w-9 h-9 rounded-lg flex items-center justify-center ${isDark ? 'bg-[#332b17] text-[#E9C349]' : 'bg-amber-50 text-[#f3bf17]'}`}>
              <Hourglass size={18} />
            </span>
          </div>
          <div className="flex items-center justify-between mb-3">
            <div className={`text-3xl font-black ${isDark ? 'text-[#E9C349]' : 'text-[#f3bf17]'}`}>3</div>
            <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-medium flex items-center gap-1 ${isDark ? 'text-[#E9C349] bg-[#3a2e12]' : 'text-amber-800 bg-amber-50'}`}>
              <span className="w-1.5 h-1.5 rounded-full bg-[#E9C349]"></span>
              {t('stats.awaitingAdvertiser')}
            </span>
          </div>
          <div className={`w-full h-1.5 rounded-full overflow-hidden ${isDark ? 'bg-[#1c2223]' : 'bg-[#e8eeeb]'}`}>
            <div className="bg-[#E9C349] h-full w-[35%] rounded-full"></div>
          </div>
        </div>

        <div className={`${isDark ? 'bg-[#191C1D] border-[#1e2425]' : 'bg-white border-[#e1e7e4] shadow-sm'} border p-4 rounded-xl relative flex flex-col justify-between`}>
          <div className="flex items-start justify-between mb-3">
            <div className={`text-xs font-semibold ${theme.secondaryText}`}>{t('stats.accepted')}</div>
            <span className={`w-9 h-9 rounded-lg flex items-center justify-center ${isDark ? 'bg-[#212f2c] text-[#94D3C1]' : 'bg-emerald-50 text-emerald-700'}`}>
              <CheckCircle2 size={18} />
            </span>
          </div>
          <div className="flex items-center justify-between mb-3">
            <div className={`text-3xl font-black ${isDark ? 'text-[#94D3C1]' : 'text-[#68c8ad]'}`}>8</div>
            <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-medium ${isDark ? 'text-[#94D3C1] bg-[#1a332a]' : 'text-emerald-800 bg-emerald-50'}`}>{t('stats.acceptanceRate')}</span>
          </div>
          <div className={`w-full h-1.5 rounded-full overflow-hidden ${isDark ? 'bg-[#1c2223]' : 'bg-[#e8eeeb]'}`}>
            <div className="bg-[#94D3C1] h-full w-[75%] rounded-full"></div>
          </div>
        </div>

        <div className={`${isDark ? 'bg-[#191C1D] border-[#1e2425]' : 'bg-white border-[#e1e7e4] shadow-sm'} border p-4 rounded-xl relative flex flex-col justify-between`}>
          <div className="flex items-start justify-between mb-3">
            <div className={`text-xs font-semibold ${theme.secondaryText}`}>{t('stats.closed')}</div>
            <span className={`w-9 h-9 rounded-lg flex items-center justify-center ${isDark ? 'bg-[#202527] text-gray-400' : 'bg-slate-100 text-slate-600'}`}>
              <Archive size={18} />
            </span>
          </div>
          <div className="flex items-center justify-between mb-3">
            <div className={`text-3xl font-black ${isDark ? 'text-gray-300' : 'text-[#404945]'}`}>3</div>
            <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-medium ${isDark ? 'text-gray-400 bg-[#22282a]' : 'text-slate-700 bg-slate-100'}`}>{t('stats.archived')}</span>
          </div>
          <div className={`w-full h-1.5 rounded-full overflow-hidden ${isDark ? 'bg-[#1c2223]' : 'bg-[#e8eeeb]'}`}>
            <div className={`h-full w-[25%] rounded-full ${isDark ? 'bg-[#505a5d]' : 'bg-slate-400'}`}></div>
          </div>
        </div>

      </div>

      {/* Banner Notice */}
      <div className={`${isDark ? 'bg-[#191C1D] border-[#1d2b2c]' : 'bg-[#eaf5f1] border-[#cce5dc]'} border p-3.5 rounded-xl flex items-start gap-3 mb-5`}>
        <ShieldCheck size={20} className="text-[#94D3C1] shrink-0 mt-0.5" />
        <div className={`text-xs leading-relaxed ${isDark ? 'text-gray-300' : 'text-[#315d50]'}`}>
          <strong className={`font-bold ml-1 ${isDark ? 'text-white' : 'text-[#1c6b58]'}`}>
            {t('notice.title')}
          </strong>
          {t('notice.description')}
        </div>
      </div>

      {/* Filter, Search & Sorting Bar */}
      <div className={`${isDark ? 'bg-[#191C1D] border-[#1e2425]' : 'bg-white border-[#e1e7e4] shadow-sm'} border p-2.5 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-3 mb-5`} dir={locale === 'ar' ? 'rtl' : 'ltr'}>

        {/* أزرار الفلترة على اليمين */}
        <div className={`orders-filter-scroll flex items-center gap-1 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 ${isDark ? 'orders-filter-scroll-dark' : 'orders-filter-scroll-light'}`}>
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeFilter === 'all'
              ? 'text-white shadow-md shadow-[#FC9102]/20'
              : isDark
              ? 'text-gray-400 hover:text-white'
              : 'bg-[#f3f6f5] text-[#53605b] hover:text-[#191c1d]'
          }`}
          style={
            activeFilter === 'all'
              ? {
                  background: 'linear-gradient(90deg, #FC9102 0%, #FB6103 100%)',
                }
              : {}
          }
          >
            {t('filters.all')} <span className={`mr-2 ${activeFilter === 'all' ? 'text-white' : 'hover:text-white'}`}>14</span>
          </button>
          <button
            onClick={() => setActiveFilter('pending')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeFilter === 'pending'
                ? ' text-white shadow-md shadow-[#ff6b00]/20'
                : isDark
                ? ' text-gray-400 hover:text-white'
                : 'bg-[#f3f6f5] text-[#53605b] hover:text-[#191c1d]'
            }`}
            style={
            activeFilter === 'pending'
              ? {
                  background: 'linear-gradient(90deg, #FC9102 0%, #FB6103 100%)',
                }
              : {}
          }
          >
            {t('filters.pending')} <span className={`mr-2 ${activeFilter === 'pending' ? 'text-white' : 'text-[#E9C349] hover:text-white'}`}>3</span>
          </button>
          <button
            onClick={() => setActiveFilter('accepted')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeFilter === 'accepted'
                ? ' text-white shadow-md shadow-[#ff6b00]/20'
                : isDark
                ? ' text-gray-400 hover:text-white'
                : 'bg-[#f3f6f5] text-[#53605b] hover:text-[#191c1d]'
            }`}
            style={
            activeFilter === 'accepted'
              ? {
                  background: 'linear-gradient(90deg, #FC9102 0%, #FB6103 100%)',
                }
              : {}
          }
          >
            {t('filters.accepted')} <span className={`mr-2 ${activeFilter === 'accepted' ? 'text-white' : 'text-[#94D3C1] hover:text-white'}`}>6</span>
          </button>
          <button
            onClick={() => setActiveFilter('rejected')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeFilter === 'rejected'
                ? ' text-white shadow-md shadow-[#ff6b00]/20'
                : isDark
                ? ' text-gray-400 hover:text-white'
                : 'bg-[#f3f6f5] text-[#53605b] hover:text-[#191c1d]'
            }`}
            style={
            activeFilter === 'rejected'
              ? {
                  background: 'linear-gradient(90deg, #FC9102 0%, #FB6103 100%)',
                }
              : {}
          }
          >
            {t('filters.rejected')} <span className={`mr-2 ${activeFilter === 'rejected' ? 'text-white' : 'text-gray-400 hover:text-white'}`}>3</span>
          </button>
        </div>

        {/* جهة اليسار: القائمة المنسدلة للفرز + حقل البحث */}
        <div className="flex items-center gap-2.5 w-full md:w-auto">
          {/* حقل البحث */}
          <div className="relative flex-1 md:w-60">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('searchPlaceholder')}
              className={`w-full border rounded-full py-2 pr-4 pl-9 text-xs focus:outline-none focus:border-[#ff6b00] ${isDark ? 'bg-[#1D2021] text-white placeholder-gray-500 border-[#252c3d]' : 'bg-white text-[#191c1d] placeholder-[#74817b] border-[#d8dfdc]'}`}
            />
            <Search size={15} className={`absolute left-3 top-2.5 ${isDark ? 'text-gray-500' : 'text-[#74817b]'}`} />
          </div>

          {/* القائمة المنسدلة للفرز */}
          <div className="relative">
            <button
              type="button"
              aria-haspopup="listbox"
              aria-expanded={isSortMenuOpen}
              aria-controls="orders-sort-options"
              onClick={() => setIsSortMenuOpen((open) => !open)}
              className={`flex items-center border rounded-xl px-3 py-2 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-[#ff6b00] ${isDark ? 'bg-[#1D2021] text-gray-200 border-[#252c3d]' : 'bg-white text-[#191c1d] border-[#d8dfdc]'}`}
            >
              <svg className={`w-4 h-4 ml-2 shrink-0 ${isDark ? 'text-gray-400' : 'text-[#74817b]'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
              </svg>
              {t(`sort.${sortBy}`)}
              <svg className={`w-3.5 h-3.5 mr-3 ${isDark ? 'text-gray-400' : 'text-[#74817b]'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {isSortMenuOpen && (
              <div
                id="orders-sort-options"
                role="listbox"
                aria-label={t('sort.label')}
                className={`absolute left-0 top-full z-30 mt-2 min-w-full overflow-hidden rounded-xl border p-1 shadow-xl ${isDark ? 'bg-[#1D2021] border-[#252c3d]' : 'bg-white border-[#d8dfdc]'}`}
              >
                {[
                  { value: 'newest', label: t('sort.newest') },
                  { value: 'highestCost', label: t('sort.highestCost') },
                  { value: 'endingSoon', label: t('sort.endingSoon') },
                ].map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    role="option"
                    aria-selected={sortBy === option.value}
                    onClick={() => {
                      setSortBy(option.value);
                      setIsSortMenuOpen(false);
                    }}
                    className={`block w-full whitespace-nowrap rounded-lg px-3 py-2 ${locale === 'ar' ? 'text-right' : 'text-left'} text-xs transition-colors ${
                      sortBy === option.value
                        ? isDark
                          ? 'bg-[#94D3C138] text-white'
                          : 'bg-[#eaf5f1] text-[#1c6b58]'
                        : isDark
                          ? 'text-gray-200 hover:bg-[#303638]'
                          : 'text-[#404945] hover:bg-[#f3f6f5]'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {sortedOrders.map((order) => {
          const isActive = order.status === 'pending' || order.status === 'accepted';
          const isClosed = !isActive;

          const metaDot =
            order.status === 'pending' ? 'bg-amber-400'
            : order.status === 'accepted' ? 'bg-emerald-400'
            : 'bg-red-400';

          const metaText =
            order.status === 'pending'
              ? t('order.submitted', { date: fmtDate(order.submittedAt, locale), time: fmtTime(order.submittedAt, locale) })
              : order.status === 'accepted'
                ? t('order.approved', { date: fmtDate(order.approvedAt, locale) })
                : t('order.closed', { date: fmtDate(order.closedAt, locale) });

          const grayBtn = `px-4 py-2 border text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 ${
            isDark
              ? 'bg-[#22282a] border-[#2d3436] text-gray-200 '
              : 'bg-[#f3f6f5] border-[#d8dfdc] text-[#404945] '
          }`;

          return (
            <div
              key={order.id}
              className={`${theme.surface} border rounded-2xl p-4 sm:p-5 transition-all space-y-4`}
            >
              {/* Header */}
              <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
                <div className="flex w-full min-w-0 items-center gap-3 sm:w-auto">
                  {order.image && (
                    <div className={`w-11 h-11 rounded-lg border overflow-hidden shrink-0 ${isDark ? 'border-[#233532]' : 'border-[#d3e6de]'}`}>
                      <img src={order.image} alt={order.title} className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div className="min-w-0">
                    <div className={`mb-1 flex min-w-0 flex-wrap items-center gap-1.5 text-[10px] ${theme.secondaryText}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${metaDot}`} />
                      <span className="min-w-0" suppressHydrationWarning>{metaText}</span>
                    </div>
                    <h3 className={`text-base sm:text-lg font-bold truncate ${theme.primaryText}`}>{order.title}</h3>
                  </div>
                </div>
                <div className="max-w-full">{getStatusBadge(order)}</div>
              </div>

              {/* Stats (للطلبات النشطة فقط) */}
              {isActive && (
                <div className={`grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x sm:divide-x-reverse rounded-lg border ${theme.inset} ${isDark ? 'divide-[#252c2d]' : 'divide-[#e1e7e4]'}`}>
                  <div className="p-3 sm:px-4">
                    <span className={`block mb-1 text-[10px] ${theme.secondaryText}`}>{t('order.cpm')}</span>
                    <strong className={`text-sm ${theme.primaryText}`}>
                      ${order.cpm} <span className={`text-[10px] font-normal ${theme.secondaryText}`}>/1K</span>
                    </strong>
                  </div>
                  <div className="p-3 sm:px-4">
                    <span className={`block mb-1 text-[10px] ${theme.secondaryText}`}>{order.budgetLabel}</span>
                    <strong className={`text-sm ${theme.primaryText}`}>{order.budgetOrLimit}</strong>
                  </div>
                  <div className="p-3 sm:px-4">
                    <span className={`block mb-1.5 text-[10px] ${theme.secondaryText}`}>{t('order.targetPlatforms')}</span>
                    <div className="flex flex-wrap items-center gap-1.5">
                      {order.platforms.map((platform) => {
                        const info = platformIcons[platform.toLowerCase()];
                        const Icon = info?.Icon;
                        return (
                          <span
                            key={platform}
                            title={info?.label || platform}
                            aria-label={info?.label || platform}
                            className={`flex h-6 w-6 items-center justify-center rounded ${isDark ? 'bg-[#292f30]' : 'bg-[#e6ecea]'}`}
                          >
                            {Icon ? (
                              <Icon
                                size={13}
                                className={platform === 'tiktok' ? (isDark ? 'text-white' : 'text-black') : info.className}
                                aria-hidden="true"
                              />
                            ) : (
                              <span className="text-[8px] uppercase">{platform.slice(0, 2)}</span>
                            )}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* بانر القبول */}
              {order.status === 'accepted' && order.note && (
                <div className={`flex items-center gap-3 rounded-lg border px-4 py-3 ${isDark ? 'border-emerald-500/25 bg-[#122625] text-emerald-100' : 'border-emerald-200 bg-emerald-50 text-emerald-900'}`}>
                  <p className="flex-1 text-xs leading-relaxed">{order.note}</p>
                  <CheckCircle2 size={18} className="shrink-0 text-emerald-400" />
                </div>
              )}

              {/* الفوتر: الملاحظة / كود التتبع + الأزرار */}
              {isActive && (
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  {order.status === 'pending' ? (
                    <div className={`flex min-w-0 items-start gap-2 text-[10px] leading-relaxed ${theme.secondaryText}`}>
                      <Clock3 size={13} className="shrink-0" />
                      <p>{order.note}</p>
                    </div>
                  ) : (
                    <div className={`flex min-w-0 flex-wrap items-center gap-2 text-[10px] ${theme.secondaryText}`}>
                      <BadgeCheck size={14} className="shrink-0 text-amber-400" />
                      <span>{t('order.trackingCode')}</span>
                      <span className={`rounded border px-2 py-0.5 font-mono font-bold ${isDark ? 'bg-[#2c2b1e] text-[#E9C349] border-[#4a4220]' : 'bg-amber-50 text-amber-800 border-amber-200'}`}>
                        {order.trackingCode}
                      </span>
                    </div>
                  )}

                  <div className="flex w-full flex-col items-stretch justify-end gap-2 sm:w-auto sm:flex-row sm:items-center sm:shrink-0">
                    {order.status === 'pending' && (
                      <>
                        <button
                          onClick={() => setSelectedOrderForWithdraw(order)}
                          className={`w-full justify-center px-4 py-2 border text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 sm:w-auto ${isDark ? 'bg-[#2a1618] border-red-500/40 text-red-300 ' : 'bg-red-50 border-red-200 text-red-700 '}`}
                        >
                          <XCircle size={14} /> {t('order.withdraw')}
                        </button>
                        <button className={`${grayBtn} w-full justify-center sm:w-auto`}>
                          <ExternalLink size={14} /> {t('order.campaignDetails')}
                        </button>
                      </>
                    )}

                    {order.status === 'accepted' && (
                      <>
                        <button className={`${grayBtn} w-full justify-center sm:w-auto`}>
                          <MessageSquare size={14} /> {t('order.contactAdvertiser')}
                        </button>
                        <button className="w-full justify-center px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 bg-[#94D3C1] text-[#0b2a22] sm:w-auto">
                          <Upload size={14} /> {t('order.uploadVideo')}
                        </button>
                      </>
                    )}
                  </div>
                </div>
              )}

              {/* المرفوض / المسحوب */}
              {isClosed && (order.rejectionReason || order.note) && (
                <div className={`rounded-lg border p-3.5 ${theme.inset}`}>
                  <div className={`flex items-center gap-1.5 mb-1.5 text-[10px] font-bold ${order.status === 'withdrawn' ? 'text-slate-400' : 'text-red-400'}`}>
                    <Info size={13} />
                    {order.status === 'withdrawn' ? t('order.withdrawReason') : t('order.rejectionReason')}
                  </div>
                  <p className={`text-xs leading-relaxed ${isDark ? 'text-gray-300' : 'text-[#404945]'}`}>
                    {order.rejectionReason || order.note}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {selectedOrderForWithdraw && (
        <WithdrawModal
          key={selectedOrderForWithdraw.id}
          isOpen={!!selectedOrderForWithdraw}
          order={selectedOrderForWithdraw}
          onClose={() => setSelectedOrderForWithdraw(null)}
          onConfirm={handleConfirmWithdraw}
        />
      )}
    </div>
  );
}