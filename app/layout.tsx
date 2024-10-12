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
          <main className="min-h-screen flex flex-col items-center">
            <div className="flex-1 w-full flex flex-col items-center">
              <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
                <div className="w-full max-w-5xl flex justify-between items-center p-3 px-5 text-sm">
                  <div className="flex gap-5 items-center font-semibold">
                    <Link href={"/"}>KeebReviews</Link>
                    <div className="flex items-center gap-2">
                      <DeployButton />
                    </div>
                  </div>
                  <div className="flex-1">
                    <Dialog>
                      <DialogTrigger>
                        <div className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 rounded-md px-3">
                          Search for a switch
                        </div>
                      </DialogTrigger>
                      <DialogContentSlim>
                        <SwitchSearchCommand />
                      </DialogContentSlim>
                    </Dialog>
                  </div>
                  {!hasEnvVars ? <EnvVarWarning /> : <HeaderAuth />}
                </div>
              </nav>
              <Container>
                <div className="w-full py-8">{children}</div>
              </Container>

              <footer className="w-full flex items-center justify-center border-t mx-auto text-center text-xs gap-8 absolute bottom-0">
                <p>
                  Powered by{" "}
                  <a
                    href="https://supabase.com/?utm_source=create-next-app&utm_medium=template&utm_term=nextjs"
                    target="_blank"
                    className="font-bold hover:underline"
                    rel="noreferrer"
                  >
                    Supabase
                  </a>
                </p>
                <ThemeSwitcher />
              </footer>
            </div>
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
