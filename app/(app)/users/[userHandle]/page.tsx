import { prismaClient } from "@/lib/database";
import { UserReviewTable } from "@/components/user-review-table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import PrettyAvatar from "prettyavatars";
import { notFound } from "next/navigation";
import { UserPublicReviewTable } from "@/components/user-public-review-table";
import pluralize from "pluralize";
import dayjs from "dayjs";

export default async function ProtectedPage({
  params,
}: {
  params: { userHandle: string };
}) {
  const { userHandle } = params;

  // see if they completed onboarding
  const userData = await prismaClient.user.findFirst({
    where: {
      handle: userHandle,
    },
  });

  // need to do something about this
  if (!userData) {
    return notFound();
  }

  const reviews = await prismaClient.review.findMany({
    where: {
      authorId: userData.id,
      published: true,
    },
    include: {
      author: true,
      keyboardSwitch: true,
    },
  });

  return (
    <div className="flex-1 w-full flex flex-col gap-12">
      <div className="flex flex-row gap-2 items-center">
        <Avatar className="cursor-pointer h-24 w-24">
          <AvatarFallback>
            <PrettyAvatar
              colors={["#5B756C", "#748B83", "#9A947C"]}
              name={userData?.handle ?? "user"}
              variant="smile"
              size={10000000}
            />
          </AvatarFallback>
        </Avatar>
        <div>
          <h1 className="font-bold text-4xl">@{userData?.handle}</h1>
          <p className="mt-2 text-muted-foreground text-md">
            Joined on {dayjs(userData?.createdAt).format("MMMM D, YYYY")}
          </p>
          <p className="text-muted-foreground text-md">
            {reviews.length === 0
              ? "No reviews yet"
              : `${reviews.length} ${pluralize("review", reviews.length)}`}
          </p>
        </div>
      </div>
      <div>
        <h2 className="font-bold text-2xl mb-4">Reviews</h2>
        <UserPublicReviewTable reviews={reviews} />
      </div>
    </div>
  );
}
