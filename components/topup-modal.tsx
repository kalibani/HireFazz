'use client';

import { useEffect, useState } from 'react';
import { Loader2, Zap } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';

import { Checkbox } from '@/components/ui/checkbox';
import { cn, formatMoneyRMG } from '@/lib/utils';
import { Button } from './ui/button';
import { useTopupModal } from '@/hooks/use-topup-modal';
import { useTopup } from '@/hooks/use-topup';
import { useParams } from 'next/navigation';
import { Input } from './ui/input';
import { validateRefferalCode } from '@/lib/actions/topup/validateRefferalCode';
import { Loader } from './share';

export const costPerToken = 1000;
const amountList = [
  {
    id: '1',
    token: 500,
  },
  {
    id: '2',
    token: 750,
  },
  {
    id: '3',
    token: 1000,
  },
  {
    id: '4',
    token: 1500,
  },
  {
    id: '5',
    token: 2000,
  },
  {
    id: '6',
    token: 3000,
  },
];

export const TopupModal = () => {
  const params = useParams();
  const topupModal = useTopupModal();
  const [isChecked, setChecked] = useState(false);
  const [refferalCode, setRefferalCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedToken, setSelectedToken] = useState(0);
  const [refferalBenefit, setRefferalBenefit] = useState<{
    code: string;
    extraToken: number;
  } | null>(null);
  const [isError, setIsError] = useState(false);
  const { handleCheckout, isLoading: loadingCheckout } = useTopup();

  useEffect(() => {
    if (topupModal.isOpen) {
      setChecked(false);
      setSelectedToken(0);
      setRefferalCode('');
      setIsError(false);
      setRefferalBenefit(null);
    }
  }, [topupModal.isOpen]);

  const handleTopup = () => {
    topupModal.onClose();
    handleCheckout({
      token: selectedToken,
      orgId: params.orgId as string,
      referralCode: refferalBenefit?.code || null,
    });
  };
  const handleValidateRefferal = async () => {
    if (!refferalCode) return;
    try {
      setIsLoading(true);
      const data = (await validateRefferalCode({
        code: refferalCode,
        orgId: params.orgId as string,
      })) as { code: string; extraToken: number };
      setRefferalBenefit({
        code: data.code as string,
        extraToken: data.extraToken as number,
      });
    } catch (error) {
      setIsError(true);
      setRefferalBenefit(null);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <>
      {loadingCheckout && <Loader />}
      <Dialog open={topupModal.isOpen} onOpenChange={topupModal.onClose}>
        <DialogContent className="sm:max-w-lg md:min-w-max">
          <DialogHeader>
            <DialogTitle className="flex flex-col items-center justify-center gap-y-4 pb-2">
              <div className="flex items-center gap-x-2 py-1 font-bold">
                Isi ulang Token Anda
              </div>
            </DialogTitle>
            <DialogDescription className="space-y-2 pt-2 text-center font-medium text-zinc-900">
              <div className="grid grid-cols-2 gap-4 ">
                {amountList.map((el) => (
                  <div
                    key={el.id}
                    className={cn(' rounded-lg  p-4 shadow-lg', {
                      'cursor-pointer': selectedToken !== el.token,
                      'bg-slate-100': selectedToken !== el.token,
                      'bg-primary': selectedToken === el.token,
                      'text-white': selectedToken === el.token,
                    })}
                    onClick={() => setSelectedToken(el.token)}
                  >
                    <p className="text-xl font-bold">
                      {el.token}
                      <span className="text-right text-sm"> token</span>
                    </p>
                    <p className="mt-2 text-xl">
                      {formatMoneyRMG(el.token * costPerToken, 'IDR')}
                    </p>
                  </div>
                ))}
              </div>
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="items-center md:justify-between">
            <div
              className={cn(
                'relative flex w-full flex-col bg-slate-50 px-5 py-8 sm:rounded-2xl',
              )}
            >
              <div className="grid grid-cols-2 text-slate-900">
                <p>Total tagihan</p>
                <p className="font-bold">
                  {formatMoneyRMG(selectedToken * costPerToken || 0, 'IDR')}
                </p>
              </div>
              <div className="mt-2 grid grid-cols-2 text-slate-900">
                <p>Jumlah Token</p>
                <p className="font-bold">
                  {formatMoneyRMG(selectedToken || 0, '')}
                  <span className="ml-1 text-xs font-light">token</span>
                </p>
              </div>
              {!!refferalBenefit && (
                <div className="mt-2 grid grid-cols-2 text-slate-900">
                  <p>Extra Token</p>
                  <p className="font-bold">
                    {formatMoneyRMG(refferalBenefit.extraToken || 0, '')}
                    <span className="ml-1 text-xs font-light">token</span>
                  </p>
                </div>
              )}
              <div className="mt-4 flex">
                <Input
                  disabled={!selectedToken}
                  value={refferalCode}
                  placeholder="kode refferal"
                  onChange={(e) => setRefferalCode(e.target.value)}
                  className="rounded-r-none focus-visible:outline-none"
                />
                <Button
                  onClick={handleValidateRefferal}
                  disabled={!selectedToken || isLoading}
                  className="rounded-l-none"
                >
                  {isLoading ? <Loader2 className="animate-spin " /> : 'Terap'}
                </Button>
              </div>
              {isError && (
                <p className="text-xs text-red-500">kode tidak valid</p>
              )}
              <div className="mt-4 flex items-center space-x-2">
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

              <Button
                variant="premium2"
                size="lg"
                className="mt-3 w-full"
                onClick={handleTopup}
                disabled={!isChecked || !selectedToken}
              >
                Bayar
                <Zap className="ml-2 h-4 w-4 fill-white" />
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
