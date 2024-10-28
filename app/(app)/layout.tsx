import { SiteFooter } from "@/components/footer";
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
      <SiteFooter />
    </>
  );
}
