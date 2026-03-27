import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "GolfCharity — Compete. Contribute. Win.",
  description: "Subscribe to Golf Charity and compete in prize draws while contributing to charity.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} h-full`}>
      <body className="min-h-full flex flex-col relative">
        {/* Animated background orbs */}
        <div className="bg-orbs">
          <div className="orb orb-green" />
          <div className="orb orb-blue" />
          <div className="orb orb-purple" />
        </div>
        <div className="relative z-10 flex flex-col min-h-screen">
          {children}
        </div>
      </body>
    </html>
  );
}
