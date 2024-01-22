import { UserButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs";
import { getUser } from "@/lib/api-limit";
import MobileSidebar from "./mobile-sidebar";

const Navbar = async () => {
  const { userId } = auth();
  const { count, subscriptionType } = await getUser(userId!);
  return (
    <div className=" flex items-center p-4">
      <MobileSidebar
        apiLimitCount={count}
        subscriptionType={subscriptionType}
      />
      <div className="flex w-full justify-end">
        <UserButton afterSignOutUrl="/" />
      </div>
    </div>
  );
};

export default Navbar;
