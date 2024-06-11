'use client';

import { Loader } from '@/components/share';
import { Button } from '@/components/ui/button';
import updateStatusCandidate from '@/lib/actions/interview/updateStatusCandidate';
import { useParams, useRouter } from 'next/navigation';
import React, { useTransition } from 'react';
import toast from 'react-hot-toast';

const ActionButton = ({ id }: { id: string }) => {
  const params = useParams();
  const { replace } = useRouter();
  const [isPending, startTransition] = useTransition();
  const handleAction = (type: 'SHORTLISTED' | 'REJECTED') => {
    startTransition(async () => {
      try {
        const updated = await updateStatusCandidate({ id: [id], status: type });
        if (updated?.success) {
          toast.success(updated.success);
          replace(`/${params.orgId}/video/${params.id}/${type.toLowerCase()}`);
        }
      } catch (error: any) {
        toast.error(error);
      }
    });
  };
  return (
    <>
      <div className="flex gap-x-3">
        <Button onClick={() => handleAction('SHORTLISTED')}>Shortlisted</Button>
        <Button onClick={() => handleAction('REJECTED')} variant="outline">
          Rejected
        </Button>
      </div>
      {isPending && <Loader />}
    </>
  );
};

export default ActionButton;
