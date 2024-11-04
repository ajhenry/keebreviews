import { prismaClient } from "@/lib/database";
import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import { getSwitchById } from "@/switchdb/src";
import { SwitchReviewForm } from "@/components/switch-review-form";

export default async function UserSwitchReview({
  params,
}: {
  params: { userHandle: string; switchId: string };
}) {
  const { userHandle, switchId } = params;

  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // see if they completed onboarding
  const authorData = await prismaClient.user.findFirst({
    where: {
      handle: userHandle,
    },
  });

  // TODO: need to do something about this
  if (!authorData) {
    return notFound();
  }

  const review = await prismaClient.review.findFirst({
    where: {
      author: {
        handle: userHandle,
      },
      keyboardSwitchId: switchId,
    },
    include: {
      author: true,
    },
  });

  if (!review) {
    return notFound();
  }

  const switchDef = getSwitchById(switchId);

  if (!switchDef) {
    return notFound();
  }

  if (!review.published && review.authorId !== user?.id) {
    return notFound();
  }

  return <SwitchReviewForm existingReview={review} />;
}
