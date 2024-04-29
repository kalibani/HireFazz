'use client';
import { UserButton } from '@/components/auth';
import { useCurrentUser } from '@/hooks/use-current-user';
import { ChevronDown, MoonIcon } from 'lucide-react';
import { FC, ReactElement } from 'react';

const Navbar = () => {
  return (
    <div className="flex items-center justify-between border-b border-l bg-white px-3 py-2">
      <p className="w-full text-sm font-normal">{currentDate}</p>
      <div className="flex w-full justify-end">
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
