'use client';

import React from 'react';
import { TabsList, TabsTrigger } from '../ui/tabs';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

const TriggerTab = () => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const tabsTriggerHandler = (tab: 'template' | 'candidates') => {
    const params = new URLSearchParams(searchParams);
    if (tab) {
      params.set('tab', tab);
    }
    replace(`${pathname}?${params.toString()}`);
  };
  return (
    <TabsList className="h-auto rounded-none p-0">
      <TabsTrigger
        value="candidates"
        className="rounded-none rounded-tr-md bg-slate-300 py-3 text-slate-700 focus-visible:ring-0 focus-visible:ring-offset-0"
        onClick={() => tabsTriggerHandler('candidates')}
      >
        Interview Candidates
      </TabsTrigger>
      <TabsTrigger
        value="template"
        className="rounded-none rounded-tr-md bg-slate-300 py-3  text-slate-700"
        onClick={() => tabsTriggerHandler('template')}
      >
        Template Interview
      </TabsTrigger>
    </TabsList>
  );
};

export default TriggerTab;
