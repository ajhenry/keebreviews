import { SiteFooter } from "@/components/footer";
import { SiteHeader } from "@/components/header";
import NotFound from "@/components/not-found";
import { Container } from "@/components/ui/container";
import { ReactNode } from "react";

export default function NotFoundPage({ children }: { children: ReactNode }) {
  return (
    <>
      <SiteHeader />
      <Container className="flex-1 flex justify-center items-center">
        <NotFound />
      </Container>
      <SiteFooter />
    </>
  );
}
