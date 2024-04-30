'use client';

import { signIn } from 'next-auth/react';
import { useParams, useSearchParams } from 'next/navigation';

import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { DEFAULT_LOGIN_REDIRECT } from '@/routes';
import { useQuery } from '@tanstack/react-query';
import { orgList } from '@/lib/actions/user/orgList';

const Social = () => {
  const { data } = useQuery({ queryKey: ['orgId'], queryFn: orgList });

  const googleSignin = async () => {
    const orgs = (await orgList()) || [];
    const orgId = orgs[0].organization.id;
    signIn('google', { callbackUrl: `/${orgId}` + DEFAULT_LOGIN_REDIRECT });
  };

  return (
    <div className="flex w-full items-center gap-x-2">
      <Button
        size="lg"
        className="flex w-full items-center justify-center gap-x-4"
        variant="outline"
        onClick={googleSignin}
      >
        <Image
          src="https://lh3.googleusercontent.com/COxitqgJr1sJnIDe8-jiKhxDx1FrYbtRHKJ9z_hELisAlapwE9LUPh6fcXIfb5vwpbMl4xl9H9TRFPc5NOO8Sb3VSgIBrfRYvW6cUA"
          width={20}
          height={20}
          alt="google"
          className="object-contain"
          sizes="100%"
        />
        Continue with google
      </Button>
    </div>
  );
};

export default Social;
