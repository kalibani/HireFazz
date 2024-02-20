"use client";

import { useEffect, useState } from "react";
import { Menu } from "lucide-react";
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import Sidebar from "./sidebar";

type MobileSidebarProps = {
  apiLimitCount: number;
  subscriptionType: string;
  isUserAgreedTermsOfService: boolean;
  maxFreeCount: number | null;
};

const MobileSidebar = ({
  apiLimitCount = 0,
  subscriptionType,
  isUserAgreedTermsOfService,
  maxFreeCount,
}: MobileSidebarProps) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }
  return (
    <Sheet>
      <SheetTrigger>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0">
        <Sidebar
          apiLimitCount={apiLimitCount}
          subscriptionType={subscriptionType}
          isUserAgreedTermsOfService={isUserAgreedTermsOfService}
          maxFreeCount={maxFreeCount}
        />
      </SheetContent>
    </Sheet>
  );
};

export default MobileSidebar;
