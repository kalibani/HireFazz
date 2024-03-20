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
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import React from 'react';
import MobileSidebar from '../mobile-sidebar';

export const LandingNavbar = () => {
  const { isSignedIn } = useAuth();

  return (
    <>
      <nav className="fixed right-0 top-0 z-50 w-full bg-white/10 px-4 backdrop-blur-md sm:px-16">
        <div className="mx-auto flex max-w-screen-xl items-start justify-between gap-x-4 py-2">
          <div className="flex flex-1 items-start space-x-11">
            <Link href="/" className="flex items-center gap-x-4">
              <div className="flex w-10 items-center justify-center">
                <Image alt="Logo" src={logo} className="ring-0" />
              </div>
              <h1 className={cn('text-xl text-slate-950')}>BerryLabs.io</h1>
            </Link>
            <div className="hidden sm:block">
              <NavigationMenuTop />
            </div>
          </div>
          <div className="flex items-center">
            <MobileSidebar>
              <NavigationMenuTop />
            </MobileSidebar>
          </div>
          <div className=" hidden items-center sm:flex">
            <Link
              href={isSignedIn ? '/dashboard' : '/sign-up'}
              legacyBehavior
              passHref
            >
              <Button className="rounded-sm px-2 text-base font-semibold hover:bg-secondary hover:text-primary">
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
              <p className="text-sm font-bold leading-none">{title}</p>
              {isComingSoon && (
                <div className="rounded-sm bg-primary px-[4px] py-[2px] text-sm font-bold leading-none">
                  <p className="text-[8px] font-normal text-white">
                    Coming Soon
                  </p>
                </div>
              )}
            </div>
            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
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
      <NavigationMenuList className={cn('flex')}>
        <NavigationMenuItem className="">
          <NavigationMenuTrigger className="flex bg-transparent px-4 py-2 hover:bg-transparent data-[active]:bg-transparent data-[state=open]:bg-transparent">
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
          <NavigationMenuTrigger className="flex bg-transparent px-4 py-2 hover:bg-transparent data-[active]:bg-transparent data-[state=open]:bg-white/10">
            Solution
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 rounded-md border bg-white/80 p-4 backdrop-blur-md md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
              {components.map((component) => (
                <ListItem
                  key={component.title}
                  title={component.title}
                  href={component.href}
                >
                  {component.description}
                </ListItem>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem className="">
          <Link
            href="#"
            legacyBehavior
            passHref
            className="flex bg-transparent px-4 py-2 hover:bg-transparent data-[active]:bg-transparent data-[state=open]:bg-white/10"
          >
            <NavigationMenuLink className="flex bg-transparent px-4 py-2 text-sm font-medium hover:bg-transparent data-[active]:bg-transparent data-[state=open]:bg-white/10">
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
      'Lorem Ipsum is simply dummy text of the printing and  typesetting industry.',
  },
  {
    title: 'Legal',
    isComingSoon: true,
    href: '/coming-soon',
    description:
      'Lorem Ipsum is simply dummy text of the printing and  typesetting industry.',
  },
  {
    isComingSoon: true,
    title: 'Finance',
    href: '/coming-soon',
    description:
      'Lorem Ipsum is simply dummy text of the printing and  typesetting industry.',
  },
  {
    isComingSoon: true,
    title: 'Scroll-area',
    href: '/docs/primitives/scroll-area',
    description: 'Visually or semantically separates content.',
  },
  {
    isComingSoon: true,
    title: 'Tabs',
    href: '/docs/primitives/tabs',
    description:
      'A set of layered sections of content—known as tab panels—that are displayed one at a time.',
  },
  {
    isComingSoon: true,
    title: 'Tooltip',
    href: '/docs/primitives/tooltip',
    description:
      'A popup that displays information related to an element when the element receives keyboard focus or the mouse hovers over it.',
  },
];
