import { FC, ReactElement } from 'react';

type TSidebarDetailJob = {
  items: Array<{
    text: string;
    link: string;
    icon?: ReactElement;
    notificationCount?: number;
  }>;
};

export const SidebarDetailJob: FC<TSidebarDetailJob> = (
  props,
): ReactElement => {
  return (
    <aside className="mt-3 flex h-full min-h-screen w-1/4 flex-col gap-5 rounded-lg bg-white p-6">
      <ul className="flex flex-col gap-y-6">
        {props.items.map((item, key) => (
          <li
            className="group flex w-full cursor-pointer items-center justify-between gap-x-2 rounded-lg p-2 hover:bg-gray-100"
            key={key}
          >
            <div className="flex gap-x-2">
              {item.icon}
              <span className="text-sm font-medium group-hover:font-semibold">
                {item.text}
              </span>
            </div>
            {item.notificationCount && (
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-500 p-2 text-xs font-medium text-white">
                {item.notificationCount}
              </span>
            )}
          </li>
        ))}
      </ul>
    </aside>
  );
};
