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
} from 'lucide-react';
import screening from '@/public/image/screening.png';
import custome from '@/public/image/custom.png';
import collaborative from '@/public/image/collaborative.png';
import dataDriven from '@/public/image/dataDriven.png';
import timeCost from '@/public/image/timeCost.png';

export const MAX_FREE_COUNTS = 100;

export const tools = [
  // {
  //   label: "Document Interaction",
  //   icon: FileArchiveIcon,
  //   href: "/summarizer",
  //   color: "text-pink-300",
  // },
  {
    label: 'CV Screener',
    icon: FileText,
    href: '/cv-scanner',
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10',
  },
  // {
  //   label: "Speech Synthesis",
  //   icon: AudioLines,
  //   href: "/speech-synthesis",
  //   color: "text-violet-500",
  //   bgColor: "bg-violet-500/10",
  // },
  {
    label: 'Bank Statement Analyzer',
    icon: Banknote,
    href: '/bank-statement-analyzer',
    color: 'text-pink-500',
    bgColor: 'bg-pink-500/10',
  },
  {
    label: 'Invoice Reviewer',
    icon: HandCoins,
    href: '/invoice-reviewer',
    color: 'text-purple-500',
    bgColor: 'bg-purple-500/10',
  },
  {
    label: 'Loan Application Processor',
    icon: DollarSignIcon,
    href: '/loan-application-processor',
    color: 'text-green-500',
    bgColor: 'bg-green-500/10',
  },
  {
    label: 'Regulatory Auditor',
    icon: Scale,
    href: '/regulatory-auditor',
    color: 'text-yellow-500',
    bgColor: 'bg-yellow-500/10',
  },
  {
    label: 'Contract Checker',
    icon: ScrollText,
    href: '/contract-checker',
    color: 'text-teal-500',
    bgColor: 'bg-teal-500/10',
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
    name: 'Basic',
    slug: 'basic',
    quota: 100,
    pagesPerPdf: 5,
    price: {
      amount: 249,
      priceIds: {
        test: '',
        production: '',
      },
    },
  },
  {
    name: 'Pro',
    slug: 'pro',
    quota: 200,
    pagesPerPdf: 10,
    price: {
      amount: 499,
      priceIds: {
        test: 'price_1OLQyVC0XsP9dATYpzHIpjAe',
        production: '',
      },
    },
  },
  {
    name: 'Premium',
    slug: 'premium',
    quota: 500,
    pagesPerPdf: 25,
    price: {
      amount: 999,
      priceIds: {
        test: 'price_1OLQyVC0XsP9dATYpzHIpjAe',
        production: '',
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
export const subscriptionTypes = ['BASIC', 'PRO', 'PREMIUM'];

export const discoverContent = [
  {
    title: 'Without Berrylabs',
    desc: '<b>Manually</b> reviewing each resume takes a significant amount of time, especially for high-volume positions. This can take away from other crucial tasks like interviewing and onboarding.',
  },
  {
    title: 'Information overload',
    desc: ' With a large number of applicants, it is easy to get overwhelmed and <b>miss out</b> on qualified candidates who might not have the most flashy resume.',
  },
  {
    title: 'Inconsistent evaluation',
    desc: ' Resumes can be formatted differently, making it difficult to compare applicants on a level playing field. Relying solely on gut instinct can also <b>lead to bias.</b>',
  },
  {
    title: 'Missed opportunities',
    desc: '  Qualified candidates might <b>get lost</b> in the shuffle, especially those lacking specific keywords or a traditional career path.',
  },
];

export const discoverContentRight = [
  {
    title: 'Save time with automations.',
    desc: '<b>Save time</b> with our automated CV screening tool. Our app uses advanced technology to quickly filter and review candidates based on specific criteria. Streamline your recruitment process and focus other important tasks. Try our tool today and simplify your hiring process.',
  },
  {
    title: 'Speedy Task Workflow',
    desc: 'Buried in resumes? AI cuts through <b>100 CVs in 20 minutes</b>, matching skills to jobs faster and leaving you time to focus on top talent.',
  },
  {
    title: 'Quality Candidates',
    desc: 'Drowning in resumes? Ditch the doubt! AI scores each CV against your <b>perfect</b> candidate profile, revealing exact skill & experience matches. Focus on top talent, not endless screening.',
  },
  {
    title: 'Efficient as One Click',
    desc: 'Streamline your workflow!  One account lets you invite both clients and collaborators, fostering seamless <b>teamwork</b> on every project. No more juggling logins - just effortless collaboration from start to finish.',
  },
];

export const pricing = [
  {
    id: 1,
    title: 'core features',
    price: 'core features',
    qty: 'core features',
    desc: 'core features',
    files: 'Files Included',
    generate: 'Free Generations',
    benef: [
      'Files per Upload',
      'Page per File',
      'File size limit',
      'High-accuracy responses',
      'Mobile-friendly interface',
      'Priority support',
    ],
    pagesFile: 'Page per File',
  },
  {
    id: 2,
    generate: '100',
    title: 'free',
    desc: 'Suitable for Starter',
    files: '100',
    price: 'IDR 0',
    benef: [
      'Up to 25 Files',
      '2 pages per File',
      '4MB',
      'check',
      'check',
      'uncheck',
    ],
  },
  {
    id: 3,
    title: 'basic',
    generate: '100',
    desc: 'Suitable for Starter',
    files: '250',
    price: 'IDR 299.000',
    benef: [
      'Up to 50 Files',
      '5 pages per File',
      '4MB',
      'check',
      'uncheck',
      'check',
    ],
  },
  {
    id: 4,
    title: 'pro',
    generate: '100',
    pagesFile: '10',
    price: 'IDR 590.000',
    desc: 'Suitable for Starter',
    files: '500',
    benef: [
      'Up to 100 Files',
      '10 pages per File',
      '4MB',
      'check',
      'check',
      'check',
    ],
  },
  {
    id: 5,
    pagesFile: '15',
    title: 'premium',
    price: 'IDR 990.000',
    desc: 'Suitable for Starter',
    generate: '100',
    files: '1000',
    benef: [
      'Up to 150 Files',
      '15 pages per File',
      '16MB',
      'check',
      'check',
      'check',
    ],
  },
];

export const unlockContent = [
  {
    title: 'Screening CV Automation',
    desc: 'Screening CV automation refers to the use of technology, such as artificial intelligence or machine learning, to streamline the process of reviewing job applications and resumes. By automating this task, employers can quickly and efficiently filter through large volumes of candidates, saving time and resources in the recruitment process.',
    image: screening,
  },
  {
    title: 'Customizable CV criteria',
    desc: 'Customizable CV criteria refers to the ability to tailor the specific requirements, qualifications, skills, and experiences that are considered important when screening or evaluating job applicants resumes. By customizing CV criteria, employers can more effectively filter through applicants and identify the most suitable candidates for the job.',
    image: custome,
  },
  {
    title: 'Collaborative hiring',
    desc: 'Collaborative hiring is when multiple people or teams work together to  make hiring decisions. It involves getting input from different  perspectives to find the best candidates for a job. This approach helps  to promote teamwork and diversity in the hiring process.',
    image: collaborative,
  },
  {
    title: 'Data-Driven Insights',
    desc: 'Data-driven insights are valuable information that we can learn from  analyzing data. By studying large amounts of data using special  techniques, we can discover patterns, trends, and important connections.  These insights help organizations make better decisions and improve  their strategies.',
    image: dataDriven,
  },
  {
    title: 'Time and Cost Efficiency',
    desc: "Time and cost efficiency simply means doing things in the most  effective and affordable way possible. It's about finding ways to save  time and money while still getting good results. This could include  things like finding ways to work more efficiently, using technology to  automate tasks, or finding more affordable options for resources or  services.",
    image: timeCost,
  },
];
