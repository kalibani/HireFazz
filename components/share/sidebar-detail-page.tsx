import clsx from 'clsx';
import Link from 'next/link';
import { FC, ReactElement } from 'react';

type TSidebarDetailPage = {
  items: {
    text: string;
    link: string;
    icon?: ReactElement;
    notificationCount?: number;
    isActive?: boolean;
  }[];
  title?: string;
};

export const SidebarDetailPage: FC<TSidebarDetailPage> = ({
  items,
  title,
}): ReactElement => {
  return (
    <aside className="flex h-[50%] w-[220px] flex-col gap-5 overflow-y-auto rounded-lg bg-white py-6 ">
      {!!title && <h2 className="px-4 text-lg font-semibold">{title}</h2>}
      <ul className="flex flex-col gap-y-3">
        {items.map((item, key) => (
          <Link
            href={item.link}
            className={clsx(
              'group flex min-h-8 w-full cursor-pointer items-center justify-between gap-x-2 px-2 py-1',
              {
                'bg-rose-600': item.isActive,
              },
            )}
            key={key}
          >
            <div className="flex gap-x-3 px-4">
              <span
                className={clsx('size-4', {
                  'text-white': item.isActive,
                  'text-rose-600': !item.isActive,
                })}
              >
                {item.icon}
              </span>
              <span
                className={clsx(
                  'text-sm font-normal group-hover:font-semibold',
                  {
                    'text-white': item.isActive,
                    'font-medium': item.isActive,
                  },
                )}
              >
                {item.text}
              </span>
            </div>
            {!!item.notificationCount && (
              <span
                className={clsx(
                  'flex items-center justify-center rounded-lg px-2 text-xs font-medium',
                  {
                    'text-white': item.isActive,
                  },
                )}
              >
                {item.notificationCount}
              </span>
            )}
          </Link>
        ))}
      </ul>
    </aside>
  );
};
