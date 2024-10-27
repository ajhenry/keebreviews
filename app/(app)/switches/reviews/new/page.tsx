import { SwitchReviewForm } from "@/components/switch-review-form";
import { prismaClient } from "@/lib/database";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function NewReview() {
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

  if (!data) {
    return redirect("/onboarding");
  }

  return <SwitchReviewForm />;
}
