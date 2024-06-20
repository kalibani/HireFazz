import screening from '@/public/image/screening.png';
import custome from '@/public/image/custom.png';
import collaborative from '@/public/image/collaborative.png';
import dataDriven from '@/public/image/dataDriven.png';
import timeCost from '@/public/image/timeCost.png';
import jobAdv from '@/public/image/job-adv.png';
import automated from '@/public/image/automated.png';
import mass from '@/public/image/mass.png';
import team from '@/public/image/team.png';
import insight from '@/public/image/insight.png';

export const MAX_FREE_COUNTS = 100;

export const LINK_TEMPLATE_CSV =
  'https://utfs.io/f/77d6ec9e-d673-418c-bdfc-1b630ae4271c-1v55sg.csv';

export const PER_PAGE_ITEMS = ['10', '20', '50', '100'];

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
    price: '',
    desc: 'core features',
    jobs: 'AI-Powered Job Creation',
    files: 'AI-Powered CV Screening',
    benef: [
      'Job Publication',
      'Team Member',
      'CV Upload',
      'File size limit',
      'ATS / Job Platform Integration',
      'Contacting Multiple Candidates',
      'High-accuracy Responses',
      'Insight',
      'Multi Organization',
      'Priority support',
    ],
    pagesFile: 'Page per File',
  },
  {
    id: 2,
    jobs: '100',
    title: 'free',
    desc: 'Ideal for Starter',
    files: '100',
    price: 0,
    benef: [
      'Up to 5 Jobs',
      '5',
      'Up to 100 Cvs',
      '4MB',
      'check',
      'check',
      'check',
      'uncheck',
      'uncheck',
      'uncheck',
    ],
  },
  {
    id: 3,
    title: 'basic',
    jobs: 'Unlimited',
    desc: 'Great for Small Businesses',
    files: '250',
    price: 299000,
    benef: [
      'Up to 50 Jobs',
      'Unlimited',
      'Up to 250 Cvs',
      '4MB',
      'check',
      'check',
      'check',
      'check',
      'check',
      'check',
    ],
  },
  {
    id: 4,
    title: 'pro',
    jobs: 'Unlimited',
    pagesFile: '10',
    price: 590000,
    desc: 'Perfect for Professional',
    files: '500',
    benef: [
      'Up to 100 Jobs',
      'Unlimited',
      'Up to 500 Cvs',
      '4MB',
      'check',
      'check',
      'check',
      'check',
      'check',
      'check',
    ],
  },
  {
    id: 5,
    pagesFile: '15',
    title: 'premium',
    price: 990000,
    desc: 'Ultimate large-scale hiring solution',
    jobs: 'Unlimited',
    files: '1000',
    benef: [
      'Unlimited',
      'Unlimited',
      'Up to 1000 Cvs',
      '16MB',
      'check',
      'check',
      'check',
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

export const components = [
  {
    id: 1,
    title: 'Recruitment',
    href: '/recruitment',
    isComingSoon: false,
    description:
      'Attract top talent, streamline hiring with AI, collaborate as a team, and make data-driven decisions. All on one platform.',
  },
  {
    id: 2,
    title: 'Legal',
    isComingSoon: true,
    href: '/comming',
    description: 'Navigate Contracts, Manage Compliance, Resolve Disputes',
  },
  {
    id: 3,
    isComingSoon: true,
    title: 'Finance',
    href: '/comming',
    description: 'Track, grow, manage debt, and plan your financial future',
  },
  {
    id: 4,
    isComingSoon: true,
    title: 'HR Management',
    href: '/comming',
    description: 'Simplify your HR, manage performance & payroll, etc.',
  },
];

export const contentRecruitment = [
  {
    image: jobAdv,
    id: '1',
    title: 'Job Advertisement Creation and Publication:',
    tagline: 'Easily craft and disseminate job postings to attract top talent',
    desc: 'Struggling to write captivating job ads that attract the best candidates? Look no further! Our platform empowers you to craft compelling job descriptions with ease, then seamlessly post them across top job boards. Find your perfect hire faster with our streamlined recruitment solution.',
  },
  {
    id: '2',
    image: automated,
    title: 'Automated Resume Analysis: ',
    tagline:
      'Streamline your hiring process with our advanced tool that automatically evaluates and ranks multiple candidate resumes.',
    desc: 'Forget the resume pile-up!  Our advanced AI analyzes and ranks a flood of resumes in seconds.  It dives deep, assessing candidate skills and experience against your specific job criteria.  This automated analysis delivers a shortlist of top matches, saving you time and ensuring you focus on the most qualified applicants.',
  },
  {
    id: '3',
    image: mass,
    title: 'Mass Candidate Outreach:',
    tagline:
      'Effortlessly contact numerous potential candidates with our automated communication feature.',
    desc: 'asting a wide net for top talent? Our automated outreach feature streamlines the process. Craft a personalized message once, then effortlessly reach out to a multitude of qualified candidates. Track responses, schedule interviews, and manage the entire hiring pipeline – all within a single, user-friendly platform.',
  },
  {
    id: '4',
    image: team,
    title: 'Team-Based Recruitment: ',
    tagline:
      'Enhance hiring outcomes through collaborative decision-making with our integrated team hiring tools.',
    desc: 'Ditch the siloed hiring process!  Empower your team to collaborate seamlessly with our integrated tools.  Recruiters, hiring managers, and team members can share candidate profiles, provide feedback, and collectively make informed hiring decisions. This fosters a transparent and efficient process, ensuring you land the perfect fit for every role.',
  },
  {
    id: '5',
    image: insight,
    title: 'Mass Candidate Outreach:',
    tagline:
      'Make informed hiring decisions with actionable data and analytics tailored to your recruitment needs.',
    desc: 'Beyond just filling positions, unlock the power of data-driven recruitment! Gain valuable insights into your hiring process with our comprehensive analytics suite. Track key metrics, identify trends in candidate pools, and tailor your strategies for maximum impact. Make informed decisions backed by real data, ensuring you build a high-performing team that drives your business forward.',
  },
];
