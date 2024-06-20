import { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import { useMidtransStore } from './use-midtrans-store';
import { useUser } from './use-user';
import { costPerToken } from '@/components/topup-modal';

export function useTopup() {
  useEffect(() => {
    const snapUrl = process.env.NEXT_PUBLIC_MIDTRANS_URL;
    const clientKey = process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY;

    const script = document.createElement('script');

    script.src = snapUrl as string;
    script.setAttribute('data-client-key', clientKey as string);
    script.async = true;

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const {
    isLoading,
    isClosed,
    successResult,
    pendingResult,
    error,
    setLoading,
    onClosed,
    onSuccess,
    onPending,
    onError,
  } = useMidtransStore();

  const { subscriptionType } = useUser();
  const handleCheckout = async ({
    token,
    orgId,
    referralCode,
  }: {
    token: number;
    orgId: string;
    referralCode: string | null;
  }) => {
    const data = {
      id: subscriptionType + uuidv4(),
      name: `TOPUP-${orgId}-TOKEN`,
      price: costPerToken * token,
      orgId,
      token,
      referralCode,
    };

    try {
      setLoading(true);

      const response = await axios.post('/api/payment-gateway', data);
      const token = response?.data?.token;

      //@ts-ignore
      snap.pay(token, {
        onSuccess: async function (result: any) {
          onSuccess(result);
        },
        onPending: function (result: any) {
          onPending(result);
        },
        onError: function (result: any) {
          onError(result);
        },
        onClose: function () {
          onClosed(true);
        },
      });
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return {
    handleCheckout,
    successResult,
    pendingResult,
    error,
    isLoading,
    isClosed,
  };
}
