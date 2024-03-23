import { cn } from '@/lib/utils';

import React from 'react';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import { components } from '@/constant';
import ListItem from './list-item';
import NavPricing from './nav-pricing';

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
                  key={component.id}
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
          <NavigationMenuLink className="flex cursor-pointer bg-transparent px-4 py-2 text-lg font-normal hover:bg-transparent data-[active]:bg-transparent data-[state=open]:bg-white/10">
            <NavPricing />
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
};
export default NavigationMenuTop;
