import { UserButton } from "@clerk/nextjs";

import { getAPILimitCount } from "@/lib/api-limit";
import MobileSidebar from "./mobile-sidebar";

const Navbar = async () => {
  const apiLimitCount = await getAPILimitCount();

  return (
    <div className=" flex items-center p-4">
      <MobileSidebar apiLimitCount={apiLimitCount} />
      <div className="flex w-full justify-end">
        <UserButton afterSignOutUrl="/" />
      </div>
    </div>
  );
};

export default Navbar;
