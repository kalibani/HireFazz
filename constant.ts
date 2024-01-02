import {
  Code,
  ImageIcon,
  MessageSquare,
  Music,
  VideoIcon,
  FileArchiveIcon,
} from "lucide-react";

export const MAX_FREE_COUNTS = 10;

export const tools = [
  {
    label: "Document Interaction",
    icon: FileArchiveIcon,
    href: "/summarizer",
    color: "text-pink-300",
  },
  {
    label: "Speech Synthesis",
    icon: MessageSquare,
    href: "/speech-synthesis",
    color: "text-violet-500",
    bgColor: "bg-violet-500/10",
  },
  // {
  //   label: "Music Generation",
  //   icon: Music,
  //   href: "/music",
  //   color: "text-emerald-500",
  //   bgColor: "bg-emerald-500/10",
  // },
  // {
  //   label: "Image Generation",
  //   icon: ImageIcon,
  //   color: "text-pink-700",
  //   bgColor: "bg-pink-700/10",
  //   href: "/image",
  // },
  // {
  //   label: "Video Generation",
  //   icon: VideoIcon,
  //   color: "text-orange-700",
  //   bgColor: "bg-orange-700/10",
  //   href: "/video",
  // },
  // {
  //   label: "Code Generation",
  //   icon: Code,
  //   color: "text-green-700",
  //   bgColor: "bg-green-700/10",
  //   href: "/code",
  // },
];

export const PLANS = [
  {
    name: "Free",
    slug: "free",
    quota: 10,
    pagesPerPdf: 5,
    price: {
      amount: 0,
      priceIds: {
        test: "",
        production: "",
      },
    },
  },
  {
    name: "Pro",
    slug: "pro",
    quota: 50,
    pagesPerPdf: 25,
    price: {
      amount: 14,
      priceIds: {
        test: "price_1OLQyVC0XsP9dATYpzHIpjAe",
        production: "",
      },
    },
  },
  {
    name: "Premium",
    slug: "premium",
    quota: 150,
    pagesPerPdf: 25,
    price: {
      amount: 20,
      priceIds: {
        test: "price_1OLQyVC0XsP9dATYpzHIpjAe",
        production: "",
      },
    },
  },
];
