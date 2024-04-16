'use client';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Banknote,
  HandCoins,
  DollarSignIcon,
  Scale,
  Home,
  ListChecks,
  FileText,
  Users,
  Handshake,
} from 'lucide-react';

import { cn } from '@/lib/utils';
import logo from '@/public/icon/logo.svg';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../ui/tooltip';

const routes = [
  { label: 'Dashboard', icon: Home, href: '/dashboard' },
  { label: 'Job list', icon: ListChecks, href: '/job' },
  { label: 'Candidates', icon: FileText, href: '/candidates' },
  { label: 'Integration', icon: Handshake, href: '/integrations' },
  { label: 'Users', icon: Users, href: '/users' },
];

const comingRoutes = [
  { icon: Banknote },
  { icon: HandCoins },
  { icon: DollarSignIcon },
  { icon: Scale },
  { icon: FileText },
];

const Sidebar = () => {
  const pathname = usePathname().split('/')[1];
  

  return (
    <aside className="flex max-w-[76px] flex-col bg-white h-dvh">
      <div className="flex items-center justify-center border-b py-1">
        <Image src={logo} alt="logo"  />
      </div>

      <div className="flex flex-col border-b py-6">
        {routes.map((route) => (
          <div key={route.label} className="p-6">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link href={route.href}>
                    <route.icon
                      className={cn(
                        'cursor-pointer h-6 w-6',
                        route.href.includes(pathname)
                          ? 'text-rose-600'
                          : 'text-slate-400'
                      )}
                    />
                  </Link>
                </TooltipTrigger>
                <TooltipContent align="start" arrowPadding={10}>
                  <p>{route.label}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        ))}
      </div>
      <div className="mt-16 px-5">
        <div className="h-207 flex flex-col items-center justify-center rounded-lg bg-slate-100">
          {comingRoutes.map((coming, idx) => (
            <Link
              href="/coming-soon"
              key={idx}
              className="flex h-11 w-9 items-center justify-center"
            >
              <coming.icon className="h-4 w-4 text-slate-400" />
            </Link>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
