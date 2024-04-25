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
import { logout } from './logout';

const UserButton = () => {
  const user = useCurrentUser();

  const onClick = () => {
    logout();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar className="rounded-full p-1">
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
  );
};

export default UserButton;
