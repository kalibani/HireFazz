// 'use client';

import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { ArrowRight } from 'lucide-react';
// import { useRouter } from "next/navigation";
import { tools } from '@/constant';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

const DashboardPage = () => {
  const t = useTranslations('dashboard');

  return (
    <div>
      <div className="mb-4 space-y-4">
        <h2 className="text-2xl md:text-4xl font-bold text-center">
          {t('page.dashboard.title')}
        </h2>
        <p className="text-muted-foreground text-sm md:text-lg text-center">
          {t('page.dashboard.tag-line')}
        </p>
      </div>
      <div className="px-4 md:px-20 lg:px-32 flex flex-col gap-y-4">
        {tools.map((tool) => (
          <Link key={tool.href} href={tool.href} passHref legacyBehavior>
            <Card className=" p-4 border-black/5 flex items-center justify-between hover:shadow-md transition cursor-pointer">
              <div className="flex items-center gap-x-4">
                <div className={cn('p-2 w-fit rounded-md', tool.bgColor)}>
                  <tool.icon className={cn('w-8 h-8', tool.color)} />
                </div>
                <div className="font-semibold">{t(`menu.${tool.label}`)}</div>
              </div>
              <ArrowRight className="w-5 h-5" />
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default DashboardPage;
