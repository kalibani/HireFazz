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
import { Button } from '../ui/button';
import { useTopupModal } from '@/hooks/use-topup-modal';
import { Badge } from '../ui/badge';
import { useQuery } from '@tanstack/react-query';
import { getTokens } from '@/lib/actions/token/consumeToken';
import { useTranslate } from '@/hooks/use-translate';
import { Locale } from '@/i18n';

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
  const { onOpen } = useTopupModal();
  const { language, setLanguage } = useTranslate();
  const params = useParams();
  const { replace } = useRouter();
  const selectedOrganization = props.orgs
    ?.filter((x) => x.organization.id === params.orgId)
    .at(0);

  const { data } = useQuery({
    queryKey: ['available-Token'],
    queryFn: async () => await getTokens({ orgId: params.orgId as string }),
    refetchInterval: 10000,
  });

  const locale: Record<Locale, string> = {
    en: 'en-US',
    id: 'id-ID',
  };

  const currentDate = new Date().toLocaleDateString(locale[language], {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <nav className="fixed z-10 flex w-full items-center justify-between gap-x-4 border-b bg-white px-3 py-[7.5px] pl-[90px]">
      <span className="flex-1 text-sm font-medium">{currentDate}</span>
      {!!data && (
        <Badge className="text-xs opacity-90">
          {data?.availableTokens || 0} tokens
        </Badge>
      )}
      <Button onClick={onOpen} size="sm">
        Topup
      </Button>
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

      <div className="mx-2 flex items-center gap-x-1 text-xs text-slate-400">
        <DropdownMenu>
          <DropdownMenuContent className="w-20" align="start">
            <span className="cursor-pointer">
              <DropdownMenuItem key="lang-id" onClick={() => setLanguage('id')}>
                ID
              </DropdownMenuItem>

              <DropdownMenuItem key="lang-en" onClick={() => setLanguage('en')}>
                EN
              </DropdownMenuItem>
            </span>
          </DropdownMenuContent>
          <DropdownMenuTrigger className="flex h-fit w-16 min-w-fit items-center justify-center">
            <div className="flex cursor-pointer items-center gap-2">
              <span>{language.toUpperCase()}</span>
              <ChevronDown />
            </div>
          </DropdownMenuTrigger>
        </DropdownMenu>
      </div>

      <MoonIcon className="text-xs text-slate-400" />
    </nav>
  );
};

export default Navbar;
