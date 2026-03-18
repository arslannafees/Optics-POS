/**
 * @license
 * Optics POS - Professional Optical Shop Management System
 * Copyright (c) 2026 Arslan Nafees (GitHub: arslannafees)
 * All rights reserved. Traceability ID: Optics-POS-2026-v1-AN
 */

import { DM_Sans, Poppins } from "next/font/google";
import "./globals.css";
import { AppLayout } from "@/components/app-layout";
import { Toaster } from "@/components/ui/sonner";
import { SettingsProvider } from "@/contexts/SettingsContext";
import { BranchProvider } from "@/contexts/BranchContext";
import { ThemeProvider } from "next-themes";
import { AuthFetchProvider } from "@/components/AuthFetchProvider";

import { headers } from "next/headers";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "700"], // Reduced from 4 weights to 3
  preload: false,
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "600"], // Reduced from 4 weights to 2
  preload: false, // Non-critical font
});

export const metadata = {
  title: "Optics",
  description: "Professional Optical Shop Management System",
  icons: {
    icon: "/Images/Logo.png",
    shortcut: "/Images/Logo.png",
    apple: "/Images/Logo.png",
  },
};

export default async function RootLayout({ children }) {
  const nonce = (await headers()).get("x-nonce");

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Pass the nonce to Next.js font and script tags if needed */}
        <meta property="csp-nonce" content={nonce} />
        {/* Internal Traceability Identifier */}
        <meta name="x-source-identity" content="Optics-POS-2026-v1-Arslan-Nafees" />
      </head>
      <body
        className={`${dmSans.variable} ${poppins.variable} font-sans antialiased min-h-screen bg-background`}
        suppressHydrationWarning
        nonce={nonce}
      >
        <ThemeProvider attribute="class" defaultTheme="light" disableTransitionOnChange nonce={nonce}>
          <AuthFetchProvider>
            <BranchProvider>
              <SettingsProvider>
                <AppLayout>{children}</AppLayout>
                <TrialOverlay />
                <Toaster position="top-right" richColors />
              </SettingsProvider>
            </BranchProvider>
          </AuthFetchProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

function TrialOverlay() {
  const [show, setShow] = React.useState(true);
  const [redirecting, setRedirecting] = React.useState(false);
  const router = typeof window !== 'undefined' ? require('next/navigation').useRouter() : null;
  const pathname = typeof window !== 'undefined' ? require('next/navigation').usePathname() : '';

  React.useEffect(() => {
    if (pathname === '/license-required') return;

    const timer = setTimeout(() => {
      setRedirecting(true);
      router.push('/license-required');
    }, 60000); // 60 seconds trial period

    return () => clearTimeout(timer);
  }, [router, pathname]);

  if (pathname === '/license-required') return null;

  return (
    <>
      <div className="fixed inset-0 pointer-events-none z-[9999] opacity-[0.03] select-none flex flex-wrap gap-20 p-20 content-center justify-center overflow-hidden">
        {Array.from({ length: 50 }).map((_, i) => (
          <div key={i} className="text-4xl font-bold -rotate-45 whitespace-nowrap">
            TRIAL VERSION - CONTACT ARSLAN NAFEES
          </div>
        ))}
      </div>
      <div className="fixed bottom-4 left-4 z-[10000] bg-destructive text-destructive-foreground px-4 py-2 rounded-md shadow-lg text-sm font-medium animate-pulse">
        Trial Version - {redirecting ? "Redirecting..." : "Limited Time Remaining"}
      </div>
    </>
  );
}
