'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useParams, usePathname } from 'next/navigation';
import {
  Home,
  ListChecks,
  FileText,
  Users,
  User,
  Video,
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
import { UserButton } from '../auth';

export const routes = [
  { label: 'Dashboard', icon: Home, href: '/dashboard' },
  { label: 'Job list', icon: ListChecks, href: '/job' },
  { label: 'Video', icon: Video, href: '/video' },
  { label: 'Candidates', icon: FileText, href: '/candidates' },
  { label: 'Integration', icon: Handshake, href: '/integrations' },
  { label: 'Users', icon: Users, href: '/users' },
];

const Sidebar = () => {
  const pathname = usePathname();
  const { orgId } = useParams();

  return (
    <aside className="fixed z-20 flex h-dvh max-w-[76px] flex-col bg-white">
      <div className="flex items-center justify-center border-b border-r py-1">
        <Image src={logo} alt="logo" />
      </div>

      <div className="flex flex-col  py-6">
        {routes.map((route) => (
          <div key={route.label} className="p-6">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link href={`/${orgId}/${route.href}`}>
                    <route.icon
                      className={cn(
                        'h-6 w-6 cursor-pointer',
                        pathname.includes(route.href)
                          ? 'text-rose-600'
                          : 'text-slate-400',
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
      <div className="flex h-full flex-col justify-end  px-5 py-10 ">
        <div className="border-t-2 pt-5">
          <UserButton />
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
