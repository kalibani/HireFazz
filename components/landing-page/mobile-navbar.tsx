import { cn } from '@/lib/utils';
import React from 'react';
import MobileSidebar from '../mobile-sidebar';
import Link from 'next/link';
import Image from 'next/image';
import logo from '@/public/BerryLabs.png';
import { Handshake, Scroll, HandCoins, Layers } from 'lucide-react';
import { DropdownMenuMobile } from '.';

const MobileNavbar = () => {
  return (
    <MobileSidebar>
      <div className="flex h-full w-fit flex-col space-y-1  py-4">
        <Link href="/" className="mb-14 flex items-center gap-x-2 px-3">
          <div className="flex w-10 items-center justify-center">
            <Image alt="Logo" src={logo} quality={50} />
          </div>
          <h1 className={cn('text-lg text-slate-950')}>BerryLabs.io</h1>
        </Link>
        {/* {routes.map((route) => (
            <Link
              href={route.href}
              key={route.href}
              className={cn(
                'group flex w-full cursor-pointer rounded-lg p-3 text-sm font-medium transition hover:bg-white/10 hover:text-white'
              )}
            >
              <div className="flex flex-1 items-center">
                <route.icon className={cn(' mr-3 h-5 w-5')} />
                {route.label}
              </div>
            </Link>
          ))} */}
        <DropdownMenuMobile />
      </div>
    </MobileSidebar>
  );
};

export default MobileNavbar;
