'use client';

import { useCurrentUser } from '@/hooks/use-current-user';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { ExitIcon } from '@radix-ui/react-icons';
import { UsersRound } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { logout } from './logout';
import { Loader } from '../share';
import { useState } from 'react';

const UserButton = () => {
  const router = useRouter();
  const user = useCurrentUser();
  const [loading, setLoading] = useState(false);
  const onClick = () => {
    setLoading(true);
    logout()
      .then(() => {
        router.push('/auth/login');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <>
      {loading && (
        <div className="fles fixed left-0 top-0 z-10 h-screen w-screen items-center justify-center bg-black/50">
          <Loader />
        </div>
      )}
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Avatar className="rounded-full p-1 focus-visible:ring-0">
            <AvatarImage className="rounded-full" src={user?.image || ''} />
            <AvatarFallback className="bg-sky-500">
              <UsersRound className="text-white" />
            </AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-40" align="end">
          <span onClick={onClick} className="cursor-pointer">
            <DropdownMenuItem>
              <ExitIcon className="mr-2 h-4 w-4" />
              Logout
            </DropdownMenuItem>
          </span>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default UserButton;
