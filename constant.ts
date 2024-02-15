import {
  FileArchiveIcon,
  AudioLines,
  FlaskConical,
  SquareStack,
  FileText,
} from "lucide-react";

export const MAX_FREE_COUNTS = 25;

export const tools = [
  // {
  //   label: "Document Interaction",
  //   icon: FileArchiveIcon,
  //   href: "/summarizer",
  //   color: "text-pink-300",
  // },
  {
    label: "CV Analyzer",
    icon: FileText,
    href: "/cv-analyzer",
    color: "text-blue-500",
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
  matchPercentage: '70%',
  reason: 'reason of the match percentage' 
}
Please note that you don’t need to explain every point at the beginning, just answer with the json!
`;

export const matchLimit = 50;
