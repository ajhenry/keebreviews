import { SiteHeader } from "@/components/header";
import { Container } from "@/components/ui/container";
import { ReactNode } from "react";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <>
      <SiteHeader />
      <Container className="flex-1">
        <div className="w-full py-8 h-full">{children}</div>
      </Container>
      <footer className="w-full flex items-center justify-center border-t mx-auto text-center text-xs gap-8 bottom-0 h-8">
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
