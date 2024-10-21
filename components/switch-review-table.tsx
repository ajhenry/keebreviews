"use client";

import {
  deleteReviewAction,
  updateReviewVisibilityAction,
} from "@/app/zsa-actions";
import FetchDataSteps from "@/components/tutorial/fetch-data-steps";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { prismaClient } from "@/lib/database";
import { getSwitchById } from "@/switchdb/src";
import {
  Ratings,
  generateScore,
  normalizedScore,
  ratingToLabel,
} from "@/utils/score";
import { createClient } from "@/utils/supabase/server";
import { Prisma, Review } from "@prisma/client";
import { DotsHorizontalIcon, Link1Icon } from "@radix-ui/react-icons";
import {
  InfoIcon,
  Link2Icon,
  LinkIcon,
  SquareArrowOutUpRightIcon,
} from "lucide-react";
import Link from "next/link";
import { redirect, useRouter } from "next/navigation";
import { useState } from "react";
import { useServerAction } from "zsa-react";
import { Avatar, AvatarFallback } from "./ui/avatar";
import PrettyAvatar from "prettyavatars";

interface UserReviewTableProps {
  reviews: Prisma.ReviewGetPayload<{
    include: { author: true };
  }>[];
}

export const SwitchReviewTable = ({ reviews }: UserReviewTableProps) => {
  const { execute: deleteReview } = useServerAction(deleteReviewAction);
  const { execute: updateReviewVisibility } = useServerAction(
    updateReviewVisibilityAction
  );
  const router = useRouter();
  const [isDelete, setIsDelete] = useState(false);

  const handleUpdate = async (reviewId: string, published: boolean) => {
    if (isDelete) {
      await deleteReview({ reviewId });
    } else {
      await updateReviewVisibility({ reviewId, visibility: !published });
    }
    router.refresh();
  };

  return (
    <Table className="mt-2">
      <TableHeader>
        <TableRow className="p-0 m-0">
          <TableHead></TableHead>
          <TableHead className="text-center">Score</TableHead>
          <TableHead className="text-center">Author</TableHead>
          <TableHead className="text-center">Travel</TableHead>
          <TableHead className="text-center">Weight</TableHead>
          <TableHead className="text-center">Sound</TableHead>
          <TableHead className="text-center">Typing</TableHead>
          <TableHead className="text-center">Feel</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {reviews.length === 0 && (
          <TableRow>
            <TableCell colSpan={8} className="text-center">
              No reviews yet
            </TableCell>
          </TableRow>
        )}
        {reviews.map((review) => {
          const scores = review.ratings as unknown as Ratings;
          const labels = ratingToLabel(scores);

          return (
            <TableRow>
              <TableCell>
                <Link
                  key={review.id}
                  href={`/switches/${review.switchId}/reviews/${review.author?.handle}`}
                >
                  <SquareArrowOutUpRightIcon size="16" strokeWidth={2} />
                </Link>
              </TableCell>
              <TableCell className="font-bold text-xl text-center">
                {generateScore(review.ratings)}
              </TableCell>
              <TableCell>
                <Link href={`/users/${review.author?.handle}`}>
                  <div className="space-x-2 flex flex-row items-center">
                    <Avatar className="cursor-pointer h-4 w-4">
                      <AvatarFallback>
                        <PrettyAvatar
                          colors={["#5B756C", "#748B83", "#9A947C"]}
                          name={review.author?.handle ?? "user"}
                          variant="smile"
                          size={10000000}
                        />
                      </AvatarFallback>
                    </Avatar>
                    <h1 className="">@{review.author?.handle}</h1>
                  </div>
                </Link>
              </TableCell>
              <TableCell className="text-center">
                {normalizedScore(scores.travel)}/20
                <p className="text-xs text-muted-foreground">{labels.travel}</p>
              </TableCell>
              <TableCell className="text-center">
                {normalizedScore(scores.weight)}/20
                <p className="text-xs text-muted-foreground">{labels.weight}</p>
              </TableCell>
              <TableCell className="text-center">
                {normalizedScore(scores.sound)}/20
                <p className="text-xs text-muted-foreground">{labels.sound}</p>
              </TableCell>
              <TableCell className="text-center">
                {normalizedScore(scores.typing)}/20
                <p className="text-xs text-muted-foreground">{labels.typing}</p>
              </TableCell>
              <TableCell className="text-center">
                {normalizedScore(scores.feel)}/20
                <p className="text-xs text-muted-foreground">{labels.feel}</p>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={7}>Total Reviews</TableCell>
          <TableCell className="text-right">{reviews.length}</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
};
