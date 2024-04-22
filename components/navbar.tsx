import { getUser } from '@/lib/api-limit';
import MobileSidebar from './mobile-sidebar';
import { UserButton } from '@/components/auth';
import Sidebar from './sidebar';
import { Input } from './ui/input';

const Navbar = async () => {
  const { count, subscriptionType, isUserAgreedTermsOfService, maxFreeCount } =
    await getUser();
  const getDateNow = new Date();
  return (
    <div className="sticky top-0 ml-[2px] flex items-center bg-white p-4">
      <div className="flex w-full items-center gap-x-8">
        <span className="min-w-[140px] max-w-[200px] font-sans text-sm">
          {getDateNow.toDateString()}
        </span>
        <Input className="w-1/2" type="search" />
      </div>
      <MobileSidebar>
        <Sidebar
          apiLimitCount={count}
          subscriptionType={subscriptionType}
          isUserAgreedTermsOfService={isUserAgreedTermsOfService}
          maxFreeCount={maxFreeCount}
        />
      </MobileSidebar>
      <div className="flex w-full justify-end">
        <UserButton />
      </div>
    </div>
  );
};

export default Navbar;
