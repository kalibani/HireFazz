import { getUser } from '@/lib/api-limit';
import MobileSidebar from './mobile-sidebar';
import { currentUser } from '@/lib/auth';
import { UserButton } from '@/components/auth';

const Navbar = async () => {
  const user = await currentUser();
  const { count, subscriptionType, isUserAgreedTermsOfService, maxFreeCount } =
    await getUser(user?.id!);
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
