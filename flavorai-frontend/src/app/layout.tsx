import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import HideNavWrapper from '../../components/HideNavWrapper';

export const metadata: Metadata = {
  title: "FlavorAI",
  description: "AI-powered recipe discovery platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="uk">
      <body className="antialiased">
        <HideNavWrapper>{children}</HideNavWrapper>
      </body>
    </html>
  );
}
