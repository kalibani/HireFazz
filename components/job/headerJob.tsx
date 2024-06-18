import { Button } from '@/components/ui/button';
import { UploadCloud } from "lucide-react";
import { getTranslations } from 'next-intl/server';

export const HeaderJob = async () => {
  const t = await getTranslations('JobList')
  return (
    <div className="flex justify-between rounded-md bg-white px-5 py-2.5">
      <div>
        <h3 className="text-xl">{t('table_title')}</h3>
        <p className="text-sm text-slate-400">
          {t('table_subTitle')}
        </p>
      </div>
      <Button className="flex items-center gap-2">
        <UploadCloud />
         {t('table_cta')}
      </Button>
    </div>
  );
};
