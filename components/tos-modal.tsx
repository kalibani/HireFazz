'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';

import { useState } from 'react';
import { useUser as useSignIn } from '@clerk/nextjs';
import { Button } from './ui/button';
import { useUser } from '@/hooks/use-user';
import axios from 'axios';
import { useRouter } from 'next/navigation';

const ToSModal = () => {
  const { isUserAgreedTermsOfService } = useUser();
  const router = useRouter();
  const [isLoading, setLoading] = useState(false);
  const handleClickToS = async () => {
    setLoading(true);
    const response = await axios.post('/api/update-user-tos', {
      isUserAgreedTermsOfService: true,
    });

    if (response) {
      router.refresh();
    }

    setLoading(false);
  };

  // const { isSignedIn } = useSignIn();

  const isOpen = false;

  return (
    <Dialog open={isOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex  flex-col gap-y-4 pb-2">
            <div className="flex items-center gap-x-2 font-bold py-1">
              Terms of Service
            </div>
          </DialogTitle>
          <DialogDescription className="pt-2 space-y-2 text-zinc-900 font-medium h-96 overflow-auto">
            <iframe
              src="https://drive.google.com/file/d/1u-DULua9EUEYjhK15JV6lrnKEDrLRuqZ/preview"
              width="100%"
              height="100%"
              allow="autoplay"
            ></iframe>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="default"
            size="lg"
            className="w-full"
            onClick={handleClickToS}
            disabled={isLoading}
          >
            I accept
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ToSModal;
