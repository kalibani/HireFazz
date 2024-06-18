import { Button } from '@/components/ui/button';
import dashboard from '@/public/icon/icon-banner-dashboard.svg';
import { Banner, SectionWrap } from '@/components/share';
import { CardFeature, CardTotal, DashboardTable } from '@/components/dashboard';
import { CardTotalProp } from '@/components/dashboard/card-total';
import {getTranslations} from 'next-intl/server';
import {
  ListChecks,
  FileText,
  Users,
  ArrowUpRight,
  SearchCheck,
} from 'lucide-react';
import { currentUser } from '@/lib/auth';
import { ParamsProps } from '@/types/types';

const DashboardPage = async ({ params }: ParamsProps) => {
  const user = await currentUser();
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
        {dummyTotal.map((item) => (
          <CardTotal
            key={item.title}
            title={t(item.title)}
            link={item.link}
            total={item.total}
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
        <DashboardTable />
        <Button variant="link" className="h-fit p-0 text-sm font-normal">
          {t('table_viewMoreJob')} <ArrowUpRight className="w-4" />
        </Button>
      </div>
    </SectionWrap>
  );
};

export default DashboardPage;

const dummyTotal: CardTotalProp[] = [
  {
    title: 'overview_totalJob',
    link: '/total-job',
    linkTitle: 'overview_seeTotalJob',
    total: 2,
    icon: <ListChecks />,
  },
  {
    title: 'overview_totalApply',
    link: '/total-job',
    linkTitle: 'overview_seeTotalApply',
    total: 146,
    icon: <FileText />,
  },
  {
    title: 'overview_totalScreening',
    link: '/total-job',
    linkTitle: 'overview_seeTotalScreening',
    total: 50,
    icon: <SearchCheck />,
  },
  {
    title: 'overview_totalMember',
    link: '/total-job',
    linkTitle: 'overview_seeTotalMember',
    total: 1,
    icon: <Users />,
  },
];
