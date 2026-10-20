'use client';

import React, { useCallback, useEffect, useState } from 'react';
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
  Loader2,
  AlertCircle,
} from 'lucide-react';
import { SiInstagram, SiTiktok, SiYoutube } from 'react-icons/si';

import { useMessages } from '@/context/MessagesContext';
import { useTheme } from '@/context/ThemeContext';
import { Link } from '@/i18n/navigation';
import { WithdrawModal } from './WithdrawModal';
import { getMyApplications, withdrawApplication } from '@/services/applications';

const platformIcons = {
  youtube: { Icon: SiYoutube, className: 'text-[#FF0000]', label: 'YouTube' },
  tiktok: { Icon: SiTiktok, label: 'TikTok' },
  instagram: { Icon: SiInstagram, className: 'text-[#E4405F]', label: 'Instagram' },
};

// ─── helpers to normalise an API application into the shape the UI expects ────

const normaliseApplication = (app) => ({
  id: app.id,
  // Use the application id as the display code (backend uses ObjectId)
  code: app.id?.slice(-8)?.toUpperCase() ?? '',
  title: app.campaign?.name ?? '',
  company: app.campaign?.brand?.name ?? '',
  image: app.campaign?.brand?.logo ?? null,
  // Map API status strings to lower-case UI status tokens
  status: (app.status ?? '').toLowerCase(),
  statusText: app.status,
  cpm: app.campaign?.cpm != null ? String(app.campaign.cpm) : '—',
  budgetOrLimit: '',
  budgetLabel: '',
  platforms: [],
  dueDate: null,
  submittedAt: app.appliedAt ?? null,
  approvedAt: app.reviewedAt ?? null,
  closedAt: app.reviewedAt ?? null,
  note: app.message ?? null,
  trackingCode: app.id?.slice(-8)?.toUpperCase() ?? '',
  rejectionReason: null,
  // keep a reference to the original applicationId for the API call
  applicationId: app.id,
});


const fmtDate = (d, locale) =>
  new Date(d).toLocaleDateString(locale === 'ar' ? 'ar-u-nu-latn' : locale, { day: 'numeric', month: 'long', year: 'numeric' });
const fmtTime = (d, locale) =>
  new Date(d).toLocaleTimeString(locale === 'ar' ? 'ar-u-nu-latn' : locale, { hour: '2-digit', minute: '2-digit' });

