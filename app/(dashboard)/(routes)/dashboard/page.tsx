

import { Button } from '@/components/ui/button';
import dashboard from '@/public/icon/icon-banner-dashboard.svg';
import { Banner, SectionWrap } from '@/components/share';
import { CardFeature, CardTotal, DashboardTable } from '@/components/dashboard';
import { CardTotalProp } from '@/components/dashboard/card-total';
import {
  ListChecks,
  FileText,
  Users,
  ArrowUpRight,
  SearchCheck,
} from 'lucide-react';

const DashboardPage = () => { 

  return (
    <SectionWrap isScroll>
      <Banner
        title="Welcome, Dikta Wicaksono"
        desc="Lorem Ipsum is simply dummy text of the printing and  typesetting industry. Lorem Ipsum has been the industry's standard dummy  text ever since the 1500s, when an unknown printer took a galley of  type and scrambled it to make a type specimen book."
        btnTitle="Check it out !"
        src={dashboard}
      />
      <div className="flex gap-x-32 rounded-lg bg-white px-11 py-3">
        {dummyTotal.map((item) => (
          <CardTotal
            key={item.title}
            title={item.title}
            link={item.link}
            total={item.total}
            linkTitle={item.linkTitle}
            icon={item.icon}
          />
        ))}
      </div>
      <CardFeature />
      <div className="space-y-4 rounded-lg bg-white px-3 py-2 min-h-svh">
        <div className="px-2">
          <h4 className="text-xl font-semibold">Latest Job</h4>
          <p className="text-sm text-slate-400">
            Latest Job that you added on Job List
          </p>
        </div>
        <DashboardTable />
        <Button variant="link" className="p-0 text-sm font-normal h-fit">
          View More Job <ArrowUpRight className="w-4" />
        </Button>
      </div>
    </SectionWrap>
  );
};

export default DashboardPage;

const dummyTotal: CardTotalProp[] = [
  {
    title: 'total job',
    link: '/total-job',
    linkTitle: 'view job',
    total: 2,
    icon: <ListChecks />,
  },
  {
    title: 'total candidates',
    link: '/total-job',
    linkTitle: 'view bank CV',
    total: 146,
    icon: <FileText />,
  },
  {
    title: 'total screening',
    link: '/total-job',
    linkTitle: 'view Quota',
    total: 50,
    icon: <SearchCheck />,
  },
  {
    title: 'total member',
    link: '/total-job',
    linkTitle: 'view member',
    total: 1,
    icon: <Users />,
  },
];

{
  /* <div className="mb-4 space-y-4">
        <h2 className="text-2xl font-bold text-center md:text-4xl">
          Explore the power of AI
        </h2>
        <p className="text-sm text-center text-muted-foreground md:text-lg">
          Work Smarter with the Smartest AI Assistant
        </p>
      </div>
      <div className="px-4 space-y-4 md:px-20 lg:px-32">
        {tools.map((tool) => (
          <Link href={tool.href} key={tool.href}>
            <Card className="flex items-center justify-between p-4 transition cursor-pointer border-black/5 hover:shadow-md">
              <div className="flex items-center gap-x-4">
                <div className={cn('p-2 w-fit rounded-md', tool.bgColor)}>
                  <tool.icon className={cn('w-8 h-8', tool.color)} />
                </div>
                <div className="font-semibold">{tool.label}</div>
              </div>
              <ArrowRight className="w-5 h-5" />
            </Card>
          </Link>
        ))}
      </div> */
}
