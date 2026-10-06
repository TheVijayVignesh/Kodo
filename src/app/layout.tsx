import type { Metadata } from "next";
import { Spectral, Inter_Tight, JetBrains_Mono, Noto_Serif_JP } from "next/font/google";
import "./globals.css";
import { SakuraLayer } from "@/components/visuals/SakuraLayer";
import { AmbientBackdrop } from "@/components/visuals/AmbientBackdrop";
import { SiteNav } from "@/components/nav/SiteNav";
import { ThemeScript } from "@/components/system/ThemeScript";
import { AccountSync } from "@/components/account/AccountSync";
import { ClerkProvider } from "@clerk/nextjs";
import { ClerkAccountButton } from "@/components/account/ClerkAccountButton";
import { ClerkAccountSync } from "@/components/account/ClerkAccountSync";
import type { ReactNode } from "react";

const clerkConfigured = Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY && process.env.CLERK_SECRET_KEY);

function AppFrame({ children }: { children: ReactNode }) {
  const content = (
    <>
      <SakuraLayer />
      <AmbientBackdrop />
      <div className="relative z-10 flex min-h-screen flex-col">
        <SiteNav accountControl={clerkConfigured ? <ClerkAccountButton /> : undefined} />
        {clerkConfigured ? <ClerkAccountSync /> : <AccountSync />}
        <main className="flex-1">{children}</main>
      </div>
    </>
  );
  return clerkConfigured ? <ClerkProvider>{content}</ClerkProvider> : content;
}

const display = Spectral({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

const sans = Inter_Tight({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const mono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

const jp = Noto_Serif_JP({
  variable: "--font-jp",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

const serifJp = Noto_Serif_JP({
  variable: "--font-serif-jp",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Kōdo — Web Technologies Learning Studio",
  description:
    "An interactive learning environment for CS3005 Web Technologies. HTML, CSS, JavaScript, DOM, AJAX, and React taught through real code, real checkers, and a calm Japanese editorial aesthetic.",
  applicationName: "Kōdo",
  authors: [{ name: "Kōdo Studio" }],
  keywords: [
    "Web Technologies",
    "HTML",
    "CSS",
    "JavaScript",
    "DOM",
    "AJAX",
    "React",
    "interactive learning",
    "coding playground",
    "CS3005",
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${sans.variable} ${mono.variable} ${jp.variable} ${serifJp.variable} antialiased`}
      suppressHydrationWarning
    >
      <head>
        <ThemeScript />
        <link rel="stylesheet" href="/kodo/sakura.min.css" />
      </head>
      <body className="min-h-screen relative"><AppFrame>{children}</AppFrame></body>
    </html>
  );
}
