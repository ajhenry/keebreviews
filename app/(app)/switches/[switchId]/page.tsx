import { getSwitchById } from "@/switchdb/src/search";

import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { SwitchReviewTable } from "@/components/switch-review-table";
import { prismaClient } from "@/lib/database";
import KeyboardSwitchInfoTable from "@/components/switch-info-table";
import { TotalReviewSlider } from "@/components/review-slider";
import { EmptyTotalReviewSlider } from "@/components/empty-review-slider";
import pluralize from "pluralize";
import { notFound } from "next/navigation";

export const dynamic = "auto";

export default async function KeyboardSwitchInfoPage({
  params,
}: {
  params: { switchId: string };
}) {
  const { switchId } = params;
  const keyboardSwitch = getSwitchById(switchId);

  if (!keyboardSwitch) {
    return notFound();
  }

  const reviews = await prismaClient.review.findMany({
    where: {
      keyboardSwitchId: switchId,
      published: true,
    },
    include: {
      author: true,
    },
  });

  const keyboardSwitchData = await prismaClient.keyboardSwitch.findFirst({
    where: {
      id: switchId,
    },
  });

  const switchName = `${keyboardSwitch?.brand.name} ${keyboardSwitch?.spec.model}`;

  return (
    <div className="flex-1 w-full flex flex-col space-y-8">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/switches">Switches</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink
              href={`/switches?brand=${keyboardSwitch?.brand.name}`}
            >
              {keyboardSwitch?.brand.name}
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{switchName}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="space-y-12">
        <div className="flex flex-row flex-wrap items-center">
          <h1 className="text-4xl font-bold mr-2">
            {keyboardSwitch?.friendlyName}{" "}
          </h1>
          <Badge className="capitalize">{keyboardSwitch?.spec.type}</Badge>
        </div>
        <div className="flex flex-col items-center">
          <div className="text-center mb-2">
            <h2 className="font-black text-6xl">
              {keyboardSwitchData?.averageScore &&
              (keyboardSwitchData?.reviewsCount ?? 0) > 0
                ? Math.ceil(keyboardSwitchData?.averageScore)
                : "—"}
              /100
            </h2>
            <p className="text-sm text-muted-foreground">
              {(keyboardSwitchData?.reviewsCount ?? 0 > 0)
                ? `Average user score based on ${keyboardSwitchData?.reviewsCount} ${pluralize("review", keyboardSwitchData?.reviewsCount)}`
                : "No user reviews yet"}
            </p>
          </div>
          {keyboardSwitchData?.averageRatings ? (
            <TotalReviewSlider ratings={keyboardSwitchData?.averageRatings} />
          ) : (
            <EmptyTotalReviewSlider />
          )}
        </div>
        <div id="reviews">
          <div className="flex flex-row justify-between items-center">
            <h2 className="text-2xl font-semibold">Reviews</h2>
            <Link href={`/switches/reviews/new?switchId=${switchId}`}>
              <Button variant="outline">Submit Review</Button>
            </Link>
          </div>
          <SwitchReviewTable reviews={reviews} />
        </div>
        <div>
          <h2 className="text-2xl font-semibold">Specs</h2>
          <KeyboardSwitchInfoTable keyboardSwitch={keyboardSwitch} />
        </div>
      </div>
    </div>
  );
}
