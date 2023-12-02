import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import ModalProvider from "@/components/modal-provider";
import { ToasterProvider } from "@/components/toasterProvider";
import Providers from "@/components/Providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Genio",
  description: "Image, Video, Music and Code Generation. 100% Free",
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
