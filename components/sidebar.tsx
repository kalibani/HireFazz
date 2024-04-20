'use client';
import { useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Montserrat } from 'next/font/google';
import {
  LayoutDashboard,
  CalendarPlus,
  SquareStack,
  HeartHandshake,
  Banknote,
  HandCoins,
  DollarSignIcon,
  Scale,
  ScrollText,
  History,
  Home,
  ListChecks,
  FileText,
  Users,
  Handshake,
} from 'lucide-react';

import { cn } from '@/lib/utils';
import FreeCounter from './free-counter';
import { useProModal } from '@/hooks/use-pro-modal';
import { useUser } from '@/hooks/use-user';
import logo from '@/public/icon/logo.svg';
import { headers } from 'next/headers';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './ui/tooltip';

type sidebarProps = {
  apiLimitCount: number;
  subscriptionType: string;
  maxFreeCount: number | null;
  isUserAgreedTermsOfService: boolean;
};

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
  const pathname = usePathname();
  console.log(pathname);
  return (
    <aside className="flex max-w-[76px] flex-col bg-white shadow-md">
      <div className="item-center flex justify-center border-b-[2px] p-4">
        <Image src={logo} alt="logo" />
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
                        'cursor-pointe h-6 w-6',
                        pathname === route.href
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

// const oldRoutes = [
//   {
//     label: 'Dashboard',
//     icon: LayoutDashboard,
//     href: '/dashboard',
//     color: 'text-sky-500',
//   },
//   {
//     label: 'CV Screener',
//     icon: FileText,
//     href: '/cv-scanner',
//     color: 'text-blue-500',
//     bgColor: 'bg-blue-500/10',
//   },
//   // {
//   //   label: "Speech Synthesis",
//   //   icon: AudioLines,
//   //   href: "/speech-synthesis",
//   //   color: "text-violet-500",
//   //   bgColor: "bg-violet-500/10",
//   // },
//   {
//     label: 'Bank Statement Analyzer',
//     icon: Banknote,
//     href: '/bank-statement-analyzer',
//     color: 'text-pink-500',
//     bgColor: 'bg-pink-500/10',
//   },
//   {
//     label: 'Invoice Reviewer',
//     icon: HandCoins,
//     href: '/invoice-reviewer',
//     color: 'text-purple-500',
//     bgColor: 'bg-purple-500/10',
//   },
//   {
//     label: 'Loan Application Processor',
//     icon: DollarSignIcon,
//     href: '/loan-application-processor',
//     color: 'text-green-500',
//     bgColor: 'bg-green-500/10',
//   },
//   {
//     label: 'Regulatory Auditor',
//     icon: Scale,
//     href: '/regulatory-auditor',
//     color: 'text-yellow-500',
//     bgColor: 'bg-yellow-500/10',
//   },
//   {
//     label: 'Contract Checker',
//     icon: ScrollText,
//     href: '/contract-checker',
//     color: 'text-teal-500',
//     bgColor: 'bg-teal-500/10',
//   },
//   {
//     label: 'History',
//     icon: History,
//     href: '/history',
//     color: 'text-orange-700',
//     bgColor: 'bg-orange-500/10',
//   },
//   {
//     label: 'Manage Subscription',
//     icon: CalendarPlus,
//     href: '/pricing',
//     color: 'text-emerald-700',
//     bgColor: 'bg-emerald-500/10',
//   },
//   {
//     label: 'Help Center',
//     icon: HeartHandshake,
//     href: '/help-center',
//     color: 'text-red-500',
//     bgColor: 'bg-red-500/10',
//   },
// ];

// const OldSideBar = ({
//   apiLimitCount = 0,
//   subscriptionType,
//   maxFreeCount,
//   isUserAgreedTermsOfService,
// }: sidebarProps) => {
//   const pathname = usePathname();
//   const { setApiLimit } = useProModal();
//   const { setMaxFreeCount, setSubscriptionType, setAgreedTermsOfService } =
//     useUser();

//   useEffect(() => {
//     setApiLimit(apiLimitCount);
//   }, [apiLimitCount]);

//   useEffect(() => {
//     setMaxFreeCount(maxFreeCount!);
//   }, [maxFreeCount]);

//   useEffect(() => {
//     setSubscriptionType(subscriptionType!);
//   }, [maxFreeCount]);

//   useEffect(() => {
//     setAgreedTermsOfService(isUserAgreedTermsOfService);
//   }, [isUserAgreedTermsOfService]);

//   return (
//     <div className="flex h-full flex-col space-y-4 bg-[#111827] py-4 text-white">
//       <div className="flex-1 px-3 py-2">
//         <Link href="/dashboard" className="mb-14 flex items-center pl-3">
//           <div className="relative mr-4 h-12 w-16">
//             <Image
//               fill
//               alt="Logo"
//               src="/BerryLabs.png"
//               sizes="100%"
//               quality={50}
//             />
//           </div>
//           <h1 className={cn('text-2xl font-bold', poppins.className)}>
//             BerryLabs
//           </h1>
//         </Link>
//         <div className="space-y-1">
//           {oldRoutes.map((route) => (
//             <Link
//               href={route.href}
//               key={route.href}
//               className={cn(
//                 'group flex w-full cursor-pointer rounded-lg p-3 text-sm font-medium transition hover:bg-white/10 hover:text-white',
//                 pathname === route.href
//                   ? 'bg-white/10 text-white'
//                   : 'text-zinc-400'
//               )}
//             >
//               <div className="flex flex-1 items-center">
//                 <route.icon className={cn(' mr-3 h-5 w-5', route?.color)} />
//                 {route.label}
//               </div>
//             </Link>
//           ))}
//         </div>
//       </div>
//       <FreeCounter
//         apiLimitCount={apiLimitCount}
//         subscriptionType={subscriptionType}
//         maxFreeCount={maxFreeCount}
//       />
//       {/* <hr className="h-px bg-white/10 border-0 " />
//       <span className="flex px-3 py-1 items-center">
//         <span className="text-zinc-400 mr-2 text-sm">
//           Powered by: IIElevenLabs
//         </span>
//         <Heart className="h-4 w-4 text-red-700" />
//       </span> */}
//     </div>
//   );
// };
