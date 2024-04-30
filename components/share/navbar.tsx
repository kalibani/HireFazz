'use client';
import { UserButton } from '@/components/auth';
import { useCurrentUser } from '@/hooks/use-current-user';
import { ChevronDown, MoonIcon } from 'lucide-react';
import { FC, ReactElement } from 'react';

const Navbar = () => {
  const user = useCurrentUser();
  return (
    <div className="flex items-center justify-between gap-x-4 border-b border-l bg-white px-3 py-2">
      <span className="w-full text-sm font-medium">{currentDate}</span>
      <div className="flex h-fit w-1/6 min-w-fit items-center justify-end rounded-xl bg-slate-100 px-3">
        {user && (
          <span className="w-full text-sm font-normal">{user.name}</span>
        )}
        <UserButton />
        <ChevronDown />
      </div>

      <div className="flex items-center gap-x-1 text-xs text-slate-400">
        <ChevronDown size="16" />
        <span>EN</span>
      </div>

      <MoonIcon className="text-xs text-slate-400" />
    </div>
  );
};

export default Navbar;

const currentDate = new Date().toLocaleDateString('en-US', {
  weekday: 'long',
  month: 'long',
  day: 'numeric',
  year: 'numeric',
});
