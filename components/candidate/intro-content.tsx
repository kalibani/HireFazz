'use client';

import { Button } from '@/components/ui/button';
import { MessagesSquare, ClipboardList } from 'lucide-react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import React from 'react';

const IntroContent = ({ name }: { name: string }) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const nextStepHandle = () => {
    const params = new URLSearchParams(searchParams);
    params.set('question', `0`);
    replace(`${pathname}?${params.toString()}`);
  };

  return (
    <>
      <h4 className="my-5 flex items-center gap-x-2 text-left text-xl font-semibold text-primary">
        <MessagesSquare className="size-5" /> Welcome to {name}
      </h4>
      <p className="max-w-xs ">Welcome to Our Online Video Interview</p>
      <p className="my-6 text-xs">
        This Interview has been designed to measrue some key attributes that are
        important for success within our organisation.
      </p>
      <p className="text-xs">
        Please to ensure you are in a quiet environment so that you can complete
        the interview with no interuptions.
      </p>

      <h4 className="mt-5 flex items-center gap-x-2 text-left text-xl font-semibold text-primary">
        <ClipboardList className="size-5" /> Need to be prepared.
      </h4>
      <div className="pl-4">
        <ul className="mb-8 list-item list-disc  text-sm">
          <li>Good internet conection</li>
          <li>Good webcam</li>
          <li>Clear voice mic</li>
          <li>Good lighting</li>
        </ul>
      </div>
      <Button onClick={nextStepHandle}>Next Step</Button>
    </>
  );
};

export default IntroContent;
