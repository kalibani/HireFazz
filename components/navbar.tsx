import { getUser } from '@/lib/api-limit';
import MobileSidebar from './mobile-sidebar';
import { UserButton } from '@/components/auth';
import Sidebar from './sidebar';

const Navbar = async () => {
  const { count, subscriptionType, isUserAgreedTermsOfService, maxFreeCount } =
    await getUser();
  return (
    <div className=" flex items-center p-4">
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
