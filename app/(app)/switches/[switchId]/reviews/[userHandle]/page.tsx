import { prismaClient } from "@/lib/database";
import { createClient } from "@/utils/supabase/server";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
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
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { UpdateReviewFlash } from "@/components/update-review-flash";

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
    return redirect("/404");
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
    return redirect("/404");
  }

  const switchDef = getSwitchById(switchId);

  if (!switchDef) {
    return redirect("/404");
  }

  if (!review.published && review.authorId !== user?.id) {
    return redirect("/404");
  }

  const score = generateScore(review.ratings);

  return (
    <div className="flex-1 w-full flex flex-col">
      <div>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/switches">Switches</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href={`/switches?brand=${switchDef?.brand.name}`}>
                {switchDef?.brand.name}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href={`/switches/${switchDef?.id}`}>
                {switchDef?.friendlyName}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href={`/switches/${switchDef?.friendlyName}`}>
                Reviews
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink
                className="text-foreground"
                href={`/users/${authorData.handle}`}
              >
                @{authorData.handle}
              </BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      {user?.id === authorData.id && (
        <UpdateReviewFlash
          switchId={switchId}
          userHandle={userHandle}
          review={review}
        />
      )}

      <div>
        <div className="text-center mt-8">
          <h2 className="font-black text-6xl">{score}/100</h2>
        </div>
      </div>

      <div className="flex flex-col items-center mt-8 w-full sm:px-12">
        <Link href={`/switches/${switchId}`} className="w-full">
          <Button
            variant="outline"
            className={cn(
              "w-full relative justify-start rounded-[0.5rem] bg-muted/50 text-sm font-normal shadow-none h-auto"
            )}
          >
            <div className="flex flex-row items-center w-full">
              <div className="flex-1">
                <div className="flex flex-col items-start">
                  <h1 className="text-lg font-semibold text-wrap text-left">
                    {switchDef?.friendlyName}
                  </h1>
                  <div className="flex flex-row space-x-2">
                    <Badge
                      className="inline-block"
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
                    <div className="underline">
                      {switchDef.spec.force.actuation?.value}
                      {switchDef.spec.force.actuation?.unit}/
                      {switchDef.spec.force.actuation?.value}
                      {switchDef.spec.force.actuation?.unit}
                    </div>
                    <div className="underline">
                      {switchDef.spec.travel.pre?.value}
                      {switchDef.spec.travel.pre?.unit}/
                      {switchDef.spec.travel.total?.value}
                      {switchDef.spec.travel.total?.unit}
                    </div>
                  </div>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 ml-4" />
            </div>
          </Button>
        </Link>
      </div>

      <div className="mt-4 flex flex-col items-center">
        <TotalReviewSlider review={review} />
      </div>

      <div className="flex flex-col items-center mt-4 text-muted-foreground sm:px-12">
        <p className="">
          Review published by
          <Link
            href={`/users/${authorData?.handle}`}
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
                      name={authorData?.handle ?? "user"}
                      variant="smile"
                      size={10000000}
                    />
                  </AvatarFallback>
                </Avatar>
                <h1 className="">@{authorData?.handle}</h1>
              </div>
            </Button>
          </Link>
          on {dayjs(review.createdAt).format("MMM D, YYYY H:mm:ss A")}
          {!dayjs(review.createdAt).isSame(review.updatedAt) &&
            ` (edited ${dayjs(review.updatedAt).format("MMM D, YYYY H:mm:ss A")})`}
        </p>
      </div>
      {review.title && (
        <div className="mt-12">
          <h1 className="text-4xl font-bold text-center">{review.title}</h1>
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
