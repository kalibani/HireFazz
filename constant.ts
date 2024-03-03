import {
  SquareStack,
  FileText,
  Banknote,
  HandCoins,
  DollarSignIcon,
  CalendarPlus,
  HeartHandshake,
  Scale,
  ScrollText,
} from "lucide-react";

export const MAX_FREE_COUNTS = 100;

export const tools = [
  // {
  //   label: "Document Interaction",
  //   icon: FileArchiveIcon,
  //   href: "/summarizer",
  //   color: "text-pink-300",
  // },
  {
    label: "CV Screener",
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
  // {
  //   label: "History",
  //   icon: SquareStack,
  //   href: "/history",
  //   color: "text-orange-700",
  //   bgColor: "bg-orange-500/10",
  // },
  // {
  //   label: "Manage Subscription",
  //   icon: CalendarPlus,
  //   href: "/pricing",
  //   color: "text-emerald-700",
  //   bgColor: "bg-emerald-500/10",
  // },
  // {
  //   label: "Help Center",
  //   icon: HeartHandshake,
  //   href: "/help-center",
  //   color: "text-red-500",
  //   bgColor: "bg-red-500/10",
  // },
];

export const PLANS = [
  {
    name: "Basic",
    slug: "basic",
    quota: 100,
    pagesPerPdf: 5,
    price: {
      amount: 249,
      priceIds: {
        test: "",
        production: "",
      },
    },
  },
  {
    name: "Pro",
    slug: "pro",
    quota: 200,
    pagesPerPdf: 10,
    price: {
      amount: 499,
      priceIds: {
        test: "price_1OLQyVC0XsP9dATYpzHIpjAe",
        production: "",
      },
    },
  },
  {
    name: "Premium",
    slug: "premium",
    quota: 500,
    pagesPerPdf: 25,
    price: {
      amount: 999,
      priceIds: {
        test: "price_1OLQyVC0XsP9dATYpzHIpjAe",
        production: "",
      },
    },
  },
];

export enum productName {
  documentInteraction,
  speechSynthesis,
  dubbing,
  instantVoiceCloning,
  advanceVoiceCloning,
}

export const cVAnalyzerPrompt = `
Below is what we are looking for:

You have 5+ years of experience building React-based web applications at scale
You have significant experience with relevant web technologies (React, Javascript, Typescript, CSS)
You have a deep understanding of modern web architecture and server-side rendering You have built and maintained complex, highly interactive frontend UI
You have excellent frontend debugging skills, and a deep understanding of how to build and optimize for performance
You have strong communication skills and the ability to work well cross-functionally
You have strong product and design sensibilities and enjoy perfecting the details that matter most to users Bonus: You have direct experience with a customer facing Next.js applications

Instructions:
You have to calculate how much is the percentage of this cv match with our requirements. The answer must be on a json format, for example: 
{
  documentsOwner: 'full name of the owner',
  matchedPercentage: '70%',
  reason: 'reason of the match percentage' 
}
Please note that you don’t need to explain every point at the beginning, just answer with the json!
`;

export const matchLimit = 50;
export const subscriptionTypes = ["BASIC", "PRO", "PREMIUM"];
