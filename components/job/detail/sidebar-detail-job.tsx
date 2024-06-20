import clsx from 'clsx';
import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { FC, ReactElement } from 'react';

type TSidebarDetailJob = {
  items: Array<{
    text: string;
    link: string;
    icon?: ReactElement;
    notificationCount?: number;
    isActive?: boolean;
  }>;
};

export const SidebarDetailJob: FC<TSidebarDetailJob> = async (
  props,
): Promise<ReactElement> => {
  const t = await getTranslations('JobDetail')
  return (
    <aside className="mt-3 flex h-fit w-[220px] flex-col gap-5 rounded-lg bg-white py-6 pb-[218px]">
      <h2 className="px-3 text-lg font-semibold">{t('listCandidate')}</h2>
      <ul className="flex flex-col gap-y-3">
        {props.items.map((item, key) => (
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
            <div className="flex gap-x-3">
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

