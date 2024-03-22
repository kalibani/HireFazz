import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { Handshake, Scroll, HandCoins, Layers } from 'lucide-react';
import Link from 'next/link';

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
    href: '/comming',
    sub: [{ label: 'Comming soon', href: '/comming' }],
  },
  {
    id: 4,
    icon: Layers,
    label: 'HR Management',
    href: '/comming',
    sub: [{ label: 'Comming soon', href: '/comming' }],
  },
];
const DropdownMenuMobile = () => (
  <>
    {routes.map((route) => (
      <DropdownMenu key={route.id}>
        <div
          className={cn(
            'group flex w-full cursor-pointer rounded-lg p-3 text-sm font-medium transition hover:bg-white/10 hover:text-white'
          )}
        >
          <DropdownMenuTrigger className="flex flex-1 items-center">
            <route.icon className={cn(' mr-3 h-5 w-5')} />
            <p>{route.label}</p>
          </DropdownMenuTrigger>

          <DropdownMenuContent className="w-fit px-4">
            {route.sub.map((item: any, index) => (
              <Link key={index} href={item.href} passHref legacyBehavior>
                <DropdownMenuItem>{item.label}</DropdownMenuItem>
              </Link>
            ))}
          </DropdownMenuContent>
        </div>
      </DropdownMenu>
    ))}
  </>
);

export default DropdownMenuMobile;
