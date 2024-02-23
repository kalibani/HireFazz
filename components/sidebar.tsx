"use client";
import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Montserrat } from "next/font/google";
import {
	LayoutDashboard,
	CalendarPlus,
	SquareStack,
	HeartHandshake,
	FileText,
	Banknote,
	HandCoins,
	DollarSignIcon,
	Scale,
	ScrollText,
	History,
} from "lucide-react";

import { cn } from "@/lib/utils";
import FreeCounter from "./free-counter";
import { useProModal } from "@/hooks/use-pro-modal";
import { useUser } from "@/hooks/use-user";
import useTranslation from "next-translate/useTranslation";

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
		label: "CV Scanner",
		icon: FileText,
		href: "/cv-scanner",
		color: "text-blue-500",
		bgColor: "bg-blue-500/10",
	},
	// {
	//   label: "Speech Synthesis",
	//   icon: AudioLines,
	//   href: "/speech-synthesis",
	//   color: "text-violet-500",
	//   bgColor: "bg-violet-500/10",
	// },
	{
		label: "Bank Statement Analyzer",
		icon: Banknote,
		href: "/bank-statement-analyzer",
		color: "text-pink-500",
		bgColor: "bg-pink-500/10",
	},
	{
		label: "Invoice Reviewer",
		icon: HandCoins,
		href: "/invoice-reviewer",
		color: "text-purple-500",
		bgColor: "bg-purple-500/10",
	},
	{
		label: "Loan Application Processor",
		icon: DollarSignIcon,
		href: "/loan-application-processor",
		color: "text-green-500",
		bgColor: "bg-green-500/10",
	},
	{
		label: "Regulatory Auditor",
		icon: Scale,
		href: "/regulatory-auditor",
		color: "text-yellow-500",
		bgColor: "bg-yellow-500/10",
	},
	{
		label: "Contract Checker",
		icon: ScrollText,
		href: "/contract-checker",
		color: "text-teal-500",
		bgColor: "bg-teal-500/10",
	},
	{
		label: "History",
		icon: History,
		href: "/history",
		color: "text-orange-700",
		bgColor: "bg-orange-500/10",
	},
	{
		label: "Manage Subscription",
		icon: CalendarPlus,
		href: "/pricing",
		color: "text-emerald-700",
		bgColor: "bg-emerald-500/10",
	},
	{
		label: "Help Center",
		icon: HeartHandshake,
		href: "/help-center",
		color: "text-red-500",
		bgColor: "bg-red-500/10",
	},
];

type sidebarProps = {
	apiLimitCount: number;
	subscriptionType: string;
	maxFreeCount: number | null;
	isUserAgreedTermsOfService: boolean;
};

const Sidebar = ({
	apiLimitCount = 0,
	subscriptionType,
	maxFreeCount,
	isUserAgreedTermsOfService,
}: sidebarProps) => {
	const { lang } = useTranslation();
	const pathname = usePathname();
	const { setApiLimit } = useProModal();
	const { setMaxFreeCount, setSubscriptionType, setAgreedTermsOfService } =
		useUser();

	useEffect(() => {
		setApiLimit(apiLimitCount);
	}, [apiLimitCount]);

	useEffect(() => {
		setMaxFreeCount(maxFreeCount!);
	}, [maxFreeCount]);

	useEffect(() => {
		setSubscriptionType(subscriptionType!);
	}, [maxFreeCount]);

	useEffect(() => {
		setAgreedTermsOfService(isUserAgreedTermsOfService);
	}, [isUserAgreedTermsOfService]);

	return (
		<div className="space-y-4 py-4 flex flex-col h-full bg-[#111827] text-white">
			<div className="px-3 py-2 flex-1">
				<Link
					href={`/dashboard?lang=${lang}`}
					as={`/${lang}/dashboard`}
					className="flex items-center pl-3 mb-14">
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
							)}>
							<div className="flex items-center flex-1">
								<route.icon className={cn(" h-5 w-5 mr-3", route?.color)} />
								{route.label}
							</div>
						</Link>
					))}
				</div>
			</div>
			<FreeCounter
				apiLimitCount={apiLimitCount}
				subscriptionType={subscriptionType}
				maxFreeCount={maxFreeCount}
			/>
			{/* <hr className="h-px bg-white/10 border-0 " />
      <span className="flex px-3 py-1 items-center">
        <span className="text-zinc-400 mr-2 text-sm">
          Powered by: IIElevenLabs
        </span>
        <Heart className="h-4 w-4 text-red-700" />
      </span> */}
		</div>
	);
};

export default Sidebar;
