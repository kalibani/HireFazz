import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { ArrowRight } from 'lucide-react';

import { tools } from '@/constant';
import Link from 'next/link';
import { auth, signOut } from '@/auth';
import { useCurrentUser } from '@/hooks/use-current-user';

const DashboardPage = async () => {
  const session = await auth();
  return (
    <div>
      <div className="mb-4 space-y-4">
        <form
          action={async () => {
            'use server';
            await signOut();
          }}
        >
          <button>Signout</button>
          <p>{JSON.stringify(session?.user)}</p>
        </form>
        <h2 className="text-2xl md:text-4xl font-bold text-center">
          Explore the power of AI
        </h2>
        <p className="text-muted-foreground text-sm md:text-lg text-center">
          Work Smarter with the Smartest AI Assistant
        </p>
      </div>
      <div className="px-4 md:px-20 lg:px-32 space-y-4">
        {tools.map((tool) => (
          <Link href={tool.href} key={tool.href}>
            <Card className=" p-4 border-black/5 flex items-center justify-between hover:shadow-md transition cursor-pointer">
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
      </div>
    </div>
  );
};

export default DashboardPage;
