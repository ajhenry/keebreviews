import { SiteHeader } from "@/components/header";
import { Container } from "@/components/ui/container";
import { ReactNode } from "react";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <>
      <SiteHeader />
      <div className="absolute w-full pt-16 h-screen flex flex-col flex-1 max-w-screen-2xl px-2 sm:px-8 left-0 right-0">
        {children}
      </div>
      <footer className="fixed w-full flex items-center justify-center border-t mx-auto text-center text-xs gap-8 bottom-0 h-8">
        <p>
          Made with ❤️ by{" "}
          <a
            href="https://ajhenry.com"
            target="_blank"
            className="font-bold hover:underline"
            rel="noreferrer"
          >
            ajhenry
          </a>
        </p>
      </footer>
    </>
  );
}
