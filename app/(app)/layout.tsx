import { SiteFooter } from "@/components/footer";
import { SiteHeader } from "@/components/header";
import { Container } from "@/components/ui/container";
import { prismaClient } from "@/lib/database";
import { createClient } from "@/utils/supabase/server";
import { ReactNode } from "react";

export default async function Layout({ children }: { children: ReactNode }) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const userData = await prismaClient.user.findFirst({
    where: {
      id: user?.id,
    },
  });

  return (
    <>
      {userData?.admin && (
        <div className="bg-destructive w-full">Admin Account</div>
      )}
      <SiteHeader />
      <Container className="flex-1">
        <div className="w-full py-8 h-full">{children}</div>
      </Container>
      <SiteFooter />
    </>
  );
}
