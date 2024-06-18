import { Button } from '@/components/ui/button';
import dashboard from '@/public/icon/icon-banner-dashboard.svg';
import { Banner, SectionWrap } from '@/components/share';
import { CardFeature, CardTotal, DashboardTable } from '@/components/dashboard';
import { getTranslations } from 'next-intl/server';
import {
  ListChecks,
  FileText,
  Users,
  ArrowUpRight,
  SearchCheck,
} from 'lucide-react';
import { currentUser } from '@/lib/auth';
import { ParamsProps } from '@/types/types';
import getTotals from '@/lib/actions/dashboard/getTotal';
import Link from 'next/link';

const DashboardPage = async ({ params }: ParamsProps) => {
  const user = await currentUser();
  const totals = await getTotals(params.orgId);
  const t = await getTranslations('Home');
  return (
    <SectionWrap isScroll>
      <Banner
        title={t('banner_title', { name: user?.name || 'User' })}
        desc={t('banner_description')}
        btnTitle={t('banner_cta')}
        src={dashboard}
      />
      <div className="flex gap-x-32 rounded-lg bg-white px-11 py-3">
        {totalData.map((item) => (
          <CardTotal
            key={item.title}
            title={t(item.title)}
            link={item.link}
            // @ts-ignore
            total={totals[item.total] ?? 0}
            linkTitle={t(item.linkTitle)}
            icon={item.icon}
          />
        ))}
      </div>
      <CardFeature orgId={params.orgId} />
      <div className="h-full space-y-4 rounded-lg bg-white px-3 py-2">
        <div className="px-2">
          <h4 className="text-xl font-semibold">{t('table_latestJob')}</h4>
          <p className="text-sm text-slate-400">
            {t('table_latestJobDescription')}
          </p>
        </div>
        <DashboardTable dataSource={totals?.latesJobs} orgId={params.orgId} />
        <Link href={`/${params.orgId}/job`}>
          <Button variant="link" className="my-4 h-fit p-0 text-sm font-normal">
            {t('table_viewMoreJob')} <ArrowUpRight className="w-4" />
          </Button>
        </Link>
      </div>
    </SectionWrap>
  );
};

export default DashboardPage;

const totalData = [
  {
    title: 'overview_totalJob',
    link: '/total-job',
    linkTitle: 'overview_seeTotalJob',
    total: 'totalJobs',
    icon: <ListChecks />,
  },
  {
    title: 'overview_totalApply',
    link: '/total-job',
    linkTitle: 'overview_seeTotalApply',
    total: 'totalCandidates',
    icon: <FileText />,
  },
  {
    title: 'overview_totalScreening',
    link: '/total-job',
    linkTitle: 'overview_seeTotalScreening',
    total: 'totalAnalyzed',
    icon: <SearchCheck />,
  },
];
