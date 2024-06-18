import React from 'react';
import {
  ListChecks,
  ArrowUpRight,
  Handshake,
  FileText,
  MessagesSquare,
  Video,
} from 'lucide-react';
import { Button } from '../ui/button';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { getTranslations } from 'next-intl/server';

const CardFeature = async ({ orgId }: { orgId: string }) => {
  const t = await getTranslations('Home');
  return (
    <div className="flex gap-x-4">
      {dataFeature.map((item) => (
        <div
          className="flex w-[234px] flex-col justify-between gap-y-2 rounded-lg bg-white p-4"
          key={item.id}
        >
          <item.icon className="h-8 w-8 text-rose-600" />
          <p className="text-sm font-normal text-slate-400">
            {t(item.descKey)}
          </p>
          <Link href={`/${orgId}/${item.url}`} passHref legacyBehavior>
            <div className="flex flex-col items-end justify-end gap-y-2">
              {item.isComing && (
                <div className="rounded-sm border border-[#5D5FEF] px-3 py-[2px] text-[6px] text-[#5D5FEF]">
                  Commig Soon
                </div>
              )}
              <Button
                variant={item.isComing ? 'outline' : 'default'}
                className={cn(
                  'flex h-fit w-fit bg-rose-600 px-4 py-1 text-sm font-normal',
                  item.isComing &&
                    'border border-[#5D5FEF] bg-transparent text-[#5D5FEF]',
                )}
              >
                {t(item.btnTitleKey)}
                <ArrowUpRight className="w-4" />
              </Button>
            </div>
          </Link>
        </div>
      ))}
    </div>
  );
};

export default CardFeature;

const dataFeature = [
  {
    id: 1,
    icon: ListChecks,
    descKey: 'feat_createJob',
    url: '/job/create',
    isComing: false,
    btnTitleKey: 'feat_createJobCta',
  },
  {
    id: 4,
    icon: Video,
    descKey: 'feat_interview',
    url: '/video',
    isComing: false,
    btnTitleKey: 'feat_interviewCta',
  },
  {
    id: 2,
    icon: Handshake,
    descKey: 'feat_integration',
    url: '/integrations',
    isComing: true,
    btnTitleKey: 'feat_integrationCta',
  },
  {
    id: 3,
    icon: FileText,
    descKey: 'feat_candidates',
    url: '/true',
    isComing: true,
    btnTitleKey: 'feat_candidatesCta',
  },
];
