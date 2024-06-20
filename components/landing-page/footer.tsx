import React from 'react';
import { WrapperSection } from '@/components/landing-page';
import { cn } from '@/lib/utils';
import logo from '@/public/BerryLabs.png';
import call from '@/public/icon/call.svg';
import location from '@/public/icon/location.svg';
import email from '@/public/icon/email.svg';
import facebook from '@/public/icon/facebook.svg';
import twitter from '@/public/icon/twitter.svg';
import linkedin from '@/public/icon/linkedin.svg';
import instagram from '@/public/icon/instagram.svg';
import Image from 'next/image';
import Link from 'next/link';

const social = [
  { id: 1, icon: facebook },
  { id: 2, icon: twitter },
  { id: 3, icon: linkedin },
  { id: 4, icon: instagram },
];

const footerContent = [
  {
    id: 1,
    title: 'pages',
    content: [
      { title: 'Home', href: '/', icon: '' },
      { title: 'Pricing', href: '/', icon: '' },
      { title: 'Solution', href: '/', icon: '' },
      { title: 'Demo', href: '/', icon: '' },
    ],
  },
  {
    id: 2,
    title: 'service',
    content: [
      { title: 'CV Screening', href: '/', icon: '' },
      { title: 'Bank statement', href: '/', icon: '' },
      { title: 'Invoice Analyzer', href: '/', icon: '' },
      { title: 'Regulatory Auditor', href: '/', icon: '' },
    ],
  },
  {
    id: 3,
    title: 'contact',
    content: [
      { title: '+6282126753060', href: '/', icon: call },
      { title: 'contact@berrytrada.com', href: '/', icon: email },
      { title: 'Bandung, Indonesia', href: '/', icon: location },
    ],
  },
];

const Footer = () => {
  return (
    <footer className="bg-[#F9FAFB]">
      <WrapperSection className="px-4 py-6 md:px-16">
        <div className="grid grid-cols-1 gap-x-10 gap-y-10 lg:grid-cols-2">
          <div className="flex flex-col items-start justify-start gap-y-7">
            <Link href="/" className="flex items-center gap-x-2">
              <div className="flex w-10 items-center justify-center">
                <Image alt="Logo" src={logo} className="ring-0" quality={50} />
              </div>
              <h1 className={cn('text-lg text-slate-950')}>BerryLabs.io</h1>
            </Link>
            <p className="text-sm text-second-text">
              Unlocking the power of AI precision, we revolutionize the way
              businesses operate. Our innovative solution automates repetitive
              tasks, saving valuable time and boosting productivity.{' '}
            </p>
            <div className="flex items-center gap-x-2">
              {social.map((item) => (
                <Image src={item.icon} alt="icon" key={item.id} />
              ))}
            </div>
          </div>
          <div className="grid gap-x-4 gap-y-4 sm:auto-cols-auto sm:grid-flow-col sm:gap-y-0">
            {footerContent.map((footer) => (
              <div className="flex flex-col md:min-w-[100px]" key={footer.id}>
                <h5 className="mb-4 text-lg font-bold sm:mb-9">
                  {footer.title}
                </h5>
                <div className="space-y-3">
                  {footer.content.map((content, index) => (
                    <div className="flex gap-x-2" key={index}>
                      {footer.title === 'contact' && (
                        <Image alt="icon" src={content.icon} />
                      )}
                      <p className="text-sm">{content.title}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </WrapperSection>
    </footer>
  );
};

export default Footer;
