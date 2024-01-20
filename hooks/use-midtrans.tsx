import { useEffect, useState } from "react";
import axios from "axios";
import { priceSchemeHelper } from "@/lib/utils";
import { usePricing } from "./use-pricing";
import { productName } from "@/constant";
import { useTextToSpeechStore } from "./use-text-to-speech";

type PayloadProps = {
  id: string;
  name: string;
  price: number;
};

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

  const [isLoading, setLoading] = useState(false);
  const [success, setSuccess] = useState<any>("");
  const [pending, setPending] = useState<any>("");
  const [error, setError] = useState<any>("");
  const [isClosed, setClosed] = useState<any>("");

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
          setSuccess(result);
          console.log("r", result);
        },
        onPending: function (result: any) {
          setPending(result);
          console.log("r", result);
        },
        onError: function (result: any) {
          setError(result);
          console.log("r", result);
        },
        onClose: function (result: any) {
          setClosed(result);
          console.log("r", result);
        },
      });
    } catch (error) {
      console.log(error);
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  return {
    handleCheckout,
    success,
    pending,
    error,
    isLoading,
    isClosed,
  };
}
