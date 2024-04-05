import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import ModalProvider from '@/components/modal-provider';
import { ToasterProvider } from '@/components/toasterProvider';
import Providers from '@/components/Providers';
import { SessionProvider } from 'next-auth/react';
import { auth } from '@/auth';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'BerryLabs - AI-Powered Solutions, Human-Centered Results',
  description:
    'BerryLabs harnesses the power of artificial intelligence to revolutionize your document handling processes. Our platform offers a suite of tools designed to automate and optimize your repetitive tasks, from scanning CVs and analyzing bank statements to reviewing contracts and ensuring regulatory compliance. Transform your business operations with BerryLabs and make data-driven decisions faster and more accurately.',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  return (
    <SessionProvider session={session}>
      <Providers>
        <html lang="en">
          <head>
            <meta
              name="keywords"
              content="AI-powered CV scanner,
              Automated bank statement analysis,
              AI contract review tool,
              Compliance and regulatory AI software,
              Invoice processing automation,
              Financial document analysis AI,
              AI for HR and finance,
              Automated document scanning,
              Regulatory compliance automation."
            />
            <link rel="icon" href="/BerryLabs.png" type="image/png" />
            <link
              rel="apple-touch-icon"
              href="/BerryLabs.png"
              type="image/png"
            />
          </head>
          <body className={inter.className}>
            <ToasterProvider />
            <ModalProvider />
            {children}
          </body>
        </html>
      </Providers>
    </SessionProvider>
  );
}
