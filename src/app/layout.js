import { DM_Sans, Poppins } from "next/font/google";
import "./globals.css";
import { AppLayout } from "@/components/app-layout";
import { Toaster } from "@/components/ui/sonner";
import { SettingsProvider } from "@/contexts/SettingsContext";


import { BranchProvider } from "@/contexts/BranchContext";


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

export const metadata = {
  title: {
    template: "%s | Optics",
    default: "Optics",
  },
  description: "Professional Optical Shop Management System",
};

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
