'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '@clerk/nextjs';
import logo from '@/public/BerryLabs.png';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink,
} from '@/components/ui/navigation-menu';
import React from 'react';
import { MobileNavbar } from '.';

export const LandingNavbar = () => {
  const { isSignedIn } = useAuth();

  return (
    <>
      <nav className="fixed right-0 top-0 z-50 w-full bg-white/10 px-4 backdrop-blur-md sm:px-16">
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
            <Link
              href={isSignedIn ? '/dashboard' : '/sign-up'}
              legacyBehavior
              passHref
            >
              <Button className="h-auto rounded-sm px-6 py-2 text-base  hover:bg-secondary hover:text-primary xl:px-8  xl:py-2 xl:text-xl">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </nav>
    </>
  );
};

interface ListItemProps extends React.ComponentPropsWithoutRef<'a'> {
  title: string;
  isComingSoon?: boolean;
}
const ListItem = React.forwardRef<React.ElementRef<'a'>, ListItemProps>(
  ({ className, title, children, isComingSoon, ...props }, ref) => {
    return (
      <li>
        <NavigationMenuLink>
          <a
            ref={ref}
            className={cn(
              'block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
              className
            )}
            {...props}
          >
            <div className=" flex items-center   space-x-2">
              <p className="text-lg font-bold leading-none xl:text-xl">
                {title}
              </p>
              {isComingSoon && (
                <div className="rounded-sm bg-primary p-[4px] text-sm font-bold leading-none">
                  <p className="text-[8px] font-normal text-white">
                    Coming Soon
                  </p>
                </div>
              )}
            </div>
            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground text-second-text xl:text-base">
              {children}
            </p>
          </a>
        </NavigationMenuLink>
      </li>
    );
  }
);
ListItem.displayName = 'ListItem';

const NavigationMenuTop = () => {
  return (
    <NavigationMenu>
      <NavigationMenuList className={cn('flex gap-x-5 xl:gap-x-4')}>
        <NavigationMenuItem>
          <NavigationMenuTrigger className="flex bg-transparent px-4 py-2  text-lg font-normal hover:bg-transparent data-[active]:bg-transparent data-[state=open]:bg-white/10">
            Products
          </NavigationMenuTrigger>
          <NavigationMenuContent className=" rounded-md">
            <ul className="grid w-[400px]  gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
              {components.map((component) => (
                <ListItem
                  key={component.title}
                  title={component.title}
                  href={component.href}
                  isComingSoon={component.isComingSoon}
                >
                  {component.description}
                </ListItem>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem className="">
          <NavigationMenuTrigger className="flex bg-transparent px-4 py-2 text-lg font-normal hover:bg-transparent data-[active]:bg-transparent data-[state=open]:bg-white/10 ">
            Solution
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 rounded-md border bg-white/80 p-4 blur-md backdrop-blur-md md:w-[500px] md:grid-cols-2 lg:w-[600px]">
              <p>Coming Soon</p>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem className="">
          <Link
            href="#"
            legacyBehavior
            passHref
            className="flex bg-transparent px-4 py-2 font-normal hover:bg-transparent data-[active]:bg-transparent data-[state=open]:font-normal"
          >
            <NavigationMenuLink className="flex bg-transparent px-4 py-2 text-lg font-normal  hover:bg-transparent data-[active]:bg-transparent data-[state=open]:bg-white/10 ">
              Pricing
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
};

const components: {
  title: string;
  href: string;
  description: string;
  isComingSoon: boolean;
}[] = [
  {
    title: 'Recruitment',
    href: '/recruitment',
    isComingSoon: false,
    description:
      'Attract top talent, streamline hiring with AI, collaborate as a team, and make data-driven decisions. All on one platform.',
  },
  {
    title: 'Legal',
    isComingSoon: true,
    href: '/comming',
    description: 'Navigate Contracts, Manage Compliance, Resolve Disputes',
  },
  {
    isComingSoon: true,
    title: 'Finance',
    href: '/comming',
    description: 'Track, grow, manage debt, and plan your financial future',
  },
  {
    isComingSoon: true,
    title: 'HR Management',
    href: '/comming',
    description: 'Simplify your HR, manage performance & payroll, etc.',
  },
];
