"use client";

import { useEffect, useState } from "react";
import { Menu } from "lucide-react";
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import Sidebar from "./sidebar";

type MobileSidebarProps = {
  apiLimitCount: number;
  subscriptionType: string;
};

const MobileSidebar = ({
  apiLimitCount = 0,
  subscriptionType,
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
        />
      </SheetContent>
    </Sheet>
  );
};

export default MobileSidebar;
