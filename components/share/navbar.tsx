import { orgList } from '@/lib/actions/user/orgList';
import { ChevronDown, MoonIcon } from 'lucide-react';
import ActionTokenOrgs from '../navbar/action-roken-orgs';

const Navbar = async () => {
  // const orgId = params.orgId || '';
  const orgs = await orgList();
  console.log(orgs, '<<<<<<<<<<<');
  return (
    <nav className="fixed z-10 flex w-full items-center justify-between gap-x-4 border-b bg-white px-3 py-[7.5px] pl-[90px]">
      <span className="flex-1 text-sm font-medium">{currentDate}</span>
      {/* {!!data && (
        <Badge className="text-xs opacity-90">
          {data?.availableTokens || 0} tokens
        </Badge>
      )} */}
      <ActionTokenOrgs orgs={orgs} />
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
