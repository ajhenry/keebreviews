import UserOnboarding from "@/components/user-onboarding";
import { prismaClient } from "@/lib/database";
import { createClient } from "@/utils/supabase/server";
import { InfoIcon } from "lucide-react";
import { redirect } from "next/navigation";

export default async function ProtectedPage() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  // see if they completed onboarding
  const data = await prismaClient.user.findFirst({
    where: {
      id: user.id,
    },
  });

  if (data) {
    return redirect("/");
  }

  return (
    <div className="flex-1 w-full flex flex-col gap-12">
      <div className="w-full">
        <div className="bg-accent text-sm p-3 px-5 rounded-md text-foreground flex gap-3 items-center mb-4">
          <InfoIcon size="16" strokeWidth={2} />
          Welcome to KeebReviews! Please complete the onboarding process to get
          started.
        </div>
        <UserOnboarding />
      </div>
    </div>
  );
}
