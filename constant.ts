import {
  FileArchiveIcon,
  AudioLines,
  FlaskConical,
  SquareStack,
} from "lucide-react";

export const MAX_FREE_COUNTS = 5;

export const tools = [
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
    name: "Pay as You Go",
    slug: "Pay as You Go",
    quota: 10,
    pagesPerPdf: 5,
    price: {
      amount: 19000,
      priceIds: {
        test: "",
        production: "",
      },
    },
  },
  {
    name: "Premium",
    slug: "premium",
    quota: 30,
    pagesPerPdf: 25,
    price: {
      amount: 499,
      priceIds: {
        test: "price_1OLQyVC0XsP9dATYpzHIpjAe",
        production: "",
      },
    },
  },
  // {
  //   name: "Premium",
  //   slug: "premium",
  //   quota: 150,
  //   pagesPerPdf: 25,
  //   price: {
  //     amount: 20,
  //     priceIds: {
  //       test: "price_1OLQyVC0XsP9dATYpzHIpjAe",
  //       production: "",
  //     },
  //   },
  // },
];

export enum productName {
  documentInteraction,
  speechSynthesis,
  dubbing,
  instantVoiceCloning,
  advanceVoiceCloning,
}
