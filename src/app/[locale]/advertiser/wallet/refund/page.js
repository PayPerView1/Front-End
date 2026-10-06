'use client';

import { useEffect, useState } from 'react';
import RefundTopCards from '@/features/wallet/components/refund/states/RefundTopCards';
import RefundInitialState from '@/features/wallet/components/refund/states/RefundInitialState';
import RefundSuccessState from '@/features/wallet/components/refund/states/RefundSuccessState';
import RefundErrorMinState from '@/features/wallet/components/refund/states/RefundErrorMinState';
import RefundErrorMaxState from '@/features/wallet/components/refund/states/RefundErrorMaxState';
import RefundRejectedState from '@/features/wallet/components/refund/states/RefundRejectedState';
import RefundCancelledState from '@/features/wallet/components/refund/states/RefundCancelledState';
import { cancelRefund, getRefundRequests, requestRefund } from '@/features/wallet/services/walletService';
import { useWallet } from '@/features/wallet/WalletProvider';
import { fetchBudgetCampaigns } from '@/features/wallet/services/budgetCampaigns';

export default function RefundPage() {
  const [state, setState] = useState('initial');
  const [submitting, setSubmitting] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [error, setError] = useState('');
  const [refund, setRefund] = useState(null);
  const [reservedBalance, setReservedBalance] = useState(null);
  const [availabilityError, setAvailabilityError] = useState(false);
  const [loadingRequest, setLoadingRequest] = useState(true);
  const { balance, setBalance, refresh } = useWallet();
  const availableBalance = reservedBalance == null || balance == null ? null : Math.max(Number(balance) - reservedBalance, 0);

  useEffect(() => {
    let active = true;
    const timer = window.setTimeout(() => {
      getRefundRequests({ page: 1, perPage: 1 })
        .then((response) => {
          if (!active) return;
          const requests = response?.data ?? response;
          const latest = Array.isArray(requests) ? requests[0] : null;
          if (!latest) return;
          const current = { ...latest, refundRequestId: latest.refundRequestId || latest.id };
          const status = String(current.status || '').toUpperCase();
          if (['PENDING', 'UNDER_REVIEW'].includes(status)) {
            setRefund(current);
            setState('success');
          } else if (['REJECTED'].includes(status)) {
            setRefund(current);
            setState('rejected');
          } else if (['APPROVED', 'COMPLETED'].includes(status)) {
            setRefund(current);
            setState('success');
          } else if (status === 'CANCELLED') {
            setRefund(current);
            setState('cancelled');
          }
        })
        .catch((cause) => { if (active) setError(cause?.message || 'تعذر تحميل حالة طلب الاسترداد.'); })
        .finally(() => { if (active) setLoadingRequest(false); });
    }, 0);
    fetchBudgetCampaigns()
      .then((campaigns) => {
        if (active) {
          setReservedBalance(campaigns.filter((campaign) => campaign.status === 'ACTIVE').reduce((sum, campaign) => sum + Math.max(campaign.budget.total - campaign.budget.spent, 0), 0));
          setAvailabilityError(false);
        }
      })
      .catch(() => { if (active) { setReservedBalance(null); setAvailabilityError(true); } });
    return () => { active = false; window.clearTimeout(timer); };
  }, []);

  const submitRefund = async (amount) => {
    setSubmitting(true);
    setError('');
    try {
      const response = await requestRefund({ amount });
      if (response?.success === false) throw new Error(response.message || 'تعذر إرسال طلب الاسترداد.');
      const data = response?.data ?? response;
      setRefund(data);
      if (Number.isFinite(Number(data.walletBalanceAfter))) setBalance(Number(data.walletBalanceAfter));
      else await refresh();
      setState('success');
    } catch (cause) {
      setError(cause?.message || 'تعذر إرسال طلب الاسترداد.');
    } finally {
      setSubmitting(false);
    }
  };

  const cancelRequest = async () => {
    if (!refund?.refundRequestId) return;
    setCancelling(true);
    setError('');
    try {
      const response = await cancelRefund(refund.refundRequestId);
      if (response?.success === false) throw new Error(response.message || 'تعذر إلغاء الطلب.');
      const data = response?.data ?? response;
      if (Number.isFinite(Number(data.walletBalanceAfter))) setBalance(Number(data.walletBalanceAfter));
      else await refresh();
      setState('cancelled');
    } catch (cause) {
      setError(cause?.message || 'تعذر إلغاء الطلب.');
    } finally {
      setCancelling(false);
    }
  };

  return (
    <div
      dir="rtl"
      className="wallet-theme-page min-h-screen bg-[#0B0D0E] text-white p-6 md:p-8"
      style={{ fontFamily: "var(--font-tajawal), 'Tajawal', sans-serif" }}
    >
      {state !== 'cancelled' && state !== 'rejected' && (
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white mb-2">
            استرداد الرصيد المالي غير المستخدم
          </h1>
          <p className="text-[#8A9490] text-sm">
            يمكنك استرداد المبالغ غير المستهلكة في ميزانيتك الإعلانية لحسابك المصرفي أو بطاقتك الأصلية بكل أمان وشفافية ودون تعقيد.
          </p>
        </div>
      )}

      <RefundTopCards walletBalance={balance} reservedBalance={reservedBalance} availableBalance={availableBalance} />

      {availabilityError && <p role="status" className="mb-5 text-sm text-amber-200">تعذر تحميل ميزانيات الحملات لحساب الرصيد القابل للاسترداد. سيتحقق الخادم من الرصيد المتاح عند الإرسال.</p>}
      {loadingRequest && <p role="status" className="mb-5 text-sm text-[#8A9490]">جارٍ تحميل حالة طلبات الاسترداد…</p>}
      {error && <p role="alert" className="mb-5 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-200">{error}</p>}
      {state === 'initial'   && <RefundInitialState   onSwitchState={setState} onSubmit={submitRefund} submitting={submitting} balance={availableBalance} />}
      {state === 'success'   && <RefundSuccessState   onSwitchState={setState} refund={refund} onCancel={cancelRequest} cancelling={cancelling} />}
      {state === 'error_min' && <RefundErrorMinState  onSwitchState={setState} />}
      {state === 'error_max' && <RefundErrorMaxState  onSwitchState={setState} />}
      {state === 'rejected'  && <RefundRejectedState  onSwitchState={setState} refund={refund} walletBalance={balance} />}
      {state === 'cancelled' && <RefundCancelledState onSwitchState={setState} refund={refund} />}
    </div>
  );
}
