import "./globals.css";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
import type { Metadata } from "next";
import Footer from "../components/layout/footer";
import NavTabs from "../components/layout/nav-tabs";
import { ThemeProvider } from "../components/theme-provider";
import { cn } from "@/utils/cn";

const fontSans = GeistSans;
const fontMono = GeistMono;

export const metadata: Metadata = {
  title: "Open DeFi - Token Info",
  description: "Open DeFi is a platform for discovering and exploring DeFi projects.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={cn("min-h-screen bg-background font-sans antialiased", fontSans.variable, fontMono.variable)}>
        <ThemeProvider attribute="class" defaultTheme="light" disableTransitionOnChange>
          <NavTabs />
          {children}
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
