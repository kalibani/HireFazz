import { useEffect } from "react";
import axios from "axios";
import { priceSchemeHelper } from "@/lib/utils";
import { usePricing } from "./use-pricing";
import { productName } from "@/constant";
import { useTextToSpeechStore } from "./use-text-to-speech";
import { useMidtransStore } from "./use-midtrans-store";

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

    const data = {
      id: voiceId,
      name: voiceName,
      price: price,
    };

    try {
      setLoading(true);

      const response = await axios.post("/api/payment-gateway", data);
      const token = response?.data?.token;

      //@ts-ignore
      snap.pay(token, {
        onSuccess: function (result: any) {
          onSuccess(result);
          //@ts-ignore
          snap.hide();
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
