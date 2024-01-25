"use client";
import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Montserrat } from "next/font/google";
import {
  Code,
  ImageIcon,
  LayoutDashboard,
  MessageSquare,
  Music,
  Settings,
  FlaskConical,
  VideoIcon,
  FileArchiveIcon,
  DollarSignIcon,
  SquareStack,
  AudioLines,
  HeartHandshake,
  Heart,
} from "lucide-react";

import { cn } from "@/lib/utils";
import FreeCounter from "./free-counter";
import { useProModal } from "@/hooks/use-pro-modal";
import { useUser } from "@/hooks/use-user";

const poppins = Montserrat({
  weight: "600",
  subsets: ["latin"],
});

const routes = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    href: "/dashboard",
    color: "text-sky-500",
  },
  {
    label: "Document Interaction",
    icon: FileArchiveIcon,
    href: "/summarizer",
    color: "text-pink-300",
  },
  {
    label: "Speech Synthesis",
    icon: AudioLines,
    href: "/speech-synthesis",
    color: "text-violet-500",
    bgColor: "bg-violet-500/10",
  },
  {
    label: "Voice Labs",
    icon: FlaskConical,
    href: "/labs",
    color: "text-pink-700",
  },
  {
    label: "History",
    icon: SquareStack,
    href: "/history",
    color: "text-orange-700",
  },
  // {
  //   label: "Music Generation",
  //   icon: Music,
  //   href: "/music",
  //   color: "text-emerald-500",
  // },
  // {
  //   label: "Code Generation",
  //   icon: Code,
  //   href: "/code",
  //   color: "text-green-700",
  // },
  {
    label: "Manage Subscription",
    icon: DollarSignIcon,
    href: "/pricing",
    color: "text-emerald-500",
  },
  {
    label: "Help Center",
    icon: HeartHandshake,
    href: "/help-center",
    color: "text-red-500",
  },
];

type sidebarProps = {
  apiLimitCount: number;
  subscriptionType: string;
};

const Sidebar = ({ apiLimitCount = 0, subscriptionType }: sidebarProps) => {
  const pathname = usePathname();
  const { setApiLimit } = useProModal();
  const { setSubscriptionType } = useUser();

  useEffect(() => {
    setApiLimit(apiLimitCount);
  }, [apiLimitCount]);

  useEffect(() => {
    setSubscriptionType(subscriptionType);
  }, [subscriptionType]);
  return (
    <div className="space-y-4 py-4 flex flex-col h-full bg-[#111827] text-white">
      <div className="px-3 py-2 flex-1">
        <Link href="/dashboard" className="flex items-center pl-3 mb-14">
          <div className="relative h-12 w-16 mr-4">
            <Image fill alt="Logo" src="/BerryLabs.png" />
          </div>
          <h1 className={cn("text-2xl font-bold", poppins.className)}>
            BerryLabs
          </h1>
        </Link>
        <div className="space-y-1">
          {routes.map((route) => (
            <Link
              href={route.href}
              key={route.href}
              className={cn(
                "text-sm group flex p-3 w-full font-medium cursor-pointer hover:text-white hover:bg-white/10 rounded-lg transition",
                pathname === route.href
                  ? "text-white bg-white/10"
                  : "text-zinc-400"
              )}
            >
              <div className="flex items-center flex-1">
                <route.icon className={cn(" h-5 w-5 mr-3", route?.color)} />
                {route.label}
              </div>
            </Link>
          ))}
        </div>
      </div>
      {subscriptionType !== "PREMIUM" ? (
        <FreeCounter apiLimitCount={apiLimitCount} />
      ) : null}
      <hr className="h-px bg-white/10 border-0 " />
      <span className="flex px-3 py-1 items-center">
        <span className="text-zinc-400 mr-2 text-sm">
          Powered by: IIElevenLabs
        </span>
        <Heart className="h-4 w-4 text-red-700" />
      </span>
    </div>
  );
};

export default Sidebar;
