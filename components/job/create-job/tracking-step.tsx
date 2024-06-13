import { cn } from '@/lib/utils';
import { useTranslations } from 'next-intl';
import React from 'react';

type TitleMap = Record<number, { title: string; subTitle: string }>

interface TrackingStepProps {
  step: number
  withTitle?: boolean
  customTitle?: string
  customSubTitle?: string
}

const TrackingStep = ({ step, withTitle = true, customTitle, customSubTitle }: TrackingStepProps) => {
  const t = useTranslations('CreateJob')
  const titleMap: TitleMap = {
    0: {
      title: t('step1_title'),
      subTitle: ''
    },
    1: {
      title: t('step2_title'),
      subTitle: ''
    },
    2: {
      title: t('step3_title'),
      subTitle: t('step3_subTitle')
    },
    3: {
      title: t('step4_title'),
      subTitle: t('step4_subTitle')
    }
  }

  const formTitle = customTitle ?? (titleMap[step]?.title || titleMap[0].title)
  const formSubTitle = customSubTitle ?? (titleMap[step]?.subTitle || titleMap[0].subTitle)

  return (
    <div className="flex items-center justify-between gap-x-2 rounded-md bg-white py-8 text-xs capitalize px-5">
      <div className="flex-1">
        {withTitle && (
          <>
            <h1 className="text-xl font-semibold">{formTitle}</h1>
            <p>{formSubTitle}</p>
          </>
        )}
      </div>
      <div className="flex-1 flex gap-2">
        <p>{t('job_detail')}</p>
        <div className="flex items-center justify-center">
          <div className="h-5 w-5 rounded-full bg-red-600" />
          <div
            className="h-[6px] w-80 bg-gray-200"

          >
            <div className={cn(
              'h-full w-1/2 bg-red-600',
              step > 0 && 'w-full'
            )} />
          </div>
          <div
            className={cn(
              'h-5 w-5 rounded-full bg-gray-200 transition-all duration-300',
              step > 0 && 'bg-red-600',
            )}
          />
        </div>
        <p>{t('job_description')}</p>
      </div>

      <div className="flex-1"></div>
    </div>
  );
};

export default TrackingStep;
