import { useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import { priceSchemeHelper } from "@/lib/utils";
import { usePricing } from "./use-pricing";
import { productName } from "@/constant";
import { useTextToSpeechStore } from "./use-text-to-speech";
import { useMidtransStore } from "./use-midtrans-store";
import { trpc } from "@/app/_trpc/client";
import { useRouter } from "next/navigation";

// import * as dateFns from "date-fns";

export default function UseMidtrans() {
  useEffect(() => {
    const snapUrl = process.env.NEXT_PUBLIC_MIDTRANS_URL;
    const clientKey = process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY;

    const script = document.createElement("script");

    script.src = snapUrl as string;
    script.setAttribute("data-client-key", clientKey as string);
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

  const { characterCount, setPayAsYouGoPrice } = usePricing();
  const { selectedVoice } = useTextToSpeechStore();

  const saveTransaction = trpc.saveTransactions.useMutation();

  const updateUserSubscription = trpc.updateUserSubscription.useMutation();

  const router = useRouter();

  const handleCheckout = async (
    subscriptionType: string,
    selectedProductName: productName
  ) => {
    // @ts-ignore
    const voiceId = selectedVoice.voice_id;
    // @ts-ignore
    const voiceName = selectedVoice.name;
    const price = priceSchemeHelper(
      characterCount,
      subscriptionType,
      selectedProductName
    );

    if (subscriptionType === "FLEXIBLE") {
      setPayAsYouGoPrice(price!);
    }

    let data = {
      id: voiceId,
      name: voiceName,
      price: price,
    };

    if (subscriptionType === "PREMIUM") {
      // const startTime = new Date();
      // const nextMonth = dateFns.addMonths(startTime, 1);

      // const dueDate = dateFns.format(nextMonth, "yyyy-MM-dd HH:mm:ss z");

      data = {
        ...data,
        id: "PREMIUM" + uuidv4(),
        name: "PREMIUM-SUBSCRIPTION",
        // @ts-ignore
        // required: true,
        // start_time: dueDate,
        // interval: "month",
      };
    }

    try {
      setLoading(true);

      const response = await axios.post("/api/payment-gateway", data);
      const token = response?.data?.token;

      //@ts-ignore
      snap.pay(token, {
        onSuccess: async function (result: any) {
          onSuccess(result);
          // save transaction to database
          await saveTransaction.mutate({
            amountPaid: Number(result?.gross_amount),
            orderId: result?.order_id,
            productName: subscriptionType,
          });

          await updateUserSubscription.mutate({
            characterCount: characterCount,
            subscriptionType: subscriptionType,
          });

          router.refresh();
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
