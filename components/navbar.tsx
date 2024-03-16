import { getUser } from '@/lib/api-limit';
import MobileSidebar from './mobile-sidebar';
import { auth } from '@/auth';

const Navbar = async () => {
  const session = await auth();
  const { count, subscriptionType, isUserAgreedTermsOfService, maxFreeCount } =
    await getUser(session?.user?.id!);
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
        {/* <UserButton afterSignOutUrl="/" /> */}
        <p>{session?.user?.name}</p>
      </div>
    </div>
  );
};

export default Navbar;
