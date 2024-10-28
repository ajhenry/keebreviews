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
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Force, ForceUnit, Travel } from "@/switchdb/src/types";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { formatForce, formatTravel } from "@/utils/force";
import { SwitchReviewTable } from "@/components/switch-review-table";
import { prismaClient } from "@/lib/database";
import KeyboardSwitchInfoTable from "@/components/switch-info-table";
import { TotalReviewSlider } from "@/components/review-slider";
import { Ratings } from "@/utils/score";
import { EmptyTotalReviewSlider } from "@/components/empty-review-slider";
import pluralize from "pluralize";

interface Spec {
  label: string;
  value: string | JSX.Element | number | undefined;
}

export default async function KeyboardSwitchInfoPage({
  params,
}: {
  params: { switchId: string };
}) {
  const { switchId } = params;
  const keyboardSwitch = getSwitchById(switchId);

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

  if (!keyboardSwitch) {
    return <div>Switch not found</div>;
  }

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
            <BreadcrumbLink href={`/switches/${keyboardSwitch?.brand.name}`}>
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
              {keyboardSwitchData?.averageScore
                ? Math.ceil(keyboardSwitchData?.averageScore)
                : "—"}
              /100
            </h2>
            <p className="text-sm text-muted-foreground">
              {keyboardSwitchData?.averageScore
                ? `Average user score based on ${keyboardSwitchData?.reviewsCount} ${pluralize("review", keyboardSwitchData?.reviewsCount)}`
                : "No user reviews yet"}
            </p>
          </div>
          {keyboardSwitchData?.averageRatings ? (
            <TotalReviewSlider
              ratings={keyboardSwitchData?.averageRatings as unknown as Ratings}
            />
          ) : (
            <EmptyTotalReviewSlider />
          )}
        </div>
        <div>
          <div className="flex flex-row justify-between items-center">
            <h2 className="text-2xl font-semibold">Reviews</h2>
            <Link href={`/switches/reviews/new`}>
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
