import DeployButton from "@/components/deploy-button";
import { EnvVarWarning } from "@/components/env-var-warning";
import HeaderAuth from "@/components/header-auth";
import { SwitchSearchCommand } from "@/components/switch-search-modal";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { Container } from "@/components/ui/container";
import {
  Dialog,
  DialogContentSlim,
  DialogTrigger,
} from "@/components/ui/dialog";
import { hasEnvVars } from "@/utils/supabase/check-env-vars";
import { GeistSans } from "geist/font/sans";
import { ThemeProvider } from "next-themes";
import Link from "next/link";
import "./globals.css";
import { SiteHeader } from "@/components/header";
import { NextUIProvider } from "@nextui-org/react";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Keeb Reviews - Keyboard Switch Reviews and Ratings",
  description:
    "Keeb Reviews is a community-driven keyboard switch review and rating platform.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={GeistSans.className} suppressHydrationWarning>
      <body className="bg-background text-foreground">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <NextUIProvider>
            <main className="min-h-screen flex flex-col items-center">
              <div className="flex-1 w-full flex flex-col items-center">
                {children}
              </div>
            </main>
          </NextUIProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
