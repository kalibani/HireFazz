import clsx from 'clsx';
import { FC, ReactElement } from 'react';

type TSidebarDetailJob = {
  items: Array<{
    text: string;
    link: string;
    icon?: ReactElement;
    notificationCount?: number;
    isActive?: boolean
  }>;
};

export const SidebarDetailJob: FC<TSidebarDetailJob> = (
  props,
): ReactElement => {
  return (
    <aside className="mt-3 flex h-full min-h-screen w-[220px] flex-col gap-5 rounded-lg bg-white py-6">
      <h2 className="font-semibold text-lg px-3">List Candidate</h2>
      <ul className="flex flex-col gap-y-3">
        {props.items.map((item, key) => (
          <li
            className={clsx(
              "group flex w-full cursor-pointer items-center justify-between gap-x-2 px-2 py-1",
              {
                'bg-rose-600': item.isActive,
              }
            )}
            key={key}
          >
            <div className="flex gap-x-3">
              <span className={clsx(
                'size-4',
                {
                  'text-white': item.isActive,
                  'text-rose-600': !item.isActive
                }
              )}>{item.icon}</span>
              <span className={clsx(
                "text-sm font-normal group-hover:font-semibold",
                {
                  'text-white': item.isActive,
                  'font-medium': item.isActive
                }
              )}>
                {item.text}
              </span>
            </div>
            {!!item.notificationCount && (
              <span className={clsx(
                "flex size-8 items-center justify-center rounded-lg p-2 text-xs font-medium",
                {
                  'text-white': item.isActive
                }
              )}>
                {item.notificationCount}
              </span>
            )}
          </li>
        ))}
      </ul>
    </aside>
  );
};
