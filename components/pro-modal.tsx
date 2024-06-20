'use client';

import { useEffect, useState } from 'react';
import { Check, Zap } from 'lucide-react';
import { Badge } from './ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { useProModal } from '@/hooks/use-pro-modal';
import { Checkbox } from '@/components/ui/checkbox';

import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';

import { usePricing } from '@/hooks/use-pricing';

import UseMidtrans from '@/hooks/use-midtrans';
import { useUser } from '@/hooks/use-user';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

import {
  FileText,
  Banknote,
  HandCoins,
  DollarSignIcon,
  Scale,
  ScrollText,
} from 'lucide-react';

export const tools = [
  {
    label: 'CV Screener',
    icon: FileText,
    href: '/cv-scanner',
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10',
  },

  {
    label: 'Bank Statement Analyzer',
    icon: Banknote,
    href: '/bank-statement-analyzer',
    color: 'text-pink-500',
    bgColor: 'bg-pink-500/10',
  },
  {
    label: 'Invoice Reviewer',
    icon: HandCoins,
    href: '/invoice-reviewer',
    color: 'text-purple-500',
    bgColor: 'bg-purple-500/10',
  },
  {
    label: 'Loan Application Processor',
    icon: DollarSignIcon,
    href: '/loan-application-processor',
    color: 'text-green-500',
    bgColor: 'bg-green-500/10',
  },
  {
    label: 'Regulatory Auditor',
    icon: Scale,
    href: '/regulatory-auditor',
    color: 'text-yellow-500',
    bgColor: 'bg-yellow-500/10',
  },
  {
    label: 'Contract Checker',
    icon: ScrollText,
    href: '/contract-checker',
    color: 'text-teal-500',
    bgColor: 'bg-teal-500/10',
  },
];

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
    proModal.onClose();
    handleCheckout();
  };

  const handleUpdateSubscription = async () => {
    try {
      const remainingQuota = maxFreeCount - proModal.apiLimitCount;
      const response = await axios.post('/api/update-user-subscription', {
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
          <DialogTitle className="flex flex-col items-center justify-center gap-y-4 pb-2">
            <div className="flex items-center gap-x-2 py-1 font-bold">
              {isQuotaLimited ? 'Re-subscribe to' : 'Upgrade to BerryLabs'}
              <Badge className="py-1 text-sm uppercase " variant="premium">
                {plan}
              </Badge>
              Plan
            </div>
          </DialogTitle>
          <DialogDescription className="space-y-2 pt-2 text-center font-medium text-zinc-900">
            {tools.map((tool) => (
              <Card
                key={tool.href}
                className="flex items-center justify-between border-black/5 p-3"
              >
                <div className="flex items-center gap-x-4">
                  <div className={cn('w-fit rounded-md p-2', tool.bgColor)}>
                    <tool.icon className={cn('h-6 w-6', tool.color)} />
                  </div>
                  <div className="text-sm font-semibold">{tool.label}</div>
                </div>
                <Check className="h-5 w-5 text-primary" />
              </Card>
            ))}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="items-center md:justify-between">
          <div
            className={cn(
              'relative flex w-full flex-col bg-slate-50 px-5 py-8 sm:rounded-2xl',
              {
                'md:w-fit': proModal.payAsYouGoPriceVisible,
                'md:w-full': !proModal.payAsYouGoPriceVisible,
              },
            )}
          >
            <p className="relative -top-2 flex items-center justify-center">
              <span className="text-[2rem] leading-none text-slate-900">
                IDR{' '}
                <span className="ml-1 font-bold">{price.toLocaleString()}</span>
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
              <div className="mt-2 flex items-center space-x-2">
                <Checkbox
                  id="terms"
                  checked={isChecked}
                  onCheckedChange={() => setChecked(!isChecked)}
                />
                <label
                  htmlFor="terms"
                  className="cursor-pointer text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  By Clicking This You Agree with Our{' '}
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
              className="mt-3 w-full"
              onClick={handleClickUpgrade}
              disabled={!isChecked}
            >
              {plan}
              <Zap className="ml-2 h-4 w-4 fill-white" />
            </Button>
          </div>
          {/* only show Premium Subscription when there's no download  */}
          {proModal.payAsYouGoPriceVisible ? (
            <>
              <div className="font-bold">Or</div>
              <div className="relative flex w-full flex-col bg-slate-50 px-5 py-8 sm:rounded-2xl md:w-fit">
                <p className="flex items-center justify-center">
                  <span className="text-[2rem] leading-none text-slate-900">
                    IDR
                    <span className="font-bold">
                      {' '}
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
                  className="mt-3 w-full"
                  onClick={handleClickUpgrade}
                >
                  Pay as You Go
                  <Zap className="ml-2 h-4 w-4 fill-white" />
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
