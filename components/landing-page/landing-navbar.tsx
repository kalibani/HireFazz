'use client'
import Image from 'next/image';
import Link from 'next/link';
import logo from '@/public/BerryLabs.png';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

import React from 'react';
import { MobileNavbar } from '.';
import NavigationMenuTop from './navigation-top';

export const LandingNavbar = () => {

  return (
      <div className="fixed right-0 top-0 z-50 w-full bg-white/10 px-4 backdrop-blur-md sm:px-12 xl:px-16">
        <div className="mx-auto flex max-w-screen-xl  items-center justify-between gap-x-2 py-2 xl:gap-x-4">
          <div className="flex items-center space-x-5 xl:space-x-10 ">
            <Link href="/" className="flex items-center gap-x-2">
              <div className="flex w-10 items-center justify-center">
                <Image alt="Logo" src={logo} className="ring-0" quality={50} />
              </div>
              <h1 className={cn('text-lg text-slate-950')}>BerryLabs.io</h1>
            </Link>
            <div className="hidden lg:block">
              <NavigationMenuTop />
            </div>
          </div>
          <MobileNavbar />
          <div className=" hidden items-center lg:flex">
            <Link href= '/auth/login'>
              <Button className="rounded-lg text-base font-normal  hover:bg-secondary hover:text-primary">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </div>
  );
};
