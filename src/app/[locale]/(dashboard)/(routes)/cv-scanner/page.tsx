import Heading from '@/components/headings';
import { FileArchiveIcon } from 'lucide-react';
import CvScanner from './cv.scanner';
import { useTranslations } from 'next-intl';
import WrapperTranslate from '@/components/wrapper-translate/wrapper-translate';
import type { SearchParamsProps } from '@/types/types';
const CVAnalyzerPage = ({ searchParams }: SearchParamsProps) => {
  const t = useTranslations('dashboard');
  return (
    <div>
      <Heading
        title={t('page.cv-scan.title')}
        description={t('page.cv-scan.description')}
        icon={FileArchiveIcon}
        iconColor="text-blue-300"
        bgColor="bg-blue-300/10"
      />
      <WrapperTranslate section="dashboard">
        <CvScanner searchParams={searchParams} />
      </WrapperTranslate>
    </div>
  );
};

export default CVAnalyzerPage;
