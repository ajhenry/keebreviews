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
import { Ratings, generateScore } from "@/utils/score";
import { createClient } from "@/utils/supabase/server";
import { Prisma, Review } from "@prisma/client";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { InfoIcon } from "lucide-react";
import Link from "next/link";
import { redirect, useRouter } from "next/navigation";
import { useState } from "react";
import { useServerAction } from "zsa-react";

interface UserReviewTableProps {
  reviews: Prisma.ReviewGetPayload<{
    include: { author: true };
  }>[];
}

export const UserReviewTable = ({ reviews }: UserReviewTableProps) => {
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
    <Table>
      <TableCaption>These are all of your reviews.</TableCaption>
      <TableHeader>
        <TableRow className="p-0 m-0">
          <TableHead>Score</TableHead>
          <TableHead>Switch Name</TableHead>
          <TableHead className="text-center">Public</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {reviews.length === 0 && (
          <TableRow>
            <TableCell colSpan={4} className="text-center">
              No reviews yet
            </TableCell>
          </TableRow>
        )}
        {reviews.map((review) => (
          <TableRow key={review.id}>
            <TableCell className="font-medium">
              {generateScore(review.ratings)}
            </TableCell>
            <TableCell>
              <Link
                href={`/switches/${review.switchId}/reviews/${review.author?.handle}`}
              >
                {getSwitchById(review.switchId)?.friendlyName}
              </Link>
            </TableCell>
            <TableCell className="text-center">
              {review.published ? "Yes" : "No"}
            </TableCell>
            <TableCell className="text-right">
              <AlertDialog>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Open menu</span>
                      <DotsHorizontalIcon className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <AlertDialogTrigger asChild>
                      <DropdownMenuItem onClick={() => setIsDelete(false)}>
                        Make {review.published ? "private" : "public"}
                      </DropdownMenuItem>
                    </AlertDialogTrigger>

                    <AlertDialogTrigger asChild>
                      <DropdownMenuItem onClick={() => setIsDelete(true)}>
                        Delete
                      </DropdownMenuItem>
                    </AlertDialogTrigger>
                  </DropdownMenuContent>
                </DropdownMenu>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    {isDelete ? (
                      <AlertDialogDescription>
                        This review cannot be recovered once deleted. If you
                        want to make this review hidden from others, make it
                        private instead.
                      </AlertDialogDescription>
                    ) : (
                      <AlertDialogDescription>
                        {review.published
                          ? "This will make your review private and only you will be able to see it."
                          : "This will make your review public and everyone will be able to see it."}
                      </AlertDialogDescription>
                    )}
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => handleUpdate(review.id, review.published)}
                    >
                      {isDelete
                        ? "Delete"
                        : review.published
                          ? "Make Private"
                          : "Make Public"}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={3}>Total Reviews</TableCell>
          <TableCell className="text-right">{reviews.length}</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
};
