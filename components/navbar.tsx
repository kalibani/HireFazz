import { UserButton } from '@clerk/nextjs';
import { auth } from '@clerk/nextjs';
import { getUser } from '@/lib/api-limit';
import MobileSidebar from './mobile-sidebar';
import SelectLanguage from './select-languange';

const Navbar = async () => {
  const { userId } = auth();
  const { count, subscriptionType, isUserAgreedTermsOfService, maxFreeCount } =
    await getUser(userId!);
  return (
    <div className=" flex items-center p-4">
      <MobileSidebar
        apiLimitCount={count}
        subscriptionType={subscriptionType}
        isUserAgreedTermsOfService={isUserAgreedTermsOfService}
        maxFreeCount={maxFreeCount}
      />
      <div className="flex w-full justify-end">
        <UserButton afterSignOutUrl="/" />
        <SelectLanguage className="text-slate-900" />
      </div>
    </div>
  );
};

export default Navbar;