export function OrdersContent() {
  const t = useTranslations('creatorOrders');
  const locale = useLocale();

  // ── API state ──────────────────────────────────────────────────────────────
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState(null);
  const [page, setPage] = useState(1);

  // ── UI state ───────────────────────────────────────────────────────────────
  const [sortBy, setSortBy] = useState('newest');
  const [isSortMenuOpen, setIsSortMenuOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrderForWithdraw, setSelectedOrderForWithdraw] = useState(null);
  const [withdrawLoading, setWithdrawLoading] = useState(false);

  const { addSystemNotification } = useMessages();
  const { isDark } = useTheme();

  // ── Fetch applications from API ────────────────────────────────────────────
  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Map UI filter → API status param
      const statusMap = {
        pending: 'PENDING',
        accepted: 'ACCEPTED',
        rejected: 'REJECTED',
      };
      const params = {
        page,
        perPage: 20,
        ...(activeFilter !== 'all' && { status: statusMap[activeFilter] }),
      };
      const res = await getMyApplications(params);
      if (res?.success) {
        setOrders((res.data ?? []).map(normaliseApplication));
        setPagination(res.pagination ?? null);
      }
    } catch (err) {
      // 404 means the endpoint isn't deployed yet — treat as empty, not an error
      if (err?.status === 404 || err?.code === 'NETWORK_ERROR') {
        setOrders([]);
      } else {
        setError(err?.message ?? 'حدث خطأ أثناء جلب الطلبات');
      }
    } finally {
      setLoading(false);
    }
  }, [page, activeFilter]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);


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

  // ── Notify on status changes ───────────────────────────────────────────────
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


  // ── Client-side search & sort (API already filters by status) ─────────────
  const filteredOrders = orders.filter((o) => {
    if (
      searchQuery &&
      !o.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !o.code.toLowerCase().includes(searchQuery.toLowerCase())
    ) return false;
    return true;
  });

  const sortedOrders = [...filteredOrders].sort((a, b) => {
    if (sortBy === 'highestCost') {
      const aCost = Number(a.cpm) || 0;
      const bCost = Number(b.cpm) || 0;
      return bCost - aCost;
    }
    if (sortBy === 'endingSoon') {
      const aTime = a.dueDate ? new Date(a.dueDate).getTime() : Infinity;
      const bTime = b.dueDate ? new Date(b.dueDate).getTime() : Infinity;
      return aTime - bTime;
    }
    // Default: newest (preserve API order — already sorted by appliedAt desc)
    return 0;
  });

  // ── Stats derived from live data ───────────────────────────────────────────
  const stats = {
    total: pagination?.total ?? orders.length,
    pending: orders.filter((o) => o.status === 'pending').length,
    accepted: orders.filter((o) => o.status === 'accepted').length,
    closed: orders.filter((o) => o.status === 'rejected' || o.status === 'withdrawn').length,
  };


  // ── Withdraw: call API, then update local state on success ─────────────────
  const handleConfirmWithdraw = async (orderId, reason) => {
    const targetOrder = orders.find((o) => o.id === orderId);
    if (!targetOrder) return;

    setWithdrawLoading(true);
    try {
      await withdrawApplication(targetOrder.applicationId ?? orderId);
    } catch (err) {
      // Surface the error but still reflect withdrawal locally
      console.error('[withdrawApplication]', err);
    } finally {
      setWithdrawLoading(false);
    }

    // Optimistically update UI
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

    addSystemNotification({
      orderId: targetOrder.id,
      status: 'withdrawn',
      title: t('notifications.withdrawnTitle'),
      text: t('notifications.withdrawnText', { title: targetOrder.title }),
    });

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
    <div className={`creator-responsive-page min-h-screen w-full font-tajawal p-3 sm:p-4 md:p-6 ${theme.page}`} dir={locale === 'ar' ? 'rtl' : 'ltr'}>

      {/* Title Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div className={locale === 'ar' ? 'text-right' : 'text-left'}>
          <h1 className={`text-2xl sm:text-3xl font-black mb-1 ${theme.primaryText}`}>{t('title')}</h1>
          <p className={`text-xs leading-relaxed max-w-2xl ${theme.secondaryText}`}>
            {t('description')}
          </p>
        </div>

        <Link
          href="/creator/discover"
          className="px-5 py-2.5 text-white font-bold text-xs rounded-xl shadow-[0_0_20px_rgba(252,145,2,0.25)] flex items-center justify-center gap-2 transition-all self-start md:self-auto shrink-0"
          style={{ background: 'linear-gradient(90deg, #FC9102 0%, #FB6103 100%)' }}
        >
          <Compass size={16} /> {t('exploreCampaigns')}
        </Link>
      </div>

      {/* KPI Stat Cards */}
      <div className="mb-5 grid grid-cols-1 gap-2 min-[360px]:grid-cols-2 sm:gap-3 lg:grid-cols-4">

        <div className={`${isDark ? 'bg-[#191C1D] border-[#1e2425]' : 'bg-white border-[#e1e7e4] shadow-sm'} border p-4 rounded-xl relative flex flex-col justify-between`}>
          <div className="flex items-start justify-between mb-3">
            <div className={`text-xs font-semibold ${theme.secondaryText}`}>{t('stats.total')}</div>
            <span className={`w-9 h-9 rounded-lg flex items-center justify-center ${isDark ? 'bg-[#212f2c] text-[#94D3C1]' : 'bg-emerald-50 text-emerald-700'}`}>
              <ClipboardList size={18} />
            </span>
          </div>
          <div className="flex items-center justify-between mb-3">
            <div className={`text-3xl font-black ${theme.primaryText}`}>{stats.total}</div>
            <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-medium ${isDark ? 'text-[#94D3C1] bg-[#1a332a]' : 'text-emerald-800 bg-emerald-50'}`}>{t('stats.registered')}</span>
          </div>
          <div className={`w-full h-1.5 rounded-full overflow-hidden ${isDark ? 'bg-[#1c2223]' : 'bg-[#e8eeeb]'}`}>
            <div className="bg-[#94D3C1] h-full rounded-full" style={{ width: stats.total > 0 ? '100%' : '0%' }}></div>
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
            <div className={`text-3xl font-black ${isDark ? 'text-[#E9C349]' : 'text-[#f3bf17]'}`}>{stats.pending}</div>
            <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-medium flex items-center gap-1 ${isDark ? 'text-[#E9C349] bg-[#3a2e12]' : 'text-amber-800 bg-amber-50'}`}>
              <span className="w-1.5 h-1.5 rounded-full bg-[#E9C349]"></span>
              {t('stats.awaitingAdvertiser')}
            </span>
          </div>
          <div className={`w-full h-1.5 rounded-full overflow-hidden ${isDark ? 'bg-[#1c2223]' : 'bg-[#e8eeeb]'}`}>
            <div className="bg-[#E9C349] h-full rounded-full" style={{ width: stats.total ? `${Math.round((stats.pending / stats.total) * 100)}%` : '0%' }}></div>
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
            <div className={`text-3xl font-black ${isDark ? 'text-[#94D3C1]' : 'text-[#68c8ad]'}`}>{stats.accepted}</div>
            <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-medium ${isDark ? 'text-[#94D3C1] bg-[#1a332a]' : 'text-emerald-800 bg-emerald-50'}`}>{t('stats.acceptanceRate')}</span>
          </div>
          <div className={`w-full h-1.5 rounded-full overflow-hidden ${isDark ? 'bg-[#1c2223]' : 'bg-[#e8eeeb]'}`}>
            <div className="bg-[#94D3C1] h-full rounded-full" style={{ width: stats.total ? `${Math.round((stats.accepted / stats.total) * 100)}%` : '0%' }}></div>
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
            <div className={`text-3xl font-black ${isDark ? 'text-gray-300' : 'text-[#404945]'}`}>{stats.closed}</div>
            <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-medium ${isDark ? 'text-gray-400 bg-[#22282a]' : 'text-slate-700 bg-slate-100'}`}>{t('stats.archived')}</span>
          </div>
          <div className={`w-full h-1.5 rounded-full overflow-hidden ${isDark ? 'bg-[#1c2223]' : 'bg-[#e8eeeb]'}`}>
            <div className={`h-full rounded-full ${isDark ? 'bg-[#505a5d]' : 'bg-slate-400'}`} style={{ width: stats.total ? `${Math.round((stats.closed / stats.total) * 100)}%` : '0%' }}></div>
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

      {/* Filter tabs — الفلتر عبر الـ API (يعيد الجلب تلقائياً) */}
      <div className={`${isDark ? 'bg-[#191C1D] border-[#1e2425]' : 'bg-white border-[#e1e7e4] shadow-sm'} border p-2.5 rounded-2xl flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 mb-5`} dir={locale === 'ar' ? 'rtl' : 'ltr'}>

        {/* أزرار الفلترة */}
        <div className={`orders-filter-scroll flex min-w-0 items-center gap-1 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 ${isDark ? 'orders-filter-scroll-dark' : 'orders-filter-scroll-light'}`}>
          <button
            onClick={() => { setActiveFilter('all'); setPage(1); }}
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
            {t('filters.all')} <span className={`mr-2 ${activeFilter === 'all' ? 'text-white' : 'hover:text-white'}`}>{stats.total}</span>
          </button>
          <button
            onClick={() => { setActiveFilter('pending'); setPage(1); }}
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
            {t('filters.pending')} <span className={`mr-2 ${activeFilter === 'pending' ? 'text-white' : 'text-[#E9C349] hover:text-white'}`}>{stats.pending}</span>
          </button>
          <button
            onClick={() => { setActiveFilter('accepted'); setPage(1); }}
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
            {t('filters.accepted')} <span className={`mr-2 ${activeFilter === 'accepted' ? 'text-white' : 'text-[#94D3C1] hover:text-white'}`}>{stats.accepted}</span>
          </button>
          <button
            onClick={() => { setActiveFilter('rejected'); setPage(1); }}
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
            {t('filters.rejected')} <span className={`mr-2 ${activeFilter === 'rejected' ? 'text-white' : 'text-gray-400 hover:text-white'}`}>{stats.closed}</span>
          </button>
        </div>

        {/* جهة اليسار: القائمة المنسدلة للفرز + حقل البحث */}
        <div className="flex min-w-0 items-center gap-2.5 w-full md:w-auto">
          {/* حقل البحث */}
          <div className="relative min-w-0 flex-1 md:w-60">
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
                className={`absolute start-0 top-full z-30 mt-2 min-w-full overflow-hidden rounded-xl border p-1 shadow-xl ${isDark ? 'bg-[#1D2021] border-[#252c3d]' : 'bg-white border-[#d8dfdc]'}`}
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
      {loading && (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="animate-spin text-[#94D3C1]" size={32} />
        </div>
      )}

      {!loading && error && (
        <div className={`flex flex-col items-center justify-center gap-3 py-16 ${theme.secondaryText}`}>
          <AlertCircle size={32} className="text-red-400" />
          <p className="text-sm">{error}</p>
          <button
            onClick={fetchOrders}
            className="mt-2 px-4 py-2 text-xs font-bold rounded-xl text-white"
            style={{ background: 'linear-gradient(90deg, #FC9102 0%, #FB6103 100%)' }}
          >
            {t('retry') || 'إعادة المحاولة'}
          </button>
        </div>
      )}

      {!loading && !error && sortedOrders.length === 0 && (
        <div className={`flex flex-col items-center justify-center gap-2 py-16 ${theme.secondaryText}`}>
          <ClipboardList size={32} className="opacity-40" />
          <p className="text-sm">{t('emptyState') || 'لا يوجد طلبات بعد'}</p>
        </div>
      )}

      <div className="space-y-4">
        {!loading && !error && sortedOrders.map((order) => {
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
          loading={withdrawLoading}
        />
      )}
    </div>
  );
}