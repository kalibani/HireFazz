'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { Handshake, Scroll, HandCoins } from 'lucide-react';
import { SheetClose } from '../ui/sheet';
import { useRouter } from 'next/navigation';

const routes = [
  {
    id: 1,
    label: 'Product',
    icon: Handshake,
    sub: [
      { label: 'Recruitment', href: '/recruitment' },
      { label: 'Legal', href: '/comming' },
      { label: 'Finance', href: '/comming' },
      { label: 'HR Management', href: '/comming' },
    ],
  },
  {
    id: 2,
    label: 'Solution',
    icon: Scroll,
    href: '/comming',
    sub: [{ label: 'Comming soon', href: '/comming' }],
  },
  {
    id: 3,
    label: 'Pricing',
    icon: HandCoins,
    href: '/?section=pricing',
    sub: [{ label: 'Comming soon', href: '/comming' }],
  },
];
const DropdownMenuMobile = () => {
  const { push } = useRouter();
  const handleClick = (href?: string) => {
    if (href) {
      push(href);
    } else {
      push('/?section=pricing', { scroll: false });
      document
        .getElementById('pricing')
        ?.scrollIntoView({ behavior: 'smooth' });
    }
  };
  return (
    <>
      {routes.map((route) => (
        <DropdownMenu key={route.id}>
          <div
            className={cn(
              'group flex w-full cursor-pointer rounded-lg p-3 text-sm font-medium transition hover:bg-white/10 hover:text-white'
            )}
          >
            <DropdownMenuTrigger className="flex flex-1 items-center">
              <>
                {route.icon && <route.icon className={cn(' mr-3 h-5 w-5')} />}
                {route.label === 'Pricing' ? (
                  <SheetClose asChild onClick={() => handleClick()}>
                    <p>{route.label}</p>
                  </SheetClose>
                ) : (
                  <p>{route.label}</p>
                )}
              </>
            </DropdownMenuTrigger>
            {route.label !== 'Pricing' && (
              <DropdownMenuContent className="flex w-fit flex-col items-start justify-start">
                {route.sub.map((item, index) => (
                  // <Link href={item.href} passHref key={index} legacyBehavior>
                  <SheetClose
                    asChild
                    key={index}
                    onClick={() => handleClick(item.href)}
                  >
                    <DropdownMenuItem>{item.label}</DropdownMenuItem>
                  </SheetClose>
                  // </Link>
                ))}
              </DropdownMenuContent>
            )}
          </div>
        </DropdownMenu>
      ))}
    </>
  );
};

export default DropdownMenuMobile;
