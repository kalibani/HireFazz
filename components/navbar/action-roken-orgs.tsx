'use client';

import React, { FC } from 'react';
import { Button } from '../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { useTopupModal } from '@/hooks/use-topup-modal';
import { UsersRound, ChevronDown } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';

interface IActionTokenOrgProps {
  orgs: any;
}

const ActionTokenOrgs: FC<IActionTokenOrgProps> = ({ orgs }) => {
  const { onOpen } = useTopupModal();
  const { replace } = useRouter();
  const params = useParams();
  console.log(params.orgId, '<???????????');
  const selectedOrganization = orgs
    ?.filter((x) => x.organization.id === params.orgId)
    .at(0);

  return (
    <>
      <Button onClick={onOpen} size="sm">
        Topup
      </Button>

      <DropdownMenu>
        <DropdownMenuContent className="w-40" align="start">
          <span className="cursor-pointer">
            {orgs?.map((x) => (
              <DropdownMenuItem
                key={x.organization.id}
                onClick={() => replace(`/${x.organization.id}/dashboard`)}
              >
                {x.organization.name}
              </DropdownMenuItem>
            ))}
          </span>
        </DropdownMenuContent>
        <DropdownMenuTrigger className="h-fit w-1/6 min-w-fit">
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
    </>
  );
};

export default ActionTokenOrgs;
