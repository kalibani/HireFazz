'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { getTokens } from '@/lib/actions/token/consumeToken';
import { Loader2Icon } from 'lucide-react';
import { useTransition, useState, useEffect } from 'react';

export function ViewToken({ orgId }: { orgId: string }) {
  const [isPending, starTransition] = useTransition();

  const [dataToken, setDataToken] = useState(0);

  const handleGetToken = (id: string) => {
    starTransition(async () => {
      try {
        const token = await getTokens({ orgId: id });
        if (token) {
          setDataToken(token.availableTokens);
        }
      } catch (error) {
        console.log(error);
      }
    });
  };
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          onClick={() => handleGetToken(orgId)}
          className="h-0 rounded-full bg-primary p-3 text-xs text-white hover:bg-primary hover:text-white"
        >
          view token
        </Button>
      </PopoverTrigger>
      <PopoverContent className="h-auto w-fit">
        {isPending ? (
          <div className="flex w-full items-center justify-center">
            loading... <Loader2Icon className="animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid gap-4">
            <div className="space-y-1">
              <h4 className="font-medium leading-none">Token Anda</h4>
              <p className="text-sm text-muted-foreground">
                Jumlah token anda saat ini:
              </p>
            </div>
            <div className="grid gap-2">
              <div className="flex items-center gap-2">
                <Label htmlFor="width">Token</Label>
                <Input
                  disabled
                  id="width"
                  defaultValue={dataToken}
                  className="h-8 w-full"
                />
              </div>
            </div>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
