'use client';
import { ChevronDown, MoonIcon, UsersRound } from 'lucide-react';
import { FC, ReactElement } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { useParams, useRouter } from 'next/navigation';

type TNavbar = {
  orgs:
    | {
        organization: {
          id: string;
          name: string;
          logo: string | null;
        };
      }[]
    | undefined;
};

const Navbar: FC<TNavbar> = (props): ReactElement => {
  const params = useParams();
  const { replace } = useRouter();
  const selectedOrganization = props.orgs
    ?.filter((x) => x.organization.id === params.orgId)
    .at(0);
  return (
    <nav className="fixed z-10 flex w-full items-center justify-between gap-x-4 border-b bg-white px-3 py-[7.5px] pl-[90px]">
      <span className="w-full text-sm font-medium">{currentDate}</span>
      <DropdownMenu>
        <DropdownMenuContent className="w-40" align="start">
          <span className="cursor-pointer">
            {props?.orgs?.map((x) => (
              <DropdownMenuItem
                key={x.organization.id}
                onClick={() => replace(`/${x.organization.id}/dashboard`)}
              >
                {x.organization.name}
              </DropdownMenuItem>
            ))}
          </span>
        </DropdownMenuContent>
        <DropdownMenuTrigger className="h-fit w-1/6 min-w-fit" disabled>
          <div className="flex h-fit min-w-fit items-center justify-end rounded-xl bg-slate-100 px-3">
            <span className="w-full text-left text-sm font-normal">
              {selectedOrganization?.organization?.name}
            </span>
            <Avatar className="rounded-full p-1">
              <AvatarImage
                className="rounded-full"
                src={selectedOrganization?.organization?.logo || ''}
              />
              <AvatarFallback className="bg-sky-500">
                <UsersRound className="text-white" />
              </AvatarFallback>
            </Avatar>
            <ChevronDown />
          </div>
        </DropdownMenuTrigger>
      </DropdownMenu>

      <div className="flex items-center gap-x-1 text-xs text-slate-400">
        <ChevronDown size="16" />
        <span>EN</span>
      </div>

      <MoonIcon className="text-xs text-slate-400" />
    </nav>
  );
};

export default Navbar;

const currentDate = new Date().toLocaleDateString('en-US', {
  weekday: 'long',
  month: 'long',
  day: 'numeric',
  year: 'numeric',
});
