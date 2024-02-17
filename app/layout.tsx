import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import ModalProvider from "@/components/modal-provider";
import { ToasterProvider } from "@/components/toasterProvider";
import Providers from "@/components/Providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "BerryLabs - Document Analyzer & Generative Voice AI",
  description:
    "Revolutionizing CV Analyzer, get the match CV percentage within seconds. Convert text to speech online for free with AI voice generator. Create natural AI voices instantly in any language.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <Providers>
        <html lang="en">
          <head>
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
    </ClerkProvider>
  );
}
