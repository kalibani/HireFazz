import { useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import { usePricing } from './use-pricing';
import { useMidtransStore } from './use-midtrans-store';
import { useUser } from './use-user';

export default function UseMidtrans() {
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

  const { characterCount, price } = usePricing();
  const { subscriptionType } = useUser();

  const handleCheckout = async () => {
    // @ts-ignore
    // const voiceId = selectedVoice.voice_id;
    // @ts-ignore
    // const voiceName = selectedVoice.name;
    // const price = priceSchemeHelper(
    //   characterCount,
    //   subscriptionType,
    //   selectedProductName
    // );

    const data = {
      id: subscriptionType + uuidv4(),
      name: `${subscriptionType}-SUBSCRIPTION`,
      price: price,
    };

    // if (subscriptionType === "PREMIUM") {
    // const startTime = new Date();
    // const nextMonth = dateFns.addMonths(startTime, 1);

    // const dueDate = dateFns.format(nextMonth, "yyyy-MM-dd HH:mm:ss z");

    // data = {
    //   ...data,
    //   id: subscriptionType + uuidv4(),
    //   name: `${subscriptionType}-SUBSCRIPTION`,
    // @ts-ignore
    // required: true,
    // start_time: dueDate,
    // interval: "month",
    // };
    // }

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
