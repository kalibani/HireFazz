import { cn } from '@/lib/utils';
import React from 'react';
import MobileSidebar from '../mobile-sidebar';
import Link from 'next/link';
import Image from 'next/image';
import logo from '@/public/BerryLabs.png';
import { DropdownMenuMobile } from '.';
import { SheetClose } from '../ui/sheet';

const MobileNavbar = () => {
  return (
    <MobileSidebar>
      <div className="flex h-full w-fit flex-col space-y-1  py-4">
        <SheetClose asChild>
          <Link href="/" className="mb-14 flex items-center gap-x-2 px-3">
            <div className="flex w-10 items-center justify-center">
              <Image alt="Logo" src={logo} quality={50} />
            </div>
            <h1 className={cn('text-lg text-slate-950')}>BerryLabs.io</h1>
          </Link>
        </SheetClose>
        <DropdownMenuMobile />
      </div>
    </MobileSidebar>
  );
};

export default MobileNavbar;
