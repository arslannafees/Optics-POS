import { DM_Sans, Poppins } from "next/font/google";
import "./globals.css";
import { AppLayout } from "@/components/app-layout";
import { Toaster } from "@/components/ui/sonner";
import { SettingsProvider } from "@/contexts/SettingsContext";
import { BranchProvider } from "@/contexts/BranchContext";
import { ThemeProvider } from "next-themes";


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

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Allow unsafe-eval for recharts/charting libs that use new Function() */}
        <meta
          httpEquiv="Content-Security-Policy"
          content="default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com data:; img-src 'self' data: blob:; connect-src 'self'; worker-src 'self' blob:;"
        />
      </head>
      <body
        className={`${dmSans.variable} ${poppins.variable} font-sans antialiased min-h-screen bg-background`}
        suppressHydrationWarning
      >
        <ThemeProvider attribute="class" defaultTheme="light" disableTransitionOnChange>
          <BranchProvider>
            <SettingsProvider>
              <AppLayout>{children}</AppLayout>
              <Toaster position="top-right" richColors />
            </SettingsProvider>
          </BranchProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
