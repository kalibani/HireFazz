import { cn } from '@/lib/utils';
import { NavigationMenuLink } from '@/components/ui/navigation-menu';
import React from 'react';

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
              <p className="text-lg font-medium leading-none">{title}</p>
              {isComingSoon && (
                <div className="rounded-sm bg-primary p-[4px] text-sm font-bold leading-none">
                  <p className="text-[8px] font-normal text-white">
                    Coming Soon
                  </p>
                </div>
              )}
            </div>
            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground text-second-text">
              {children}
            </p>
          </a>
        </NavigationMenuLink>
      </li>
    );
  }
);
ListItem.displayName = 'ListItem';

export default ListItem;
