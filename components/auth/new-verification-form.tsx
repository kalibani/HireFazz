'use client';

import { useCallback, useEffect, useState } from 'react';
// import { BeatLoader } from "react-spinners";
import { useSearchParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';

// import { newVerification } from "@/actions/new-verification";
import { FormError } from '@/components/form-error';
import { FormSuccess } from '@/components/form-success';
import { CardWrapper } from '.';
// import { trpc } from '@/app/_trpc/client';

export const NewVerificationForm = () => {
  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();
  // const { mutate } = trpc.userNewVerification.useMutation({
  //   onSuccess: (data) => {
  //     setSuccess('verified');
  //   },
  //   onError: (data) => {
  //     setError(data.message);
  //   },
  // });

  const searchParams = useSearchParams();

  const token = searchParams.get('token');

  const onSubmit = useCallback(() => {
    if (success || error) return;

    if (!token) {
      setError('Missing token!');
      return;
    }
    // mutate({ token });
  }, [token, success, error]);

  useEffect(() => {
    onSubmit();
  }, [onSubmit]);

  return (
    <CardWrapper
      headerLabel="Confirming your verification"
      backButtonLabel="Back to login"
      backButtonHref="/auth/login"
    >
      <div className="flex w-full items-center justify-center">
        {!success && !error && <Loader2 />}
        <FormSuccess message={success} />
        {!success && <FormError message={error} />}
      </div>
    </CardWrapper>
  );
};
