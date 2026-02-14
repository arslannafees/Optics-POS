import { DM_Sans, Poppins } from "next/font/google";
import "./globals.css";
import { AppLayout } from "@/components/app-layout";
import { Toaster } from "@/components/ui/sonner";
import { SettingsProvider } from "@/contexts/SettingsContext";


import { BranchProvider } from "@/contexts/BranchContext";
import getDb from "@/lib/db";


const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "700"], // Reduced from 4 weights to 3
  preload: true,
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "600"], // Reduced from 4 weights to 2
  preload: false, // Non-critical font
});

export async function generateMetadata() {
  try {
    const db = getDb();
    const setting = db.prepare("SELECT value FROM settings WHERE key = ? AND shop_id IS NULL").get("businessName");
    const appName = setting?.value || "Optics";

    return {
      title: appName,
      description: "Professional Optical Shop Management System",
      icons: {
        icon: "/Images/Logo.png",
        shortcut: "/Images/Logo.png",
        apple: "/Images/Logo.png",
      },
    };
  } catch (error) {
    return {
      title: "Optics",
      description: "Professional Optical Shop Management System",
      icons: {
        icon: "/Images/Logo.png",
        shortcut: "/Images/Logo.png",
        apple: "/Images/Logo.png",
      },
    };
  }
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${dmSans.variable} ${poppins.variable} font-sans antialiased min-h-screen bg-background`}
        suppressHydrationWarning
      >
        <BranchProvider>
          <SettingsProvider>
            <AppLayout>{children}</AppLayout>
            <Toaster position="top-right" richColors />
          </SettingsProvider>
        </BranchProvider>
      </body>
    </html>
  );
}
