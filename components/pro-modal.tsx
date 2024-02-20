"use client";

import { useEffect, useState } from "react";
import { Check, Zap } from "lucide-react";
import { tools } from "@/constant";
import { Badge } from "./ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { useProModal } from "@/hooks/use-pro-modal";
import { Checkbox } from "@/components/ui/checkbox";

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";

import { usePricing } from "@/hooks/use-pricing";

import UseMidtrans from "@/hooks/use-midtrans";
import { useUser } from "@/hooks/use-user";
import axios from "axios";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const ProModal = () => {
  const proModal = useProModal();
  const { payAsYouGoPrice, price, characterCount } = usePricing();
  const {
    plan,
    quota,
    isQuotaLimited,
    maxFreeCount,
    isUserAgreedTermsOfService,
  } = useUser();
  const { handleCheckout, successResult } = UseMidtrans();
  const router = useRouter();

  const handleClickUpgrade = () => {
    handleCheckout();
    setTimeout(() => {
      proModal.onClose();
    }, 1000);
  };

  const handleUpdateSubscription = async () => {
    try {
      const remainingQuota = maxFreeCount - proModal.apiLimitCount;
      const response = await axios.post("/api/update-user-subscription", {
        characterCount: characterCount,
        maxFreeCount: quota + remainingQuota,
        subscriptionType: plan?.toUpperCase(),
        isUserAgreedTermsOfService: isChecked,
      });

      if (response) {
        toast.success(`Successfully Upgrade to ${plan} Plan`, {
          duration: 5000,
        });
      }
    } catch (error) {
      console.log(error);
    } finally {
      router.refresh();
    }
  };

  useEffect(() => {
    if (Object.keys(successResult).length > 0) {
      handleUpdateSubscription();
    }
  }, [successResult]);

  const [isChecked, setChecked] = useState(false);

  useEffect(() => {
    setChecked(isUserAgreedTermsOfService);
  }, [isUserAgreedTermsOfService]);

  return (
    <Dialog open={proModal.isOpen} onOpenChange={proModal.onClose}>
      <DialogContent className="sm:max-w-lg md:min-w-max">
        <DialogHeader>
          <DialogTitle className="flex justify-center items-center flex-col gap-y-4 pb-2">
            <div className="flex items-center gap-x-2 font-bold py-1">
              {isQuotaLimited ? "Re-subscribe to" : "Upgrade to BerryLabs"}
              <Badge className=" uppercase text-sm py-1" variant="premium">
                {plan}
              </Badge>
              Plan
            </div>
          </DialogTitle>
          <DialogDescription className=" text-center pt-2 space-y-2 text-zinc-900 font-medium">
            {tools.map((tool) => (
              <Card
                key={tool.href}
                className="p-3 border-black/5 flex items-center justify-between"
              >
                <div className="flex items-center gap-x-4">
                  <div className={cn("p-2 w-fit rounded-md", tool.bgColor)}>
                    <tool.icon className={cn("w-6 h-6", tool.color)} />
                  </div>
                  <div className="font-semibold text-sm">{tool.label}</div>
                </div>
                <Check className="text-primary w-5 h-5" />
              </Card>
            ))}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="md:justify-between items-center">
          <div
            className={cn(
              "w-full relative flex flex-col bg-slate-50 px-5 py-8 sm:rounded-2xl",
              {
                "md:w-fit": proModal.payAsYouGoPriceVisible,
                "md:w-full": !proModal.payAsYouGoPriceVisible,
              }
            )}
          >
            <p className="flex items-center justify-center relative -top-2">
              <span className="text-[2rem] leading-none text-slate-900">
                IDR{" "}
                <span className="font-bold ml-1">{price.toLocaleString()}</span>
              </span>
              <span className="ml-3 text-sm">
                <span className="font-semibold text-slate-900">
                  One Time Payment
                </span>
                <br />
                <span className="font-semibold text-slate-500">
                  Unlimited Access
                </span>
              </span>
            </p>
            {!isUserAgreedTermsOfService ? (
              <div className="flex items-center space-x-2 mt-2">
                <Checkbox
                  id="terms"
                  checked={isChecked}
                  onCheckedChange={() => setChecked(!isChecked)}
                />
                <label
                  htmlFor="terms"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                >
                  By Clicking This You Agree with Our{" "}
                  <a
                    className="text-blue-400 underline"
                    href="https://drive.google.com/file/d/1u-DULua9EUEYjhK15JV6lrnKEDrLRuqZ/view?usp=sharing"
                    target="_blank"
                  >
                    Terms of Service
                  </a>
                </label>
              </div>
            ) : null}

            <Button
              variant="premium2"
              size="lg"
              className="w-full mt-3"
              onClick={handleClickUpgrade}
              disabled={!isChecked}
            >
              {plan}
              <Zap className="w-4 h-4 ml-2 fill-white" />
            </Button>
          </div>
          {/* only show Premium Subscription when there's no download  */}
          {proModal.payAsYouGoPriceVisible ? (
            <>
              <div className="font-bold">Or</div>
              <div className="w-full md:w-fit relative flex flex-col bg-slate-50 px-5 py-8 sm:rounded-2xl">
                <p className="flex items-center justify-center">
                  <span className="text-[2rem] leading-none text-slate-900">
                    IDR
                    <span className="font-bold">
                      {" "}
                      {payAsYouGoPrice.toLocaleString()}
                    </span>
                  </span>
                  <span className="ml-3 text-sm">
                    <span className="font-semibold text-slate-900">
                      Flexible Payment
                    </span>
                    <br />
                    <span className="font-semibold text-slate-500">
                      Use As You Wish
                    </span>
                  </span>
                </p>
                <Button
                  variant="premium"
                  size="lg"
                  className="w-full mt-3"
                  onClick={handleClickUpgrade}
                >
                  Pay as You Go
                  <Zap className="w-4 h-4 ml-2 fill-white" />
                </Button>
              </div>
            </>
          ) : null}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ProModal;
