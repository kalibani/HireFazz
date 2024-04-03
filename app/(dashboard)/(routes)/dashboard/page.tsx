// "use client";

import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
// import { useRouter } from "next/navigation";

import { tools } from '@/constant';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import dashboard from '@/public/icon/icon-banner-dashboard.svg';
import { Banner } from '@/components/share';
import { CardFeature, CardTotal, DashboardTable } from '@/components/dashboard';
import { CardTotalProp } from '@/components/dashboard/card-total';
import { ListChecks, FileText, Scan, Users } from 'lucide-react';

const DashboardPage = () => {
  return (
    <div className="space-y-3 p-4">
      <Banner
        title="Welcome, Dikta Wicaksono"
        desc="Lorem Ipsum is simply dummy text of the printing and  typesetting industry. Lorem Ipsum has been the industry's standard dummy  text ever since the 1500s, when an unknown printer took a galley of  type and scrambled it to make a type specimen book."
        btnTitle="Check it out !"
        src={dashboard}
      />
      <div className="flex gap-x-32 rounded-lg bg-white px-11 py-4">
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
      <div className="space-y-4 rounded-lg bg-white p-3">
        <div className="p-2">
          <h4 className="text-xl font-semibold">Latest Job</h4>
          <p className="text-sm text-slate-400">
            Latest Job that you added on Job List
          </p>
        </div>
        <DashboardTable />
      </div>
    </div>
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
    icon: <Scan />,
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
        <h2 className="text-2xl md:text-4xl font-bold text-center">
          Explore the power of AI
        </h2>
        <p className="text-muted-foreground text-sm md:text-lg text-center">
          Work Smarter with the Smartest AI Assistant
        </p>
      </div>
      <div className="px-4 md:px-20 lg:px-32 space-y-4">
        {tools.map((tool) => (
          <Card
            onClick={() => router.push(tool.href)}
            key={tool.href}
            className=" p-4 border-black/5 flex items-center justify-between hover:shadow-md transition cursor-pointer"
          >
            <div className="flex items-center gap-x-4">
              <div className={cn("p-2 w-fit rounded-md", tool.bgColor)}>
                <tool.icon className={cn("w-8 h-8", tool.color)} />
              </div>
              <div className="font-semibold">{tool.label}</div>
            </div>
            <ArrowRight className="w-5 h-5" />
          </Card>
        ))}
      </div> */
}
