import { SiteFooter } from "@/components/footer";
import { SiteHeader } from "@/components/header";
import { ReactNode } from "react";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <>
      <SiteHeader />
      <div className="absolute w-full pt-16 pb-8 h-screen flex flex-col flex-1 max-w-screen-2xl px-2 sm:px-8 left-0 right-0">
        {children}
      </div>
    </>
  );
}
