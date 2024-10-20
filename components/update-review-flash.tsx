"use client";

import { InfoIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";
import {
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";
import { Review } from "@prisma/client";
import { useServerAction } from "zsa-react";
import {
  deleteReviewAction,
  updateReviewVisibilityAction,
} from "@/app/zsa-actions";
import { redirect, useRouter } from "next/navigation";

interface UpdateReviewFlashProps {
  switchId: string;
  userHandle: string;
  review: Review;
}

export const UpdateReviewFlash = ({
  switchId,
  userHandle,
  review,
}: UpdateReviewFlashProps) => {
  const router = useRouter();
  const { execute: deleteReview } = useServerAction(deleteReviewAction);
  const { execute: updateReviewVisibility } = useServerAction(
    updateReviewVisibilityAction
  );

  const handleDelete = async () => {
    await deleteReview({ reviewId: review.id });
    router.push(`/switches/${switchId}`);
  };

  const handleVisibilityUpdate = async () => {
    await updateReviewVisibility({
      reviewId: review.id,
      visibility: !review.published,
    });
    router.refresh();
  };

  return (
    <div className="mt-4 outline outline-1 outline-accent-foreground text-sm p-3 px-5 rounded-md text-foreground flex gap-3 items-center">
      <InfoIcon size="16" strokeWidth={2} />
      <div className="flex flex-col space-y-2 justify-between items-start w-full">
        <p>
          This is your review.{" "}
          {review.published
            ? "It is currently public for all to see"
            : "It is currently private and only you can see it."}
        </p>
        <div className="space-x-1">
          <Link href={`/switches/${switchId}/reviews/${userHandle}/edit`}>
            <Button variant="outline" className="text-xs h-8">
              Edit
            </Button>
          </Link>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="secondary" className="text-xs h-8">
                Make {review.published ? "Private" : "Public"}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  {review.published
                    ? "This will make your review private and only you will be able to see it."
                    : "This will make your review public and everyone will be able to see it."}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleVisibilityUpdate}>
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" className="text-xs h-8">
                Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This review cannot be recovered once deleted. If you want to
                  make this review hidden from others, make it private instead.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete}>
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </div>
  );
};
