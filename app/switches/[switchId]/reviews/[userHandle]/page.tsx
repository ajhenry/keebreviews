import { prismaClient } from "@/lib/database";
import { createClient } from "@/utils/supabase/server";
import { Prisma } from "@prisma/client";
import { ChevronRight, InfoIcon } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { UserReviewTable } from "@/components/user-review-table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import PrettyAvatar from "prettyavatars";
import { ReviewContent } from "@/components/review-content";
import { TotalReviewSlider } from "@/components/review-slider";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import dayjs from "dayjs";
import { getSwitchById } from "@/switchdb/src";
import { Badge } from "@/components/ui/badge";
import { generateScore } from "@/utils/score";

export default async function UserSwitchReview({
  params,
}: {
  params: { userHandle: string; switchId: string };
}) {
  const { userHandle, switchId } = params;

  // see if they completed onboarding
  const userData = await prismaClient.user.findFirst({
    where: {
      handle: userHandle,
    },
  });

  // TODO: need to do something about this
  if (!userData) {
    return redirect("/404");
  }

  const review = await prismaClient.review.findFirst({
    where: {
      author: {
        handle: userHandle,
      },
      switchId: switchId,
    },
    include: {
      author: true,
    },
  });

  if (!review) {
    return redirect("/404");
  }

  const switchDef = getSwitchById(switchId);

  if (!switchDef) {
    return redirect("/404");
  }

  console.log("created at", review);

  const score = generateScore(review.ratings);

  return (
    <div className="flex-1 w-full flex flex-col">
      <div className="flex flex-col items-center">
        <Link href={`/switches/${switchId}`}>
          <Button
            variant="outline"
            className={cn(
              "relative justify-start rounded-[0.5rem] bg-muted/50 text-sm font-normal shadow-none"
            )}
          >
            <div className="space-x-2 flex flex-row items-center w-full">
              <div className="flex-1">
                <div className="block">
                  <h1 className="text-xl font-bold">
                    {switchDef?.friendlyName}
                  </h1>
                  <Badge
                    className="mx-2 inline-block"
                    variant={
                      switchDef.spec.type === "linear"
                        ? "default"
                        : switchDef.spec.type === "tactile"
                          ? "secondary"
                          : "destructive"
                    }
                  >
                    {switchDef.spec.type}
                  </Badge>
                </div>
                <div>ANother line</div>
              </div>
              <ChevronRight className="h-4 w-4" />
            </div>
          </Button>
        </Link>
      </div>
      <div>
        <div className="text-center mt-8">
          <h2 className="font-black text-6xl">{score}/100</h2>
        </div>
      </div>

      <div className="mt-8 flex flex-col items-center">
        <TotalReviewSlider review={review} />
      </div>
      <div className="flex flex-col items-center mt-4 text-muted-foreground">
        <p className="">
          Review published by
          <Link
            href={`/users/${userData?.handle}`}
            className="inline-block mx-1"
          >
            <Button
              variant="outline"
              className={cn(
                "px-2 relative justify-start rounded-[0.5rem] bg-muted/50 text-sm font-normal shadow-none h-8"
              )}
            >
              <div className="space-x-2 flex flex-row items-center">
                <Avatar className="cursor-pointer h-4 w-4">
                  <AvatarFallback>
                    <PrettyAvatar
                      colors={["#5B756C", "#748B83", "#9A947C"]}
                      name={userData?.handle ?? "user"}
                      variant="smile"
                      size={10000000}
                    />
                  </AvatarFallback>
                </Avatar>
                <h1 className="">@{userData?.handle}</h1>
              </div>
            </Button>
          </Link>
          on {dayjs(review.createdAt).format("MMM D, YYYY H:mm:ss A")}
          {review.updatedAt !== review.createdAt &&
            ` (edited ${dayjs(review.updatedAt).format("MMM D, YYYY H:mm:ss A")})`}
        </p>
      </div>
      {review.title && (
        <div className="mt-8">
          <h1 className="text-4xl font-bold">{review.title}</h1>
        </div>
      )}
      {review.content && (
        <div className="mt-8">
          <ReviewContent review={review} />
        </div>
      )}
    </div>
  );
}
