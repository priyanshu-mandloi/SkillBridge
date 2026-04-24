import "./globals.css";

import { DM_Sans, Syne } from "next/font/google";

import Footer from "@/components/Footer";
import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import { ThemeProvider } from "@/components/theme-provider";

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
  weight: ["400", "500", "600", "700", "800"],
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  weight: ["300", "400", "500", "600"],
});

export const metadata: Metadata = {
  title: "SkillBridge AI — Connect. Build. Grow.",
  description:
    "AI-powered platform connecting developers with projects that match their skills.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${syne.variable} ${dmSans.variable} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange={false}
        >
          <Navbar />
          <main>{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
