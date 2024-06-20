'use client'
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { CheckedState } from '@radix-ui/react-checkbox';
import { clsx } from 'clsx';
import { BotIcon, Flag, Info, MapPinIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { FC, ReactElement } from 'react';
import { match } from 'ts-pattern';

interface ScreenedItemProps {
  isChecked?: boolean;
  id: string;
  handleCheck?: (checked: CheckedState, id: string) => void;
  flag?: string;
  score: string;
  name: string;
  description: string;
  education: string;
  experience: number;
  skills: string;
  location: string;
  cvLink?: string;
}

export const ScreenedItem: FC<ScreenedItemProps> = async ({
  isChecked,
  handleCheck,
  id,
  cvLink,
  flag,
  score,
  description,
  name,
  education,
  experience,
  skills,
  location,
}): Promise<ReactElement> => {
  const t =  useTranslations('JobDetail')
  return (
    <div className="w-full overflow-hidden rounded-md border border-slate-300">
      <div className="flex gap-2">
        <Checkbox className="ml-2 mt-4" onCheckedChange={(checked) => handleCheck?.(checked, id)} />

        <div className="flex-1 py-3">
          <div className="flex justify-between">
            <div className="flex items-center gap-4">
              <h3 className="text-xl font-semibold leading-tight">{name}</h3>
              <div
                className={clsx('flex items-center gap-1 text-xs', {
                  'text-green-600': flag === 'high',
                  'text-blue-600': flag === 'medium',
                  'text-red-600': flag === 'low',
                })}
              >
                <Flag className="size-[14px]" />
                <span>
                  {match(flag)
                    .with('high', () => t('goodCandidate'))
                    .with('medium', () => t('averageCandidate'))
                    .with('low', () => t('badCandidate'))
                    .otherwise(() => '')}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <MapPinIcon className="size-[14px]" />
              <span className="text-sm">{location}</span>
            </div>
          </div>

          <div className="mt-2 flex gap-2">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-sm bg-rose-600">
              <BotIcon className="size-[18px] text-white" />
            </div>

            <p className="text-xs font-medium text-slate-500">
              {description?.length > 250 ? (
                <>
                  {description.trim().slice(0, 249).trim() + '...'}
                  <Info className="inline-block size-[14px] text-blue-800" />
                </>
              ) : (
                description
              )}
            </p>
          </div>
        </div>

        <div className="flex w-[76px] flex-col justify-center border-l border-slate-300 bg-slate-200 px-4 py-2">
          <span className="text-sm">{t('score')}</span>
          <span className="text-lg font-semibold">{score}</span>
          <span className="text-sm">{t('match')}</span>
        </div>
      </div>

      <div className="flex min-h-16 w-full items-start justify-between gap-2 border-t border-slate-300 bg-slate-100 px-5 py-2">
        <div>
          <div className="flex items-start gap-2">
            <div className="w-fit rounded-sm border bg-white px-2 py-1 text-xs text-slate-500">
              {t('experience')}: {experience}
            </div>
            <div className="w-fit rounded-sm border bg-white px-2 py-1 text-xs text-slate-500">
              {t('education')}: {education}
            </div>
          </div>

          <div className="mt-2 w-fit rounded-sm border bg-white px-2 py-1 text-xs">
            {t('skills')}: {skills}
          </div>
        </div>

        <Link href={`${cvLink}`} rel="noopener noreferrer" target={'_blank'}>
          <Button className="h-fit w-[80px] p-2 text-xs">
            <span>{t('viewCV')}</span>
          </Button>
        </Link>
      </div>
    </div>
  );
};
